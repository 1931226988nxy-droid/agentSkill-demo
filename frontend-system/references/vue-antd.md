# Vue 与 Ant Design Vue

使用 Vue 3 Composition API、JavaScript 和 `<script setup>`。公共包公开 ESM，Vue/Ant 作为 ui 的 peer 依赖，避免重复打包 Vue。
页面优先从 @jcc/shared/components 导入组合组件，普通控件仍可直接用 Ant；不机械包装全部控件。
独立前端项目按共享包上一级目录的 `使用说明.md` 将 @jcc/shared 链接到同一份源码。
UI 包源码改变后，链接项目的 Vite 开发服务直接读取变化；已部署页面需重新构建和部署。
真实 API、鉴权和响应归一化由应用提供。包不保存 token，不包含任何生产后端地址。
应用可以自行路由懒加载；静态预览页面不限制实际项目的拆分方式。

官方文档：[Vue](https://vuejs.org/api/sfc-script-setup.html)、[Ant Design Vue](https://github.com/vueComponent/ant-design-vue)。
