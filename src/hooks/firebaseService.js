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
  // ✅ MODO OFFLINE - Funciona sin Firebase
 async cargarDatos() {
    console.log('📥 Cargando desde Firebase...');
    
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datosFirebase = docSnap.data();
        console.log('✅ Datos encontrados en Firebase:', datosFirebase);
        
        return {
          success: true,
          datos: {
            clientes: datosFirebase.clientes || [],
            deudas: datosFirebase.deudas || [],
            inversiones: datosFirebase.inversiones || []
          }
        };
      } else {
        console.log('📝 No hay datos en Firebase');
        return { success: false, message: 'Sin datos en Firebase' };
      }
      
    } catch (error) {
      console.error('❌ Error cargando desde Firebase:', error);
      return { success: false, message: error.message };
    }
  },

  async guardarDatos(clientes, deudas, inversiones) {
    console.log('💾 Guardando en Firebase...');
    
    try {
      const datosCompletos = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        timestamp: Date.now(),
        version: '2.1-offline'
      };
      // Guardar en Firebase
try {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  await setDoc(docRef, datosCompletos, { merge: true });
  console.log('✅ Guardado en Firebase exitoso');
} catch (error) {
  console.error('❌ Error guardando en Firebase:', error);
}
      
      // Múltiples backups
      localStorage.setItem('grizalum-datos-principales', JSON.stringify(datosCompletos));
      localStorage.setItem('grizalum-backup-1', JSON.stringify(datosCompletos));
      localStorage.setItem('grizalum-backup-2', JSON.stringify(datosCompletos));
      
      console.log('✅ Datos guardados en modo offline');
      return { success: true, message: 'Guardado offline exitoso' };
      
    } catch (error) {
      console.error('❌ Error guardando offline:', error);
      return { success: false, message: error.message };
    }
  },

  async verificarConexion() {
    console.log('🔄 Modo offline - Siempre "conectado"');
    return true; // Siempre "conectado" en modo offline
  }
};

export default firebaseService;
