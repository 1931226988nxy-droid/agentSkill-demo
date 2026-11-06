import { defineComponent } from 'vue';
import {
  openModal,
  JccTree,
  JccTable,
  type JccTableProps,
  type JccFormModalProps,
  useModal,
} from '@jcc/shared/components';
import { useTableQuery, useAsyncTask } from '@jcc/shared/hooks';
import { createHttpClient } from '@jcc/shared/api';
import { debounce, formatBytes } from '@jcc/shared/utils';
import { isEmail } from '@jcc/shared/validators';
import { createAntTheme } from '@jcc/shared/theme';
import { documentImageUrl } from '@jcc/shared/assets';
import { jccLiveViteConfig } from '@jcc/shared/vite';
import { JccModal } from '@jcc/shared';

const Editor = defineComponent({
  props: { name: { type: String, required: true } },
  emits: {
    saved: (id: number) => Number.isFinite(id),
    'update:value': (value: string) => typeof value === 'string',
  },
});
const modal = openModal({
  component: Editor,
  props: { name: '测试' },
  on: { saved: (id) => id.toFixed(), 'update:value': (value) => value.toUpperCase() },
  onOk: (event, handle) => {
    event.preventDefault();
    handle.close();
  },
  onFullscreenChange: (fullscreen, handle) => handle.setFullscreen(!fullscreen),
  modalProps: { width: 720, footer: null },
});
modal.setFullscreen(true);
// @ts-expect-error 全屏状态必须是布尔值。
modal.setFullscreen('yes');
// @ts-expect-error 内容组件 props 保留原始类型。
openModal({ component: Editor, props: { name: 123 } });
// @ts-expect-error 组件声明了必填 props 时不能省略 props。
openModal({ component: Editor });
// @ts-expect-error 必填的 name 不能省略。
openModal({ component: Editor, props: {} });
const boundModal = useModal();
boundModal.openModal({
  component: Editor,
  props: { name: '绑定宿主' },
  on: { saved: (id) => id.toFixed() },
});
// @ts-expect-error 绑定入口与全局入口具有相同的必填 props 约束。
boundModal.openModal({ component: Editor });
openModal({ component: defineComponent({ props: { optional: String } }) });
// @ts-expect-error 自定义事件的回调参数保留原始类型。
openModal({ component: Editor, props: { name: '' }, on: { saved: (id: string) => id } });
// @ts-expect-error 未声明的事件名需要被拒绝。
openModal({ component: Editor, props: { name: '' }, on: { unknownEvent: () => {} } });
const table: JccTableProps = {
  mode: 'server',
  total: 10,
  onPageChange: ({ page }) => page.toFixed(),
};
// @ts-expect-error 分页模式仅支持 server/client。
const badTable: JccTableProps = { mode: 'auto' };
const form: JccFormModalProps = {
  submit: async (values, { signal }) => ({ values, aborted: signal.aborted }),
};
const query = useTableQuery({
  initialFilters: { name: '' },
  fetcher: async ({ filters }) => ({ items: [{ id: filters.name.length }], total: 1 }),
});
query.items.value[0]?.id.toFixed();
// @ts-expect-error 行字段推导为 number。
query.items.value[0]?.id.toUpperCase();
const task = useAsyncTask(async ({ signal }, id: number) => ({ id, aborted: signal.aborted }));
task.run(1);
// @ts-expect-error 异步任务参数保留类型。
task.run('1');
const request = createHttpClient();
const blob: Promise<Blob | null> = request('/file', { responseType: 'blob' });
// @ts-expect-error 不接受不存在的响应解析模式。
request('/file', { responseType: 'buffer' });
// @ts-expect-error 响应泛型仅用于 JSON，不能把 Blob 断言为业务对象。
request<{ id: number }>('/file', { responseType: 'blob' });
// @ts-expect-error 文本响应不接受 JSON 泛型。
request<{ id: number }>('/file', { responseType: 'text' });
const json: Promise<{ id: number } | null> = request<{ id: number }>('/file', {
  responseType: 'json',
});
const response: Promise<Response> = request('/file', { responseType: 'response' });
void [json, response];
const search = debounce((value: string) => value.toUpperCase());
search('test');
search.cancel();
void [
  JccTree,
  JccTable,
  JccModal,
  table,
  badTable,
  form,
  blob,
  formatBytes(1024),
  isEmail('a@b.cn'),
  createAntTheme,
  documentImageUrl,
  jccLiveViteConfig(),
];
