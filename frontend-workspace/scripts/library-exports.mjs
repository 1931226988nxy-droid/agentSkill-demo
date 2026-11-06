import ts from 'typescript';

/** 通过模块符号读取真实导出，支持 export *、别名、命名空间和循环重导出。 */
export function createExportReader(files) {
  const program = ts.createProgram(files, {
    allowJs: true,
    checkJs: false,
    noEmit: true,
    // 清单只需要模块符号，不加载默认全局库与自动发现的 @types。
    noLib: true,
    types: [],
    skipLibCheck: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  });
  const checker = program.getTypeChecker();
  return (path) => {
    const file = program.getSourceFile(path);
    const symbol = file && checker.getSymbolAtLocation(file);
    if (!symbol) throw new Error(`无法解析导出模块：${path}`);
    return checker
      .getExportsOfModule(symbol)
      .map((entry) => entry.name)
      .filter((name) => name !== 'default');
  };
}

export function catalogMatches(actual, expected) {
  return actual.replace(/\r\n?/g, '\n') === expected.replace(/\r\n?/g, '\n');
}
