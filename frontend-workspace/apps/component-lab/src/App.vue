<script setup>
import { computed, ref } from 'vue';
import {
  JccDownload,
  JccFormModal,
  JccPagePanel,
  JccPagination,
  JccProvider,
  JccTable,
  JccTree,
  JccTreeSelect,
  JccUpload,
} from '@jcc/shared/components';
import { formatBytes } from '@jcc/shared/utils';
const nodes = [
  {
    id: 0,
    label: '集团总部',
    nodes: [
      { id: 1, label: '综合管理部' },
      { id: 2, label: '项目管理部' },
    ],
  },
  { id: 3, label: '区域中心' },
];
const fields = { label: 'label', value: 'id', children: 'nodes' };
const selected = ref([0]),
  selectedValue = ref(0),
  page = ref(1),
  pageSize = ref(10),
  standalonePage = ref(1),
  standaloneSize = ref(20);
const tasks = ref(
  Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    name: `任务 ${String(i + 1).padStart(2, '0')}`,
    department: i % 2 ? '综合管理部' : '项目管理部',
  })),
);
const columns = [
  { title: '编号', dataIndex: 'id', width: 70 },
  { title: '任务名称', dataIndex: 'name' },
  { title: '所属部门', dataIndex: 'department' },
  { title: '操作', key: 'action', width: 90 },
];
const formOpen = ref(false),
  failSave = ref(false);
async function saveTask(values) {
  if (failSave.value) throw new Error('模拟保存失败，内容已保留，请关闭故障开关后重试');
  const row = { id: tasks.value.length + 1, ...values, department: '综合管理部' };
  tasks.value.unshift(row);
  page.value = 1;
  return row;
}
const fileList = ref([]),
  stored = ref([]),
  failUpload = ref(false),
  failDownload = ref(false);
const blobs = new Map();
async function upload(file, { signal, onProgress }) {
  if (failUpload.value) throw new Error('模拟上传失败，可移除失败项后重新选择文件');
  const bytes = await file.arrayBuffer();
  if (signal.aborted) throw new DOMException('已取消', 'AbortError');
  const item = { id: crypto.randomUUID(), name: file.name, size: file.size };
  blobs.set(item.id, new Blob([bytes], { type: file.type }));
  stored.value.unshift(item);
  onProgress(100);
  return item;
}
async function download(file, { signal }) {
  if (failDownload.value) throw new Error('模拟下载失败，请关闭故障开关后重试');
  if (signal.aborted) throw new DOMException('已取消', 'AbortError');
  return { blob: blobs.get(file.id), filename: file.name };
}
const selectedLabel = computed(
  () =>
    ({ 0: '集团总部', 1: '综合管理部', 2: '项目管理部', 3: '区域中心' })[selectedValue.value] ||
    '未选择',
);
</script>
<template>
  <JccProvider>
    <header class="fs-header">
      <div class="fs-brand">
        <span class="fs-brand-mark">J</span>
        <span class="fs-brand-title">公共组件演示</span>
      </div>
      <span>第二个独立消费项目</span>
    </header>
    <main class="fs-page-area">
      <JccPagePanel title="共享组件与交互验证">
        <p class="muted" style="margin-bottom: 20px">
          此项目与业务管理示例使用同一份公共组件包、主题和方法。上传文件只保留在内存中。
        </p>
        <div class="jcc-lab-grid">
          <section class="jcc-lab-card">
            <h2>树组件</h2>
            <JccTree
              v-model:selected-keys="selected"
              :tree-data="nodes"
              :field-names="fields"
              @select="(keys) => (selectedValue = keys[0])"
            />
            <p class="muted">支持节点主键 0、自定义字段和保留祖先的搜索。</p>
          </section>
          <section class="jcc-lab-card">
            <h2>下拉树选择</h2>
            <label for="lab-department">所属部门</label>
            <JccTreeSelect
              id="lab-department"
              v-model:value="selectedValue"
              :tree-data="nodes"
              :field-names="fields"
              aria-label="所属部门"
              @change="(value) => (selected = value == null ? [] : [value])"
            />
            <p style="margin-top: 16px" role="status">当前选择：{{ selectedLabel }}</p>
            <h2 style="margin-top: 24px">独立分页</h2>
            <JccPagination
              v-model:page="standalonePage"
              v-model:page-size="standaloneSize"
              :total="137"
            />
            <p style="margin-top: 12px">第 {{ standalonePage }} 页，每页 {{ standaloneSize }} 条</p>
          </section>
          <section class="jcc-lab-card">
            <h2>上传组件</h2>
            <a-space style="margin-bottom: 16px">
              <a-switch v-model:checked="failUpload" aria-label="模拟上传失败" />
              <span>模拟上传失败</span>
            </a-space>
            <JccUpload
              v-model:file-list="fileList"
              :upload="upload"
              accept=".txt,.csv,.pdf,.png"
              :max-size-mb="2"
            />
          </section>
          <section class="jcc-lab-card">
            <h2>下载组件</h2>
            <a-space style="margin-bottom: 16px">
              <a-switch v-model:checked="failDownload" aria-label="模拟下载失败" />
              <span>模拟下载失败</span>
            </a-space>
            <a-empty v-if="!stored.length" description="先上传文件，再验证下载" />
            <div v-for="file in stored" :key="file.id" style="margin-bottom: 12px">
              <p>{{ file.name }} · {{ formatBytes(file.size) }}</p>
              <JccDownload :file="file" :request="download" />
            </div>
          </section>
        </div>
        <section class="jcc-lab-card" style="margin-top: 16px">
          <div class="fs-toolbar">
            <h2>公共表格与表单弹窗</h2>
            <a-space>
              <a-switch v-model:checked="failSave" aria-label="模拟保存失败" />
              <span>模拟保存失败</span>
              <a-button type="primary" @click="formOpen = true">新增任务</a-button>
            </a-space>
          </div>
          <JccTable
            v-model:page="page"
            v-model:page-size="pageSize"
            mode="client"
            :columns="columns"
            :data-source="tasks"
            :scroll="{ x: 650 }"
          >
            <template #bodyCell="{ column, record }">
              <a-tag v-if="column.key === 'action'" color="blue">
                {{ record.id % 2 ? '待处理' : '处理中' }}
              </a-tag>
            </template>
          </JccTable>
        </section>
      </JccPagePanel>
    </main>
    <JccFormModal
      v-model:open="formOpen"
      title="新增任务"
      :initial-values="{ name: '' }"
      :rules="{ name: [{ required: true, whitespace: true, message: '请输入任务名称' }] }"
      :submit="saveTask"
    >
      <template #default="{ model }">
        <a-form-item name="name" label="任务名称">
          <a-input v-model:value="model.name" placeholder="请输入任务名称" />
        </a-form-item>
        <a-space>
          <a-switch v-model:checked="failSave" aria-label="编辑时模拟保存失败" />
          <span>模拟保存失败</span>
        </a-space>
      </template>
    </JccFormModal>
  </JccProvider>
</template>
