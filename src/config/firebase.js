import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDuy86ufbqPMtm45NJu7FVQ05NE-qD0",
  authDomain: "grizalum-9b670.firebaseapp.com",
  projectId: "grizalum-9b670",
  storageBucket: "grizalum-9b670.firebasestorage.app",
  messagingSenderId: "526692565959",
  appId: "1:526692565959:web:16c2ff1278b12a1498cfe2"
};

// Inicializar Firebase SIN modo de emergencia
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase inicializado - Project ID:', firebaseConfig.projectId);

export { db, app };
export default db;
