import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist/apps/carbon-ui-builder'
  },
  server: {
    port: 4200,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    css: true,
  },
  plugins: [react()],
});
