// firebase.js - CONFIGURACIÓN CORREGIDA
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// 🔥 CONFIGURACIÓN REAL DE FIREBASE
// ⚠️ REEMPLAZA CON TUS CREDENCIALES REALES DE FIREBASE
const firebaseConfig = {
 const firebaseConfig = {
  apiKey: "AIzaSyDuy86ufbqPMtm45NJu7FVQ05NE-qD0",        // ← De tu imagen 1
  authDomain: "grizalum-9b670.firebaseapp.com",           // ← Tu dominio real
  projectId: "grizalum-9b670",                            // ← Tu project ID real
  storageBucket: "grizalum-9b670.firebasestorage.app",    // ← Tu storage real
  messagingSenderId: "526692565959",                       // ← Tu sender ID real
  appId: "1:526692565959:web:16c2ff1278b12a1498cfe2"      // ← Tu app ID real
};

// 🏗️ INICIALIZACIÓN ROBUSTA CON FALLBACK
let app;
let db;
let firebaseDisponible = true;

try {
  // Intentar inicializar Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  console.log('✅ Firebase inicializado correctamente');
  console.log('🔗 Conectado a proyecto:', firebaseConfig.projectId);
  
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  firebaseDisponible = false;
  
  // 🆘 MODO DE EMERGENCIA: Mock Firebase para desarrollo
  console.warn('⚠️ MODO EMERGENCIA: Usando mock Firebase');
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ 
          exists: false, 
          data: () => null 
        }),
        set: (data) => {
          console.log('🔧 Mock Firebase SET:', data);
          return Promise.resolve();
        },
        update: (data) => {
          console.log('🔧 Mock Firebase UPDATE:', data);
          return Promise.resolve();
        }
      })
    })
  };
}

// 🔍 FUNCIÓN PARA VERIFICAR ESTADO DE FIREBASE
export const verificarFirebase = () => {
  return {
    disponible: firebaseDisponible,
    db: !!db,
    projectId: firebaseConfig.projectId
  };
};

export { db, app, firebaseDisponible };
export default db;
