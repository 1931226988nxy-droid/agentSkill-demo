# 浮层

- 常规表单用 JccFormModal，详情可直接用 Ant Drawer，简单危险确认用 Popconfirm。
- 保留标题、关闭按钮、键盘和焦点管理；有未保存内容时提醒，不误丢输入。
- 静态 message/notification/Modal 不假定自动继承 ConfigProvider 上下文。
- 需要定制时先用 attrs、slot 和项目局部类；不要复制一份公共弹窗到应用内修改。
- 提交失败的错误显示在本次操作附近，避免只出现一闪而过的通知。
