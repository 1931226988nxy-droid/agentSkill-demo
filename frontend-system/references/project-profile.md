# 项目配置：可修改入口

| 项目 | 当前值 | 适配方式 |
|---|---|---|
| 技术栈 | Vue 3 + Ant Design Vue 4.x + JavaScript | `<script setup>`，不默认引入 TS |
| 公共库源码入口 | @jcc/shared 0.1.0 | 包根目录为 frontend-workspace；本机项目用 npm link |
| 公共组件 | @jcc/shared/components | 13 个组件及 `openModal`、`useModal` 方法 |
| 状态、API、方法、规则、素材 | @jcc/shared/hooks、api、utils、validators、assets | 以自动生成的导出清单为准 |
| 主题 | @jcc/shared/style.css、theme | 包含统一样式和 Ant Token 映射 |
| 工程根目录 | frontend-workspace | 链接后从项目依赖解析位置确认 |
| API 文档 | frontend-workspace/docs/API.md | 从公共库源码目录读取 |
| 分类详细说明 | frontend-workspace/docs/ui.md、utils.md、hooks.md、theme.md | 与公共库源码一起维护 |
| 接口实现 | 项目自己的 api 目录 | 对接 Java 服务地址、接口字段与响应格式 |
| 产品信息 | 项目自己的配置 | 品牌、部门和导航不进入底层组件 |
| 默认主题 | 蓝青渐变企业管理风格 | frontend-workspace/src/theme/tokens.css，经 @jcc/shared/style.css 引入 |
| 样式密度 | small / compact | 可通过 JccProvider size 与主题局部调整 |
| 图表 | 沿用项目已有实现 | 不默认添加新依赖 |

`auto` 不是必须填写的阻塞项。项目自己的 AGENTS.md 可覆盖主题、公共封装路径、接口和路由等差异。
修改主题或组件会被正在运行的源码链接开发项目读取；已部署页面仍需重新构建和部署。
