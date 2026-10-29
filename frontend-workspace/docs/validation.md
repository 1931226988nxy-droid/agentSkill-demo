# 公共库合并验证

日期：2026-10-29。公共实现已合并到 `packages/shared/src`；工作区只保留一个公共包 `@jcc/shared`，两个示例应用仍通过原有分类子路径使用它。

- `npm ci --offline`：从锁文件完成干净安装。
- `npm ls --workspaces --depth=0`：仅列出 `@jcc/shared` 和两个示例应用；无旧公共包工作区。
- `npm run sync:skill` 与 `npm run check:skill`：按 shared 内的公开导出更新并校验清单。
- `npm run quality`：格式检查、清单检查、32 个单元测试、两个应用构建和 3 个浏览器测试均通过。
- 现有工作台、组件示例及侧栏截图无需更新，说明这次目录迁移未改变视觉基线；390px 页面仍无意外横向滚动。

构建仍提示演示应用主 JavaScript chunk 超过 500 kB。这是现有演示项目的打包体积提示，后续业务项目可按路由拆分。源码链接仅用于可访问同一工作目录的开发项目；部署页面仍需重新构建。
