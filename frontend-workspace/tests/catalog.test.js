import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalogMatches, createExportReader } from '../scripts/library-exports.mjs';

describe('skill 清单读取实际模块导出', () => {
  it(
    '识别循环重导出、export *、别名和同一声明的多个变量，排除未导出实现',
    { timeout: 15000 },
    () => {
      const directory = mkdtempSync(join(tmpdir(), 'jcc-export-regression-'));
      const files = {
        'entry.js':
          "export * from './barrel.js'; export { value as renamed } from './values.js'; export * as namespace from './values.js';",
        'barrel.js': "export * from './entry.js'; export * from './values.js';",
        'values.js':
          'export const value = 1, second = 2; export function helper() {} const internal = 3;',
      };
      try {
        for (const [name, content] of Object.entries(files))
          writeFileSync(join(directory, name), content);
        const entry = join(directory, 'entry.js');
        const readExports = createExportReader([entry]);
        expect(readExports(entry).sort()).toEqual([
          'helper',
          'namespace',
          'renamed',
          'second',
          'value',
        ]);
      } finally {
        for (const name of Object.keys(files)) unlinkSync(join(directory, name));
        rmdirSync(directory);
      }
    },
  );
  it('CRLF 与 LF 不造成误报，实际导出变化仍会被发现', () => {
    const expected = '# 导出\n\n- `openModal`\n';
    expect(catalogMatches(expected.replaceAll('\n', '\r\n'), expected)).toBe(true);
    expect(catalogMatches(expected + '- `useModal`\n', expected)).toBe(false);
  });
});
