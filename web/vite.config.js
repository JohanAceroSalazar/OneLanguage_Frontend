import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones en la intranet
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8084', // Redirige internamente las peticiones hacia tu backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})