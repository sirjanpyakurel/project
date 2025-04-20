import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chunk-YAJ7WJ6V']
  },
  server: {
    port: 5174,
    strictPort: false
  }
})
