export interface User {
	name: string;
	email: string;
	photoURL: string;
	userId: string;
}

// decodedToken:  {
//   name: 'Paulo Soares',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIzEfMHX7FGsGwoq_NMZS2aqzS7spJjc-6WSjl4On5X_4FydUIS=s96-c',
//   iss: 'https://securetoken.google.com/loginflow-5132e',
//   aud: 'loginflow-5132e',
//   auth_time: 1733687697,
//   user_id: 'Mi8WlxQeXqSbTluNLY0JMOnvCeG3',
//   sub: 'Mi8WlxQeXqSbTluNLY0JMOnvCeG3',
//   iat: 1733687697,
//   exp: 1733691297,
//   email: 'pbss2007@gmail.com',
//   email_verified: true,
//   firebase: {
//     identities: { 'google.com': [Array], email: [Array] },
//     sign_in_provider: 'google.com'
//   },
//   uid: 'Mi8WlxQeXqSbTluNLY0JMOnvCeG3'
// }
