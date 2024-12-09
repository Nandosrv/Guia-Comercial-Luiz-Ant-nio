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
		}
	  }
}

export {};
