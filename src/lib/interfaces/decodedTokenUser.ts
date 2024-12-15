// {
//   name: 'Nando oliveira',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJt-VgGM50IEXzErvAKQmLzVWYJ4x7O6SYTcQOnh_7qAfTN=s96-c',
//   iss: 'https://securetoken.google.com/loginflow-5132e',
//   aud: 'loginflow-5132e',
//   auth_time: 1734194572,
//   user_id: 'VaCshKlKmvUxZyVvK34NSGZjHXM2',
//   sub: 'VaCshKlKmvUxZyVvK34NSGZjHXM2',
//   iat: 1734194572,
//   exp: 1734198172,
//   email: 'nandooliveirasrv1@gmail.com',
//   email_verified: true,
//   firebase: {
//     identities: { 'google.com': [Array], email: [Array] },
//     sign_in_provider: 'google.com'
//   },
//   uid: 'VaCshKlKmvUxZyVvK34NSGZjHXM2'
// }
// gerar interface do codigo acima

export interface DecodedTokenUser {
	name: string;
	picture: string;
	iss: string;
	aud: string;
	auth_time: number;
	user_id: string;
	sub: string;
	iat: number;
	exp: number;
	email: string;
	email_verified: boolean;
	firebase: {
		identities: { 'google.com': string[]; email: string[] };
		sign_in_provider: string;
	};
	uid: string;
}
