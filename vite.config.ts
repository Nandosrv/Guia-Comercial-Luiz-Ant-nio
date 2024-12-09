import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
		'process.env.PUBLIC_SUPABASE_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_KEY)
	  }
});
