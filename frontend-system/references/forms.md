# 表单

- 普通字段使用 Ant Form.Item/Input/Select 等，分类字段用 JccTreeSelect。
- 常规新增/编辑使用 JccFormModal，通过 initialValues 和字段插槽配置业务表单。
- submit(values,{signal}) 必须返回真正等待接口完成的 Promise。失败不关闭窗口、不清空字段；禁止用不返回 Promise 的事件假装保存完成。
- 字段规则由应用提供，校验成功后才发请求；公共弹窗防重复提交并提供未保存提醒。
- 查询区域使用 JccQueryBar；保持草稿与已生效条件的语义，重置同步页码与选择。
- 标签明确，错误关联字段；文件元数据与权限检查由业务接口决定。
- 暂不引入通用 schema 表单引擎；只有出现明确稳定的复杂复用需求时再评估。
