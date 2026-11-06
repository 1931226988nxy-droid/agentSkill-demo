import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const ignored = new Set([
  '.git',
  'node_modules',
  '_backups',
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
]);
function documents(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? documents(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}
const errors = [];
const scripts = JSON.parse(
  readFileSync(join(root, 'frontend-workspace', 'package.json'), 'utf8'),
).scripts;
for (const path of documents(root)) {
  const original = readFileSync(path, 'utf8');
  for (const [, command] of original.matchAll(/npm run ([\w:-]+)/g)) {
    if (!scripts[command]) errors.push(`${path}: 未定义 npm run ${command}`);
  }
  const markdown = original.replace(/```[\s\S]*?```/g, '');
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(target)) continue;
    const relative = decodeURIComponent(target.split('#')[0]);
    if (!existsSync(resolve(dirname(path), relative))) errors.push(`${path}: ${target}`);
  }
}
if (errors.length) throw new Error(`文档链接失效：\n${errors.join('\n')}`);
console.log('本地 Markdown 文件链接与 npm 命令有效；文字描述、API 语义与外部链接仍需审核。');
