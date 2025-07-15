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

const COLLECTION_NAME = 'empresas';
const DOCUMENT_ID = 'grizalum_metalurgica';

const firebaseService = {
  // ✅ MODO FIREBASE - Funciona con Firebase real
 async cargarDatos() {
    console.log('📥 Cargando desde Firebase...');
    
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datosFirebase = docSnap.data();
        console.log('✅ Datos encontrados en Firebase:', datosFirebase);
        console.log('🔍 CLIENTES ESPECÍFICOS:', datosFirebase.clientes);
        console.log('🔍 ESTRUCTURA COMPLETA:', JSON.stringify(datosFirebase, null, 2));
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
        version: '2.1'
      };
      
      // Guardar en Firebase
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(docRef, datosCompletos, { merge: true });
      console.log('✅ Guardado en Firebase exitoso');
      
      // Backup en localStorage
      localStorage.setItem('grizalum-firebase-backup', JSON.stringify(datosCompletos));
      
      return { success: true, message: 'Guardado Firebase exitoso' };
      
    } catch (error) {
      console.error('❌ Error guardando en Firebase:', error);
      return { success: false, message: error.message };
    }
  }, 
  async verificarConexion() {
    console.log('🔄 Verificando conexión Firebase...');
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.error('❌ Error conexión Firebase:', error);
      return false;
    }
  }
};

export default firebaseService;
