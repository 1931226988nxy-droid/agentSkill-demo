import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { catalogMatches, createExportReader } from './library-exports.mjs';

const workspace = fileURLToPath(new URL('..', import.meta.url));
const skill = join(workspace, '..', 'frontend-system');
const output = join(skill, 'references', 'library-catalog.md');

function source(path) {
  return readFileSync(join(workspace, path), 'utf8');
}

const groups = [
  ['公共组件与调用方法', 'src/components/index.js', '@jcc/shared/components'],
  ['状态方法', 'src/hooks/index.js', '@jcc/shared/hooks'],
  ['公共 API', 'src/api.js', '@jcc/shared/api'],
  ['公共方法', 'src/utils.js', '@jcc/shared/utils'],
  ['验证规则', 'src/validators.js', '@jcc/shared/validators'],
  ['主题方法', 'src/theme/index.js', '@jcc/shared/theme'],
  ['图片与图标 URL', 'src/assets.js', '@jcc/shared/assets'],
];

const packageExports = JSON.parse(source('package.json')).exports;
const typedEntries = Object.entries(packageExports).filter(
  ([, entry]) => typeof entry === 'object',
);
const readExports = createExportReader([
  ...groups.map(([, path]) => join(workspace, path)),
  join(workspace, 'src/utils/index.js'),
  ...typedEntries.flatMap(([, entry]) => [
    join(workspace, entry.default),
    join(workspace, entry.types),
  ]),
]);
const namedExports = (path) => readExports(join(workspace, path));

const components = namedExports('src/components/index.js');
const unexported = readdirSync(join(workspace, 'src', 'components')).filter(
  (file) => file.endsWith('.vue') && !components.includes(file.slice(0, -4)),
);
if (unexported.length)
  throw new Error(`组件未从 @jcc/shared/components 导出：${unexported.join('、')}`);

const originalMethods = namedExports('src/utils/index.js');
const sharedMethods = new Set([...namedExports('src/api.js'), ...namedExports('src/utils.js')]);
const omittedMethods = originalMethods.filter((name) => !sharedMethods.has(name));
if (omittedMethods.length)
  throw new Error(`公共方法未从 @jcc/shared 公开：${omittedMethods.join('、')}`);

const assetFiles = readdirSync(join(workspace, 'assets'));
// 类型声明必须跟随每一个公开 JS 入口；类型检查另由消费方示例验证。
for (const [subpath, entry] of typedEntries) {
  const declared = new Set(namedExports(entry.types));
  const expected = namedExports(entry.default);
  const missing = expected.filter((name) => !declared.has(name));
  if (missing.length) throw new Error(`${subpath} 缺少公开类型：${missing.join('、')}`);
}
const hiddenAssets = assetFiles.filter((file) => !packageExports[`./assets/${file}`]);
if (hiddenAssets.length)
  throw new Error(`素材未从 @jcc/shared/package.json 导出：${hiddenAssets.join('、')}`);

const lines = [
  '# 公共库导出清单',
  '',
  '<!-- 由 frontend-workspace/scripts/sync-skill.mjs 生成；请修改实际源码，再运行 npm run sync:skill。 -->',
  '',
  '源码链接入口：`@jcc/shared`。在应用入口单独导入 `@jcc/shared/style.css`。组件细节以真实源码和 API 文档为准。',
  '',
];
for (const [title, path, importPath] of groups) {
  const names = namedExports(path);
  if (!names.length) throw new Error(`${path} 没有发现公开导出`);
  lines.push(`## ${title}`, '', `导入路径：\`${importPath}\`；导出源码：共享包 \`${path}\`。`, '');
  lines.push(names.map((name) => `- \`${name}\``).join('\n'), '');
}
lines.push(
  '## 静态素材',
  '',
  '素材目录位于 `frontend-workspace/assets`，可直接导入：',
  '',
  ...assetFiles.map((file) => `- \`@jcc/shared/assets/${file}\``),
  '',
  '新增组件或方法后先确认其公开导出与 API 文档，再运行 `npm run sync:skill` 和 `npm run quality`。',
  '',
);
const catalog = lines.join('\n');
if (process.argv.includes('--check')) {
  if (!catalogMatches(readFileSync(output, 'utf8'), catalog)) {
    throw new Error('公共库导出清单已过期：运行 npm run sync:skill 后提交更新。');
  }
  console.log('公共库导出清单与公开源码一致。');
} else {
  writeFileSync(output, catalog);
  console.log(`已更新 ${output}`);
}
