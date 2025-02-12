import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
	// browserSessionPersistence,
	browserLocalPersistence,
	getAuth,
	setPersistence
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const PUBLIC_FIREBASE_API_KEY = process.env.PUBLIC_FIREBASE_API_KEY;
const PUBLIC_FIREBASE_APP_ID = process.env.PUBLIC_FIREBASE_APP_ID;
const PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
const PUBLIC_FIREBASE_MEASUREMENT_ID = process.env.PUBLIC_FIREBASE_MEASUREMENT_ID;
const PUBLIC_FIREBASE_MESSAGING_SENDER_ID = process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const PUBLIC_FIREBASE_PROJECT_ID = process.env.PUBLIC_FIREBASE_PROJECT_ID as string;
const PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.PUBLIC_FIREBASE_STORAGE_BUCKET;

// Configuração do Firebase
const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Agora você pode usar o Firebase, por exemplo:
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Inicializa o Analytics apenas se estiver no lado do cliente
let analytics;
if (typeof window !== 'undefined') {
	analytics = getAnalytics(app); // Somente inicializar no cliente
}

// Obtém a instância de autenticação do Firebase
const auth = getAuth(app);

// Define o tipo de persistência da sessão
setPersistence(auth, browserLocalPersistence) // Use browserSessionPersistence se preferir sessão temporária
	.then(() => {
		console.log('Persistência de sessão configurada com sucesso.');
	})
	.catch((error) => {
		console.error('Erro ao configurar persistência de sessão:', error);
	});

export { analytics, auth, app as firebaseApp };
