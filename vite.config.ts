import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
	],
	// Supertonic owns four ONNX sessions inside a module worker. Keeping the
	// worker as ESM lets its WebGPU/WASM runtime be selected lazily in-browser.
	worker: { format: 'es' }
});
