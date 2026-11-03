# 共享主题

共享主题的数值来源为 `frontend-workspace/src/theme/tokens.css`；`createAntTheme()` 把变量映射到 Ant Design Vue。布局在同目录的 `layout.css`，组件局部样式在 `frontend-workspace/src/components/style.css`。新项目只导入 `@jcc/shared/style.css`，所有应用通过 `JccProvider` 共用主题。

当前默认视觉以用户提供的档案系统原型为准：页面底色 `#f2f3f8`、白色内容卡片、蓝青渐变顶栏、亮蓝强调色 `#4c78f4`、浅蓝选中底色 `#e9eefc` 和浅灰表头 `#f0f1f5`。主操作色为 `#246fee`，用于按钮与链接；卡片圆角约 12–16px，表单控件仍保持较小圆角。完整侧栏和图标侧栏共用 `JccAppShell`，工作台可不显示顶部页签。

改色先改语义变量，再检查 `createAntTheme()` 与页面实际效果。不要把早先 CSS 截图中的 `html {font-size:100px}`、全局 `outline:none`、全局 `.ant-*` 覆盖、按菜单序号隐藏导航项或大量 `!important` 规则移入共享主题。导航数量由数据控制；焦点样式保留。原型中的企业标识、照片和统计图需要真实资源或页面数据支持，不能靠主题 CSS 自动生成。

产品名称、菜单和业务文案在应用配置中修改。局部主题可用应用作用域变量与 `JccProvider theme` 覆盖；改变 CSS 变量的组件色时同步 Provider Token。交付前检查桌面/手机宽度、表格溢出、悬停/选中/禁用/焦点状态及文字对比度。照片中的水印、标识和业务信息不属于设计规范。
