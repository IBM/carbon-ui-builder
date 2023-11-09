import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	assetsInclude: ['**/*.md'],
	build: {
		outDir: '../../dist/apps/carbon-ui-builder'
	},
	define: {
		// Node.js global workaround
		global: {}
	},
	plugins: [react()],
	server: {
		port: 3000,
		open: true
	},
});
