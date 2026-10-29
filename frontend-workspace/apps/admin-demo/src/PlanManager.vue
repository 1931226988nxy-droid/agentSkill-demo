<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import { JccFormModal, JccPagePanel, JccQueryBar, JccTable, JccTree } from '@jcc/shared/components';
import { useTableQuery } from '@jcc/shared/hooks';
import { deletePlans, listPlans, plans, savePlan } from './api/mock.js';
const props = defineProps({ mode: { type: String, default: 'config' } });
const isReview = computed(() => props.mode === 'review');
const title = computed(() => (isReview.value ? '检查自评' : '检查方案'));
const activeSection = ref('plans'),
  treeOpen = ref(false),
  selectedKeys = ref([]);
const statusLabels = { pending: '未上报', returned: '已退回', submitted: '已上报' };
const statusColors = { pending: 'default', returned: 'orange', submitted: 'blue' };
const {
  filters,
  page,
  pageSize,
  items,
  total,
  loading,
  error,
  refresh,
  search,
  reset,
  changePage,
} = useTableQuery({
  fetcher: listPlans,
  initialFilters: { keyword: '', status: 'all', year: 'all', tab: 'all' },
});
onMounted(refresh);
const treeData = computed(() => [
  {
    title: '全部检查方案',
    key: 'all',
    children: ['2026', '2025'].map((year) => ({
      title: `${year} 年度方案（${plans.value.filter((row) => row.year === year).length}）`,
      key: year,
    })),
  },
]);
function query() {
  selectedKeys.value = [];
  return search();
}
function resetQuery() {
  const year = filters.year,
    tab = filters.tab;
  filters.keyword = '';
  filters.status = 'all';
  filters.year = year;
  filters.tab = tab;
  return query();
}
function selectYear(keys) {
  filters.year = keys[0] || 'all';
  return query();
}
function selectTab(key) {
  filters.tab = key;
  return query();
}
function pagination(value) {
  selectedKeys.value = [];
  return changePage(value);
}
const selection = computed(() => ({
  selectedRowKeys: selectedKeys.value,
  getCheckboxProps: (row) => ({ 'aria-label': `选择 ${row.name}` }),
  onChange: (keys) => (selectedKeys.value = keys),
}));
const columns = computed(() => [
  { title: '序号', key: 'index', width: 64, align: 'center' },
  { title: '操作', key: 'action', width: 160 },
  { title: '检查方案名称', dataIndex: 'name', key: 'name', width: 290 },
  {
    title: isReview.value ? '检查结果状态' : '方案状态',
    key: 'status',
    width: 106,
    align: 'center',
  },
  { title: '所属单位', dataIndex: 'department', width: 155 },
  { title: '检查年度', dataIndex: 'year', width: 96, align: 'center' },
  { title: '检查方案描述', dataIndex: 'description', width: 280, ellipsis: true },
  { title: '创建时间', dataIndex: 'date', width: 116 },
]);
const editorOpen = ref(false),
  initialValues = ref({}),
  editing = ref(false);
const rules = {
  name: [{ required: true, whitespace: true, message: '请输入检查方案名称' }],
  year: [{ required: true, message: '请选择检查年度' }],
  department: [{ required: true, whitespace: true, message: '请输入所属单位' }],
};
function edit(row) {
  editing.value = !!row;
  initialValues.value = {
    id: row?.id || null,
    name: row?.name || '',
    year: row?.year || (filters.year === '2025' ? '2025' : '2026'),
    department: row?.department || '综合管理中心',
    description: row?.description || '',
  };
  editorOpen.value = true;
}
function saved(result) {
  Object.assign(filters, { keyword: '', status: 'all', year: result.year, tab: 'all' });
  return query();
}
async function remove() {
  await deletePlans(selectedKeys.value);
  selectedKeys.value = [];
  await refresh();
}
const detailOpen = ref(false),
  detail = ref(null);
function view(row) {
  detail.value = row;
  detailOpen.value = true;
}
</script>
<template>
  <JccPagePanel :title="title">
    <template #breadcrumb>
      <a-breadcrumb class="fs-breadcrumb">
        <a-breadcrumb-item>
          <HomeOutlined />
          首页
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ isReview ? '档案检查' : '业务定制' }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
    <a-tabs v-if="!isReview" v-model:active-key="activeSection" :animated="false">
      <a-tab-pane key="plans" tab="档案检查方案" />
      <a-tab-pane key="guide" tab="填报说明" />
    </a-tabs>
    <a-tabs v-else :active-key="filters.tab" :animated="false" @change="selectTab">
      <a-tab-pane key="all" :tab="`全部（${plans.length}）`" />
      <a-tab-pane
        v-for="(label, key) in statusLabels"
        :key="key"
        :tab="`${label}（${plans.filter((row) => row.status === key).length}）`"
      />
    </a-tabs>
    <a-alert
      v-if="!isReview && activeSection === 'guide'"
      type="info"
      show-icon
      message="检查方案填报说明"
      description="按年度选择分类，填写方案名称和所属单位，核对信息后按流程办理。"
    />
    <template v-else>
      <a-button
        class="fs-mobile-tree-toggle"
        :aria-expanded="treeOpen"
        @click="treeOpen = !treeOpen"
      >
        <FolderOpenOutlined />
        {{ treeOpen ? '收起年度分类' : '展开年度分类' }}
      </a-button>
      <div class="fs-tree-table">
        <aside
          class="fs-tree-pane"
          :class="{ 'is-hidden-mobile': !treeOpen }"
          aria-label="年度分类"
        >
          <p class="fs-tree-caption">
            <FolderOpenOutlined />
            检查方案分类
          </p>
          <JccTree
            :tree-data="treeData"
            :selected-keys="[filters.year]"
            @update:selected-keys="selectYear"
          />
        </aside>
        <div class="fs-table-pane">
          <JccQueryBar :loading="loading" @search="query" @reset="resetQuery">
            <template #actions>
              <a-space>
                <a-button type="primary" @click="edit()">
                  <PlusOutlined />
                  添加检查方案
                </a-button>
                <a-popconfirm
                  :title="`确定删除选中的 ${selectedKeys.length} 个方案？`"
                  :disabled="!selectedKeys.length"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="remove"
                >
                  <a-button danger :disabled="!selectedKeys.length">
                    <DeleteOutlined />
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
            <label for="plan-status">状态</label>
            <a-select
              id="plan-status"
              v-model:value="filters.status"
              :options="[
                { label: '全部状态', value: 'all' },
                ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
              ]"
            />
            <a-input
              v-model:value="filters.keyword"
              allow-clear
              placeholder="请输入检查方案名称"
              aria-label="检查方案名称"
            />
          </JccQueryBar>
          <div class="fs-table-summary" role="status" aria-live="polite">
            {{ filters.year === 'all' ? '全部年度' : `${filters.year} 年度` }} · 共
            {{ total }} 个方案
            <span v-if="selectedKeys.length">· 已选 {{ selectedKeys.length }} 项</span>
          </div>
          <JccTable
            :columns="columns"
            :data-source="items"
            :total="total"
            :page="page"
            :page-size="pageSize"
            :loading="loading"
            :error="error"
            :row-selection="selection"
            :scroll="{ x: 1280, y: 'max(240px,calc(100vh - 390px))' }"
            empty-text="没有匹配的检查方案，请调整分类或筛选条件"
            @page-change="pagination"
            @retry="refresh"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ (page - 1) * pageSize + index + 1 }}
              </template>
              <span v-else-if="column.key === 'action'" class="fs-row-actions">
                <a-button type="link" @click="edit(record)">
                  <EditOutlined />
                  {{ isReview ? '检查自评' : '编辑' }}
                </a-button>
                <a-button type="link" @click="view(record)">
                  <EyeOutlined />
                  详情
                </a-button>
              </span>
              <a-button
                v-else-if="column.key === 'name'"
                type="link"
                class="fs-text-clip"
                :title="record.name"
                @click="view(record)"
              >
                {{ record.name }}
              </a-button>
              <a-tag v-else-if="column.key === 'status'" :color="statusColors[record.status]">
                {{ statusLabels[record.status] }}
              </a-tag>
            </template>
          </JccTable>
        </div>
      </div>
    </template>
  </JccPagePanel>
  <JccFormModal
    v-model:open="editorOpen"
    :title="editing ? '编辑检查方案' : '添加检查方案'"
    :initial-values="initialValues"
    :rules="rules"
    :submit="savePlan"
    @saved="saved"
  >
    <template #default="{ model }">
      <a-form-item label="检查方案名称" name="name">
        <a-input
          v-model:value="model.name"
          placeholder="请输入检查方案名称"
          :maxlength="80"
          show-count
        />
      </a-form-item>
      <a-form-item label="检查年度" name="year">
        <a-select
          v-model:value="model.year"
          :options="[
            { label: '2026 年', value: '2026' },
            { label: '2025 年', value: '2025' },
          ]"
        />
      </a-form-item>
      <a-form-item label="所属单位" name="department">
        <a-input v-model:value="model.department" :maxlength="60" />
      </a-form-item>
      <a-form-item label="方案描述" name="description">
        <a-textarea v-model:value="model.description" :rows="4" :maxlength="500" show-count />
      </a-form-item>
    </template>
  </JccFormModal>
  <a-drawer v-model:open="detailOpen" title="检查方案详情" width="min(var(--drawer-width),100vw)">
    <a-descriptions v-if="detail" :column="1" bordered>
      <a-descriptions-item label="方案名称">{{ detail.name }}</a-descriptions-item>
      <a-descriptions-item label="检查年度">{{ detail.year }}</a-descriptions-item>
      <a-descriptions-item label="所属单位">{{ detail.department }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ statusLabels[detail.status] }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ detail.date }}</a-descriptions-item>
      <a-descriptions-item label="方案描述">
        {{ detail.description || '暂无描述' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>
