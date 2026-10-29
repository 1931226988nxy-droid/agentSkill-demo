# 前端视觉与交互基线

公共组件的视觉基线来自本仓库的样式和两个示例应用。新增页面先复用已有组件与主题变量，再为确有复用价值的交互扩展公共库。

| 内容 | 唯一维护位置 |
| --- | --- |
| 品牌色、文字色、间距等变量 | `packages/shared/src/theme/tokens.css` |
| 顶栏、侧栏、页面容器 | `packages/shared/src/theme/layout.css` |
| 组件外观 | `packages/shared/src/components` 与 `packages/shared/src/theme` |
| 组件 API 和行为 | `packages/shared/docs/API.md`，对应源码与测试 |
| 档案系统原型的布局约束 | [布局规范](../../frontend-system/references/layout.md) |
| 档案系统原型的主题约束 | [主题规范](../../frontend-system/references/theme.md) |
| 可运行示例 | `apps/admin-demo`、`apps/component-lab` |

## 改动检查

1. 新页面使用 `@jcc/shared/style.css` 和分类子路径的公共能力；页面专属内容保留在应用中。
2. 公共组件提供明确的属性、事件与状态说明；涉及键盘、空状态、加载和错误时同步验证。
3. 主题或布局变化运行 `npm run test:browser:update`，查看快照差异后提交新的基线；普通变更运行 `npm run quality`。
4. 检查 1440px 工作台、390px 移动布局和侧栏收起状态；页面不能出现意外横向滚动。

浏览器快照位于 `tests/browser/visual.spec.js-snapshots`。它们用于发现意外变化，不代替对原型和业务内容的人工检查。Windows 快照应在相同运行环境更新。
