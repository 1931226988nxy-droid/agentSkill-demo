<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN.js';
import { createAntTheme } from '../../../theme/src/index.js';
defineOptions({ inheritAttrs: false });
const props = defineProps({
  theme: { type: Object, default: () => ({}) },
  locale: { type: Object, default: () => zhCN },
  size: { type: String, default: 'small' },
});
const base = ref({});
onBeforeMount(() => {
  base.value = createAntTheme();
});
const resolved = computed(() => ({
  ...base.value,
  ...props.theme,
  token: { ...base.value.token, ...props.theme.token },
  components: Object.fromEntries(
    [
      ...new Set([
        ...Object.keys(base.value.components || {}),
        ...Object.keys(props.theme.components || {}),
      ]),
    ].map((key) => [key, { ...base.value.components?.[key], ...props.theme.components?.[key] }]),
  ),
}));
</script>
<template>
  <ConfigProvider :theme="resolved" :locale="locale" :component-size="size">
    <div v-bind="$attrs" class="frontend-system"><slot /></div>
  </ConfigProvider>
</template>
