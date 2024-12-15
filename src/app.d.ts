// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: any;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace NodeJS {
		interface ProcessEnv {
			PUBLIC_SUPABASE_URL: string;
			PUBLIC_SUPABASE_KEY: string;
			PUBLIC_FIREBASE_API_KEY: string;
			PUBLIC_FIREBASE_AUTH_DOMAIN: string;
			PUBLIC_FIREBASE_PROJECT_ID: string;
			PUBLIC_FIREBASE_STORAGE_BUCKET: string;
			PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
			PUBLIC_FIREBASE_APP_ID: string;
			PUBLIC_FIREBASE_MEASUREMENT_ID: string;
			PUBLIC_FIREBASE_CLIENT_EMAIL: string;
			PUBLIC_FIREBASE_PRIVATE_KEY: string;
		}
	}
}

export {};
