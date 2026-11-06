# 前端视觉与交互基线

公共组件的视觉基线由主题变量、组件样式和 `playground` 共同维护。库自身验证默认外观与公共交互；使用方验收业务页面、权限和真实数据组合。

| 内容                       | 维护位置                                               |
| -------------------------- | ------------------------------------------------------ |
| 品牌色、文字色、间距等变量 | `src/theme/tokens.css`                                 |
| 顶栏、侧栏、页面容器       | `src/theme/layout.css`                                 |
| 组件外观                   | `src/components` 与 `src/theme`                        |
| 组件 API 和行为            | `docs/API.md`、对应源码与测试                          |
| 档案系统原型布局           | [布局规范](../../frontend-system/references/layout.md) |
| 档案系统原型主题           | [主题规范](../../frontend-system/references/theme.md)  |

## 运行预览与浏览器回归

在包根目录执行 `npm run dev` 可查看组件预览。预览直接导入 `@jcc/shared`，不复制实现；文件操作使用本地适配器。

修改组件或主题后执行：

```sh
npm run quality
npm run build:preview
npx playwright install chromium
npm run test:browser
npm run test:visual
```

`test:browser` 验证树筛选、查询重置、侧栏图标对齐、窄屏折叠，以及弹窗 props、事件、拖拽与全屏。`test:visual` 比对树表、空状态、收起侧栏、主题顶栏、普通/全屏弹窗与窄屏截图。基线位于 `tests/browser/snapshots`。

测试使用锁文件指定的 Chromium、1440×1000 默认视口、本地 Noto Sans SC 字体和禁用动画的测试样式；窄屏为 640×900。最多允许 1% 像素差异以容纳跨系统栅格化差异。CI 基线缺失或超出差异阈值时失败，不自动创建/接受截图。浏览器版本或字体升级也需要审核基线。

有意修改视觉时先运行 `npm run test:visual` 查看差异，再运行 `npm run test:visual:update` 生成新截图。人工检查新图和 diff 后，与样式变更一起提交；不可仅为清除失败而更新。首次基线在 Windows Chromium 生成并目视检查；Ubuntu 的实际渲染结果以首次 CI 运行和附件为准。

覆盖率只统计 `src` 中的 JS/Vue 源码，包含未执行文件，重导出入口没有可执行语句。初始全局阈值为 statements 80%、branches 70%、functions 70%、lines 85%，后续结合报告和关键行为逐步提高。HTML/LCOV 报告在 `coverage`，浏览器 HTML 报告在 `playwright-report`。

影响实际业务页面的变化仍由使用项目对照其原型检查，并维护该项目的浏览器快照。
