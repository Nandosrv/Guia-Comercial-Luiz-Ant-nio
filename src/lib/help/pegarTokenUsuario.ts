import { auth } from "$lib/firebase/client";

async function pegarTokenUsuario() {
    const user = auth.currentUser;
    if (user) {
        await user.getIdToken(true); // Força a atualização do token
        return await user.getIdToken();
    }
    throw new Error("Usuário não autenticado");
}
export default pegarTokenUsuario;