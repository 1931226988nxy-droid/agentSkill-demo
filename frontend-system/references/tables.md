# 列表与分页

- 默认 JccTable + useTableQuery。后端返回值由项目 api 适配成 `{items,total}`。
- server 模式接收已分页数据，不再 slice；client 模式接收全部数组后分页，明确选择而不是猜测。
- JccPagination 可单用，也由 JccTable 内部复用。页容量改变回第一页，`change/page-change` 每次交互只发一次。
- 服务端查询用 `:page/:page-size` + `@page-change`；不要既 watch 页码又在事件中请求，造成双请求。
- 查询草稿仅在 search 后生效。useTableQuery 负责重置页码、错误状态、重试、取消旧请求和忽略晚到响应。
- 筛选/树选择后清理应用的失效选中项；删除后 refresh 会修正超范围页码。
- 主键稳定，长文本省略或查看详情；错误提供重试，空数据与失败区分。
- Tree 与 TreeSelect 均支持映射 label/value/children 字段；保留合法主键 0。
- 宽表局部滚动，不能撑宽页面。实际 Ant columns/rowSelection/scroll 和 bodyCell 等插槽保留给业务扩展。

准确 API 阅读共享包 `docs/ui.md`，异步逻辑阅读共享包 `docs/hooks.md`。
