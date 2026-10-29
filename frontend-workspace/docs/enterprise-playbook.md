# 多项目开发与交付约定

本仓库保留一份公共源码：`packages/shared` 是唯一公共包，内部按 `components`、`hooks`、`utils`、`theme` 分类。两个示例应用直接通过 npm workspaces 使用它。开发时，其他本机 Vite 项目按根目录 `使用说明.md` 建立目录链接后可随源码修改刷新。

## 新项目接入

1. 新项目采用 Vue 3、Ant Design Vue 4 和 Vite；按 `使用说明.md` 链接 `@jcc/shared` 并配置 `jccLiveViteConfig()`。
2. 复制 `docs/project-AGENTS.template.md` 到新项目的 `AGENTS.md`，填入项目自己的后端适配、权限、路由和主题差异。
3. 在应用入口导入 `@jcc/shared/style.css`；按 `packages/shared/docs/API.md` 选用分类导出。
4. 在需要使用 Codex skill 的开发机上执行 `scripts/install-skill.ps1`，将 `frontend-system` 链接到用户级 skills 目录。

目录链接使**能访问同一份源码的本机开发项目**自动刷新。其他电脑需先同步这份仓库；已部署应用也需要重新构建和部署。共享源码更新属于跨项目变更，应在变更说明中列出影响的 API 与页面。

## 提交与验收

- 每个公共能力至少记录公开导出、API 文档和有价值的行为测试。未公开的实现不写入 skill 清单。
- `npm run quality` 检查格式、skill 清单、单元测试、两个应用的构建及浏览器布局；浏览器测试使用已安装的 Google Chrome。
- 视觉变化先运行 `npm run test:browser:update`，检查基线，再执行 `npm run quality`。
- 使用固定指令“同步公共组件库 skill”时运行 `npm run sync:skill`，生成 `frontend-system/references/library-catalog.md` 并提交。
- 在代码托管平台启用 PR 必须通过 `.github/workflows/frontend-quality.yml` 的 `verify` 检查。当前仓库未配置远端，需推送到托管平台后才能运行该流程。

## 版本与跨电脑交付

`@jcc/shared` 目前是 `private: true` 的自包含源码工作区包。因此当前交付方式是 **Git 同步源码 + 本机链接**，无需手工生成单包文件。对某个公共 API 做不兼容修改时，先给旧用法保留迁移期并记录影响项目；升级由各项目的构建检查确认。

如果未来需要独立仓库、跨电脑自动获得稳定版本，再配置包的独立构建、企业私有 registry、凭据和自动发布流水线。下游项目通过依赖版本更新机器人自动创建升级 PR，CI 验证后合并与部署。需要先提供代码托管平台、私有 registry 地址和部署方式，才能让这条发布链实际运行。生产环境不应在无验证的情况下随共享源码变化。

## 轻量知识入口

- 视觉与交互：`docs/design-system.md`。
- 架构与归属：`docs/architecture.md`。
- 公共 API：`packages/shared/docs/API.md`。
- Agent 执行规则：根目录 `AGENTS.md`、`frontend-system/SKILL.md` 和各项目自己的 `AGENTS.md`。

这些文件随源码版本化，已足够作为目前的知识入口；出现跨团队规范检索、审批或大量非代码资料时，再评估集中式知识库。
