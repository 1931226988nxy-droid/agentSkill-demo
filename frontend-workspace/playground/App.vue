<script setup>
import { computed, h, ref } from 'vue';
import { Button, FormItem, Input, InputSearch, Select, Space, Tag } from 'ant-design-vue';
import { AppstoreOutlined, FileOutlined, FolderOutlined } from '@ant-design/icons-vue';
import {
  JccAppShell,
  JccDownload,
  JccFormModal,
  JccPagePanel,
  JccProvider,
  JccQueryBar,
  JccTable,
  JccTree,
  JccTreeSelect,
  JccTreeTableLayout,
  JccUpload,
  openModal,
} from '@jcc/shared/components';
import { addIconUrl, documentImageUrl } from '@jcc/shared/assets';
import ExampleEditor from './ExampleEditor.vue';

const activeKey = ref('overview');
const collapsed = ref(false);
const mobileOpen = ref(true);
const theme = ref('blue');
const themeTokens = computed(() => ({
  token: { colorPrimary: theme.value === 'green' ? '#16856b' : '#2475fc' },
}));
const navigation = [
  { key: 'overview', label: '树表与查询', icon: () => h(AppstoreOutlined) },
  { key: 'dialogs', label: '表单与弹窗', icon: () => h(FolderOutlined) },
  { key: 'files', label: '文件与素材', icon: () => h(FileOutlined) },
];
const categories = [
  {
    key: 'all',
    title: '全部分类',
    children: [
      { key: 'document', title: '文档' },
      { key: 'image', title: '图片' },
    ],
  },
];
const records = [
  { id: 1, name: '组件接入指南', category: 'document', type: '文档', status: '可用' },
  { id: 2, name: '主题设计规范', category: 'document', type: '文档', status: '可用' },
  { id: 3, name: '共享图标', category: 'image', type: '图片', status: '可用' },
];
const columns = [
  { title: '序号', dataIndex: 'id', width: 80 },
  { title: '名称', dataIndex: 'name' },
  { title: '类别', dataIndex: 'type', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
];
const selectedKeys = ref(['all']);
const keyword = ref('');
const appliedKeyword = ref('');
const page = ref(1);
const rows = computed(() =>
  records.filter(
    (row) =>
      (selectedKeys.value[0] === 'all' ||
        !selectedKeys.value.length ||
        row.category === selectedKeys.value[0]) &&
      row.name.includes(appliedKeyword.value),
  ),
);
function search() {
  appliedKeyword.value = keyword.value;
  page.value = 1;
}
function reset() {
  keyword.value = '';
  search();
}
const saved = ref('');
function showModal() {
  const modal = openModal({
    component: ExampleEditor,
    props: { name: '示例名称' },
    on: {
      saved(value) {
        saved.value = value;
        modal.close();
      },
    },
    modalProps: { title: '编辑示例', width: 640, footer: null },
  });
}
const formOpen = ref(false);
const files = ref([]);
async function upload(file) {
  return { name: file.name, id: 'local-preview' };
}
async function download() {
  return {
    blob: new Blob(['JCC shared preview'], { type: 'text/plain' }),
    filename: 'shared-preview.txt',
  };
}
</script>

<template>
  <JccProvider :theme="themeTokens" class="preview-root" :class="`preview-theme-${theme}`">
    <JccAppShell
      v-model:active-key="activeKey"
      v-model:collapsed="collapsed"
      :items="navigation"
      brand="公共组件预览"
      short-name="JCC SHARED"
      brand-mark="J"
      user-name="预览用户"
      department="共享前端组件"
    >
      <template #header-actions>
        <Select
          v-model:value="theme"
          aria-label="切换主题"
          :options="[
            { value: 'blue', label: '默认蓝色' },
            { value: 'green', label: '青绿主题' },
          ]"
          class="preview-theme-select"
        />
      </template>
      <JccPagePanel title="公共组件预览">
        <template #extra><Tag color="blue">本地示例数据</Tag></template>
        <div class="preview-intro">
          <p>直接引用公共库源码，检查组件组合、主题与交互。</p>
          <Space wrap>
            <Button type="primary" @click="showModal">打开弹窗</Button>
            <Button @click="formOpen = true">打开表单</Button>
            <Button class="preview-mobile-toggle" @click="mobileOpen = !mobileOpen">
              切换分类
            </Button>
          </Space>
          <p role="status">{{ saved ? `已保存：${saved}` : '等待操作' }}</p>
        </div>
        <JccTreeTableLayout v-if="activeKey === 'overview'" :mobile-open="mobileOpen">
          <template #tree-header><h2>资源分类</h2></template>
          <template #tree>
            <JccTree v-model:selected-keys="selectedKeys" :tree-data="categories" />
          </template>
          <template #content-header><h2>共享资源</h2></template>
          <template #toolbar>
            <JccQueryBar @search="search" @reset="reset">
              <InputSearch
                v-model:value="keyword"
                aria-label="资源名称"
                placeholder="输入资源名称"
                @search="search"
              />
            </JccQueryBar>
          </template>
          <JccTable
            v-model:page="page"
            :columns="columns"
            :data-source="rows"
            mode="client"
            :page-size="10"
            :scroll="{ x: 620 }"
          />
        </JccTreeTableLayout>
        <div v-else-if="activeKey === 'dialogs'" class="preview-section">
          <h2>弹窗与表单</h2>
          <p>标题支持鼠标拖拽，右上角可切换全屏。表单校验通过后执行 submit 回调。</p>
          <label for="category-select">下拉树选择</label>
          <JccTreeSelect
            id="category-select"
            :tree-data="categories"
            placeholder="选择分类"
            style="width: 280px"
          />
        </div>
        <div v-else class="preview-section">
          <h2>上传、下载与共享素材</h2>
          <p>上传仅演示本地适配器；刷新后清空。下载生成浏览器本地文本文件。</p>
          <JccUpload v-model:file-list="files" :upload="upload" accept=".txt,.pdf,.png" />
          <JccDownload :file="{ id: 'preview', name: 'shared-preview.txt' }" :request="download" />
          <Space>
            <img :src="documentImageUrl" alt="文档图标" width="32" />
            <img :src="addIconUrl" alt="新增图标" width="32" />
          </Space>
        </div>
      </JccPagePanel>
    </JccAppShell>
    <JccFormModal
      v-model:open="formOpen"
      title="新增资源"
      :initial-values="{ name: '' }"
      :rules="{ name: [{ required: true, message: '请输入名称' }] }"
      :submit="
        async (values) => {
          saved = values.name;
          return values;
        }
      "
    >
      <template #default="{ model }">
        <FormItem label="名称" name="name">
          <Input v-model:value="model.name" aria-label="表单名称" />
        </FormItem>
      </template>
    </JccFormModal>
  </JccProvider>
</template>
