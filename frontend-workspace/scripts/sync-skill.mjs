import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const workspace = fileURLToPath(new URL('..', import.meta.url));
const skill = join(workspace, '..', 'frontend-system');
const output = join(skill, 'references', 'library-catalog.md');

function source(path) {
  return readFileSync(join(workspace, path), 'utf8');
}

function namedExports(path) {
  const code = source(path);
  const entries = [];
  for (const match of code.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/g)) {
    for (const item of match[1].split(',')) {
      const name = item
        .trim()
        .split(/\s+as\s+/)
        .at(-1);
      if (name) entries.push(name);
    }
  }
  for (const match of code.matchAll(
    /export\s+(?:(?:async|default)\s+)?(?:function|class|const)\s+([\w$]+)/g,
  ))
    entries.push(match[1]);
  return [...new Set(entries)];
}

const groups = [
  ['公共组件', 'packages/ui/src/index.js', '@jcc/shared/components'],
  ['状态方法', 'packages/hooks/src/index.js', '@jcc/shared/hooks'],
  ['公共 API', 'packages/shared/src/api.js', '@jcc/shared/api'],
  ['公共方法', 'packages/shared/src/utils.js', '@jcc/shared/utils'],
  ['验证规则', 'packages/shared/src/validators.js', '@jcc/shared/validators'],
  ['主题方法', 'packages/theme/src/index.js', '@jcc/shared/theme'],
  ['图片与图标 URL', 'packages/shared/src/assets.js', '@jcc/shared/assets'],
];

const components = namedExports('packages/ui/src/index.js');
const unexported = readdirSync(join(workspace, 'packages', 'ui', 'src', 'components')).filter(
  (file) => file.endsWith('.vue') && !components.includes(file.slice(0, -4)),
);
if (unexported.length) throw new Error(`组件未从 @jcc/ui 导出：${unexported.join('、')}`);

const utilsIndex = source('packages/utils/src/index.js');
const originalMethods = [
  ...utilsIndex.matchAll(/export\s*\*\s*from\s*['"]\.\/([^'"]+)['"]/g),
].flatMap((match) => namedExports(`packages/utils/src/${match[1]}`));
const sharedMethods = new Set([
  ...namedExports('packages/shared/src/api.js'),
  ...namedExports('packages/shared/src/utils.js'),
]);
const omittedMethods = originalMethods.filter((name) => !sharedMethods.has(name));
if (omittedMethods.length)
  throw new Error(`原 utils 已导出但 @jcc/shared 未公开：${omittedMethods.join('、')}`);

const assetFiles = readdirSync(join(workspace, 'packages', 'shared', 'assets'));
const packageExports = JSON.parse(source('packages/shared/package.json')).exports;
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
  const link = relative(join(skill, 'references'), join(workspace, path)).replaceAll('\\', '/');
  lines.push(`## ${title}`, '', `导入路径：\`${importPath}\`；[导出源码](${link})。`, '');
  lines.push(names.map((name) => `- \`${name}\``).join('\n'), '');
}
lines.push(
  '## 静态素材',
  '',
  '素材目录位于 `packages/shared/assets`，可直接导入：',
  '',
  ...assetFiles.map((file) => `- \`@jcc/shared/assets/${file}\``),
  '',
  '新增组件或方法后先确认其公开导出与 API 文档，再运行 `npm run sync:skill`，最后运行相关测试和应用构建。',
  '',
);
const catalog = lines.join('\n');
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== catalog) {
    throw new Error('公共库导出清单已过期：运行 npm run sync:skill 后提交更新。');
  }
  console.log('公共库导出清单与公开源码一致。');
} else {
  writeFileSync(output, catalog);
  console.log(`已更新 ${output}`);
}
