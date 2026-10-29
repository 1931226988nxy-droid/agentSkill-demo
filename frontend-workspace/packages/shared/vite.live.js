import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// 让独立 Vite 项目读取链接目录中的组件、样式和素材源码。
export function jccLiveViteConfig(projectRoot = process.cwd()) {
  return {
    resolve: { dedupe: ['vue', 'ant-design-vue', '@ant-design/icons-vue'] },
    server: { fs: { allow: [projectRoot, packagesRoot] } },
    optimizeDeps: { exclude: ['@jcc/shared'] },
  };
}
