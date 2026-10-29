import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { jccLiveViteConfig } from '@jcc/shared/vite';
const live = jccLiveViteConfig();
export default defineConfig({
  ...live,
  plugins: [vue()],
  base: './',
  server: { ...live.server, host: '127.0.0.1', port: 5173, strictPort: true },
});
