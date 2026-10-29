<script setup>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  AuditOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { JccAppShell, JccProvider } from '@jcc/shared/components';
import Workbench from './Workbench.vue';
import PlanManager from './PlanManager.vue';
import FileManager from './FileManager.vue';
import { siteConfig } from './site-config.js';
const activePage = ref('home'),
  collapsed = ref(window.innerWidth <= 1120),
  settingsOpen = ref(false);
const items = [
  { key: 'home', label: '工作台', icon: () => h(AppstoreOutlined) },
  { key: 'review', label: '检查自评', icon: () => h(AuditOutlined) },
  { key: 'config', label: '业务定制', icon: () => h(SettingOutlined) },
  { key: 'files', label: '文件管理', icon: () => h(FolderOpenOutlined) },
];
</script>
<template>
  <JccProvider>
    <JccAppShell
      v-model:active-key="activePage"
      v-model:collapsed="collapsed"
      :items="items"
      :brand="siteConfig.name"
      :short-name="siteConfig.shortName"
      :brand-mark="siteConfig.brandMark"
      :user-name="siteConfig.userName"
      :department="siteConfig.department"
      :show-tabs="activePage !== 'home'"
    >
      <template #header-actions>
        <a-button type="text" aria-label="返回工作台" @click="activePage = 'home'">
          <HomeOutlined />
        </a-button>
        <a-button type="text" aria-label="界面设置" @click="settingsOpen = true">
          <SettingOutlined />
        </a-button>
      </template>
      <KeepAlive>
        <Workbench v-if="activePage === 'home'" @navigate="activePage = $event" />
        <FileManager v-else-if="activePage === 'files'" />
        <PlanManager v-else :key="activePage" :mode="activePage" />
      </KeepAlive>
    </JccAppShell>
    <a-drawer v-model:open="settingsOpen" title="界面设置" width="min(420px,100vw)">
      <a-form layout="vertical">
        <a-form-item label="导航显示">
          <a-select
            :value="collapsed ? 'compact' : 'full'"
            :options="[
              { label: '完整导航', value: 'full' },
              { label: '紧凑导航', value: 'compact' },
            ]"
            @change="collapsed = $event === 'compact'"
          />
        </a-form-item>
      </a-form>
    </a-drawer>
  </JccProvider>
</template>
