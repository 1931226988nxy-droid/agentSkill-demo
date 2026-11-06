# @jcc/shared

Vue 3 + Ant Design Vue 的公共前端源码库，包含组件、hooks、请求封装、工具、验证规则、主题和共享 SVG。Java 接口与业务配置由使用项目维护。

## 本地运行

需要 Node.js 22.12+（也支持 20.19+）。

```sh
git clone https://github.com/1931226988nxy-droid/agentSkill-demo.git
cd agentSkill-demo/frontend-workspace
npm ci
npm run dev
```

打开终端提示的地址，预览侧栏、树表、查询、表单、上传下载和可拖拽/全屏弹窗。预览使用本地数据，可在没有后端服务的情况下运行。

## 在其他项目使用

按 [使用说明](使用说明.md) 建立本机源码链接。Vue、Ant Design Vue 和图标库由应用提供；从分类入口导入能力：

```js
import { JccProvider, JccTree, openModal } from "@jcc/shared/components";
import { useTableQuery } from "@jcc/shared/hooks";
import { createHttpClient } from "@jcc/shared/api";
import "@jcc/shared/style.css";
```

开发时修改共享源码会触发已链接的 Vite 项目刷新。正式交付固定源码提交；已部署的应用需要重新构建部署。各公开入口附带类型声明，JS 项目也可获得参数与回调提示。

## 检查与维护

在 `frontend-workspace` 执行：

| 命令                              | 用途                                                      |
| --------------------------------- | --------------------------------------------------------- |
| `npm run quality`                 | 格式、文档链接、导出/类型清单、消费方类型契约、覆盖率门禁 |
| `npm run build:preview`           | 构建组件预览，验证源码在浏览器中的依赖与编译              |
| `npx playwright install chromium` | 首次安装浏览器测试所需 Chromium                           |
| `npm run test:browser`            | 浏览器交互与布局回归                                      |
| `npm run test:visual`             | 对照已提交的截图基线                                      |
| `npm run test:visual:update`      | 有意修改样式后生成待审核的新基线                          |
| `npm run sync:skill`              | 从真实导出更新 skill 清单                                 |

CI 在 Ubuntu 执行质量检查、预览构建及浏览器回归。覆盖率报告在 `frontend-workspace/coverage/index.html`，失败时的浏览器截图与 trace 见 CI 附件。

## 文档

- [公共 API](frontend-workspace/docs/API.md)
- [组件与事件](frontend-workspace/docs/ui.md)
- [结构与归属](frontend-workspace/docs/architecture.md)
- [多项目交付及版本触发条件](frontend-workspace/docs/enterprise-playbook.md)
- [视觉基线与截图审核](frontend-workspace/docs/design-system.md)
- [变更记录](CHANGELOG.md)
- [Codex skill](frontend-system/SKILL.md)：新增能力后输入“同步公共组件库 skill”。
