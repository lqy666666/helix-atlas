import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署到 GitHub Pages（https://<user>.github.io/<repo>/）时，
// 由 .github/workflows/deploy.yml 注入 VITE_BASE=/<repo>/；
// 本地 npm run dev / npm run build 不设置该变量，base 保持 '/'。
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
