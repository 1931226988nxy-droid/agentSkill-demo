# 本工程的公共库

当前 Vue 3 + Ant Design Vue 工程的公共能力集中在 `frontend-workspace/packages/shared`，旧的 ui、hooks、utils、theme 包仍为源码与兼容入口。

用户输入固定指令“同步公共组件库 skill”时，读取 `frontend-system/SKILL.md`，检查新增能力已公开导出和记录 API，运行 `npm run sync:skill` 更新 `frontend-system/references/library-catalog.md`，再运行相关测试和应用构建。未导出的实现不登记为可用 API。

跨项目复用、视觉基线与团队交付约定见 `frontend-workspace/docs/enterprise-playbook.md` 和 `frontend-workspace/docs/design-system.md`。公共库变更完成后在 `frontend-workspace` 运行 `npm run quality`；视觉改动先审核并更新浏览器快照。业务字段、后端地址、权限与路由放在应用项目自己的配置和 AGENTS.md。
