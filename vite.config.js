import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 其他 Vite 配置
  build: {
    // 这是为了确保 Vite 打包后文件存储在 Tauri 期望的位置
    outDir: 'dist',
  },
})