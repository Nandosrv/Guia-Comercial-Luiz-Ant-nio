import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxt3-VD2D2_f8MXhLCvPNFHmUCk83WcXE",
  authDomain: "loginflow-5132e.firebaseapp.com",
  projectId: "loginflow-5132e",
  storageBucket: "loginflow-5132e.firebasestorage.app",
  messagingSenderId: "971812191713",
  appId: "1:971812191713:web:0c6981932e1dc3266aa6a0",
  measurementId: "G-W5MRMQDDSL"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Obtém a instância de autenticação do Firebase
const auth = getAuth(app);

// Define o tipo de persistência. Isso garante que a sessão seja mantida
setPersistence(auth, browserLocalPersistence) // Use browserSessionPersistence se quiser expirar quando a aba for fechada
  .then(() => {
    // Persistência configurada com sucesso
  })
  .catch((error) => {
    console.error("Erro ao configurar persistência de sessão:", error);
  });

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider, signInWithPopup };
