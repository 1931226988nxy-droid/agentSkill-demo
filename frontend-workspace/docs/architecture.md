# 公共库结构与复用边界

`@jcc/shared` 位于 `packages/shared`，通过源码子路径统一导出公共能力。两个示例应用使用 npm workspaces 的目录链接；仓库外的本机项目可用 `npm link @jcc/shared` 指向同一目录。开发时修改源码，Vite 直接读取更新，无需生成单个安装文件。

```text
packages/shared/               唯一公共包、验证规则、共享素材与接入配置
  src/components/              公共 Vue 组件
  src/hooks/                   列表查询、竞态与防重复任务
  src/utils/                   树、文件、请求和格式化方法
  src/theme/                   主题变量、页面布局和 Ant Token 映射
apps/admin-demo/       业务页面与接口适配
apps/component-lab/    组件使用演示
```

独立项目的链接步骤及 Vite 配置见根目录 `使用说明.md`。组件从 `@jcc/shared/components` 导入，其他子路径见 `packages/shared/docs/API.md`。Vue、Ant Design Vue 和图标库由使用项目安装；库中的 `@jcc/shared/vite` 配置允许 Vite 访问链接目录并避免重复解析 Vue。

新增组件时修改 `packages/shared/src/components`，从该目录的 `index.js` 公开导出并更新 API 文档。新增公共方法时修改 `src/utils/index.js` 或 `src/hooks/index.js` 及对应公共分类入口；验证规则和素材也在 shared 维护。输入“同步公共组件库 skill”后，Codex 检查导出与文档，执行 `npm run sync:skill` 更新目录，并验证应用构建。

公共库不存后端 URL、业务字段、token、权限码或业务图片。各应用负责请求配置和响应适配。目录链接只对能访问相同源码的项目有效；生产站点需重新构建和部署。
