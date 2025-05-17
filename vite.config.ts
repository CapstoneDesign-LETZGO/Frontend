import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port : 5173
  },
  build: {
    outDir: 'dist', // 기본값이지만 명시적으로 써도 좋음
  },
  base: '/', // Vercel에서 꼭 이걸로 지정 (하위 디렉토리 배포가 아니라면)
})
