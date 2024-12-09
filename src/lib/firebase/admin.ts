import admin from 'firebase-admin';
// import { readFileSync } from 'fs';
// import {
// 	PUBLIC_FIREBASE_PROJECT_ID,
// 	PUBLIC_FIREBASE_CLIENT_EMAIL,
// 	PUBLIC_FIREBASE_PRIVATE_KEY
// } from '$env/static/public';

const PUBLIC_FIREBASE_PROJECT_ID = process.env.PUBLIC_FIREBASE_PROJECT_ID;
const PUBLIC_FIREBASE_CLIENT_EMAIL = process.env.PUBLIC_FIREBASE_CLIENT_EMAIL;
const PUBLIC_FIREBASE_PRIVATE_KEY = process.env.PUBLIC_FIREBASE_PRIVATE_KEY as string;

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: PUBLIC_FIREBASE_PROJECT_ID,
			clientEmail: PUBLIC_FIREBASE_CLIENT_EMAIL,
			privateKey: PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
		})
		// databaseURL: 'https://<SEU-PROJETO>.firebaseio.com'
	});
}

export const authAdmin = admin.auth();
