import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
	plugins: [sveltekit()],
	define: {
		// Exponha apenas as variáveis públicas prefixadas com "PUBLIC"
		'process.env': {
		  ...Object.fromEntries(
			Object.entries(process.env).filter(([key]) => key.startsWith('PUBLIC'))
		  )
		}
	  },
});
