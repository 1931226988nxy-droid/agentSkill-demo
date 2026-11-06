# 多项目开发与交付约定

本仓库只维护一份公共源码：`frontend-workspace` 是 `@jcc/shared` 的包根目录。其他本机 Vite 前端项目按根目录 `使用说明.md` 建立链接后，开发时可直接读取源码更新。

## 新项目接入

1. 新项目使用 Vue 3、Ant Design Vue 4 和 Vite；按 `使用说明.md` 链接 `@jcc/shared` 并配置 `jccLiveViteConfig()`。
2. 将 `docs/project-AGENTS.template.md` 的约定加入新项目自己的 `AGENTS.md`，填写 Java 后端适配、权限、路由和主题差异。
3. 在应用入口导入 `@jcc/shared/style.css`；按 `docs/API.md` 选用分类导出。
4. 需要在新开发机使用 Codex skill 时执行 `scripts/install-skill.ps1`。

目录链接只让能访问同一份源码的开发项目自动刷新。其他电脑需同步本仓库；已部署的应用需要重新构建和部署。公共源码更新时，应说明影响的 API 与使用项目。

## 提交与验收

- 每个公共能力记录公开导出、API 文档和有价值的行为测试。未公开的实现不写入 skill 清单。
- `npm run quality` 检查格式、文档链接、公开导出与类型、消费方类型契约和带覆盖率的行为测试；再运行 `npm run build:preview`、`npm run test:browser` 与 `npm run test:visual` 验证浏览器。
- 使用固定指令“同步公共组件库 skill”时运行 `npm run sync:skill`，生成 `frontend-system/references/library-catalog.md`。
- 仓库位于 [GitHub](https://github.com/1931226988nxy-droid/agentSkill-demo)，push/PR 会触发 `.github/workflows/frontend-quality.yml`。维护者需在分支保护或 ruleset 中将 `verify` 配为必须通过；仓库里的 workflow 文件不会自动开启分支保护。

## 版本与跨电脑交付

`@jcc/shared` 当前是 `private: true` 的源码包，包版本为 `0.1.0`；`private` 用于防止误发布。开发通过 Git 同步与本机链接读取源码，变更写入根目录 [CHANGELOG](../../CHANGELOG.md) 的 Unreleased。

以下任一条件出现时，在下一次交付前启用固定版本管理：第二个需要独立上线的项目接入；首次修改不兼容的公共 API；跨开发机或 CI 需要复现同一份公共库。

- 发布记录使用 SemVer。`0.x` 阶段不兼容变更提升次版本（例如 `0.1.0 → 0.2.0`），兼容新增或修复提升补丁版本；进入 `1.0.0` 后，不兼容提升主版本、兼容新增提升次版本、修复提升补丁版本。
- 更新 package.json 与锁文件中的包版本，将 Unreleased 移至版本段，记录影响范围、迁移步骤和源码提交。完成质量检查和使用方验证后创建 `v版本号` Git 标签。尚未创建的标签不得写成已发布版本。
- 正式交付从独立源码 checkout 接入，固定经过审核的完整 Git SHA（可由标签解析得到），在应用的依赖记录中保存版本、SHA、迁移情况与验证结果。避免将生产构建链接到日常变动的开发目录。
- 同机可用 `git worktree add --detach ../jcc-release-0.1.0 0e8fe76` 建立已有基线的独立目录，再从该目录的 `frontend-workspace` 执行 `npm ci`、`npm link`。业务项目继续按使用说明接入；后续升级由应用主动选择新提交。

版本化仍可交付 `.vue`、JS、CSS 源码，无需生成单个 bundle。更多团队需要自动下载时，再配置企业 registry 并发布源码包。生产应用仍需构建与部署才能更新。

## 知识入口

- 视觉与交互：`docs/design-system.md`。
- 架构与归属：`docs/architecture.md`。
- 公共 API：`docs/API.md`。
- Agent 执行规则：根目录 `AGENTS.md`、`frontend-system/SKILL.md` 和各项目自己的 `AGENTS.md`。
