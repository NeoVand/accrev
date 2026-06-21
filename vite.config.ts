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
	// kokoro-js + transformers.js load ONNX/WASM and large model files at runtime
	// and are imported only in the browser (lazily, on first "Listen"). Keep Vite
	// from pre-bundling them and from trying to externalize/run them during SSR.
	optimizeDeps: {
		exclude: ['kokoro-js', '@huggingface/transformers']
	},
	ssr: {
		external: ['kokoro-js', '@huggingface/transformers']
	}
});
