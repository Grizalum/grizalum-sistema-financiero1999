import { guardarSnapshot, crearSnapshotProteccion, iniciarSnapshotsAutomaticos } from '../services/historialService';
import { useState, useEffect, useCallback, useRef } from 'react';
import firebaseService from './firebaseService';
const useFinancialData = () => {
// Hook personalizado para manejar toda la lógica financiera
  // Estados principales
  const [misClientes, setMisClientes] = useState([]);
  const [misDeudas, setMisDeudas] = useState([]);
  const [misInversiones, setMisInversiones] = useState([]);

   // 🔄 ESTADOS PARA FIREBASE
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [guardandoEnNube, setGuardandoEnNube] = useState(false);
  const [errorConexion, setErrorConexion] = useState(null);
  const [ultimoGuardadoNube, setUltimoGuardadoNube] = useState(null);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [cambiosRemotos, setCambiosRemotos] = useState(false);
  const datosInicializados = useRef(false);
  
const agregarInversion = useCallback((nuevaInversion) => {
  const inversion = {
    id: `inv${Date.now()}`,
    nombre: nuevaInversion.nombre,
    descripcion: nuevaInversion.descripcion,
    tipo: nuevaInversion.tipo,
    inversion: parseFloat(nuevaInversion.inversion),
    gananciaEsperada: parseFloat(nuevaInversion.gananciaEsperada),
    gananciaActual: 0,
    roi: 0,
    progreso: 0,
    estado: 'En Proceso',
    fechaInicio: nuevaInversion.fechaInicio,
    historialGanancias: [] // ← AGREGAR ESTA LÍNEA
  };
  
  setMisInversiones(prev => [...prev, inversion]);
}, []);

  const actualizarGanancias = useCallback((id, nuevaGanancia, fecha, notas = '') => {
  setMisInversiones(prev => prev.map(inv => {
    if (inv.id === id) {
      const gananciaAnterior = inv.gananciaActual;
      const gananciaActual = inv.gananciaActual + parseFloat(nuevaGanancia); // ✅ SUMA ACUMULATIVA
      const diferencia = parseFloat(nuevaGanancia);
      const roi = ((gananciaActual / inv.inversion) * 100);
      const progreso = Math.min((gananciaActual / inv.gananciaEsperada) * 100, 100);
      const estado = progreso >= 100 ? 'Completado' : 'En Proceso';
      
      // Crear nuevo registro en el historial
      const nuevoRegistro = {
        id: (inv.historialGanancias?.length || 0) + 1,
        fecha: fecha || new Date().toISOString().split('T')[0],
        gananciaAnterior: gananciaAnterior,
        gananciaActual: gananciaActual,
        diferencia: parseFloat(nuevaGanancia), 
        notas: notas || 'Actualización de ganancias'
      };

      return {
        ...inv,
        gananciaActual,
        roi: Math.round(roi * 10) / 10,
        progreso: Math.round(progreso),
        estado,
        historialGanancias: [...(inv.historialGanancias || []), nuevoRegistro]
      };
    }
    return inv;
  }));
}, []);
  
const eliminarRegistroGanancia = useCallback((inversionId, registroId) => {
  setMisInversiones(prev => prev.map(inv => {
    if (inv.id === inversionId) {
      // Filtrar el registro eliminado
      const nuevoHistorial = inv.historialGanancias.filter(r => r.id !== registroId);
      
      // Recalcular ganancia actual (último registro o 0)
      const ultimoRegistro = nuevoHistorial[nuevoHistorial.length - 1];
      const nuevaGananciaActual = ultimoRegistro ? ultimoRegistro.gananciaActual : 0;
      
      // Recalcular ROI y progreso
      const roi = ((nuevaGananciaActual / inv.inversion) * 100);
      const progreso = Math.min((nuevaGananciaActual / inv.gananciaEsperada) * 100, 100);
      const estado = progreso >= 100 ? 'Completado' : 'En Proceso';

      return {
        ...inv,
        gananciaActual: nuevaGananciaActual,
        roi: Math.round(roi * 10) / 10,
        progreso: Math.round(progreso),
        estado,
        historialGanancias: nuevoHistorial
      };
    }
    return inv;
  }));
}, []);
  const editarInversion = useCallback((id, datosActualizados) => {
  setMisInversiones(prev => prev.map(inv => {
    if (inv.id === id) {
      const inversionActualizada = parseFloat(datosActualizados.inversion);
      const gananciaEsperada = parseFloat(datosActualizados.gananciaEsperada);
      const gananciaActual = parseFloat(datosActualizados.gananciaActual || inv.gananciaActual); // ← NUEVA LÍNEA
      const roi = ((gananciaActual / inversionActualizada) * 100); // ← CAMBIO AQUÍ
      const progreso = Math.min((gananciaActual / gananciaEsperada) * 100, 100); // ← CAMBIO AQUÍ
      
      return {
        ...inv,
        nombre: datosActualizados.nombre,
        descripcion: datosActualizados.descripcion,
        tipo: datosActualizados.tipo,
        inversion: inversionActualizada,
        gananciaEsperada,
        gananciaActual, // ← NUEVA LÍNEA
        roi: Math.round(roi * 10) / 10,
        progreso: Math.round(progreso),
        estado: progreso >= 100 ? 'Completado' : 'En Proceso' // ← NUEVA LÍNEA
      };
    }
    return inv;
  }));
}, []);

  const eliminarInversion = useCallback((id) => {
    setMisInversiones(prev => prev.filter(inv => inv.id !== id));
  }, []);

  // 📥 FUNCIÓN PARA CARGAR DATOS INICIALES
 const cargarDatosIniciales = useCallback(async () => {
  if (datosInicializados.current) return;
  
  console.log('🚀 CARGANDO DATOS AL INICIO');
  setCargandoDatos(true);
  
  try {
    const resultado = await firebaseService.cargarDatos();
    if (resultado && resultado.success && resultado.datos) {
      console.log('✅ Datos cargados:', resultado.datos);
      
      console.log('🔍 CLIENTES RECIBIDOS:', resultado.datos.clientes);
      console.log('🔍 DEUDAS RECIBIDAS:', resultado.datos.deudas);
      console.log('🔍 INVERSIONES RECIBIDAS:', resultado.datos.inversiones);

      // CARGAR SIEMPRE, sin validar length
      setMisClientes(resultado.datos.clientes || []);
      setMisDeudas(resultado.datos.deudas || []);
      setMisInversiones(resultado.datos.inversiones || []);
      datosInicializados.current = true;
    }
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
  } finally {
    setCargandoDatos(false);
  }
}, []);
  
const guardarEnFirebase = useCallback(async (clientes = misClientes, deudas = misDeudas, inversiones = misInversiones) => {
  console.log('🚀 guardarEnFirebase iniciado');

  setGuardandoEnNube(true);
  console.log('🚀 guardarEnFirebase iniciado');
  
  try {
    const resultado = await firebaseService.guardarDatos(clientes, deudas, inversiones);
    
     if (resultado.success) {
      setUltimoGuardadoNube(new Date());
      setFirebaseConectado(true);
      console.log('✅ Guardado en Firebase exitoso');
     } else {
      setErrorConexion(resultado.message);
      setFirebaseConectado(false);
     }
    
    return resultado;
    
   } catch (error) {
    console.error('❌ Error al guardar:', error);
    setErrorConexion('Error de conexión');
    setFirebaseConectado(false);
    return { success: false, message: error.message };
   } finally {
    setGuardandoEnNube(false);
   }
  }, []);
  // 💾 BACKUP AUTOMÁTICO para proteger datos reales
const crearBackup = useCallback(async () => {
  const fecha = new Date().toISOString().split('T')[0];
  const backup = {
    fecha: fecha,
    clientes: misClientes,
    deudas: misDeudas,
    inversiones: misInversiones,
    version: '2.1'
  };
  
  try {
    // Guardar backup con fecha en Firebase
    const resultado = await firebaseService.guardarDatos(backup.clientes, backup.deudas, backup.inversiones, `backup-${fecha}`);
    if (resultado.success) {
      console.log('💾 Backup creado exitosamente:', fecha);
    }
  } catch (error) {
    console.error('❌ Error creando backup:', error);
  }
}, [misClientes, misDeudas, misInversiones]);
  
// 🔥 CARGAR DATOS AL INICIO - ✅ HABILITADO
useEffect(() => {
  cargarDatosIniciales();
}, [cargarDatosIniciales]);
  // 🔥 GUARDADO INMEDIATO AL CAMBIAR CLIENTES
useEffect(() => {
  if (!datosInicializados.current) return;
  if (misClientes.length === 0) return;
  
  console.log('💾 GUARDADO INMEDIATO POR CAMBIO EN CLIENTES');
  
  const guardarInmediato = async () => {
    try {
      await firebaseService.guardarDatos(misClientes, misDeudas, misInversiones);
      console.log('✅ GUARDADO INMEDIATO EXITOSO');
    } catch (error) {
      console.error('❌ Error guardado inmediato:', error);
    }
  };
  
  guardarInmediato();
}, [misClientes]);
//console.log('🛡️ Carga automática COMPLETAMENTE deshabilitada');
  // 🚀 GUARDADO AUTOMÁTICO INTELIGENTE - ✅ COMO CANVA
useEffect(() => {
  // ❌ NO guardar si no están inicializados los datos
  if (!datosInicializados.current) return;
  
  // ❌ NO guardar si está cargando
  if (cargandoDatos) return;
  
  // ❌ NO guardar si todo está vacío
  if (misClientes.length === 0 && misDeudas.length === 0 && misInversiones.length === 0) {
    return;
  }

  console.log('🚀 GUARDADO AUTOMÁTICO INTELIGENTE');
  
  // ⏰ DELAY DE 5 SEGUNDOS (como Canva)
  const timer = setTimeout(async () => {
    try {
      const resultado = await guardarEnFirebase(misClientes, misDeudas, misInversiones);
      if (resultado.success) {
        console.log('✅ AUTO-GUARDADO EXITOSO');
        setUltimoGuardadoNube(new Date());
      }
    } catch (error) {
      console.error('❌ Error en auto-guardado:', error);
    }
  }, 5000); // ← 5 segundos como Canva

  return () => clearTimeout(timer);
}, [misClientes, misDeudas, misInversiones, datosInicializados, cargandoDatos, guardarEnFirebase]);
// 🔄 AUTOSAVE DESHABILITADO - SOLO GUARDADO MANUAL
//() => {
//   if (!cargandoDatos && !guardandoEnNube && (misClientes.length > 0 || misDeudas.length > 0 || misInversiones.length > 0)) {
//     const timeout = setTimeout(async () => {
//       console.log('💾 Guardando automáticamente...');
//       try {
//         const resultado = await guardarEnFirebase();
//         if (resultado.success) {
//           console.log('✅ Autosave exitoso');
//         } else {
//           console.log('❌ Autosave falló:', resultado.message);
//         }
//       } catch (error) {
//         console.error('❌ Error en autosave:', error);
//       }
//     }, 3000); // ← Cambiar a 3 segundos
//     
//     return () => clearTimeout(timeout);
//   }
// }, [misClientes, misDeudas, misInversiones, cargandoDatos, guardandoEnNube, guardarEnFirebase]);
  
// useEffect(() => {
//   if (!cargandoDatos) {
//     const interval = setInterval(async () => {
//       // ⚠️ NO RECARGAR SI ESTAMOS GUARDANDO
//       if (!guardandoEnNube) {
//         console.log('🔄 Verificando cambios remotos...');
//         
//         try {
//           const resultado = await firebaseService.cargarDatos();
//           
//           if (resultado.success && resultado.datos) {
//             console.log('📥 Datos desde Firebase verificados');
//             
//             // 🛡️ NO SOBRESCRIBIR DATOS LOCALES VÁLIDOS CON DATOS VACÍOS
//             const clientesFirebase = resultado.datos.clientes || [];
//             const deudasFirebase = resultado.datos.deudas || [];
//             const inversionesFirebase = resultado.datos.inversiones || [];
            
            // ✅ SOLO ACTUALIZAR SI FIREBASE TIENE DATOS VÁLIDOS
            //if (clientesFirebase.length > 0 && JSON.stringify(clientesFirebase) !== JSON.stringify(misClientes)) {
            //  console.log('📱 Actualizando clientes desde Firebase (datos válidos)');
            //  setMisClientes(clientesFirebase);
            //}
            
            //if (deudasFirebase.length > 0 && JSON.stringify(deudasFirebase) !== JSON.stringify(misDeudas)) {
              //console.log('💳 Actualizando deudas desde Firebase (datos válidos)');
              //setMisDeudas(deudasFirebase);
            //}
            
           // if (inversionesFirebase.length > 0 && JSON.stringify(inversionesFirebase) !== JSON.stringify(misInversiones)) {
             // console.log('💰 Actualizando inversiones desde Firebase (datos válidos)');
              //setMisInversiones(inversionesFirebase);
            //}
            //
        //             setFirebaseConectado(true);
//           } else {
//             console.log('📝 Firebase sin datos válidos - Manteniendo datos locales');
//           }
//         } catch (error) {
//           console.error('❌ Error sincronización:', error);
//           setFirebaseConectado(false);
//         }
//       } else {
//         console.log('⏳ Esperando... guardado en progreso');
//       }
//     }, 60000); // ← Cambiado a 1 minuto para reducir verificaciones
//     
//     return () => clearInterval(interval);
//   }
// }, [cargandoDatos, guardandoEnNube, misClientes, misDeudas, misInversiones]);
//   console.log('🛡️ Sincronización automática deshabilitada');
  
// 🔄 VERIFICAR CONEXIÓN - DESHABILITADO
// useEffect(() => {
//   const verificarConexion = async () => {
//     const conectado = await firebaseService.verificarConexion();
//     setFirebaseConectado(conectado);
//   };
//   
//   const interval = setInterval(verificarConexion, 30000);
//   return () => clearInterval(interval);
// }, []);
  
 const [alertas, setAlertas] = useState([]);
  // Cálculos derivados
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const recursosDisponibles = totalPorCobrar + misInversiones.reduce((acc, i) => acc + i.gananciaActual, 0);
  const cobertura = totalPorPagar > 0 ? (recursosDisponibles / totalPorPagar) * 100 : 100;

  // Funciones de acción con useCallback para evitar re-renders
  const registrarPagoCliente = useCallback((clienteId, monto, fecha) => {
  setMisClientes(prev => prev.map(cliente => {
    if (cliente.id === clienteId) {
      const nuevoSaldo = Math.max(0, cliente.saldoPendiente - monto);
      const nuevoPagado = cliente.pagosRecibidos + monto;
      
      // Generar ID único para el pago
      const nuevoId = cliente.historialPagos.length > 0 
        ? Math.max(...cliente.historialPagos.map(p => p.id)) + 1 
        : 1;
      
      const nuevoPago = {
        id: nuevoId,
        fecha: fecha,
        monto: Math.round(monto * 100) / 100,
        tipo: monto >= cliente.cuotaMensual ? 'Cuota Regular' : 'Pago Parcial'
      };

      return {
        ...cliente,
        saldoPendiente: Math.round(nuevoSaldo * 100) / 100,
        pagosRecibidos: Math.round(nuevoPagado * 100) / 100,
        estado: nuevoSaldo === 0 ? 'Completado' : 'En Proceso',
        historialPagos: [...cliente.historialPagos, nuevoPago]
      };
    }
    return cliente;
  }));
  }, []);

 const pagarDeuda = useCallback((deudaId, monto, fecha) => {
  setMisDeudas(prev => prev.map(deuda => {
    if (deuda.id === deudaId) {
      const nuevoSaldo = Math.max(0, deuda.saldoPendiente - monto);
      const nuevoTotalPagado = (deuda.totalPagado || 0) + monto;
      
      // Generar ID único para el pago
      const nuevoId = deuda.historialPagos?.length > 0 
        ? Math.max(...deuda.historialPagos.map(p => p.id)) + 1 
        : 1;
      
      const nuevoPago = {
        id: nuevoId,
        fecha: fecha || new Date().toISOString().split('T')[0],
        monto: Math.round(monto * 100) / 100,
        tipo: monto >= deuda.cuotaMensual ? 'Cuota Regular' : 'Pago Parcial'
      };

      // ✅ CALCULAR PRÓXIMO VENCIMIENTO AUTOMÁTICAMENTE
      const nuevosHistorialPagos = [...(deuda.historialPagos || []), nuevoPago];
      const fechaInicio = new Date(deuda.fechaInicio);
      const proximoVencimiento = new Date(fechaInicio);
      proximoVencimiento.setMonth(proximoVencimiento.getMonth() + nuevosHistorialPagos.length + 1);

      return {
        ...deuda,
        saldoPendiente: Math.round(nuevoSaldo * 100) / 100,
        totalPagado: Math.round(nuevoTotalPagado * 100) / 100,
        estado: nuevoSaldo === 0 ? 'Pagado' : 'Activo',
        historialPagos: nuevosHistorialPagos,
        proximoVencimiento: proximoVencimiento.toISOString().split('T')[0]
      };
    }
    return deuda;
  }));
}, []);
  const eliminarCliente = useCallback((clienteId) => {
    setMisClientes(prev => prev.filter(c => c.id !== clienteId));
  }, []);

  const eliminarDeuda = useCallback((deudaId) => {
    setMisDeudas(prev => prev.filter(d => d.id !== deudaId));
  }, []);

 const eliminarPagoHistorial = useCallback((clienteId, pagoId) => {
  setMisClientes(prev => prev.map(cliente => {
    if (cliente.id === clienteId) {
      const pagoEliminado = cliente.historialPagos.find(p => p.id === pagoId);
      if (pagoEliminado) {
        const nuevoPagosRecibidos = cliente.pagosRecibidos - pagoEliminado.monto;
        const nuevoSaldoPendiente = cliente.saldoPendiente + pagoEliminado.monto;
        
        return {
          ...cliente,
          historialPagos: cliente.historialPagos.filter(p => p.id !== pagoId),
          pagosRecibidos: Math.round(nuevoPagosRecibidos * 100) / 100,
          saldoPendiente: Math.round(nuevoSaldoPendiente * 100) / 100,
          estado: nuevoSaldoPendiente > 0 ? 'En Proceso' : 'Completado'
        };
      }
    }
    return cliente;
  }));
}, []);

  const eliminarAlerta = useCallback((alertaId) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
  }, []);
  const eliminarPagoHistorialDeuda = useCallback((deudaId, pagoId) => {
  setMisDeudas(prev => prev.map(deuda => {
    if (deuda.id === deudaId) {
      const pagoEliminado = deuda.historialPagos.find(p => p.id === pagoId);
      if (pagoEliminado) {
        const nuevoTotalPagado = (deuda.totalPagado || 0) - pagoEliminado.monto;
        const nuevoSaldoPendiente = deuda.saldoPendiente + pagoEliminado.monto;
        
        return {
          ...deuda,
          historialPagos: deuda.historialPagos.filter(p => p.id !== pagoId),
          totalPagado: Math.round(nuevoTotalPagado * 100) / 100,
          saldoPendiente: Math.round(nuevoSaldoPendiente * 100) / 100,
          estado: nuevoSaldoPendiente > 0 ? 'Activo' : 'Pagado'
        };
      }
    }
    return deuda;
  }));
}, []);
const agregarCliente = useCallback((nuevoCliente) => {
  setMisClientes(prev => {
    // Calcular cuota mensual y total a cobrar
    const capital = parseFloat(nuevoCliente.capital);
    const tasa = parseFloat(nuevoCliente.tasaInteres) / 100;
    const meses = parseInt(nuevoCliente.plazoMeses);
    
    // Fórmula de cuota mensual
    const tasaMensual = tasa / 12;
    const cuotaMensual = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    const totalCobrar = cuotaMensual * meses;
    
    const clienteConId = {
      ...nuevoCliente,
      id: Math.max(...prev.map(c => c.id), 0) + 1,
      capital: capital,
      tasaInteres: parseFloat(nuevoCliente.tasaInteres),
      plazoMeses: meses,
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      totalCobrar: Math.round(totalCobrar * 100) / 100,
      saldoPendiente: Math.round(totalCobrar * 100) / 100,
      pagosRecibidos: 0,
      estado: 'En Proceso',
      historialPagos: []
    };
    
   const nuevosClientes = [...prev, clienteConId];

    // 💾 GUARDADO MANUAL INMEDIATO
    setTimeout(async () => {
      try {
        await guardarEnFirebase(nuevosClientes, misDeudas, misInversiones);
        console.log('✅ Cliente guardado manualmente');
      } catch (error) {
        console.error('❌ Error guardado manual:', error);
      }
    }, 100);

    return nuevosClientes;
  });
}, []);
  const agregarDeuda = useCallback((nuevaDeuda) => {
  setMisDeudas(prev => {
    // Calcular cuota mensual y total a pagar
    const capital = parseFloat(nuevaDeuda.capital);
    const tasa = parseFloat(nuevaDeuda.tasaInteres) / 100;
    const meses = parseInt(nuevaDeuda.plazoMeses);
    
    let cuotaMensual = 0;
    if (tasa > 0) {
      // Fórmula de cuota mensual con interés
      const tasaMensual = tasa / 12;
      cuotaMensual = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    } else {
      // Sin interés, solo dividir el capital
      cuotaMensual = capital / meses;
    }
    
    const deudaConId = {
      ...nuevaDeuda,
      id: Math.max(...prev.map(d => d.id), 0) + 1,
      capital: capital,
      tasaInteres: parseFloat(nuevaDeuda.tasaInteres),
      plazoMeses: meses,
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      saldoPendiente: capital,
      totalPagado: 0,
      estado: 'Activo',
      historialPagos: []
    };
    
    return [...prev, deudaConId];
  });
}, []);
  // Función para generar alertas automáticas
const generarAlertasVencimiento = useCallback(() => {
  const hoy = new Date();
  const nuevasAlertas = [];
  
  // LIMPIAR ALERTAS ANTIGUAS DE DEUDAS PRIMERO
  setAlertas(prev => prev.filter(a => 
    !['deuda_vencimiento', 'deuda_vencida'].includes(a.tipo)
  ));
  
  misDeudas.forEach(deuda => {
    if (deuda.estado === 'Activo') {
      const fechaVencimiento = new Date(deuda.proximoVencimiento);
      const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      
      // 📅 ALERTA 7 DÍAS ANTES
      if (diasRestantes <= 7 && diasRestantes > 3) {
        nuevasAlertas.push({
          id: `deuda-7d-${deuda.id}`,
          mensaje: `⚠️ Pago de ${deuda.acreedor} vence en ${diasRestantes} días - S/ ${deuda.cuotaMensual.toLocaleString()}`,
          urgencia: 'media',
          tipo: 'deuda_vencimiento',
          activa: true,
          deudaId: deuda.id
        });
      }
      
      // 🔥 ALERTA 3 DÍAS ANTES
      if (diasRestantes <= 3 && diasRestantes > 0) {
        nuevasAlertas.push({
          id: `deuda-3d-${deuda.id}`,
          mensaje: `🚨 Pago de ${deuda.acreedor} vence en ${diasRestantes} días - S/ ${deuda.cuotaMensual.toLocaleString()}`,
          urgencia: 'alta',
          tipo: 'deuda_vencimiento',
          activa: true,
          deudaId: deuda.id
        });
      }
      
      // 🔴 ALERTA HOY
      if (diasRestantes === 0) {
        nuevasAlertas.push({
          id: `deuda-hoy-${deuda.id}`,
          mensaje: `🚨 ¡PAGAR HOY! ${deuda.acreedor} - S/ ${deuda.cuotaMensual.toLocaleString()}`,
          urgencia: 'alta',
          tipo: 'deuda_vencimiento',
          activa: true,
          deudaId: deuda.id
        });
      }
      
      // 🚨 ALERTA VENCIDA
      if (diasRestantes < 0) {
        nuevasAlertas.push({
          id: `deuda-vencida-${deuda.id}`,
          mensaje: `🚨 ¡URGENTE! ${deuda.acreedor} venció hace ${Math.abs(diasRestantes)} días - S/ ${deuda.cuotaMensual.toLocaleString()}`,
          urgencia: 'alta',
          tipo: 'deuda_vencida',
          activa: true,
          deudaId: deuda.id
        });
      }
    }
  });
  
  // AGREGAR NUEVAS ALERTAS
  if (nuevasAlertas.length > 0) {
    setAlertas(prev => [...prev, ...nuevasAlertas]);
    console.log(`🔔 ${nuevasAlertas.length} alertas de deudas generadas`);
  }
}, [misDeudas]);

// ✅ AGREGA esto DESPUÉS de la función anterior
// Ejecutar alertas cada vez que cambien las deudas Y clientes

  // 🔥 FUNCIÓN PARA CALCULAR PRÓXIMA FECHA DE COBRO
const calcularProximaFechaCobro = (fechaInicio, numerosPagosRealizados) => {
  const fechaInicioParsed = new Date(fechaInicio);
  const hoy = new Date();
  
  // Calcular próxima fecha basada en meses reales
  const proximaFecha = new Date(fechaInicioParsed);
  proximaFecha.setMonth(proximaFecha.getMonth() + numerosPagosRealizados + 1);
  
  // Si la fecha calculada ya pasó, mover al siguiente mes
  if (proximaFecha < hoy && numerosPagosRealizados === 0) {
    proximaFecha.setMonth(proximaFecha.getMonth() + 1);
  }
  
  return proximaFecha;
};

// 🔥 FUNCIÓN PRINCIPAL PARA GENERAR ALERTAS DE COBRANZA MEJORADA
const generarAlertasCobranza = useCallback(() => {
  const hoy = new Date();
  const nuevasAlertas = [];
  
  // LIMPIAR ALERTAS ANTIGUAS DE CLIENTES PRIMERO
  setAlertas(prev => prev.filter(a => 
    !['cobro_preventivo', 'cobro_proximo', 'cobro_hoy', 'cobro_retrasado'].includes(a.tipo)
  ));
  
  misClientes.forEach(cliente => {
    if (cliente.estado === 'En Proceso') {
      const numerosPagosRealizados = cliente.historialPagos?.length || 0;
      
      // 🗓️ CALCULAR PRÓXIMA FECHA DE COBRO MENSUAL
      const proximaFechaCobro = calcularProximaFechaCobro(cliente.fechaInicio, numerosPagosRealizados);
      
      // 📅 CALCULAR DÍAS RESTANTES
      const diasRestantes = Math.ceil((proximaFechaCobro - hoy) / (1000 * 60 * 60 * 24));
      
      // 📊 ALERTA 15 DÍAS ANTES (PLANIFICACIÓN)
      if (diasRestantes <= 15 && diasRestantes > 7) {
        nuevasAlertas.push({
          id: `cliente-15d-${cliente.id}`,
          mensaje: `📊 Planificación: Cobro de ${cliente.nombre} programado para el ${proximaFechaCobro.toLocaleDateString()} (en ${diasRestantes} días) - S/ ${cliente.cuotaMensual.toLocaleString()}`,
          urgencia: 'baja',
          tipo: 'cobro_preventivo',
          activa: true,
          clienteId: cliente.id,
          fechaCobro: proximaFechaCobro.toISOString().split('T')[0]
        });
      }
      
      // 📅 ALERTA 7 DÍAS ANTES
      if (diasRestantes <= 7 && diasRestantes > 3) {
        nuevasAlertas.push({
          id: `cliente-7d-${cliente.id}`,
          mensaje: `📋 Recordatorio: Cobro de ${cliente.nombre} en ${diasRestantes} días (${proximaFechaCobro.toLocaleDateString()}) - S/ ${cliente.cuotaMensual.toLocaleString()}`,
          urgencia: 'baja',
          tipo: 'cobro_preventivo',
          activa: true,
          clienteId: cliente.id,
          fechaCobro: proximaFechaCobro.toISOString().split('T')[0]
        });
      }
      
      // ⚠️ ALERTA 3 DÍAS ANTES
      if (diasRestantes <= 3 && diasRestantes > 0) {
        nuevasAlertas.push({
          id: `cliente-3d-${cliente.id}`,
          mensaje: `⚠️ Cobro próximo: ${cliente.nombre} - ${diasRestantes} días (${proximaFechaCobro.toLocaleDateString()}) - S/ ${cliente.cuotaMensual.toLocaleString()}`,
          urgencia: 'media',
          tipo: 'cobro_proximo',
          activa: true,
          clienteId: cliente.id,
          fechaCobro: proximaFechaCobro.toISOString().split('T')[0]
        });
      }
      
      // 🔥 ALERTA HOY
      if (diasRestantes === 0) {
        nuevasAlertas.push({
          id: `cliente-hoy-${cliente.id}`,
          mensaje: `🔥 ¡COBRAR HOY! ${cliente.nombre} - Cuota mensual vence hoy (${proximaFechaCobro.toLocaleDateString()}) - S/ ${cliente.cuotaMensual.toLocaleString()}`,
          urgencia: 'alta',
          tipo: 'cobro_hoy',
          activa: true,
          clienteId: cliente.id,
          fechaCobro: proximaFechaCobro.toISOString().split('T')[0]
        });
      }
      
      // 🚨 ALERTA MOROSO (RETRASADO)
      if (diasRestantes < 0) {
        const diasRetraso = Math.abs(diasRestantes);
        nuevasAlertas.push({
          id: `cliente-moroso-${cliente.id}`,
          mensaje: `🚨 ¡MOROSO! ${cliente.nombre} lleva ${diasRetraso} días de retraso desde ${proximaFechaCobro.toLocaleDateString()} - S/ ${cliente.cuotaMensual.toLocaleString()}`,
          urgencia: 'alta',
          tipo: 'cobro_retrasado',
          activa: true,
          clienteId: cliente.id,
          diasRetraso: diasRetraso,
          fechaCobro: proximaFechaCobro.toISOString().split('T')[0]
        });
      }
    }
  });
  
  // AGREGAR NUEVAS ALERTAS
  if (nuevasAlertas.length > 0) {
    setAlertas(prev => [...prev, ...nuevasAlertas]);
    console.log(`🔔 ${nuevasAlertas.length} alertas de clientes generadas`);
  }
}, [misClientes]);
  
// 🔥 FUNCIÓN PARA MOSTRAR PRÓXIMAS FECHAS DE COBRO
const obtenerProximasFechasCobro = useCallback(() => {
  return misClientes
    .filter(cliente => cliente.estado === 'En Proceso')
    .map(cliente => {
      const numerosPagosRealizados = cliente.historialPagos?.length || 0;
      const proximaFecha = calcularProximaFechaCobro(cliente.fechaInicio, numerosPagosRealizados);
      const diasRestantes = Math.ceil((proximaFecha - new Date()) / (1000 * 60 * 60 * 24));
      
      return {
        clienteId: cliente.id,
        nombre: cliente.nombre,
        proximaFecha: proximaFecha.toISOString().split('T')[0],
        diasRestantes: diasRestantes,
        monto: cliente.cuotaMensual,
        estado: diasRestantes < 0 ? 'retrasado' : diasRestantes === 0 ? 'hoy' : 'proximo'
      };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}, [misClientes]);
  
// 🔥 FUNCIÓN PARA LIMPIAR ALERTAS CUANDO SE REGISTRA UN PAGO
const limpiarAlertasClientePagado = useCallback((clienteId) => {
  setAlertas(prev => prev.filter(alerta => 
    !(alerta.clienteId === clienteId && 
      ['cobro_preventivo', 'cobro_proximo', 'cobro_hoy', 'cobro_retrasado'].includes(alerta.tipo))
  ));
}, []);
 // ✅ SISTEMA DE ALERTAS COMPLETO ACTIVADO
useEffect(() => {
  if (misDeudas.length > 0 || misClientes.length > 0) {
    console.log('🔔 Generando alertas automáticas...');
    generarAlertasVencimiento();    // Alertas de deudas
    generarAlertasCobranza();       // Alertas de clientes morosos
  }
}, [misDeudas, misClientes, generarAlertasVencimiento, generarAlertasCobranza]);
  
// 🕐 INICIAR SNAPSHOTS AUTOMÁTICOS
useEffect(() => {
  if (datosInicializados.current) {
    const obtenerDatos = () => ({
      clientes: misClientes,
      deudas: misDeudas, 
      inversiones: misInversiones
    });
    
    const { cleanup } = iniciarSnapshotsAutomaticos(obtenerDatos);
    
    return cleanup;
  }
}, [misClientes, misDeudas, misInversiones, datosInicializados]);

// 🛡️ SNAPSHOT DE PROTECCIÓN AL ELIMINAR
const eliminarClienteConProteccion = useCallback(async (clienteId) => {
  await crearSnapshotProteccion(misClientes, misDeudas, misInversiones, 'antes_eliminar_cliente');
  eliminarCliente(clienteId);
}, [misClientes, misDeudas, misInversiones, eliminarCliente]);

const eliminarDeudaConProteccion = useCallback(async (deudaId) => {
  await crearSnapshotProteccion(misClientes, misDeudas, misInversiones, 'antes_eliminar_deuda');
  eliminarDeuda(deudaId);
}, [misClientes, misDeudas, misInversiones, eliminarDeuda]);
  
  return {
    // Estados
    misClientes,
    misDeudas,
    misInversiones,
    agregarInversion,
    actualizarGanancias,
    editarInversion,
    eliminarInversion,
    alertas,
    firebaseConectado,
    cambiosRemotos,
    
    // Cálculos
    totalPorCobrar,
    totalPorPagar,
    balanceNeto,
    recursosDisponibles,
    cobertura,
    
    // Acciones
    registrarPagoCliente,
    pagarDeuda,
    eliminarCliente,
    eliminarDeuda,
    eliminarPagoHistorial,
    eliminarPagoHistorialDeuda,
    eliminarAlerta,
    eliminarRegistroGanancia,
    agregarCliente,
    agregarDeuda,
    
    // 🆕 NUEVAS FUNCIONES DE ALERTAS
    obtenerProximasFechasCobro,      
    limpiarAlertasClientePagado, 
    
    // Setters directos (para casos especiales)
    setMisClientes,
    setMisDeudas,
    setAlertas,
    // 🆕 NUEVAS PROPIEDADES PARA FIREBASE
    cargandoDatos,
    guardandoEnNube,
    errorConexion,
    ultimoGuardadoNube,
    guardarEnFirebase,
    cargarDatosIniciales,
    // 🆕 FUNCIONES DE HISTORIAL
    eliminarClienteConProteccion,
    eliminarDeudaConProteccion,
    crearSnapshotManual: () => guardarSnapshot(misClientes, misDeudas, misInversiones, 'manual')
  };
};

export default useFinancialData;
