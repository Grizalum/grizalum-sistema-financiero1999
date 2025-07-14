// firebase.js - CONFIGURACIÓN CORREGIDA
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// 🔥 CONFIGURACIÓN REAL DE FIREBASE
// ⚠️ REEMPLAZA CON TUS CREDENCIALES REALES DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890123456"
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
