import admin from 'firebase-admin';
// import { readFileSync } from 'fs';
import {
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_CLIENT_EMAIL,
	PUBLIC_FIREBASE_PRIVATE_KEY
} from '$env/static/public';
// Caminho para o arquivo JSON com as configurações do Firebase Admin
// const serviceAccount = JSON.parse(readFileSync('firebase-adminsdk.json', 'utf-8'));
// console.log('admin firebase: ', serviceAccount);

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: PUBLIC_FIREBASE_PROJECT_ID,
			clientEmail: PUBLIC_FIREBASE_CLIENT_EMAIL,
			privateKey: PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
		})
		// databaseURL: 'https://<SEU-PROJETO>.firebaseio.com'
	});
}

export const authAdmin = admin.auth();
