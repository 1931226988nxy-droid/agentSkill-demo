import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
for (const [app, name] of [
  ['admin-demo', '预览.html'],
  ['component-lab', '组件演示.html'],
]) {
  const dist = join(root, 'apps', app, 'dist');
  let html = readFileSync(join(dist, 'index.html'), 'utf8');
  let scripts = 0,
    styles = 0;
  html = html
    .replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
      scripts += 1;
      const code = readFileSync(join(dist, src), 'utf8');
      if (/\bimport\s*\(/.test(code))
        throw new Error('此快照脚本要求单入口构建，不能残留异步 chunk');
      return `<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`;
    })
    .replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (_, src) => {
      styles += 1;
      return `<style>${readFileSync(join(dist, src), 'utf8')}</style>`;
    });
  if (scripts !== 1 || styles !== 1) throw new Error('请先完成两个应用的构建');
  if (/<script[^>]+src=|<link[^>]+rel="stylesheet"/i.test(html))
    throw new Error('快照还有外部资源');
  writeFileSync(resolve(root, '..', name), html, 'utf8');
  console.log(`Exported ${name}`);
}
