// src/services/firebaseService.js
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'grizalum-financiero';
const DOCUMENT_ID = 'datos-principales';

const firebaseService = {
  // 💾 GUARDAR TODOS LOS DATOS
  async guardarDatos(clientes, deudas, inversiones) {
    try {
      console.log('🔄 Iniciando guardado en Firebase...');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const datosParaGuardar = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        ultimaActualizacion: serverTimestamp(),
        version: '2.0',
        usuario: 'grizalum-admin'
      };
      
      await setDoc(docRef, datosParaGuardar, { merge: true });
      
      console.log('✅ Datos guardados exitosamente en Firebase');
      return { 
        success: true, 
        message: 'Datos sincronizados con la nube',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error al guardar en Firebase:', error);
      return { 
        success: false, 
        message: `Error de conexión: ${error.message}`,
        error: error.code 
      };
    }
  },

  // 📥 CARGAR TODOS LOS DATOS
  async cargarDatos() {
    try {
      console.log('🔄 Cargando datos desde Firebase...');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datos = docSnap.data();
        console.log('✅ Datos cargados desde Firebase:', {
          clientes: datos.clientes?.length || 0,
          deudas: datos.deudas?.length || 0,
          inversiones: datos.inversiones?.length || 0,
          ultimaActualizacion: datos.ultimaActualizacion
        });
        
        return { 
          success: true, 
          datos: {
            clientes: datos.clientes || [],
            deudas: datos.deudas || [],
            inversiones: datos.inversiones || [],
            ultimaActualizacion: datos.ultimaActualizacion
          },
          message: 'Datos cargados desde la nube'
        };
      } else {
        console.log('📝 No hay datos guardados en Firebase');
        return { 
          success: false, 
          message: 'No hay datos previos guardados',
          datos: null 
        };
      }
      
    } catch (error) {
      console.error('❌ Error al cargar desde Firebase:', error);
      return { 
        success: false, 
        message: `Error al conectar: ${error.message}`,
        error: error.code,
        datos: null 
      };
    }
  },

  // 🔍 VERIFICAR CONEXIÓN
  async verificarConexion() {
    try {
      const testRef = doc(db, COLLECTION_NAME, 'test-conexion');
      await getDoc(testRef);
      
      console.log('✅ Conexión Firebase verificada');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión Firebase:', error);
      return false;
    }
  }
};

export default firebaseService;