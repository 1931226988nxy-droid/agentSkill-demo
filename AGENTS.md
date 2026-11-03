# 本工程的公共库

`frontend-workspace` 是唯一的 `@jcc/shared` 源码包；组件、hooks、utils、theme 是包内分类目录。业务前端通过本机源码链接使用它，Java 后端由业务项目对接。

用户输入固定指令“同步公共组件库 skill”时，读取 `frontend-system/SKILL.md`，检查新增能力已公开导出并记录 API，在 `frontend-workspace` 运行 `npm run sync:skill` 更新 `frontend-system/references/library-catalog.md`，再运行 `npm run quality`。未导出的实现不登记为可用 API。

跨项目复用、视觉基线与团队交付约定见 `frontend-workspace/docs/enterprise-playbook.md` 和 `frontend-workspace/docs/design-system.md`。公共库变更完成后在 `frontend-workspace` 运行 `npm run quality`；视觉改动由使用该库的前端项目审核。业务字段、后端地址、权限与路由放在应用项目自己的配置和 AGENTS.md。
