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
      console.log('🔍 DATOS RAW DE FIREBASE:', JSON.stringify(docSnap.data(), null, 2));
      console.log('✅ Datos encontrados en Firebase:', datosFirebase);
      
      // GUARDAR BACKUP EN LOCALSTORAGE
      localStorage.setItem('grizalum-backup', JSON.stringify(datosFirebase));
      
      return {
        success: true,
        datos: {
          clientes: datosFirebase.clientes || [],
          deudas: datosFirebase.deudas || [],
          inversiones: datosFirebase.inversiones || []
        }
      };
    } else {
      console.log('📝 No hay datos en Firebase - Intentando LocalStorage');
      
      // CARGAR DESDE LOCALSTORAGE COMO BACKUP
      const backup = localStorage.getItem('grizalum-backup');
      if (backup) {
        const datosBackup = JSON.parse(backup);
        console.log('🔄 Datos recuperados desde LocalStorage');
        return {
          success: true,
          datos: {
            clientes: datosBackup.clientes || [],
            deudas: datosBackup.deudas || [],
            inversiones: datosBackup.inversiones || []
          }
        };
      }
      
      return { success: false, message: 'Sin datos en Firebase ni LocalStorage' };
    }
    
  } catch (error) {
    console.error('❌ Error cargando desde Firebase:', error);
    
    // BACKUP DE EMERGENCIA
    const backup = localStorage.getItem('grizalum-backup');
    if (backup) {
      const datosBackup = JSON.parse(backup);
      console.log('🚨 Usando backup de emergencia');
      return {
        success: true,
        datos: {
          clientes: datosBackup.clientes || [],
          deudas: datosBackup.deudas || [],
          inversiones: datosBackup.inversiones || []
        }
      };
    }
    
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
      console.log('💾 DATOS QUE SE VAN A GUARDAR:', JSON.stringify(datosCompletos, null, 2));
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
     await setDoc(docRef, datosCompletos);
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
