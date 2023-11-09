import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: '../../dist/apps/carbon-ui-builder'
	},
	server: {
		port: 3000,
		open: true,
	},
	plugins: [react()],
	define: {
		// Node.js global workaround
		global: {}
	}
});
