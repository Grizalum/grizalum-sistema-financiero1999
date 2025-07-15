// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDuy86ufbqPMtm45NJu7FVQ05NE-qD0",              // ✅ REAL
  authDomain: "grizalum-9b670.firebaseapp.com",               // ✅ REAL
  projectId: "grizalum-9b670",                                // ✅ REAL  
  storageBucket: "grizalum-9b670.firebasestorage.app",        // ✅ REAL
  messagingSenderId: "526692565959",                          // ✅ REAL
  appId: "1:526692565959:web:16c2ff1278b12a1498cfe2"          // ✅ REAL
};

// Inicializar Firebase solo una vez
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  
  // ⚠️ MODO DE EMERGENCIA: Crear app mock si Firebase falla
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve()
      })
    })
  };
}

export { db, app };
export default db;
