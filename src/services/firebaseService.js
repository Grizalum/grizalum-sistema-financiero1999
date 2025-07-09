// src/hooks/firebaseService.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// 🔥 USAR LA MISMA COLECCIÓN QUE YA EXISTE EN FIREBASE
const COLLECTION_NAME = 'grizalum_metalurgica';
const DOCUMENT_ID = 'datos-financieros';

const firebaseService = {
  // 💾 GUARDAR TODOS LOS DATOS
  async guardarDatos(clientes, deudas, inversiones) {
    try {
      console.log('🔄 Guardando en Firebase - Colección:', COLLECTION_NAME);
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const datosParaGuardar = {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || [],
        ultimaActualizacion: serverTimestamp(),
        version: '2.1',
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

  // 📥 CARGAR TODOS LOS DATOS - MEJORADO
  async cargarDatos() {
    try {
      console.log('🔄 Cargando desde Firebase - Colección:', COLLECTION_NAME);
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const datos = docSnap.data();
        
        // 🔍 VERIFICAR QUE LOS DATOS EXISTEN
        const datosLimpios = {
          clientes: Array.isArray(datos.clientes) ? datos.clientes : [],
          deudas: Array.isArray(datos.deudas) ? datos.deudas : [],
          inversiones: Array.isArray(datos.inversiones) ? datos.inversiones : [],
          ultimaActualizacion: datos.ultimaActualizacion
        };
        
        console.log('✅ Datos cargados desde Firebase:', {
          clientes: datosLimpios.clientes.length,
          deudas: datosLimpios.deudas.length,
          inversiones: datosLimpios.inversiones.length,
          timestamp: datos.ultimaActualizacion
        });
        
        // ✅ SIEMPRE RETORNAR SUCCESS TRUE SI EXISTE EL DOCUMENTO
        return { 
          success: true, 
          datos: datosLimpios,
          message: 'Datos cargados desde la nube'
        };
      } else {
        console.log('📝 No hay documento en Firebase - creando uno nuevo');
        
        // 🆕 CREAR DOCUMENTO INICIAL SI NO EXISTE
        const datosIniciales = {
          clientes: [],
          deudas: [],
          inversiones: [],
          ultimaActualizacion: serverTimestamp(),
          version: '2.1',
          usuario: 'grizalum-admin'
        };
        
        await setDoc(docRef, datosIniciales);
        
        return { 
          success: true, 
          datos: {
            clientes: [],
            deudas: [],
            inversiones: [],
            ultimaActualizacion: new Date()
          },
          message: 'Documento creado en Firebase'
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

  // 🔥 NUEVO: LISTENER EN TIEMPO REAL
  configurarListenerTiempoReal(callback) {
    try {
      console.log('🔄 Configurando listener en tiempo real...');
      
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      
      // 🎯 ESCUCHAR CAMBIOS EN TIEMPO REAL
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        console.log('🔔 Snapshot recibido:', docSnap.exists());
        
        if (docSnap.exists()) {
          const datosNuevos = docSnap.data();
          
          console.log('🔄 DATOS RECIBIDOS EN TIEMPO REAL:', {
            clientes: datosNuevos.clientes?.length || 0,
            deudas: datosNuevos.deudas?.length || 0,
            inversiones: datosNuevos.inversiones?.length || 0,
            timestamp: datosNuevos.ultimaActualizacion
          });
          
          // 🔍 VERIFICAR Y LIMPIAR DATOS
          const datosLimpios = {
            clientes: Array.isArray(datosNuevos.clientes) ? datosNuevos.clientes : [],
            deudas: Array.isArray(datosNuevos.deudas) ? datosNuevos.deudas : [],
            inversiones: Array.isArray(datosNuevos.inversiones) ? datosNuevos.inversiones : [],
            ultimaActualizacion: datosNuevos.ultimaActualizacion
          };
          
          // ✅ LLAMAR AL CALLBACK CON LOS DATOS NUEVOS
          callback({
            success: true,
            datos: datosLimpios,
            esActualizacionRemota: true
          });
          
        } else {
          console.log('📄 Documento no existe en Firebase');
          callback({
            success: false,
            datos: null,
            message: 'Documento no encontrado'
          });
        }
      }, (error) => {
        console.error('❌ Error en listener tiempo real:', error);
        callback({
          success: false,
          error: error.message,
          datos: null
        });
      });
      
      console.log('✅ Listener configurado exitosamente');
      return unsubscribe;
      
    } catch (error) {
      console.error('❌ Error configurando listener:', error);
      return null;
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
