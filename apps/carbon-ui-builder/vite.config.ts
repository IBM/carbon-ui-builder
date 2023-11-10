import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import path from 'path';

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
	plugins: [react(), nxViteTsPaths()],
	server: {
		port: 3000,
		open: true,
		// Allow files outside of vite serving list
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd())
			]
		}
	},
	resolve: {
		alias: {
			/**
			 * Vite does not support tilde imports,
			 * hence we need create an alias to the @ibm/plex package in node_modules
			 */
			'~@ibm': path.resolve(process.cwd(), 'node_modules/@ibm')
		}
	}
});