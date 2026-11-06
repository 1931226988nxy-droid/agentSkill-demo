# 组件选择路由

具体属性、插槽和示例以共享包 `docs/ui.md` 与源码为准。本文件只指导选择。当前完整导出名称见[公共库导出清单](library-catalog.md)。

| 需要 | 使用 |
|---|---|
| 应用主题和语言 | JccProvider |
| 企业顶栏/导航/页签 | JccAppShell |
| 标题和内容面板 | JccPagePanel |
| 查询、重置、工具栏 | JccQueryBar |
| 带状态及分页的表格 | JccTable |
| 单独分页 | JccPagination |
| 搜索和选择分类树 | JccTree |
| 左树右表可拖拽布局 | JccTreeTableLayout，业务树与表格通过插槽传入 |
| 表单中的下拉树选择 | JccTreeSelect |
| 校验、进度、取消和上传反馈 | JccUpload |
| 下载请求、防重复及错误反馈 | JccDownload |
| 校验、保存、失败保留和未保存提醒 | JccFormModal |
| 任意内容的可拖拽、可全屏弹窗 | JccModal；在业务事件中调用 openModal |

优先组合这些组件。对未封装的普通控件直接使用 Ant Design Vue，不制造只改名称的重复包装。
公共封装保留原始 Ant 属性/插槽的扩展入口；接口发生冲突时以 wrapper 的受控属性约定为准。
