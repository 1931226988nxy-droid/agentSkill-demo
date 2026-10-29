# @jcc/shared/components 0.1.0

组件基于 Vue 3 + Ant Design Vue 4.2.6。业务通过 `@jcc/shared/components` 命名导入使用；入口导入 `@jcc/shared/style.css`，根使用 JccProvider。
保留原生 Ant 非冲突 attrs/events 和具名插槽。受控模型、数据、分页、上传请求等由封装本身管理，不能再用 attrs 覆盖这些契约。

## JccProvider

theme 对象：与默认 token/components 合并。locale 默认中文，size 默认 small。默认插槽包裹应用。
主题 CSS 只需导入一次；浏览器挂载前读取 CSS 变量。SSR 不读取 document，但完整 SSR 样式方案需项目另行配置。

## JccAppShell / JccPagePanel / JccQueryBar

- AppShell：v-model:activeKey、v-model:collapsed、items（Ant Menu items）、brand、shortName、brandMark、userName、department、showTabs。
- AppShell 插槽：default、brand、header-actions、footer。不绑定任何业务路由/权限系统。
- PagePanel：title；插槽 default、breadcrumb、header、extra。
- QueryBar：loading、showReset；事件 search/reset；插槽 actions（左侧操作）、default（查询字段）。Enter 触发 search。

## JccTable

| 属性              | 默认                     | 说明                                     |
| ----------------- | ------------------------ | ---------------------------------------- |
| dataSource        | []                       | server 时已分页数据；client 时完整数组   |
| columns           | []                       | 原生 Ant columns                         |
| rowKey            | id                       | 稳定主键字符串或函数                     |
| mode              | server                   | server 不二次 slice；client 在内部分页   |
| page / pageSize   | 1 / 20                   | 可 v-model；服务端推荐由 hook 控制       |
| total             | 0                        | server 必须传真实总数；client 取数组长度 |
| pagination        | true                     | false 关闭分页，client 也不切片          |
| paginationOptions | {}                       | 传给内部 JccPagination 的额外选项        |
| loading / error   | false / null             | 加载与错误重试                           |
| emptyText         | 暂无数据，请调整筛选条件 | 可用 emptyText 插槽覆盖                  |

事件：update:page、update:pageSize、page-change({page,pageSize})、retry、change（Ant 表格过滤/排序原始参数）。
默认 small/bordered，可传 scroll、rowSelection、customRow 等 Ant 属性；bodyCell、headerCell、summary 等插槽透传。
服务端只在 page-change 调用 changePage，不再 watch page 发第二次请求。

```vue
<JccTable
  :data-source="items"
  :columns="columns"
  :page="page"
  :page-size="pageSize"
  :total="total"
  :loading="loading"
  :error="error"
  @page-change="changePage"
  @retry="refresh"
>
  <template #bodyCell="{column,record}"><a-button v-if="column.key==='action'" @click="edit(record)">编辑</a-button></template>
</JccTable>
```

客户端数据减少导致当前页失效时，应用应调整页码；服务端 useTableQuery 会在 refresh 中修正超范围页码。

## JccPagination

v-model:page、v-model:pageSize、total。默认 small、显示总数、可改页容量。
一次 change({page,pageSize})；页容量改变回到第 1 页。只绑定 Ant change，避免与 showSizeChange 重复触发。
可透传 pageSizeOptions、showQuickJumper、hideOnSinglePage、disabled 等。

## JccTree

treeData、v-model:selectedKeys、fieldNames（默认 {label:'title',value:'key',children:'children'}）、searchable=true、searchPlaceholder='搜索分类'。
字段映射支持主键 0。搜索保留匹配节点祖先，匹配父节点保留分支；搜索时自动展开结果。
事件 select(keys,info)、search(keyword)，原生节点插槽和非冲突属性透传。checkedKeys/expandedKeys 等由原生 attrs 与事件管理。

## JccTreeSelect

treeData、v-model:value、fieldNames 与 Tree 一致。默认可搜索、清除和展开；change(value,label,extra) 原样回传。
支持原生 multiple、treeCheckable、disabled、labelInValue 等属性；clear 值可能为 undefined，业务不要用真假判断排除 0。

## JccUpload

v-model:fileList：Ant UploadFile[]。upload：必传异步适配器。accept 默认空，maxSizeMb=10，maxCount=5。
beforeUpload 可额外做异步业务校验，返回 false 拒绝。

```js
async function upload(file, { signal, onProgress }) {
  // 使用项目自己的请求客户端。fetch 没有上传百分比，不伪造 onProgress。
  const form = new FormData();
  form.append('file', file);
  const result = await request('/files', { method: 'POST', body: form, signal });
  return { id: result.fileId, name: file.name, url: result.previewUrl }; // 按真实接口映射
}
```

适配器有真实百分比时调用 onProgress(0..100)。返回文件元数据；成功项包含 data/response，url 可选。
事件 success({file,result})、error(error,file)、change(info)。失败保留错误反馈，移除或卸载取消请求，取消后不接受晚到响应。
Upload 原生非冲突 attrs/具名插槽仍可用，例如 multiple、listType、onPreview；action/customRequest/fileList/beforeUpload 由本封装管理。
移除上传列表项只改变列表，不隐式删除远端文件。maxCount 只限制该列表，并不限制业务数据库总数。

## JccDownload

file（至少包含业务 id/name）、request(file,{signal})、label='下载文件'；Button 属性和默认插槽可扩展。
适配器返回 Blob 或 {blob,filename}，不把 JSON 错误交给下载组件。
事件 success(file)、error(error)。同一实例请求期间防重复点击，失败可重试；卸载取消，Blob URL 自动释放。

```js
async function download(file, { signal }) {
  const response = await request(`/files/${encodeURIComponent(file.id)}/download`, {
    signal,
    responseType: 'response',
  });
  return {
    blob: await response.blob(),
    filename: getDownloadName(response.headers.get('content-disposition'), file.name),
  };
}
```

## JccFormModal

v-model:open、title、initialValues（普通 JSON 数据）、rules（Ant Form rules）、submit(values,{signal})、width。
打开时克隆初始数据；默认插槽拿到 {model}，里面放原生 Form.Item；由组件维护 Form。
校验通过后等待 submit Promise；成功 emit saved(result,values) 并关闭；失败保留内容显示错误，取消脏表单需确认。
submit 必须返回真实接口 Promise，不要写成只 emit 一个异步事件而无法等待。
事件 saved、cancel、error、update:open；非冲突 Modal attrs 可传递；open、onOk、onCancel、confirmLoading 等由本组件管理。
