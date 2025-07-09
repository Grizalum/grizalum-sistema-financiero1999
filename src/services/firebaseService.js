// src/hooks/firebaseService.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'grizalum_metalurgica';
const DOCUMENT_ID = 'datos-financieros';

const firebaseService = {
  async guardarDatos(clientes, deudas, inversiones) {
    try {
      console.log('🔄 Guardando en Firebase...');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const datosParaGuardar = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        ultimaActualizacion: serverTimestamp(),
        version: '2.1'
      };
      
      await setDoc(docRef, datosParaGuardar);
      
      console.log('✅ Datos guardados exitosamente');
      return { success: true, message: 'Guardado exitoso' };
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      return { success: false, message: error.message };
    }
  },

  async cargarDatos() {
    try {
      console.log('🔄 Cargando desde Firebase...');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datos = docSnap.data();
        console.log('✅ Datos encontrados en Firebase:', {
          clientes: datos.clientes?.length || 0,
          deudas: datos.deudas?.length || 0,
          inversiones: datos.inversiones?.length || 0
        });
        
        return { 
          success: true, 
          datos: {
            clientes: datos.clientes || [],
            deudas: datos.deudas || [],
            inversiones: datos.inversiones || []
          }
        };
      } else {
        console.log('📝 No hay datos en Firebase - primera vez');
        return { success: false, message: 'No hay datos' };
      }
      
    } catch (error) {
      console.error('❌ Error al cargar:', error);
      return { success: false, message: error.message };
    }
  },

  async verificarConexion() {
    try {
      const testRef = doc(db, COLLECTION_NAME, 'test');
      await getDoc(testRef);
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }
};

export default firebaseService;
};

export default firebaseService;
