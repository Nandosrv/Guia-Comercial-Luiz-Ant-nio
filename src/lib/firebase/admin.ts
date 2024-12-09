import admin from 'firebase-admin';
// import { readFileSync } from 'fs';
// import {
// 	PUBLIC_FIREBASE_PROJECT_ID,
// 	PUBLIC_FIREBASE_CLIENT_EMAIL,
// 	PUBLIC_FIREBASE_PRIVATE_KEY
// } from '$env/static/public';

// const PUBLIC_FIREBASE_PROJECT_ID = process.env.PUBLIC_FIREBASE_PROJECT_ID as string;
// const PUBLIC_FIREBASE_CLIENT_EMAIL = process.env.PUBLIC_FIREBASE_CLIENT_EMAIL as string;
// const PUBLIC_FIREBASE_PRIVATE_KEY = process.env.PUBLIC_FIREBASE_PRIVATE_KEY as string;

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			// projectId: process.env.PRIVATE_FIREBASE_PROJECT_ID,
			projectId: 'loginflow-5132e',
			// clientEmail: process.env.PRIVATE_FIREBASE_CLIENT_EMAIL,
			clientEmail: 'firebase-adminsdk-pv3y8@loginflow-5132e.iam.gserviceaccount.com',
			// privateKey: process.env.PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
			privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDDTq/ui9AOptJb\nscWGBqzz0IqqMqR7Cq1Sj/PgwlbAjUJduIDVBqN5p6mOSc4CTwZSrDX5NAgzqVAg\nbpCrF/kKXVOVu8pw6mZuDdBT6WGc4YOmAeGQJctqoyqwCBBds54U1qMkcpzoNjSa\nniGcT8ar3EFA8y7lMGXW4B8gfhrCT42z1gGQKrJfPld9fKjYLtpM3bGo2K8kf5NY\n97QpLHIj7s3YPJa7pjjGfppe8wDTbjrTjijeqwOZM2A9hJwkBckpVRzk57l+ORDD\nBV/BOy+PaP9/wQdKPyH2hy8yUc9tbHtiKnSa3YyRtOdCjWnJyoT1pEBPIipTP7IG\nYW9vcq1BAgMBAAECggEASt+tMbnW2u8YYP+/djiz8EqoBkSg6uy2cpruR2GpiWr+\nINjdRw2i+T4OEhb4S8lI5sPPc0h/xnJn3e8VNgpcNp19sD8MhopOF23jSnADtHV+\nF1PMSgs7NxfzgwWsZIe6GEoKxCvOPHWfaBEsWHT6+KLZP1GbTlDmEeDc/gNqNchH\nTs8S3/Foe9yFTGn6D1QtA6avxjL1h6h4k4V6+kUX91Dq1iIjhbVrje0FlVZ2+Fvf\noMkUjXJWj6tFHFZgn7gejaCl8m76VJDvnNh9LBsni9ppKYWFjSgJQ6pISERBYlCK\nh5bTZHCYnjKpthESccob2Z1W3TkTYh2S7j3CkEw10wKBgQDlL3XdAL9MXNC+yK+6\nLRujipZo/yPJL1jtRNxfepTUDT+bB2R+uIJDNhw6Cw8WyQtPcPnNCexs93F/CYGB\n033pvRXWIVGicqmd0qlwKIMreWxI7E9qaTcDSveFpcKKDUM+bX0pganb7fFZfG2F\nbX0ET3CoyoIVSrV/yYGPuRjcnwKBgQDaKIP4sf+9UYhJH6w+1EH0IMWGP3nlIY+T\nSNc3MmO7Pv/VsMirt6DjFQ7NzCNpGOmsK1dogZYCdajy5pwLP694c+mcBuHLI8xB\ns5guAofqgCZDy26Qwx7JX7Ohg6tM1A8/NM3zOoqRb+xVBxFpuVxWMDU/clN2hGK2\nX7wwIBZKHwKBgQCymOSRX6aznFSzh/Kg88vpCvOhSMobWoFDDPlqkjzubpCVgBJJ\nSgGA3ObsOHf+upbMxm5z4PrUA5P3enHouOYTQt2Ea5yRKieRrHuLwpZNR6chwL02\nYF2VfFMdXAoYyLMRMANsV/YFRAxjPrqeUq8sr7dMYdszOm/r8By94nFEYwKBgQC/\npP/qJVQoF8vFkRFbUFNwBqn+uRx38PeTx1Voo9eA0mMkcdyXHQU093a9yysAVGZS\nXPC4Wb5SAtKcL4G9UADxq8H40wLf1V7GCOMS6B5GHrV+sOM8QGx3Mp82r9h38YJD\nYDvcA/1erhfKyh695Zv8CvV7+w7e+oVM+OT00ftCuQKBgQCGmg9zeW9FosXMW+Fq\ns49U8jdYMbDtYprh42Q2Q300+UmTM/9bLZFpqwIQ/4ococawcD/873kZCQUQrFQY\neHFjtngl8mE8/Ducf5MDH7Eil+Ix/GOUHkHjtiMyEZlG3/0DyWPKkGU//kcqcBLD\n1Iw1v6t06d6oIZxO/07m+LDY4g==\n-----END PRIVATE KEY-----\n'
		})
		// databaseURL: 'https://<SEU-PROJETO>.firebaseio.com'
	});
}

export const authAdmin = admin.auth();
