import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
	browserLocalPersistence,
	getAuth,
	setPersistence,
	onAuthStateChanged,
	type Auth
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
	apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

// Função para inicializar o Firebase
function initializeFirebase() {
	try {
		if (!getApps().length) {
			console.log('Inicializando nova instância do Firebase');
			firebaseApp = initializeApp(firebaseConfig);
		} else {
			console.log('Usando instância existente do Firebase');
			firebaseApp = getApps()[0];
		}

		auth = getAuth(firebaseApp);

		if (typeof window !== 'undefined') {
			analytics = getAnalytics(firebaseApp);
			
			// Configurar persistência local apenas no cliente
			setPersistence(auth, browserLocalPersistence)
				.then(() => {
					console.log('Persistência configurada com sucesso');
				})
				.catch((error) => {
					console.error('Erro ao configurar persistência:', error);
				});
		}

		return { firebaseApp, auth, analytics };
	} catch (error) {
		console.error('Erro ao inicializar Firebase:', error);
		throw error;
	}
}

// Inicializar Firebase imediatamente
initializeFirebase();

// Exportar instâncias já inicializadas
export { firebaseApp, auth, analytics };
