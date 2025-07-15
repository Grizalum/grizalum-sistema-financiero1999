// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSVxLk4cQWJAJz5Zg9cYj2mXbO8dPfGhI",
  authDomain: "grizalum-financiero.firebaseapp.com", 
  projectId: "grizalum-financiero",
  storageBucket: "grizalum-financiero.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890123456"
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
