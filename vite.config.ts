import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
dotenv.config();
export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
		'process.env.PUBLIC_SUPABASE_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_KEY),

		'process.env.PUBLIC_FIREBASE_API_KEY': JSON.stringify(process.env.PUBLIC_FIREBASE_API_KEY),
		'process.env.PUBLIC_FIREBASE_AUTH_DOMAIN': JSON.stringify(
			process.env.PUBLIC_FIREBASE_AUTH_DOMAIN
		),
		'process.env.PUBLIC_FIREBASE_STORAGE_BUCKET': JSON.stringify(
			process.env.PUBLIC_FIREBASE_STORAGE_BUCKET
		),
		'process.env.PUBLIC_FIREBASE_MEASUREMENT_ID': JSON.stringify(
			process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
		),
		'process.env.PUBLIC_FIREBASE_APP_ID': JSON.stringify(process.env.PUBLIC_FIREBASE_APP_ID),
		'process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
			process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID
		),

		'process.env.PUBLIC_FIREBASE_PROJECT_ID': JSON.stringify(
			process.env.PUBLIC_FIREBASE_PROJECT_ID
		),
		'process.env.PUBLIC_FIREBASE_CLIENT_EMAIL': JSON.stringify(
			process.env.PUBLIC_FIREBASE_CLIENT_EMAIL
		),
		'process.env.PUBLIC_FIREBASE_PRIVATE_KEY': JSON.stringify(
			process.env.PUBLIC_FIREBASE_PRIVATE_KEY
		),

		'process.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL)
	},
	resolve: {
		alias: {
			net: '',
			url: '',
			fs: '',
			tls: '',
			os: '',
			querystring: ''
		}
	}
});
