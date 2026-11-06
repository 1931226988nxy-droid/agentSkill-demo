import type { Ref, UnwrapNestedRefs } from 'vue';

export interface AbortContext {
  signal: AbortSignal;
}
export interface PageChange {
  page: number;
  pageSize: number;
}
export interface ListResult<T> {
  items: T[];
  total: number;
}
export interface TableQueryOptions<T, F extends object> {
  fetcher: (query: PageChange & AbortContext & { filters: F }) => Promise<ListResult<T>>;
  initialFilters?: F;
  pageSize?: number;
}
export interface TableQuery<T, F extends object> {
  filters: UnwrapNestedRefs<F>;
  applied: Ref<F>;
  items: Ref<T[]>;
  page: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  refresh(): Promise<ListResult<T> | undefined>;
  search(): Promise<ListResult<T> | undefined>;
  reset(): Promise<ListResult<T> | undefined>;
  changePage(value: PageChange): Promise<ListResult<T> | undefined>;
  dispose(): void;
}
export function useTableQuery<T, F extends object = Record<string, unknown>>(
  options: TableQueryOptions<T, F>,
): TableQuery<T, F>;
export interface AsyncTask<A extends unknown[], R> {
  run(...args: A): Promise<R>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  cancel(): void;
}
export function useAsyncTask<A extends unknown[], R>(
  task: (context: AbortContext, ...args: A) => R | Promise<R>,
): AsyncTask<A, R>;
