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
    console.log('🔄 Modo offline - Cargando desde localStorage...');
    
    try {
      const datos = localStorage.getItem('grizalum-datos-principales');
      if (datos) {
        const datosParseados = JSON.parse(datos);
        console.log('✅ Datos encontrados en modo offline');
        return {
          success: true,
          datos: {
            clientes: datosParseados.clientes || [],
            deudas: datosParseados.deudas || [],
            inversiones: datosParseados.inversiones || []
          }
        };
      }
      
      console.log('📝 No hay datos offline - Primera vez');
      return { success: false, message: 'Sin datos offline' };
      
    } catch (error) {
      console.error('❌ Error modo offline:', error);
      return { success: false, message: error.message };
    }
  },

  async guardarDatos(clientes, deudas, inversiones) {
    console.log('💾 Modo offline - Guardando en localStorage...');
    
    try {
      const datosCompletos = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        timestamp: Date.now(),
        version: '2.1-offline'
      };
      
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
