import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['sb-7098vd4nj0v3.vercel.run', 'localhost', '127.0.0.1']
  }
})
