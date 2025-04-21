import { getAuth } from 'firebase/auth';

export default async function pegarTokenUsuario() {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error('Usuário não está autenticado');
    }
    
    // Aqui podemos obter o token diretamente do SDK do Firebase
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Erro ao obter token de usuário:', error);
    throw error;
  }
} 