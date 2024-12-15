import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import 'dotenv/config'

// const adapters = {
// 	'cloudflare': adapterCloudflare,
// 	'default': adapterAuto
// }

// function getAdapter(){
// 	let adpt = process.env.VITE_ADAPTER ?? 'default'
// 	if (!(adpt in adapters)) adpt = 'default'
// 	return adapters[adpt]()
// }

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapterAuto(),
		
		// paths: {
        //     base: '/.svelte-kit/cloudflare', // Defina se seu app não está na raiz
        // },
		env: {
			publicPrefix: 'PUBLIC_',
			privatePrefix:'PRIVATE_'
		}
	}
};

export default config;
