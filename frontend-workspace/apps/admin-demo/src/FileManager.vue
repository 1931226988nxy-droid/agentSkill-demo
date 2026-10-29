<script setup>
import { computed, ref } from 'vue';
import {
  JccDownload,
  JccPagePanel,
  JccQueryBar,
  JccTable,
  JccTreeSelect,
  JccUpload,
} from '@jcc/shared/components';
import { findTreeNode, formatBytes } from '@jcc/shared/utils';
import { deleteDocument, documents, downloadDocument, uploadDocument } from './api/mock.js';
const categories = [
  { key: 'general', title: '综合资料' },
  {
    key: 'project',
    title: '项目资料',
    children: [
      { key: 'contract', title: '合同资料' },
      { key: 'report', title: '项目报告' },
    ],
  },
];
const category = ref(),
  keyword = ref(''),
  query = ref({ category: undefined, keyword: '' }),
  fileList = ref([]),
  page = ref(1),
  pageSize = ref(10);
const rows = computed(() =>
  documents.value.filter(
    (file) =>
      (!query.value.category || file.category === query.value.category) &&
      file.name.toLowerCase().includes(query.value.keyword.trim().toLowerCase()),
  ),
);
const columns = [
  { title: '文件名称', dataIndex: 'name', width: 260 },
  { title: '文件分类', key: 'category', width: 130 },
  { title: '大小', key: 'size', width: 100 },
  { title: '上传日期', dataIndex: 'date', width: 130 },
  { title: '操作', key: 'actions', width: 200 },
];
function search() {
  query.value = { category: category.value, keyword: keyword.value };
  page.value = 1;
}
function reset() {
  category.value = undefined;
  keyword.value = '';
  search();
}
function upload(file, context) {
  return uploadDocument(file, { ...context, category: category.value || 'general' });
}
function afterUpload() {
  query.value = { category: undefined, keyword: '' };
  page.value = 1;
}
function remove(file) {
  deleteDocument(file.id);
  fileList.value = fileList.value.filter((item) => item.response?.id !== file.id);
  page.value = Math.max(1, Math.min(page.value, Math.ceil(rows.value.length / pageSize.value)));
}
</script>
<template>
  <JccPagePanel title="文件管理">
    <a-alert
      type="info"
      show-icon
      message="本地演示文件服务"
      description="文件仅保留在本页内存中，刷新后清空；不会上传到外部服务器。"
    />
    <JccQueryBar @search="search" @reset="reset">
      <template #actions>
        <span class="muted">已保存 {{ documents.length }} 个文件</span>
      </template>
      <label for="file-category">文件分类</label>
      <JccTreeSelect
        id="file-category"
        v-model:value="category"
        :tree-data="categories"
        aria-label="文件分类"
        style="width: 180px"
      />
      <a-input
        v-model:value="keyword"
        allow-clear
        placeholder="请输入文件名称"
        aria-label="文件名称"
      />
    </JccQueryBar>
    <JccUpload
      v-model:file-list="fileList"
      :upload="upload"
      accept=".txt,.csv,.pdf,.png,.jpg,.xlsx,.docx"
      :max-size-mb="10"
      :max-count="5"
      @success="afterUpload"
    />
    <div style="margin-top: 20px">
      <JccTable
        v-model:page="page"
        v-model:page-size="pageSize"
        mode="client"
        :columns="columns"
        :data-source="rows"
        :scroll="{ x: 820 }"
        empty-text="尚无文件，请先选择文件上传"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'category'">
            {{ findTreeNode(categories, record.category)?.title || '未分类' }}
          </template>
          <template v-else-if="column.key === 'size'">{{ formatBytes(record.size) }}</template>
          <a-space v-else-if="column.key === 'actions'">
            <JccDownload :file="record" :request="downloadDocument" type="link" label="下载" />
            <a-popconfirm
              title="确定删除该文件？"
              ok-text="删除"
              cancel-text="取消"
              @confirm="remove(record)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </JccTable>
    </div>
  </JccPagePanel>
</template>
