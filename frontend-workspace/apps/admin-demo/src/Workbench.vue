<script setup>
import { computed, ref } from 'vue';
import {
  AuditOutlined,
  BellOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  RightOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { siteConfig } from './site-config.js';

const emit = defineEmits(['navigate']);
const keyword = ref('');
const query = ref('');
const detail = ref(null);
const detailOpen = ref(false);
const shortcuts = [
  { title: '检查自评', icon: AuditOutlined, route: 'review' },
  { title: '方案管理', icon: FileDoneOutlined, route: 'config' },
  { title: '文件管理', icon: FileSearchOutlined, route: 'files' },
  { title: '业务反馈', icon: MessageOutlined, tone: 'teal', action: 'feedback' },
  { title: '业务定制', icon: SettingOutlined, tone: 'purple', route: 'config' },
  { title: '最近办理', icon: ClockCircleOutlined, action: 'recent' },
];
const modules = [
  {
    title: '电子公告',
    icon: BellOutlined,
    items: [
      { title: '关于开展年度业务资料规范检查的通知', date: '2026-10-20' },
      { title: '业务管理平台使用指引更新', date: '2026-10-18' },
      { title: '第四季度资料归集安排', date: '2026-10-15' },
      { title: '关于完善检查方案填报信息的提醒', date: '2026-10-12' },
    ],
  },
  {
    title: '意见反馈',
    icon: MessageOutlined,
    items: [
      { title: '关于优化资料分类方式的建议', date: '2026-10-21' },
      { title: '检索结果显示规则调整建议', date: '2026-10-19' },
      { title: '检查方案填报体验反馈', date: '2026-10-16' },
      { title: '业务流程改进事项汇总', date: '2026-10-11' },
    ],
  },
  {
    title: '消息中心',
    icon: BellOutlined,
    items: [
      { title: '您有一项检查方案待完善', date: '2026-10-22' },
      { title: '年度检查方案已提交，请查看办理进度', date: '2026-10-21' },
      { title: '资料归集任务已更新', date: '2026-10-20' },
      { title: '专项检查方案已通过审核', date: '2026-10-18' },
    ],
  },
  {
    title: '最近整理',
    icon: FolderOpenOutlined,
    items: [
      { title: '2026 年度综合业务检查方案', date: '2026-10-22' },
      { title: '项目资料分类清单', date: '2026-10-21' },
      { title: '业务流程规范与说明', date: '2026-10-20' },
      { title: '检查事项与问题整改记录', date: '2026-10-18' },
    ],
  },
];
const filteredModules = computed(() =>
  modules.map((module) => ({
    ...module,
    items: module.items.filter((item) => item.title.includes(query.value.trim())),
  })),
);
function showDetail(item, category) {
  detail.value = { ...item, category };
  detailOpen.value = true;
}
function act(shortcut) {
  if (shortcut.route) emit('navigate', shortcut.route);
  else if (shortcut.action === 'search') document.querySelector('#workbench-search')?.focus();
  else showDetail({ title: shortcut.title, date: '2026-10-22' }, '工作台');
}
</script>

<template>
  <div class="fs-home-top">
    <section class="fs-search-panel" aria-labelledby="search-title">
      <h1 id="search-title" class="fs-home-heading">业务检索与快捷办理</h1>
      <div class="fs-search-row">
        <a-input-search
          id="workbench-search"
          v-model:value="keyword"
          placeholder="请输入公告、消息或资料关键词"
          aria-label="搜索工作台内容"
          size="large"
          allow-clear
          @search="query = keyword"
        >
          <template #enterButton>
            <a-button type="primary">
              <SearchOutlined />
              搜索
            </a-button>
          </template>
        </a-input-search>
        <a-button
          size="large"
          @click="
            keyword = '';
            query = '';
          "
        >
          重置
        </a-button>
      </div>
      <div class="fs-quick-grid">
        <button
          v-for="shortcut in shortcuts"
          :key="shortcut.title"
          class="fs-quick"
          :class="shortcut.tone"
          type="button"
          @click="act(shortcut)"
        >
          <span class="fs-quick-icon"><component :is="shortcut.icon" /></span>
          <span>{{ shortcut.title }}</span>
        </button>
      </div>
    </section>
    <aside class="fs-profile-panel" aria-label="用户概览">
      <a-avatar :size="64">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <p class="fs-profile-name">{{ siteConfig.userName }}</p>
      <p class="muted small">{{ siteConfig.department }}</p>
      <div class="fs-profile-shortcuts">
        <a-button type="text" @click="emit('navigate', 'review')">
          <FileDoneOutlined />
          待办
        </a-button>
        <a-button
          type="text"
          @click="showDetail({ title: '我的收藏', date: '2026-10-22' }, '个人中心')"
        >
          <StarOutlined />
          收藏
        </a-button>
        <a-button
          type="text"
          @click="showDetail({ title: '最近浏览', date: '2026-10-22' }, '个人中心')"
        >
          <ClockCircleOutlined />
          浏览
        </a-button>
      </div>
    </aside>
  </div>
  <p v-if="query" class="muted small" role="status" style="margin-top: 12px">
    检索关键词：{{ query }}，下方显示匹配内容。
  </p>
  <div class="fs-modules">
    <section
      v-for="module in filteredModules"
      :key="module.title"
      class="fs-module"
      :aria-label="module.title"
    >
      <div class="fs-module-heading">
        <h2>
          <component :is="module.icon" class="fs-module-icon" />
          {{ module.title }}
        </h2>
        <a-button
          type="text"
          :aria-label="`查看${module.title}汇总`"
          @click="showDetail({ title: module.title, date: '2026-10-22' }, '信息汇总')"
        >
          <RightOutlined />
        </a-button>
      </div>
      <ul v-if="module.items.length" class="fs-news-list">
        <li v-for="item in module.items" :key="item.title">
          <button type="button" class="fs-news-button" @click="showDetail(item, module.title)">
            {{ item.title }}
          </button>
          <time class="fs-news-date">{{ item.date }}</time>
        </li>
      </ul>
      <a-empty v-else description="没有匹配内容" />
    </section>
  </div>
  <a-drawer v-model:open="detailOpen" :title="detail?.title" width="min(520px, 100vw)">
    <a-descriptions v-if="detail" :column="1" bordered>
      <a-descriptions-item label="栏目">{{ detail.category }}</a-descriptions-item>
      <a-descriptions-item label="日期">{{ detail.date }}</a-descriptions-item>
      <a-descriptions-item label="发布单位">{{ siteConfig.department }}</a-descriptions-item>
    </a-descriptions>
    <p class="fs-detail-text" style="margin-top: 24px">
      请按工作安排完善相关资料，核对填报信息，并及时跟进办理进度。
    </p>
  </a-drawer>
</template>
