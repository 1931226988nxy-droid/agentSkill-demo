<script setup>
import { ref } from 'vue';
import { Button, Input, Space } from 'ant-design-vue';

const props = defineProps({ name: { type: String, default: '' } });
const emit = defineEmits(['saved']);
const name = ref(props.name);
</script>

<template>
  <div class="preview-editor">
    <label for="editor-name">名称</label>
    <Input id="editor-name" v-model:value="name" />
    <p>此内容组件通过 props 接收初值，保存时触发 saved 自定义事件。</p>
    <Space><Button type="primary" @click="emit('saved', name)">保存内容</Button></Space>
  </div>
</template>
