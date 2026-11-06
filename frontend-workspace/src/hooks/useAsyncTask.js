import { getCurrentScope, onScopeDispose, ref } from 'vue';

/**
 * 同一时刻的 run 调用复用同一个 Promise；任务接收 ({ signal }, ...args)。
 * cancel 会发出取消信号，任务本身应传递 signal 或自行检查它。
 * @template {unknown[]} A
 * @template R
 * @param {(context: import('../../types/hooks.js').AbortContext, ...args: A) => R | Promise<R>} task
 * @returns {import('../../types/hooks.js').AsyncTask<A, R>}
 */
export function useAsyncTask(task) {
  const loading = ref(false),
    error = ref(null);
  let active, controller;
  function run(...args) {
    if (active) return active;
    const current = (controller = new AbortController());
    loading.value = true;
    error.value = null;
    active = Promise.resolve()
      .then(() => {
        if (current.signal.aborted) throw new DOMException('操作已取消', 'AbortError');
        return task({ signal: current.signal }, ...args);
      })
      .then((result) => {
        if (current.signal.aborted) throw new DOMException('操作已取消', 'AbortError');
        return result;
      })
      .catch((cause) => {
        if (!current.signal.aborted) error.value = cause;
        throw cause;
      })
      .finally(() => {
        // 已取消任务可能晚于新任务结束，不能清空新任务的状态。
        if (controller === current) {
          active = undefined;
          loading.value = false;
        }
      });
    return active;
  }
  function cancel() {
    controller?.abort();
    controller = undefined;
    active = undefined;
    loading.value = false;
  }
  if (getCurrentScope()) onScopeDispose(cancel);
  return { run, loading, error, cancel };
}
