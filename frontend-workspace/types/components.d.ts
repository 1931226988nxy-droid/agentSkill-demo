import type { Component, DefineComponent, FunctionalComponent, SlotsType, VNodeChild } from 'vue';
import type {
  ButtonProps,
  ConfigProviderProps,
  FormProps,
  MenuProps,
  ModalProps,
  PaginationProps,
  TableProps,
  TreeProps,
  TreeSelectProps,
  UploadProps,
} from 'ant-design-vue';
import type { AbortContext, PageChange } from './hooks.js';
import type { TreeFieldNames, TreeKey } from './utils.js';

type ContentSlots = Record<string, (props: any) => VNodeChild>;
type PublicComponent<P, S extends Record<string, any> = ContentSlots> = DefineComponent<
  P,
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  string,
  {},
  {},
  {},
  SlotsType<S>
>;
export interface ModalHandle {
  close(): void;
  setFullscreen(fullscreen: boolean): void;
}
export type ComponentProps<C> = C extends new (...args: any[]) => { $props: infer P }
  ? P
  : C extends FunctionalComponent<infer P>
    ? P
    : Record<string, unknown>;
/** 使用 Vue 组件生成的 onEvent props 推导自定义事件参数。 */
export type ComponentEvents<C> = {
  [K in keyof ComponentProps<C> as K extends `on${infer E}`
    ? Uncapitalize<E>
    : never]?: NonNullable<ComponentProps<C>[K]> extends (...args: infer A) => unknown
    ? (...args: A) => unknown
    : never;
};
export type ModalEventHandler = (event: MouseEvent, handle: ModalHandle) => unknown;
type RequiredKeys<P> = { [K in keyof P]-?: {} extends Pick<P, K> ? never : K }[keyof P];
interface ModalOptionsBase<C extends Component> {
  component: C;
  on?: ComponentEvents<NoInfer<C>>;
  slots?: ContentSlots;
  modalProps?: Omit<ModalProps, 'open' | 'visible' | 'modalRender' | 'onOk' | 'onCancel'> & {
    onOk?: ModalEventHandler;
    onCancel?: ModalEventHandler;
  };
  modalSlots?: { title?: () => VNodeChild; footer?: () => VNodeChild };
  draggable?: boolean;
  fullscreen?: boolean;
  onOk?: ModalEventHandler;
  onCancel?: ModalEventHandler;
  onFullscreenChange?: (fullscreen: boolean, handle: ModalHandle) => unknown;
}
export type OpenModalOptions<C extends Component = Component> = ModalOptionsBase<C> &
  ([RequiredKeys<ComponentProps<C>>] extends [never]
    ? { props?: ComponentProps<C> }
    : { props: ComponentProps<C> });
export function openModal<C extends Component>(
  options: { component: C } & NoInfer<Omit<OpenModalOptions<C>, 'component'>>,
): ModalHandle;
export interface ModalApi {
  openModal: typeof openModal;
}
/** 在后代组件的 setup 中调用，绑定最近的 JccProvider。 */
export function useModal(): ModalApi;

export type JccProviderProps = {
  theme?: ConfigProviderProps['theme'];
  locale?: ConfigProviderProps['locale'];
  size?: 'small' | 'middle' | 'large';
};
export const JccProvider: PublicComponent<JccProviderProps>;
export interface JccAppShellProps {
  activeKey: string;
  items?: MenuProps['items'];
  collapsed?: boolean;
  brand?: string;
  shortName?: string;
  brandMark?: string;
  userName?: string;
  department?: string;
  showTabs?: boolean;
  'onUpdate:activeKey'?: (key: string) => void;
  'onUpdate:collapsed'?: (collapsed: boolean) => void;
}
export const JccAppShell: PublicComponent<JccAppShellProps>;
export const JccPagePanel: PublicComponent<{ title?: string }>;
export const JccQueryBar: PublicComponent<{
  loading?: boolean;
  showReset?: boolean;
  onSearch?: () => void;
  onReset?: () => void;
}>;
export type JccPaginationProps = Omit<
  PaginationProps,
  'current' | 'pageSize' | 'total' | 'onChange'
> & {
  page?: number;
  pageSize?: number;
  total?: number;
  'onUpdate:page'?: (page: number) => void;
  'onUpdate:pageSize'?: (pageSize: number) => void;
  onChange?: (value: PageChange) => void;
};
export const JccPagination: PublicComponent<JccPaginationProps>;
export type JccTableProps = Omit<TableProps, 'pagination' | 'loading' | 'rowKey'> & {
  rowKey?: string | ((record: any) => TreeKey);
  mode?: 'server' | 'client';
  page?: number;
  pageSize?: number;
  total?: number;
  pagination?: boolean;
  paginationOptions?: JccPaginationProps;
  loading?: boolean;
  error?: unknown;
  emptyText?: string;
  'onUpdate:page'?: (page: number) => void;
  'onUpdate:pageSize'?: (pageSize: number) => void;
  onPageChange?: (value: PageChange) => void;
  onRetry?: () => void;
};
export const JccTable: PublicComponent<JccTableProps>;
export type JccTreeProps = Omit<TreeProps, 'treeData' | 'fieldNames' | 'selectedKeys'> & {
  treeData?: Record<string, unknown>[];
  fieldNames?: TreeFieldNames;
  selectedKeys?: TreeKey[];
  searchable?: boolean;
  searchPlaceholder?: string;
  'onUpdate:selectedKeys'?: (keys: TreeKey[]) => void;
  onSearch?: (keyword: string) => void;
};
export const JccTree: PublicComponent<JccTreeProps>;
export interface JccTreeTableLayoutProps {
  treeLabel?: string;
  separatorLabel?: string;
  mobileOpen?: boolean;
  defaultTreeWidth?: number;
  minTreeWidth?: number;
  maxTreeWidth?: number;
  minContentWidth?: number;
  onResize?: (width: number) => void;
}
export const JccTreeTableLayout: PublicComponent<JccTreeTableLayoutProps>;
export type JccTreeSelectProps = Omit<TreeSelectProps, 'treeData' | 'fieldNames'> & {
  treeData?: Record<string, unknown>[];
  fieldNames?: TreeFieldNames;
  'onUpdate:value'?: (value: TreeSelectProps['value']) => void;
};
export const JccTreeSelect: PublicComponent<JccTreeSelectProps>;
export type UploadAdapter = (
  file: File,
  context: AbortContext & { onProgress(percent: number): void },
) => Promise<Record<string, unknown> | void>;
export type JccUploadProps = Omit<
  UploadProps,
  'action' | 'customRequest' | 'beforeUpload' | 'onChange'
> & {
  upload: UploadAdapter;
  maxSizeMb?: number;
  beforeUpload?: (file: File, files: File[]) => boolean | void | Promise<boolean | void>;
  'onUpdate:fileList'?: (files: NonNullable<UploadProps['fileList']>) => void;
  onChange?: UploadProps['onChange'];
  onSuccess?: (value: { file: File; result: Record<string, unknown> | void }) => void;
  onError?: (error: unknown, file: File) => void;
};
export const JccUpload: PublicComponent<JccUploadProps>;
export interface DownloadFile extends Record<string, unknown> {
  id?: TreeKey;
  name?: string;
}
export type DownloadAdapter = (
  file: DownloadFile,
  context: AbortContext,
) => Promise<Blob | { blob: Blob; filename?: string }>;
export type JccDownloadProps = Omit<ButtonProps, 'onClick' | 'loading'> & {
  file: DownloadFile;
  request: DownloadAdapter;
  label?: string;
  onSuccess?: (file: DownloadFile) => void;
  onError?: (error: unknown) => void;
};
export const JccDownload: PublicComponent<JccDownloadProps>;
export type JccModalProps = Omit<ModalProps, 'modalRender' | 'title'> & {
  title?: string;
  draggable?: boolean;
  fullscreen?: boolean;
  'onUpdate:open'?: (open: boolean) => void;
  'onUpdate:fullscreen'?: (fullscreen: boolean) => void;
};
export const JccModal: PublicComponent<JccModalProps>;
export type JccFormModalProps = Omit<
  JccModalProps,
  'onOk' | 'onCancel' | 'confirmLoading' | 'title'
> & {
  title?: string;
  initialValues?: Record<string, any>;
  rules?: FormProps['rules'];
  submit: (values: Record<string, any>, context: AbortContext) => Promise<unknown>;
  onSaved?: (result: unknown, values: Record<string, any>) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
};
export const JccFormModal: PublicComponent<
  JccFormModalProps,
  { default?: (props: { model: Record<string, any> }) => VNodeChild }
>;
