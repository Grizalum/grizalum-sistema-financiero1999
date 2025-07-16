import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, orderBy, query, limit, doc, getDoc, deleteDoc } from 'firebase/firestore';

// 🕐 FUNCIÓN PARA GUARDAR SNAPSHOT AUTOMÁTICO
export const guardarSnapshot = async (clientes, deudas, inversiones, tipoAccion = 'automatico') => {
  try {
    const fecha = new Date();
    const snapshot = {
      timestamp: fecha.toISOString(),
      fecha: fecha.toLocaleDateString('es-PE'),
      hora: fecha.toLocaleTimeString('es-PE'),
      usuario: auth.currentUser?.email || 'sistema',
      tipoAccion: tipoAccion, // 'automatico', 'antes_eliminar', 'manual', 'antes_restaurar'
      version: Date.now(),
      datos: {
        clientes: clientes || [],
        deudas: deudas || [],
        inversiones: inversiones || []
      },
      resumen: {
        totalClientes: clientes?.length || 0,
        totalDeudas: deudas?.length || 0,
        totalInversiones: inversiones?.length || 0,
        totalPorCobrar: clientes?.reduce((acc, c) => acc + (c.saldoPendiente || 0), 0) || 0,
        totalPorPagar: deudas?.reduce((acc, d) => acc + (d.saldoPendiente || 0), 0) || 0
      }
    };

    // GUARDAR EN COLECCIÓN DE HISTORIAL
    const historialRef = collection(db, 'grizalum_historial');
    const docRef = await addDoc(historialRef, snapshot);
    
    console.log(`✅ Snapshot guardado: ${docRef.id} - ${tipoAccion}`);
    
    // LIMPIAR SNAPSHOTS ANTIGUOS (mantener solo últimos 30)
    setTimeout(() => limpiarHistorialAntiguo(), 5000);
    
    return {
      success: true,
      snapshotId: docRef.id,
      fecha: snapshot.fecha,
      hora: snapshot.hora,
      tipoAccion: snapshot.tipoAccion,
      resumen: snapshot.resumen
    };

  } catch (error) {
    console.error('❌ Error guardando snapshot:', error);
    return { success: false, error: error.message };
  }
};

// 📜 FUNCIÓN PARA OBTENER HISTORIAL DISPONIBLE
export const obtenerHistorial = async () => {
  try {
    console.log('📋 Obteniendo historial disponible...');
    
    const historialRef = collection(db, 'grizalum_historial');
    const q = query(historialRef, orderBy('timestamp', 'desc'), limit(30));
    const querySnapshot = await getDocs(q);
    
    const historial = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      historial.push({
        id: doc.id,
        fecha: data.fecha,
        hora: data.hora,
        usuario: data.usuario,
        tipoAccion: data.tipoAccion,
        resumen: data.resumen,
        timestamp: data.timestamp,
        version: data.version
      });
    });
    
    console.log(`✅ ${historial.length} snapshots encontrados`);
    return { success: true, historial };
    
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    return { success: false, error: error.message, historial: [] };
  }
};

// 🔄 FUNCIÓN PARA RESTAURAR DESDE HISTORIAL
export const restaurarDesdeHistorial = async (snapshotId) => {
  try {
    console.log(`🔄 Restaurando desde snapshot: ${snapshotId}`);
    
    // OBTENER EL SNAPSHOT ESPECÍFICO
    const snapshotDoc = doc(db, 'grizalum_historial', snapshotId);
    const snapshotSnap = await getDoc(snapshotDoc);
    
    if (!snapshotSnap.exists()) {
      throw new Error('Snapshot no encontrado en el historial');
    }
    
    const snapshotData = snapshotSnap.data();
    
    // CONFIRMAR RESTAURACIÓN
    const confirmacion = window.confirm(
      `🔄 RESTAURAR DESDE HISTORIAL\n\n` +
      `📅 Fecha: ${snapshotData.fecha} ${snapshotData.hora}\n` +
      `👤 Usuario: ${snapshotData.usuario}\n` +
      `📊 Tipo: ${snapshotData.tipoAccion}\n\n` +
      `📈 DATOS A RESTAURAR:\n` +
      `• Clientes: ${snapshotData.resumen.totalClientes}\n` +
      `• Deudas: ${snapshotData.resumen.totalDeudas}\n` +
      `• Inversiones: ${snapshotData.resumen.totalInversiones}\n\n` +
      `💰 RESUMEN FINANCIERO:\n` +
      `• Por cobrar: S/ ${snapshotData.resumen.totalPorCobrar.toLocaleString()}\n` +
      `• Por pagar: S/ ${snapshotData.resumen.totalPorPagar.toLocaleString()}\n\n` +
      `⚠️ ADVERTENCIA: Esto sobrescribirá todos los datos actuales.\n\n` +
      `¿Continuar con la restauración?`
    );
    
    if (!confirmacion) {
      return { success: false, message: 'Restauración cancelada por el usuario' };
    }
    
    // 🔄 RESTAURAR Y RECALCULAR DATOS AUTOMÁTICAMENTE
const datosRestaurados = {
  clientes: (snapshotData.datos.clientes || []).map(cliente => {
    // ✅ RECALCULAR PROGRESO DE PAGOS BASADO EN HISTORIAL
    const numerosPagosRealizados = cliente.historialPagos?.length || 0;
    const pagosEsperados = cliente.plazoMeses;
    
    // ✅ RECALCULAR PRÓXIMA FECHA DE COBRO
    const fechaInicio = new Date(cliente.fechaInicio);
    const proximaFechaCobro = new Date(fechaInicio);
    proximaFechaCobro.setMonth(proximaFechaCobro.getMonth() + numerosPagosRealizados + 1);
    
    return {
      ...cliente,
      // 🔄 RECALCULAR AUTOMÁTICAMENTE
      pagosRealizados: numerosPagosRealizados,
      pagosEsperados: pagosEsperados,
      proximaFechaCobro: proximaFechaCobro.toISOString().split('T')[0]
    };
  }),
  
  deudas: (snapshotData.datos.deudas || []).map(deuda => {
    // ✅ RECALCULAR PROGRESO DE DEUDAS
    const numerosPagosRealizados = deuda.historialPagos?.length || 0;
    const cuotasEsperadas = deuda.plazoMeses;
    
    // ✅ RECALCULAR PRÓXIMO VENCIMIENTO BASADO EN HISTORIAL
    const fechaInicio = new Date(deuda.fechaInicio);
    const proximoVencimiento = new Date(fechaInicio);
    proximoVencimiento.setMonth(proximoVencimiento.getMonth() + numerosPagosRealizados + 1);
    
    return {
      ...deuda,
      // 🔄 RECALCULAR AUTOMÁTICAMENTE
      cuotasPagadas: numerosPagosRealizados,
      cuotasEsperadas: cuotasEsperadas,
      proximoVencimiento: proximoVencimiento.toISOString().split('T')[0]
    };
  }),
  
  inversiones: snapshotData.datos.inversiones || []
};

return {
  success: true,
  message: `✅ Datos restaurados y recalculados desde ${snapshotData.fecha} ${snapshotData.hora}`,
  datos: datosRestaurados,
  // ...
};
// 🧹 FUNCIÓN PARA LIMPIAR HISTORIAL ANTIGUO
const limpiarHistorialAntiguo = async () => {
  try {
    console.log('🧹 Limpiando historial antiguo...');
    
    const historialRef = collection(db, 'grizalum_historial');
    const q = query(historialRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const documentos = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ 
        id: doc.id, 
        timestamp: doc.data().timestamp,
        tipoAccion: doc.data().tipoAccion 
      });
    });
    
    // MANTENER SOLO ÚLTIMOS 30 SNAPSHOTS
    if (documentos.length > 30) {
      const documentosAEliminar = documentos.slice(30);
      console.log(`🧹 Eliminando ${documentosAEliminar.length} snapshots antiguos`);
      
      for (const documento of documentosAEliminar) {
        try {
          await deleteDoc(doc(db, 'grizalum_historial', documento.id));
          console.log(`🗑️ Snapshot eliminado: ${documento.id}`);
        } catch (error) {
          console.error(`❌ Error eliminando snapshot ${documento.id}:`, error);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error limpiando historial:', error);
  }
};

// 🛡️ FUNCIÓN PARA PROTEGER ELIMINACIONES
export const crearSnapshotProteccion = async (clientes, deudas, inversiones, motivo = 'antes_eliminar') => {
  console.log(`🛡️ Creando snapshot de protección: ${motivo}`);
  
  const resultado = await guardarSnapshot(clientes, deudas, inversiones, motivo);
  
  if (resultado.success) {
    console.log(`✅ Snapshot de protección creado: ${resultado.snapshotId}`);
  }
  
  return resultado;
};

// ⏰ FUNCIÓN PARA SNAPSHOT AUTOMÁTICO PROGRAMADO
export const iniciarSnapshotsAutomaticos = (obtenerDatos) => {
  console.log('⏰ Iniciando snapshots automáticos cada 6 horas...');
  
  // SNAPSHOT CADA 6 HORAS
  const intervalId = setInterval(async () => {
    try {
      console.log('🕐 Ejecutando snapshot automático programado...');
      const { clientes, deudas, inversiones } = obtenerDatos();
      
      // SOLO CREAR SNAPSHOT SI HAY DATOS
      if (clientes.length > 0 || deudas.length > 0 || inversiones.length > 0) {
        await guardarSnapshot(clientes, deudas, inversiones, 'automatico');
      }
    } catch (error) {
      console.error('❌ Error en snapshot automático:', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 horas
  
  // SNAPSHOT AL CERRAR LA VENTANA
  const handleBeforeUnload = async () => {
    try {
      const { clientes, deudas, inversiones } = obtenerDatos();
      await guardarSnapshot(clientes, deudas, inversiones, 'al_cerrar');
    } catch (error) {
      console.error('❌ Error en snapshot al cerrar:', error);
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return {
    intervalId,
    cleanup: () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  };
};

// 📊 FUNCIÓN PARA OBTENER ESTADÍSTICAS DEL HISTORIAL
export const obtenerEstadisticasHistorial = async () => {
  try {
    const { historial } = await obtenerHistorial();
    
    const tipos = historial.reduce((acc, snapshot) => {
      acc[snapshot.tipoAccion] = (acc[snapshot.tipoAccion] || 0) + 1;
      return acc;
    }, {});
    
    const fechaMasAntigua = historial.length > 0 ? historial[historial.length - 1].fecha : null;
    const fechaMasReciente = historial.length > 0 ? historial[0].fecha : null;
    
    return {
      success: true,
      estadisticas: {
        totalSnapshots: historial.length,
        tiposDeSnapshot: tipos,
        fechaMasAntigua,
        fechaMasReciente,
        ultimoSnapshot: historial[0] || null
      }
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};
