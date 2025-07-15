// src/hooks/firebaseService.js - SERVICIO COMPLETO CORREGIDO
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { db, firebaseDisponible, verificarFirebase } from '../config/firebase';

// 🏷️ CONFIGURACIÓN DE COLECCIÓN
const COLLECTION_NAME = 'grizalum_metalurgica';
const DOCUMENT_ID = 'grizalum_metalurgica';

console.log('🔥 Firebase Service iniciado');
console.log('🔍 Estado Firebase:', verificarFirebase());

const firebaseService = {
  
  // 📥 CARGAR DATOS (Firebase + Fallback LocalStorage)
  async cargarDatos() {
    console.log('📥 Iniciando carga de datos...');
    
    // 🔥 PRIORIDAD 1: Intentar Firebase si está disponible
    if (firebaseDisponible && db) {
      try {
        console.log('🌐 Cargando desde Firebase...');
        
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const datosFirebase = docSnap.data();
          console.log('✅ Datos encontrados en Firebase:', datosFirebase);
          
          // 💾 BACKUP en localStorage como respaldo
          localStorage.setItem('grizalum-firebase-backup', JSON.stringify(datosFirebase));
          
          return {
            success: true,
            datos: {
              clientes: datosFirebase.clientes || [],
              deudas: datosFirebase.deudas || [],
              inversiones: datosFirebase.inversiones || []
            },
            origen: 'firebase'
          };
        } else {
          console.log('📝 No hay datos en Firebase - Documento no existe');
        }
        
      } catch (error) {
        console.error('❌ Error cargando desde Firebase:', error);
        console.log('🔄 Fallback a localStorage...');
      }
    }
    
    // 🗃️ FALLBACK: Cargar desde localStorage
    try {
      console.log('💾 Cargando desde localStorage...');
      
      // Intentar múltiples fuentes de backup
      const fuentes = [
        'grizalum-firebase-backup',
        'grizalum-datos-principales', 
        'grizalum-backup-1',
        'grizalum-backup-2'
      ];
      
      for (const fuente of fuentes) {
        const datos = localStorage.getItem(fuente);
        if (datos) {
          const datosParseados = JSON.parse(datos);
          console.log(`✅ Datos encontrados en ${fuente}`);
          
          return {
            success: true,
            datos: {
              clientes: datosParseados.clientes || [],
              deudas: datosParseados.deudas || [],
              inversiones: datosParseados.inversiones || []
            },
            origen: 'localStorage'
          };
        }
      }
      
      console.log('📝 No hay datos en localStorage - Primera vez');
      return { 
        success: false, 
        message: 'Sin datos previos',
        datos: { clientes: [], deudas: [], inversiones: [] }
      };
      
    } catch (error) {
      console.error('❌ Error en localStorage:', error);
      return { 
        success: false, 
        message: error.message,
        datos: { clientes: [], deudas: [], inversiones: [] }
      };
    }
  },

  // 💾 GUARDAR DATOS (Firebase + Backup LocalStorage)
  async guardarDatos(clientes, deudas, inversiones, backupId = null) {
    console.log('💾 Iniciando guardado de datos...');
    console.log('📊 Clientes:', clientes?.length || 0);
    console.log('📊 Deudas:', deudas?.length || 0);
    console.log('📊 Inversiones:', inversiones?.length || 0);
    
    // 🛡️ VALIDACIÓN DE DATOS
    if (!clientes && !deudas && !inversiones) {
      console.warn('⚠️ No hay datos para guardar');
      return { success: false, message: 'No hay datos para guardar' };
    }
    
    const datosCompletos = {
      clientes: clientes || [],
      deudas: deudas || [],
      inversiones: inversiones || [],
      ultimaActualizacion: serverTimestamp(),
      timestamp: Date.now(),
      version: '2.1',
      backupId: backupId || `manual-${Date.now()}`
    };
    
    let resultadoFirebase = false;
    let resultadoLocal = false;
    
    // 🔥 INTENTAR FIREBASE PRIMERO
    if (firebaseDisponible && db) {
      try {
        console.log('🌐 Guardando en Firebase...');
        
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, datosCompletos, { merge: true });
        
        console.log('✅ Guardado en Firebase exitoso');
        resultadoFirebase = true;
        
      } catch (error) {
        console.error('❌ Error guardando en Firebase:', error);
        console.log('🔄 Continuando con localStorage...');
      }
    } else {
      console.log('⚠️ Firebase no disponible, usando solo localStorage');
    }
    
    // 💾 SIEMPRE GUARDAR EN LOCALSTORAGE COMO BACKUP
    try {
      console.log('💾 Guardando backup en localStorage...');
      
      // Múltiples copias para máxima seguridad
      const backups = [
        'grizalum-datos-principales',
        'grizalum-backup-1', 
        'grizalum-backup-2',
        'grizalum-firebase-backup'
      ];
      
      backups.forEach(key => {
        localStorage.setItem(key, JSON.stringify(datosCompletos));
      });
      
      // Backup con timestamp único
      const timestampBackup = `grizalum-backup-${new Date().toISOString().split('T')[0]}`;
      localStorage.setItem(timestampBackup, JSON.stringify(datosCompletos));
      
      console.log('✅ Backups en localStorage creados');
      resultadoLocal = true;
      
    } catch (error) {
      console.error('❌ Error en localStorage:', error);
    }
    
    // 📊 RESULTADO FINAL
    if (resultadoFirebase && resultadoLocal) {
      return { 
        success: true, 
        message: '✅ Guardado completo (Firebase + LocalStorage)',
        firebase: true,
        localStorage: true
      };
    } else if (resultadoLocal) {
      return { 
        success: true, 
        message: '⚠️ Guardado solo en LocalStorage (Firebase falló)',
        firebase: false,
        localStorage: true
      };
    } else {
      return { 
        success: false, 
        message: '❌ Error: No se pudo guardar en ningún sitio',
        firebase: false,
        localStorage: false
      };
    }
  },

  // 🔗 VERIFICAR CONEXIÓN
  async verificarConexion() {
    if (!firebaseDisponible || !db) {
      console.log('❌ Firebase no disponible');
      return false;
    }
    
    try {
      console.log('🔍 Verificando conexión Firebase...');
      
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      
      console.log('✅ Conexión Firebase verificada');
      return true;
      
    } catch (error) {
      console.error('❌ Error conexión Firebase:', error);
      return false;
    }
  },

  // 🧹 LIMPIAR DATOS (solo para desarrollo)
  async limpiarTodosLosDatos() {
    console.warn('🧹 LIMPIANDO TODOS LOS DATOS...');
    
    try {
      // Limpiar localStorage
      const keys = Object.keys(localStorage).filter(key => key.includes('grizalum'));
      keys.forEach(key => localStorage.removeItem(key));
      
      // Limpiar Firebase si está disponible
      if (firebaseDisponible && db) {
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, {
          clientes: [],
          deudas: [],
          inversiones: [],
          ultimaLimpieza: serverTimestamp()
        });
      }
      
      console.log('✅ Datos limpiados completamente');
      return { success: true, message: 'Datos limpiados' };
      
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return { success: false, message: error.message };
    }
  }
};

export default firebaseService;
