import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Flat repo: these files sit next to App.tsx and are copied into the build as they are
const ROOT_FILES = ['sw.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.ico', 'favicon-16.png', 'favicon-32.png']

function copyRootFiles(): Plugin {
  let root = process.cwd()
  let outDir = resolve(root, 'dist')
  return {
    name: 'copy-root-files',
    apply: 'build',
    configResolved(c) { root = c.root; outDir = resolve(c.root, c.build.outDir) },
    closeBundle() {
      for (const f of ROOT_FILES) {
        const src = resolve(root, f)
        if (existsSync(src)) copyFileSync(src, resolve(outDir, f))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyRootFiles()],
  base: '/',
  publicDir: false, // nothing else from the repo is copied (no node_modules, no source files)
})
