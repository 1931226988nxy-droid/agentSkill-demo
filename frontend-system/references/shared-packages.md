# 共享工程接入与归属

公共库入口是 `frontend-workspace/packages/shared`，包名 `@jcc/shared`，组件、hooks、utils 和 theme 源码均在该包内。当前两个应用已通过 npm workspaces 链接该目录；其他本机项目通过 `npm link` 链接同一目录，具体命令及 Vite 配置见根目录 `使用说明.md`。

应用入口导入 `ant-design-vue/dist/reset.css` 和 `@jcc/shared/style.css`；组件从 `@jcc/shared/components` 导入，其他类别见[导出清单](library-catalog.md)。新增组件或方法后更新源码导出和 API 文档，输入“同步公共组件库 skill”运行 `npm run sync:skill`。链接项目的 Vite 开发服务直接读取源码变化；新增依赖或导出路径时重启服务。

通用组件、样式、无业务方法、请求封装和共享素材归公共库；业务字段、后端 URL、权限、接口响应适配和业务图片归各应用。跨电脑使用时需要可共同访问的源码目录或其他同步机制；已部署页面仍需重新构建和部署。
