---
name: frontend-system
description: "在 Vue 3 + Ant Design Vue + JavaScript 项目使用或维护 @jcc/shared 公共库；提供组件、样式、请求、方法、验证规则和素材，并支持指令‘同步公共组件库 skill’更新导出清单。"
---

# 使用共享前端工程

先读取 [项目配置](references/project-profile.md) 与 [共享包接入](references/shared-packages.md)，确认真实依赖、包版本、API 适配器和已有业务封装。先从当前项目依赖或本 skill 的实际目录定位 `frontend-workspace`，再按需读取其 `docs/API.md`、源码和 [公共库导出清单](references/library-catalog.md)。不要依赖全局 skill 安装入口的相对路径定位共享包。

## 依赖与代码归属

- 技术栈固定为 Vue 3 + Ant Design Vue 4.x + JavaScript，单文件组件使用 `<script setup>`。已有项目不擅自迁移。
- 新项目将 `@jcc/shared` 链接到同一份源码，从其分类子路径引用组件、hooks、API、方法、验证规则和素材；入口导入 `@jcc/shared/style.css`。
- 包根目录是 `frontend-workspace`，接入说明在其上一级目录的 `使用说明.md`。本机前端项目可按说明使用 `npm link` 和 Vite 源码访问配置；不要把共享组件复制到各应用再分别修改。
- 用户明确要求与项目局部配置优先；遵守仓库指令。共享包缺失时确认真实安装位置，不编造组件或假定已发布 npm。
- 业务字段、权限、路由、后端地址和响应格式转换属于应用；通用交互、样式和无业务方法属于公共包。

## 按需读取

| 任务                             | 读取                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- |
| 选择公共组件/API                 | [导出清单](references/library-catalog.md)、[组件路由](references/components.md)，再打开真实包的 docs/API.md 和必要源码 |
| 列表查询、分页、竞态             | [列表规范](references/tables.md)                                            |
| 树与下拉树选择                   | [组件路由](references/components.md) + 共享包 `docs/ui.md`                  |
| 表单与弹窗                       | [表单](references/forms.md)、[浮层](references/overlays.md)                 |
| 上传下载、请求与公共方法         | [文件与接口](references/files.md)                                           |
| 布局与主题，包括档案系统原型风格 | [布局](references/layout.md)、[主题](references/theme.md)                   |
| Vue/Ant 写法                     | [技术栈](references/vue-antd.md)                                            |
| 数据图表                         | [图表](references/charts.md)                                                |

## 开发步骤

1. 确认依赖版本及公共组件已存在；阅读任务相关的 API、示例和必要实现。
2. 优先组合已有组件及插槽、透传属性，不为一个业务页面新增庞大配置框架。
3. 列表默认采用 `useTableQuery` 和服务端分页；组件不会二次切片。纯本地数组明确使用 client 模式。
4. 接口在应用适配为 `{items,total}`；上传适配为 `upload(file,{signal,onProgress})`，下载适配为 `request(file,{signal}) -> Blob/{blob,filename}`。
5. 新增有明确复用价值的能力时修改公共包，补充 API、`types` 下的公开类型与行为测试，并在根目录 CHANGELOG 的 Unreleased 记录影响；业务专属逻辑留在应用。
6. 在公共包运行 `npm run quality`（包含文档链接/命令、导出类型、消费方类型和覆盖率门禁）与 `npm run build:preview`。组件或主题改动再运行 `npm run test:browser`、`npm run test:visual`；通过 `npm run dev` 查看真实组件预览。截图更新须目视审核，流程见共享包 `docs/design-system.md`。使用项目继续负责业务构建与页面验收。

交付说明修改了哪些应用/公共包、兼容性及验证结果。改变共享 API 或接入范围时明确说明；链接项目开发时直接读源码，生产页面仍需重新构建部署。

多项目交付时按需读取共享包的 `docs/enterprise-playbook.md` 和 `docs/design-system.md`，并遵守目标项目自己的 AGENTS.md。

本机开发可继续源码联动；独立上线项目的交付按 playbook 固定 Git 提交。`private: true` 不代表已有发布流程，未创建的版本标签不得当作已发布版本。

## 固定更新指令

用户输入 **`同步公共组件库 skill`** 时，在 `frontend-workspace` 中检查新组件或方法已从 `src` 的对应分类入口公开导出，并补全相应 API 文档；执行 `npm run sync:skill`，检查生成的 `frontend-system/references/library-catalog.md`，再运行 `npm run quality`。清单由真实导出生成，不把未导出的文件或用户提供的描述当作可调用 API。源码链接的开发项目不需要重新安装。
