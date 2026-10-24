import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相对路径，便于部署到 GitHub Pages 等子路径站点
  base: './',
  plugins: [react()],
})
