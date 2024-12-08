import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	setPersistence,
	browserSessionPersistence,
	browserLocalPersistence
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public';

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

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export {
	auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	googleProvider,
	signInWithPopup
};
export { app as firebaseApp, analytics };
