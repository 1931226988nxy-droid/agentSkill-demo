import { hasInjectionContext, inject } from 'vue';

const hosts = new Set();
export const modalScopeKey = Symbol('jcc-modal-scope');

export function createModalScope() {
  return { host: null };
}

// 弹窗挂在 JccProvider 内，动态内容才能继承应用的注入、主题和语言环境。
export function registerModalHost(host, scope) {
  scope.host = host;
  hosts.add(host);
  return () => {
    hosts.delete(host);
    scope.host = null;
  };
}

function openInHost(host, options) {
  if (!options?.component) throw new TypeError('openModal 需要 component 内容组件');
  if (!host) throw new Error('openModal 需要在已挂载的 JccProvider 下使用');
  return host.open(options);
}

/**
 * 在 setup 中捕获最近的 Provider，返回可在点击事件/异步方法中使用的调用入口。
 * @returns {import('../../types/components.js').ModalApi}
 */
export function useModal() {
  const scope = hasInjectionContext() ? inject(modalScopeKey, null) : null;
  if (!scope) throw new Error('useModal 需要在 JccProvider 内的 setup 中调用');
  return { openModal: (options) => openInHost(scope.host, options) };
}

/**
 * 在已挂载的 JccProvider 中打开内容组件。
 * props、on、slots 属于内容组件；modalProps 属于 Ant Modal。
 * @template {import('vue').Component} C
 * @param {import('../../types/components.js').OpenModalOptions<C>} options
 * @returns {import('../../types/components.js').ModalHandle}
 */
export function openModal(options) {
  const scope = hasInjectionContext() ? inject(modalScopeKey, null) : null;
  if (scope) return openInHost(scope.host, options);
  if (hosts.size > 1)
    throw new Error('存在多个 JccProvider，请在 setup 中使用 useModal() 绑定弹窗上下文');
  return openInHost(hosts.values().next().value, options);
}
