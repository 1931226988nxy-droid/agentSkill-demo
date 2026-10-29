import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
const local = (path) => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@jcc/ui': local('./packages/ui/src/index.js') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    restoreMocks: true,
  },
});
