import { auth } from '$lib/firebase/client';
import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signInWithPopup, 
    GoogleAuthProvider 
} from 'firebase/auth';

// Login com Google
export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        throw error;
    }
}

// Registro com e-mail e senha
export async function registerWithEmail(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Erro ao registrar com e-mail e senha:', error);
        throw error;
    }
}

// Redefinição de senha
export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        return 'E-mail de redefinição enviado!';
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        throw error;
    }
}
