import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, inject, nextTick, provide } from 'vue';
import { Form, Input, Modal } from 'ant-design-vue';
import { JccFormModal, JccModal, JccProvider, openModal, useModal } from '@jcc/shared/components';
import { useAsyncTask } from '@jcc/shared/hooks';
import { formatBytes } from '@jcc/shared/utils';

const wrappers = [];
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
function render(component, options = {}) {
  const wrapper = mount(component, { attachTo: document.body, ...options });
  wrappers.push(wrapper);
  return wrapper;
}
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = '';
});

describe('表单会话与取消后的新任务', () => {
  it.each(['resolve', 'reject'])('旧提交 %s 后不关闭新表单，也不覆盖新提交状态', async (settle) => {
    const old = deferred(),
      current = deferred();
    const submit = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const wrapper = render(JccFormModal, {
      props: { open: true, initialValues: { name: 'A' }, submit },
      slots: {
        default: ({ model }) =>
          h(Form.Item, { name: 'name' }, () => h(Input, { value: model.name })),
      },
    });
    await flushPromises();
    document.querySelector('.ant-modal-footer .ant-btn-primary').click();
    await flushPromises();
    expect(submit).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ open: false });
    expect(submit.mock.calls[0][1].signal.aborted).toBe(true);
    await wrapper.setProps({ open: true, initialValues: { name: 'B' } });
    await flushPromises();
    document.querySelector('.ant-modal-footer .ant-btn-primary').click();
    await flushPromises();
    expect(submit).toHaveBeenCalledTimes(2);
    old[settle](settle === 'resolve' ? { name: 'A' } : new Error('旧提交失败'));
    await flushPromises();
    expect(wrapper.findComponent(Form).props('model')).toEqual({ name: 'B' });
    expect(wrapper.findComponent(Modal).props('confirmLoading')).toBe(true);
    expect(wrapper.emitted('saved')).toBeUndefined();
    expect(wrapper.emitted('error')).toBeUndefined();
    expect(wrapper.emitted('update:open')).toBeUndefined();
    current.resolve({ name: 'B' });
    await flushPromises();
    expect(wrapper.emitted('saved')).toEqual([[{ name: 'B' }, { name: 'B' }]]);
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('取消后可以立刻重试，旧任务 finally 不清空新任务状态', async () => {
    const first = deferred(),
      second = deferred();
    const task = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const state = useAsyncTask(task);
    const old = state.run().catch((cause) => cause);
    await Promise.resolve();
    state.cancel();
    const current = state.run();
    await Promise.resolve();
    first.resolve('old');
    expect((await old).name).toBe('AbortError');
    expect(state.loading.value).toBe(true);
    expect(state.run()).toBe(current);
    second.resolve('new');
    await expect(current).resolves.toBe('new');
    expect(state.loading.value).toBe(false);
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('在任务开始前取消，不调用底层适配器', async () => {
    const task = vi.fn();
    const state = useAsyncTask(task);
    const pending = state.run();
    state.cancel();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(task).not.toHaveBeenCalled();
  });
});

describe('弹窗宿主隔离与状态同步', () => {
  const Content = defineComponent({
    setup() {
      const context = inject('modal-test-context');
      return () => h('div', { class: 'modal-context-value' }, context);
    },
  });
  function root(context, apis) {
    const Caller = defineComponent({
      setup() {
        apis[context] = useModal();
        return () =>
          h(
            'button',
            {
              class: `launch-${context}`,
              onClick: () => apis[context].openModal({ component: Content }),
            },
            context,
          );
      },
    });
    return defineComponent({
      setup() {
        provide('modal-test-context', context);
        return () => h(JccProvider, null, { default: () => h(Caller) });
      },
    });
  }

  it('两个 Provider 分别使用自己的注入，未绑定的全局调用拒绝猜测上下文', async () => {
    const apis = {};
    const A = root('A', apis),
      B = root('B', apis);
    const wrapper = render(defineComponent({ setup: () => () => h('div', [h(A), h(B)]) }));
    expect(() => openModal({ component: Content })).toThrow('useModal');
    await wrapper.find('.launch-A').trigger('click');
    await flushPromises();
    expect(
      [...document.querySelectorAll('.modal-context-value')].map((node) => node.textContent),
    ).toEqual(['A']);
    await wrapper.find('.launch-B').trigger('click');
    await flushPromises();
    expect(
      [...document.querySelectorAll('.modal-context-value')].map((node) => node.textContent),
    ).toEqual(['A', 'B']);
  });

  it('宿主卸载后，已绑定的入口不会回退到另一个 Provider', () => {
    const apis = {};
    const A = render(root('A', apis));
    render(root('B', apis));
    A.unmount();
    expect(() => apis.A.openModal({ component: Content })).toThrow('已挂载');
    expect(() => apis.B.openModal({ component: Content })).not.toThrow();
  });

  it('编程式全屏复位拖拽，每次状态变化仅通知一次', async () => {
    const changed = vi.fn();
    render(JccProvider);
    const handle = openModal({
      component: defineComponent({ setup: () => () => h('div', '内容') }),
      onFullscreenChange: changed,
    });
    await flushPromises();
    const position = document.querySelector('.jcc-modal-position');
    position.getBoundingClientRect = () => ({ left: 100, right: 500, top: 100, bottom: 400 });
    document
      .querySelector('.jcc-modal-title')
      .dispatchEvent(
        new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 150, clientY: 150 }),
      );
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 190, clientY: 180 }));
    window.dispatchEvent(new MouseEvent('pointerup'));
    await nextTick();
    expect(position.style.transform).toContain('translate(40px, 30px)');
    handle.setFullscreen(true);
    await nextTick();
    expect(position.style.transform).toContain('translate(0px, 0px)');
    expect(changed).toHaveBeenCalledExactlyOnceWith(true, handle);
    handle.setFullscreen(true);
    expect(changed).toHaveBeenCalledTimes(1);
    document.querySelector('.jcc-modal-fullscreen-button').click();
    await nextTick();
    expect(changed.mock.calls).toEqual([
      [true, handle],
      [false, handle],
    ]);
  });

  it('缺少 Provider 时 useModal 明确报错', () => {
    expect(() => useModal()).toThrow('setup');
  });
});

describe('文件大小的缺失值和小数', () => {
  it.each([null, undefined, '', '   ', NaN, Infinity, -1])('%s 不视为零字节', (value) => {
    expect(formatBytes(value)).toBe('—');
  });
  it('保留零与小数字节，单位下标不越界', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes('0')).toBe('0 B');
    expect(formatBytes(0.5)).toBe('0.5 B');
    expect(formatBytes(1.25)).toBe('1.25 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});
