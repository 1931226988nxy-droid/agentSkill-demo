import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Table, Upload } from 'ant-design-vue';
import { JccPagePanel, JccQueryBar, JccTable, JccUpload } from '@jcc/shared/components';
import { debounce, findTreeNode } from '@jcc/shared/utils';
import { createAntTheme } from '@jcc/shared/theme';

const wrappers = [];
function render(component, options) {
  const wrapper = mount(component, options);
  wrappers.push(wrapper);
  return wrapper;
}
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.useRealTimers();
});
describe('查询与反馈交互', () => {
  it('查询提交与重置独立触发，加载时禁用重置', async () => {
    const wrapper = render(JccQueryBar, { slots: { default: '<input name="keyword" />' } });
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('search')).toHaveLength(1);
    await wrapper.find('button[type="button"]').trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
    await wrapper.setProps({ loading: true });
    expect(wrapper.find('button[type="button"]').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ showReset: false });
    expect(wrapper.find('button[type="button"]').exists()).toBe(false);
  });
  it('页面标题可由插槽替换，保留操作与内容', () => {
    const wrapper = render(JccPagePanel, {
      props: { title: '资源' },
      slots: {
        header: '<h1>自定义标题</h1>',
        extra: '<button>新建</button>',
        default: '<p>正文</p>',
      },
    });
    expect(wrapper.attributes('aria-label')).toBe('资源');
    expect(wrapper.find('h1').text()).toBe('自定义标题');
    expect(wrapper.text()).toContain('正文');
  });
  it('表格错误可重试，分页和原生排序事件传给调用方', async () => {
    const wrapper = render(JccTable, { props: { error: new Error('查询失败'), pageSize: 10 } });
    await wrapper.find('.jcc-table-error button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
    const table = wrapper.findComponent(Table);
    table.vm.$emit('change', {}, {}, { order: 'ascend' }, {});
    expect(wrapper.emitted('change')[0][2]).toEqual({ order: 'ascend' });
    wrapper.findComponent({ name: 'JccPagination' }).vm.$emit('change', { page: 1, pageSize: 20 });
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]]);
    expect(wrapper.emitted('page-change')).toEqual([[{ page: 1, pageSize: 20 }]]);
  });
  it('上传的业务校验拒绝与异常均不会发起请求', async () => {
    const upload = vi.fn();
    const beforeUpload = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error('业务规则拒绝'));
    const wrapper = render(JccUpload, { props: { upload, beforeUpload } });
    const file = new File(['a'], 'a.txt');
    const before = wrapper.findComponent(Upload).props('beforeUpload');
    expect(await before(file, [file])).toBe(Upload.LIST_IGNORE);
    expect(await before(file, [file])).toBe(Upload.LIST_IGNORE);
    expect(upload).not.toHaveBeenCalled();
    expect(wrapper.emitted('error')[0][0].message).toBe('业务规则拒绝');
  });
});
describe('方法和主题契约', () => {
  it('防抖只调用最后一次并保留 this，取消后不执行', () => {
    vi.useFakeTimers();
    const fn = vi.fn(function (value) {
      return this.prefix + value;
    });
    const context = { prefix: 'x', run: debounce(fn, 100) };
    context.run('a');
    context.run('b');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledExactlyOnceWith('b');
    expect(fn.mock.contexts[0]).toBe(context);
    context.run('c');
    context.run.cancel();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('查找深层主键 0，找不到时返回 undefined', () => {
    const node = { key: 0, title: '子节点' };
    const tree = [{ key: 1, children: [node] }];
    expect(findTreeNode(tree, 0)).toBe(node);
    expect(findTreeNode(tree, 99)).toBeUndefined();
  });
  it('读取 CSS 主题变量供 Ant 使用', () => {
    const spy = vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (key) =>
        ({ '--color-primary': '#16856b', '--font-body': '14px' })[key] || '0',
    });
    try {
      const theme = createAntTheme();
      expect(theme.token.colorPrimary).toBe('#16856b');
      expect(theme.token.fontSize).toBe(14);
      expect(theme.components.Tree.controlItemBgActive).toBe('0');
    } finally {
      spy.mockRestore();
    }
  });
});
