/* eslint-disable @typescript-eslint/no-unsafe-call */
import { resolve } from 'path'

import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@renderer/components': resolve('src/renderer/src/components'),
        '@renderer/lib': resolve('src/renderer/src/lib'),
      },
    },
    plugins: [react(), tailwindcss()],
  },
})
