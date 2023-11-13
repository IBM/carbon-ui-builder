import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	assetsInclude: ['**/*.md'],
	build: {
		outDir: '../dist/app'
	},
	plugins: [react(), nxViteTsPaths(), pluginRewriteAll()],
	server: {
		port: 3000,
		open: true,
		// Allow files outside of vite serving list
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd())
			]
		}
	}
});
