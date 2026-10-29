# 本次交付验证

日期：2026-10-23。技术栈：Vue 3.5.44、Ant Design Vue 4.2.6、JavaScript。

- `npm test`：30 项测试通过，包含树/主键 0、文件校验、请求归一化、竞态、取消、分页边界、表格扩展、表单失败保留/防重复和下载资源释放。
- `npm run format:check`：源码格式检查通过。
- `npm run build`：11 个组件的 UI 包，以及两个消费项目均构建成功。Vue 与 Ant 为 UI 包 peer，不内置另一份 Vue。
- `npm run pack:libs`：四个包的本地 tgz 已生成，包入口和 API 文档完整。
- 独立验证工程只安装四个 tgz 及其 peer/构建依赖，成功构建，未使用 workspace 源码别名。
- 浏览器实际验证树与表格联动、独立分页、下拉树选择、失败保存后保留输入并重试、文件上传失败/成功和下载重试。
- 使用生成的测试文本文件上传再下载，下载字节与原文件一致；演示适配器只保存在浏览器内存。
- 390px 宽度检查了组件演示和业务文件页，未出现页面横向撑宽。
- 两个构建页面控制台未出现警告或错误。截图与单文件快照已更新。

单文件预览为方便直接查看而保留单入口，应用构建存在大 chunk 提示；正式项目宜按业务路由懒加载。
真实后端、鉴权权限、文件内容安全检查、大数据量性能与生产部署需按具体项目接入验证。本交付不会发布 npm，也不会自动改动其他项目。

## 2026-10-24 旧项目 CSS 参考优化

- 将旧项目截图中可辨认的浅蓝灰背景、白色面板、蓝色选中态、细边框与紧凑密度整理进共享 tokens、布局和组件样式；按钮操作色采用更深的蓝色以保持白字可读。
- `npm test`：30 项通过；`npm run format:check`：通过；`npm run build`：UI 与两个应用构建成功。
- `npm run pack:libs`：四个本地安装包已刷新；`npm run export:preview`：两个离线 HTML 已刷新。
- 浏览器检查业务工作台、树表管理页和独立组件演示，主题样式均已加载，表格与树的选中状态正常显示。
- skill 的引用文件和 YAML frontmatter 已检查；`quick_validate.py` 因本机 Python 环境缺少 PyYAML，未能执行。

## 2026-10-26 单包公共库

- `npm run pack:shared` 成功，生成 `artifacts/jcc-shared-0.1.0.tgz`，包含分类 JS 入口、合并 CSS、SVG 素材及五份 API 文档；产物 JS 无运行时 `@jcc/*` 引用。
- 将这个 tgz 单独安装到临时 Vue + Ant Design Vue 项目后，Vite 成功构建包含组件、API、验证规则、素材和样式的页面。
- `npm test`：32 项通过；`npm run format:check`：通过；`npm run sync:skill`：成功生成公共库导出清单。
- 临时验证项目位于 `.tmp-shared-check`；自动清理命令被本机策略拒绝，未删除该目录。

## 2026-10-26 源码链接接入

- 以上 tgz 方案已停止使用；打包脚本和生成的五个 tgz 已移除。当前两个应用改从 `@jcc/shared` 的源码子路径导入。
- `npm run build`：两个应用均构建成功；`npm test`：32 项通过；`npm run format:check` 和 `npm run sync:skill`：通过。
- 在独立验证项目运行 `npm link @jcc/shared --save` 后，`node_modules/@jcc/shared` 为指向公共库源码的目录链接；`npm ci` 后该链接仍恢复，Vite 构建成功。
- 独立项目的 Vite 开发服务通过 `@jcc/shared/vite` 读取公共源码。临时修改验证规则源码时，HTTP 请求读到新内容且 Vite 报告页面刷新；测试文件已恢复。
