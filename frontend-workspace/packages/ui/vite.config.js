import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: 'index', cssFileName: 'ui' },
    rolldownOptions: {
      external: (id) =>
        /^(vue|ant-design-vue|@ant-design\/icons-vue|@jcc\/)(?:\/|$)/.test(id) ||
        id.startsWith('@jcc/'),
    },
  },
});
