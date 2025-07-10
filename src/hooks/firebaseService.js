// src/hooks/firebaseService.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

 // 🔍 DEBUG: Verificar que Firebase esté importado correctamente
console.log('🔥 Firebase DB:', db);
console.log('🔥 DB exists:', !!db);

const COLLECTION_NAME = 'grizalum_metalurgica';
const DOCUMENT_ID = 'datos-financieros';

const firebaseService = {
  async guardarDatos(clientes, deudas, inversiones) {
    try {
      console.log('🔄 Guardando en Firebase...');
      
      // 🔍 DEBUG: Ver exactamente qué se está guardando
      console.log('🔍 DEBUG GUARDADO - clientes:', clientes);
      console.log('🔍 DEBUG GUARDADO - clientes.length:', clientes?.length);
      console.log('🔍 DEBUG GUARDADO - deudas:', deudas);
      console.log('🔍 DEBUG GUARDADO - deudas.length:', deudas?.length);
      console.log('🔍 DEBUG GUARDADO - inversiones:', inversiones);
      console.log('🔍 DEBUG GUARDADO - inversiones.length:', inversiones?.length);
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const datosParaGuardar = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        ultimaActualizacion: serverTimestamp(),
        version: '2.1'
      };
      
      console.log('🔍 DEBUG GUARDADO - datosParaGuardar:', datosParaGuardar);
      
      console.log('💾 Ejecutando setDoc con:', datosParaGuardar);
      await setDoc(docRef, datosParaGuardar);
      
      console.log('✅ setDoc completado exitosamente');
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
    
    // ✅ FORZAR DATOS DEL SERVIDOR (no caché)
    const docSnap = await getDoc(docRef, { source: 'server' });
    
    if (docSnap.exists()) {
      const datos = docSnap.data();
      console.log('✅ Datos encontrados en Firebase:', {
        clientes: datos.clientes?.length || 0,
        deudas: datos.deudas?.length || 0,
        inversiones: datos.inversiones?.length || 0
      });
      
      // ✅ VALIDAR QUE NO SEAN ARRAYS VACÍOS
      const clientesValidos = datos.clientes && datos.clientes.length > 0 ? datos.clientes : [];
      const deudasValidas = datos.deudas && datos.deudas.length > 0 ? datos.deudas : [];
      const inversionesValidas = datos.inversiones && datos.inversiones.length > 0 ? datos.inversiones : [];
      
      return { 
        success: true, 
        datos: {
          clientes: clientesValidos,
          deudas: deudasValidas,
          inversiones: inversionesValidas
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
}

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
