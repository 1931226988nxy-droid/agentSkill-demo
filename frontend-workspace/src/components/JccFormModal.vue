<script setup>
import { nextTick, reactive, ref, watch } from 'vue';
import { Alert, Button, Form, Space } from 'ant-design-vue';
import { cloneQuery } from '../utils/index.js';
import { useAsyncTask } from '../hooks/index.js';
import JccModal from './JccModal.vue';
defineOptions({ inheritAttrs: false });
const props = defineProps({
  open: Boolean,
  title: { type: String, default: '编辑' },
  initialValues: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  submit: { type: Function, required: true },
  width: { type: [Number, String], default: 'var(--modal-width, 560px)' },
});
const emit = defineEmits(['update:open', 'saved', 'cancel', 'error']);
const model = reactive({}),
  formRef = ref(),
  discardOpen = ref(false),
  fullscreen = ref(false);
let baseline = '';
let session = 0;
const {
  run,
  loading,
  error,
  cancel: cancelTask,
} = useAsyncTask(async ({ signal }, values) => props.submit(values, { signal }));
// 每次打开时复制初始值，避免直接修改调用方的数据，并重置脏值基线。
watch(
  () => props.open,
  async (open) => {
    const currentSession = ++session;
    cancelTask();
    error.value = null;
    discardOpen.value = false;
    if (!open) return;
    // 同一次父组件更新中，open 可能早于 initialValues 写入 props。
    await nextTick();
    if (currentSession !== session || !props.open) return;
    Object.keys(model).forEach((key) => delete model[key]);
    Object.assign(model, cloneQuery(props.initialValues));
    baseline = JSON.stringify(model);
    fullscreen.value = false;
    await nextTick();
    if (currentSession === session && props.open) formRef.value?.clearValidate();
  },
  { immediate: true, flush: 'sync' },
);
function close() {
  emit('update:open', false);
  emit('cancel');
  discardOpen.value = false;
}
function cancel() {
  // 提交期间禁止关闭；仅在内容发生变化时提示放弃修改。
  if (loading.value) return;
  if (JSON.stringify(model) !== baseline) discardOpen.value = true;
  else close();
}
async function save() {
  if (loading.value || !props.open) return;
  const currentSession = session;
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  if (loading.value || currentSession !== session || !props.open) return;
  try {
    const values = cloneQuery(model);
    const result = await run(values);
    if (currentSession !== session || !props.open) return;
    emit('saved', result, values);
    emit('update:open', false);
  } catch (cause) {
    if (currentSession === session && props.open && cause.name !== 'AbortError')
      emit('error', cause);
  }
}
defineExpose({ formRef, model });
</script>
<template>
  <JccModal
    v-bind="$attrs"
    :open="open"
    v-model:fullscreen="fullscreen"
    :title="title"
    :width="width"
    :confirm-loading="loading"
    :keyboard="!loading"
    :closable="!loading"
    :mask-closable="false"
    wrap-class-name="fs-editor"
    ok-text="保存"
    cancel-text="取消"
    @ok="save"
    @cancel="cancel"
  >
    <Form ref="formRef" :model="model" :rules="rules" layout="vertical" class="jcc-modal-form">
      <slot :model="model" />
    </Form>
    <Alert v-if="error" type="error" show-icon :message="error.message || '保存失败，请重试'" />
    <Alert v-if="discardOpen" type="warning" show-icon message="有尚未保存的修改，是否放弃？">
      <template #action>
        <Space>
          <Button danger @click="close">放弃修改</Button>
          <Button @click="discardOpen = false">继续编辑</Button>
        </Space>
      </template>
    </Alert>
  </JccModal>
</template>
