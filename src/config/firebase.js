import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDuy86ufbqPMtm45NJu7FVQ05NE-qD0-RESTO_DE_LA_KEY",
  authDomain: "grizalum-9b670.firebaseapp.com",
  projectId: "grizalum-9b670",
  storageBucket: "grizalum-9b670.firebasestorage.app",
  messagingSenderId: "526692565959",
  appId: "1:526692565959:web:16c2ff1278b12a1498cfe2"
};

// Inicializar Firebase SIN modo de emergencia
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('🔥 Firebase inicializado - Project ID:', firebaseConfig.projectId);

export { db, app, auth };
export default db;
