import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { jccLiveViteConfig } from './vite.live.js';

export default defineConfig({
  ...jccLiveViteConfig(fileURLToPath(new URL('.', import.meta.url))),
  root: fileURLToPath(new URL('./playground', import.meta.url)),
  plugins: [vue()],
  build: { outDir: '../dist/preview', emptyOutDir: true },
});
