// firebaseService.js - Servicio para guardar en Firebase
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// 🔧 CONFIGURACIÓN ACTUALIZADA DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDUy86uIbqCPMfto45Nju7FV6906NE-qD0",
  authDomain: "grizalum-9b670.firebaseapp.com",
  projectId: "grizalum-9b670",
  storageBucket: "grizalum-9b670.firebasestorage.app",
  messagingSenderId: "52669256959",
  appId: "1:52669256959:web:16c2ff1278b12a1498cfe2",
  measurementId: "G-80M8SVLKX4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🏢 ID único para la empresa (GRIZALUM)
const EMPRESA_ID = 'grizalum_metalurgica';

class FirebaseService {
  
  // 💾 GUARDAR TODOS LOS DATOS
  async guardarDatos(clientes, deudas, inversiones) {
    try {
      console.log('🔄 Guardando datos en Firebase...');
      
      const datosCompletos = {
        clientes: clientes,
        deudas: deudas,
        inversiones: inversiones,
        ultimaActualizacion: serverTimestamp(),
        version: '1.0'
      };

      // Guardar en Firestore
      await setDoc(doc(db, 'empresas', EMPRESA_ID), datosCompletos);
      
      console.log('✅ Datos guardados exitosamente en Firebase');
      return { success: true, message: 'Datos guardados en la nube' };
      
    } catch (error) {
      console.error('❌ Error al guardar en Firebase:', error);
      return { 
        success: false, 
        message: 'Error al guardar: ' + error.message 
      };
    }
  }

  // 📥 CARGAR DATOS AL INICIAR
  async cargarDatos() {
    try {
      console.log('🔄 Cargando datos desde Firebase...');
      
      const docRef = doc(db, 'empresas', EMPRESA_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        console.log('✅ Datos cargados desde Firebase');
        
        return {
          success: true,
          datos: {
            clientes: datos.clientes || [],
            deudas: datos.deudas || [],
            inversiones: datos.inversiones || [],
            ultimaActualizacion: datos.ultimaActualizacion
          }
        };
      } else {
        console.log('📝 No hay datos previos, usando datos por defecto');
        return { success: false, message: 'No hay datos guardados' };
      }
      
    } catch (error) {
      console.error('❌ Error al cargar desde Firebase:', error);
      return { 
        success: false, 
        message: 'Error al cargar: ' + error.message 
      };
    }
  }

  // 🔄 ESCUCHAR CAMBIOS EN TIEMPO REAL
  escucharCambios(callback) {
    try {
      const docRef = doc(db, 'empresas', EMPRESA_ID);
      
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const datos = doc.data();
          console.log('🔄 Datos actualizados en tiempo real');
          callback({
            success: true,
            datos: {
              clientes: datos.clientes || [],
              deudas: datos.deudas || [],
              inversiones: datos.inversiones || [],
              ultimaActualizacion: datos.ultimaActualizacion
            }
          });
        }
      });

      return unsubscribe; // Para poder cancelar la escucha
      
    } catch (error) {
      console.error('❌ Error en tiempo real:', error);
      callback({ success: false, message: error.message });
      return null;
    }
  }

  // ✅ VERIFICAR CONEXIÓN
  async verificarConexion() {
    try {
      const docRef = doc(db, 'empresas', 'test_conexion');
      await setDoc(docRef, { timestamp: serverTimestamp() });
      return true;
    } catch (error) {
      console.error('❌ Sin conexión a Firebase:', error);
      return false;
    }
  }
}

// Exportar instancia única
export const firebaseService = new FirebaseService();
export default firebaseService;
