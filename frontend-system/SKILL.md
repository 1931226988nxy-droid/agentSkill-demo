---
name: frontend-system
description: "在 Vue 3 + Ant Design Vue + JavaScript 项目使用或维护 @jcc/shared 公共库；提供组件、样式、请求、方法、验证规则和素材，并支持指令‘同步公共组件库 skill’更新导出清单。"
---

# 使用共享前端工程

先读取 [项目配置](references/project-profile.md) 与 [共享包接入](references/shared-packages.md)，确认真实依赖、包版本、API 适配器和已有业务封装。选用已有能力时读取自动生成的 [公共库导出清单](references/library-catalog.md)，细节以 `@jcc/shared/docs` 和源码为准。

## 依赖与代码归属

- 技术栈固定为 Vue 3 + Ant Design Vue 4.x + JavaScript，单文件组件使用 `<script setup>`。已有项目不擅自迁移。
- 新项目将 `@jcc/shared` 链接到同一份源码，从其分类子路径引用组件、hooks、API、方法、验证规则和素材；入口导入 `@jcc/shared/style.css`。
- 同仓库使用 npm workspaces，仓库外的本机项目按根目录 `使用说明.md` 使用 `npm link` 和 Vite 源码访问配置。不要把共享组件复制到各应用再分别修改。
- 用户明确要求与项目局部配置优先；遵守仓库指令。共享包缺失时确认真实安装位置，不编造组件或假定已发布 npm。
- 业务字段、权限、路由、后端地址和响应格式转换属于应用；通用交互、样式和无业务方法属于公共包。

## 按需读取

| 任务                             | 读取                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- |
| 选择公共组件/API                 | [导出清单](references/library-catalog.md)、[组件路由](references/components.md)，再打开真实包的 docs/API.md 和必要源码 |
| 列表查询、分页、竞态             | [列表规范](references/tables.md)                                            |
| 树与下拉树选择                   | 组件路由 + @jcc/shared/docs/ui.md                                            |
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
5. 新增稳定且至少有明确复用价值的能力时修改公共包，补充 API 与行为测试；业务专属逻辑留在应用。
6. 运行相关测试和构建，验证错误重试、重复提交、旧响应、分页边界、文件校验及移动布局中本次涉及的部分。

交付说明修改了哪些应用/公共包、兼容性及验证结果。改变共享 API 或接入范围时明确说明；链接项目开发时直接读源码，生产页面仍需重新构建部署。

多项目交付时按需读取 [团队约定](../frontend-workspace/docs/enterprise-playbook.md) 和 [视觉基线](../frontend-workspace/docs/design-system.md)，并遵守目标项目自己的 AGENTS.md。

## 固定更新指令

用户输入 **`同步公共组件库 skill`** 时，在 `frontend-workspace` 中检查新组件或方法已从 `packages/shared/src` 的对应分类入口公开导出，并补全相应 API 文档；执行 `npm run sync:skill`，检查生成的 `frontend-system/references/library-catalog.md`，再运行相关测试和 `npm run build`。清单由真实导出生成，不把未导出的文件或用户提供的描述当作可调用 API。源码链接的开发项目不需要重新安装。
