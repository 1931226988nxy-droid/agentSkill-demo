# 文件与公共方法

上传用 JccUpload，下载用 JccDownload。实际接口按 @jcc/shared/docs/ui.md 实现，不能在组件里硬编码后端 URL。
- 上传前校验 accept 和 maxSizeMb，回调 upload(file,{signal,onProgress}) 归一化为文件元数据。
- 只有上传适配器报告真实进度时显示相应百分比；fetch 不提供真实上传进度时不编造进度。
- 删除/卸载中止上传，取消后忽略晚到的成功结果。上传列表移除和服务端删除是不同业务动作。
- 下载适配器返回 Blob 或 {blob,filename}；先检查 HTTP 状态，不能把错误 JSON 当作文件。
- 文件名可用 getDownloadName 解析和清理，对象 URL 在触发下载后释放。
- 前端文件校验用于体验，服务端仍核验实际内容、大小、权限等。

普通请求可从 @jcc/shared/api 使用 createHttpClient，配置 baseURL、getHeaders、onUnauthorized；也可沿用已有项目请求库。
树数据使用 listToTree/normalizeTree/filterTree；数字与时间用 formatBytes/formatDate。
具体参数和边界阅读各公共包的 docs/API.md。
