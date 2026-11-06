export function formatBytes(value) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return '—';
  const size = Number(value);
  if (!Number.isFinite(size) || size < 0) return '—';
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.max(
    0,
    Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1),
  );
  const precision = index || !Number.isInteger(size) ? 2 : 0;
  return `${Number((size / 1024 ** index).toFixed(precision))} ${units[index]}`;
}

export function formatDate(value, { dateOnly = true, locale = 'zh-CN', timeZone } = {}) {
  if (value == null || value === '') return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(dateOnly ? {} : { hour: '2-digit', minute: '2-digit' }),
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

/** 查询参数约定为普通 JSON 数据，不保存函数、DOM 或 Vue ref。 */
export function cloneQuery(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * 保留最后一次参数与调用上下文；cancel 可撤销待执行任务。
 * @template {(...args: any[]) => unknown} F
 * @param {F} fn
 * @param {number} [delay=250]
 * @returns {import('../../types/utils.js').Debounced<F>}
 */
export function debounce(fn, delay = 250) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn.apply(this, args);
    }, delay);
  }
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  return debounced;
}
