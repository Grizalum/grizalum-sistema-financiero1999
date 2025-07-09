import { useState, useEffect, useCallback } from 'react';
import firebaseService from './firebaseService';
const useFinancialData = () => {
// Hook personalizado para manejar toda la lógica financiera
  // Estados principales
  const [misClientes, setMisClientes] = useState([]);
  const [misDeudas, setMisDeudas] = useState([]);
  const [misInversiones, setMisInversiones] = useState([]);

   // 🔄 ESTADOS PARA FIREBASE
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardandoEnNube, setGuardandoEnNube] = useState(false);
  const [errorConexion, setErrorConexion] = useState(null);
  const [ultimoGuardadoNube, setUltimoGuardadoNube] = useState(null);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [cambiosRemotos, setCambiosRemotos] = useState(false);
  
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
      fechaInicio: nuevaInversion.fechaInicio
    };
    
    setMisInversiones(prev => [...prev, inversion]);
  }, []);

  const actualizarGanancias = useCallback((id, nuevaGanancia) => {
    setMisInversiones(prev => prev.map(inv => {
      if (inv.id === id) {
        const gananciaActual = parseFloat(nuevaGanancia);
        const roi = ((gananciaActual / inv.inversion) * 100);
        const progreso = Math.min((gananciaActual / inv.gananciaEsperada) * 100, 100);
        const estado = progreso >= 100 ? 'Completado' : 'En Proceso';
        
        return {
          ...inv,
          gananciaActual,
          roi: Math.round(roi * 10) / 10,
          progreso: Math.round(progreso),
          estado
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
        const roi = ((inv.gananciaActual / inversionActualizada) * 100);
        const progreso = Math.min((inv.gananciaActual / gananciaEsperada) * 100, 100);
        
        return {
          ...inv,
          nombre: datosActualizados.nombre,
          descripcion: datosActualizados.descripcion,
          tipo: datosActualizados.tipo,
          inversion: inversionActualizada,
          gananciaEsperada,
          roi: Math.round(roi * 10) / 10,
          progreso: Math.round(progreso)
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
  setCargandoDatos(true);
  
  try {
    console.log('🚀 Iniciando carga de datos...');
    const resultado = await firebaseService.cargarDatos();
    
    if (resultado.success && resultado.datos) {
      console.log('✅ Cargando datos REALES desde Firebase');
      setMisClientes(resultado.datos.clientes);
      setMisDeudas(resultado.datos.deudas);
      setMisInversiones(resultado.datos.inversiones);
      setFirebaseConectado(true);
    } else {
      console.log('📝 Primera vez - creando datos iniciales');
      const datosIniciales = [
        {
          id: 1,
          nombre: 'Antonio Rodriguez',
          email: 'antonio@example.com',
          telefono: '+51 999 123 456',
          capital: 10000,
          tasaInteres: 14,
          plazoMeses: 18,
          cuotaMensual: 633.30,
          totalCobrar: 11399.40,
          saldoPendiente: 8000.00,
          pagosRecibidos: 3399.40,
          estado: 'En Proceso',
          fechaInicio: '2024-06-01',
          historialPagos: []
        }
      ];
      
      setMisClientes(datosIniciales);
      await firebaseService.guardarDatos(datosIniciales, [], []);
      setFirebaseConectado(true);
    }
    
  } catch (error) {
    console.error('❌ Error al cargar:', error);
    setErrorConexion('Error al cargar datos');
    setFirebaseConectado(false);
  } finally {
    setCargandoDatos(false);
  }
}, []);
  
const guardarEnFirebase = useCallback(async (clientes = misClientes, deudas = misDeudas, inversiones = misInversiones) => {
  setGuardandoEnNube(true);
  setErrorConexion(null);
  
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
  
// 🚀 CARGAR DATOS AL INICIAR
useEffect(() => {
  cargarDatosIniciales();
}, [cargarDatosIniciales]);

// 🔄 AUTOSAVE RÁPIDO - 1 SEGUNDO
useEffect(() => {
  if (!cargandoDatos && !guardandoEnNube && (misClientes.length > 0 || misDeudas.length > 0)) {
    const timeout = setTimeout(async () => {
      console.log('💾 Guardando automáticamente...');
      const resultado = await guardarEnFirebase();
      if (resultado.success) {
        console.log('✅ Guardado exitoso');
      }
    }, 1000); // ← 1 segundo para guardar
    
    return () => clearTimeout(timeout);
  }
}, [misClientes, misDeudas, misInversiones, cargandoDatos, guardandoEnNube, guardarEnFirebase]);

// 🔄 SINCRONIZACIÓN MÁS LENTA - 5 SEGUNDOS
useEffect(() => {
  if (!cargandoDatos) {
    const interval = setInterval(async () => {
      // ⚠️ NO RECARGAR SI ESTAMOS GUARDANDO
      if (!guardandoEnNube) {
        console.log('🔄 Verificando cambios remotos...');
        
        try {
          const resultado = await firebaseService.cargarDatos();
          
          if (resultado.success && resultado.datos) {
            console.log('📥 Datos desde Firebase verificados');
            
            // ✅ SOLO ACTUALIZAR SI HAY DIFERENCIAS REALES
            const clientesFirebase = JSON.stringify(resultado.datos.clientes || []);
            const clientesLocales = JSON.stringify(misClientes);
            
            if (clientesFirebase !== clientesLocales) {
              console.log('📱 Actualizando clientes desde otro usuario');
              setMisClientes(resultado.datos.clientes || []);
            }
            
            const deudasFirebase = JSON.stringify(resultado.datos.deudas || []);
            const deudasLocales = JSON.stringify(misDeudas);
            
            if (deudasFirebase !== deudasLocales) {
              console.log('💳 Actualizando deudas desde otro usuario');
              setMisDeudas(resultado.datos.deudas || []);
            }
            
            const inversionesFirebase = JSON.stringify(resultado.datos.inversiones || []);
            const inversionesLocales = JSON.stringify(misInversiones);
            
            if (inversionesFirebase !== inversionesLocales) {
              console.log('💰 Actualizando inversiones desde otro usuario');
              setMisInversiones(resultado.datos.inversiones || []);
            }
            
            setFirebaseConectado(true);
          }
        } catch (error) {
          console.error('❌ Error:', error);
          setFirebaseConectado(false);
        }
      } else {
        console.log('⏳ Esperando... guardado en progreso');
      }
    }, 5000); // ← 5 segundos para verificar cambios
    
    return () => clearInterval(interval);
  }
}, [cargandoDatos, guardandoEnNube, misClientes, misDeudas, misInversiones]);

// 🔄 VERIFICAR CONEXIÓN
useEffect(() => {
  const verificarConexion = async () => {
    const conectado = await firebaseService.verificarConexion();
    setFirebaseConectado(conectado);
  };
  
  const interval = setInterval(verificarConexion, 30000);
  return () => clearInterval(interval);
}, []);
  
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      mensaje: 'Pago de Antonio Rodriguez vence en 3 dias',
      urgencia: 'media',
      tipo: 'pago_pendiente',
      activa: true
    },
    {
      id: 2,
      mensaje: 'Cuota BCP vence mañana',
      urgencia: 'alta',
      tipo: 'deuda_vencimiento',
      activa: true
    }
  ]);

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
    
    return [...prev, clienteConId];
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
  
  misDeudas.forEach(deuda => {
    if (deuda.estado === 'Activo') {
      const fechaVencimiento = new Date(deuda.proximoVencimiento);
      const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      
      // Alerta 5 días antes del vencimiento
      if (diasRestantes <= 5 && diasRestantes > 0) {
        const alertaExistente = alertas.find(a => 
          a.tipo === 'deuda_vencimiento' && 
          a.mensaje.includes(deuda.acreedor)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random(),
            mensaje: `Pago de ${deuda.acreedor} vence en ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}`,
            urgencia: diasRestantes <= 2 ? 'alta' : 'media',
            tipo: 'deuda_vencimiento',
            activa: true
          });
        }
      }
      
      // Alerta si ya venció
      if (diasRestantes < 0) {
        const alertaExistente = alertas.find(a => 
          a.tipo === 'deuda_vencida' && 
          a.mensaje.includes(deuda.acreedor)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random() + 1,
            mensaje: `¡URGENTE! Pago de ${deuda.acreedor} venció hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) > 1 ? 's' : ''}`,
            urgencia: 'alta',
            tipo: 'deuda_vencida',
            activa: true
          });
        }
      }
    }
  });
  
  if (nuevasAlertas.length > 0) {
    setAlertas(prev => [...prev, ...nuevasAlertas]);
  }
}, [misDeudas, alertas]);

// ✅ AGREGA esto DESPUÉS de la función anterior
// Ejecutar alertas cada vez que cambien las deudas Y clientes

  // 🔥 FUNCIÓN PARA CALCULAR PRÓXIMA FECHA DE COBRO
const calcularProximaFechaCobro = (fechaInicio, numerosPagosRealizados) => {
  const fecha = new Date(fechaInicio);
  fecha.setMonth(fecha.getMonth() + numerosPagosRealizados + 1);
  return fecha;
};

// 🔥 FUNCIÓN PRINCIPAL PARA GENERAR ALERTAS DE COBRANZA
const generarAlertasCobranza = useCallback(() => {
  const hoy = new Date();
  const nuevasAlertas = [];
  
  misClientes.forEach(cliente => {
    if (cliente.estado === 'En Proceso') {
      const numerosPagosRealizados = cliente.historialPagos?.length || 0;
      const proximaFechaCobro = calcularProximaFechaCobro(cliente.fechaInicio, numerosPagosRealizados);
      const diasRestantes = Math.ceil((proximaFechaCobro - hoy) / (1000 * 60 * 60 * 24));
      
      // ✅ ALERTAS PREVENTIVAS (7 días antes)
      if (diasRestantes <= 7 && diasRestantes > 3) {
        const alertaExistente = alertas.find(a => 
          a.tipo === 'cobro_preventivo' && 
          a.mensaje.includes(cliente.nombre)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random(),
            mensaje: `Recordatorio: Cobro de ${cliente.nombre} en ${diasRestantes} días - S/ ${cliente.cuotaMensual.toLocaleString()}`,
            urgencia: 'baja',
            tipo: 'cobro_preventivo',
            activa: true,
            clienteId: cliente.id,
            fechaEsperada: proximaFechaCobro.toISOString().split('T')[0]
          });
        }
      }
      
      // ⚠️ ALERTAS CERCANAS (3 días antes)
      if (diasRestantes <= 3 && diasRestantes > 0) {
        const alertaExistente = alertas.find(a => 
          a.tipo === 'cobro_proximo' && 
          a.mensaje.includes(cliente.nombre)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random() + 1,
            mensaje: `Cobro próximo: ${cliente.nombre} - ${diasRestantes} día${diasRestantes > 1 ? 's' : ''} - S/ ${cliente.cuotaMensual.toLocaleString()}`,
            urgencia: 'media',
            tipo: 'cobro_proximo',
            activa: true,
            clienteId: cliente.id,
            fechaEsperada: proximaFechaCobro.toISOString().split('T')[0]
          });
        }
      }
      
      // 🚨 ALERTAS URGENTES (hoy es el día)
      if (diasRestantes === 0) {
        const alertaExistente = alertas.find(a => 
          a.tipo === 'cobro_hoy' && 
          a.mensaje.includes(cliente.nombre)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random() + 2,
            mensaje: `¡HOY! Cobrar a ${cliente.nombre} - S/ ${cliente.cuotaMensual.toLocaleString()}`,
            urgencia: 'alta',
            tipo: 'cobro_hoy',
            activa: true,
            clienteId: cliente.id,
            fechaEsperada: proximaFechaCobro.toISOString().split('T')[0]
          });
        }
      }
      
      // 🔴 ALERTAS DE RETRASO (después de la fecha)
      if (diasRestantes < 0) {
        const diasRetraso = Math.abs(diasRestantes);
        const alertaExistente = alertas.find(a => 
          a.tipo === 'cobro_retrasado' && 
          a.mensaje.includes(cliente.nombre)
        );
        
        if (!alertaExistente) {
          nuevasAlertas.push({
            id: Date.now() + Math.random() + 3,
            mensaje: `¡RETRASO! ${cliente.nombre} debe ${diasRetraso} día${diasRetraso > 1 ? 's' : ''} - S/ ${cliente.cuotaMensual.toLocaleString()}`,
            urgencia: 'alta',
            tipo: 'cobro_retrasado',
            activa: true,
            clienteId: cliente.id,
            fechaEsperada: proximaFechaCobro.toISOString().split('T')[0],
            diasRetraso: diasRetraso
          });
        }
      }
    }
  });
  
  if (nuevasAlertas.length > 0) {
    setAlertas(prev => [...prev, ...nuevasAlertas]);
  }
}, [misClientes, alertas]);
  
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
  useEffect(() => {
  generarAlertasVencimiento();
  generarAlertasCobranza();    
}, [misDeudas, misClientes]); 

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
  };
};

export default useFinancialData;
