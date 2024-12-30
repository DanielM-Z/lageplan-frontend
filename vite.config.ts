import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['leaflet', 'leaflet.path.drag']
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		}
	},
	ssr: {
		noExternal: ['@googlemaps/js-api-loader']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
