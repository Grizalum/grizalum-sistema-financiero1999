// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDy86ufbqGPMftQ45NJu7FV690SNE-qDQ",
  authDomain: "grizalum-9b670.firebaseapp.com",
  projectId: "grizalum-9b670",
  storageBucket: "grizalum-9b670.firebasestorage.app",
  messagingSenderId: "526092565959",
  appId: "1:526092565959:web:16c2ff1278b12a1498cfe2",
  measurementId: "G-QQM8SVLKX4"
};

// Verificar configuración
console.log('🔥 Firebase Config Check:', {
  apiKey: '✅ Loaded',
  projectId: '✅ Loaded - grizalum-9b670',
  authDomain: '✅ Loaded'
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Analytics (opcional)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
