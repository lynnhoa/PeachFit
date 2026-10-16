import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static files (icons, manifest) live in /public and are copied to the build as they are
export default defineConfig({
  plugins: [react()],
  base: '/',
})
