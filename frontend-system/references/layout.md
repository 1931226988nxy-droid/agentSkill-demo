# 布局组合

- 外壳使用 JccAppShell 的 brand/items/activeKey 等参数及 header-actions/footer 插槽。
- 页面使用 JccPagePanel；筛选和操作使用 JccQueryBar，主体用 JccTable 或自己的业务模块。
- 左树右表组合 JccTree + JccTable；树选择事件转换为应用查询条件。
- 侧栏、树宽度和基础间距来自共享主题。手机收起导航和分类树，宽表在自身容器内滚动。
- 工作台使用模块卡片和快捷入口，信息密集页面保持紧凑；不要为了统一而让所有业务结构相同。
- 档案系统原型的完整白色导航栏约 230px，图标导航栏约 72px；工作区使用浅灰背景与白色卡片。共享尺寸通过 `--sidebar-width`、`--sidebar-collapsed-width`、`--page-padding`、`--table-cell-*` 等变量调整，不按菜单序号隐藏元素。
- 路由、权限、多页签缓存由真实应用负责。示例外壳的 activeKey 只展示消费方式，不冒充完整路由系统。
