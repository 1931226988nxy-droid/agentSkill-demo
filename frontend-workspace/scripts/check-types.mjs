import ts from 'typescript';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const configPath = fileURLToPath(new URL('../tests/types/tsconfig.json', import.meta.url));
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(configPath));
// 检查本库 d.ts 本身，避免 skipLibCheck 顺便跳过手写声明中的错误。
const program = ts.createProgram(parsed.fileNames, { ...parsed.options, skipLibCheck: false });
const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
// Ant Design Vue 的既有声明兼容问题不作为本库错误；本库声明与消费示例仍严格检查。
const local = diagnostics.filter(
  (item) => !item.file || !item.file.fileName.replaceAll('\\', '/').includes('/node_modules/'),
);
if (local.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(local, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => '\n',
    }),
  );
  process.exitCode = 1;
} else {
  console.log('公共类型声明与消费方正反用例通过；第三方 node_modules 声明诊断不计入本库门禁。');
}
