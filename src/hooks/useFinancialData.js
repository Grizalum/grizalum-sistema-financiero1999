import { useState, useCallback } from 'react';
import firebaseService from './firebaseService';

const useFinancialData = () => {
  // Estados principales - SOLO LO ESENCIAL
  const [misClientes, setMisClientes] = useState([]);
  const [misDeudas, setMisDeudas] = useState([]);
  const [misInversiones, setMisInversiones] = useState([]);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [guardandoEnNube, setGuardandoEnNube] = useState(false);

  // 🔥 GUARDADO MANUAL SOLAMENTE
  const guardarEnFirebase = useCallback(async (clientes = misClientes, deudas = misDeudas, inversiones = misInversiones) => {
    if (clientes.length === 0 && deudas.length === 0 && inversiones.length === 0) {
      return { success: false, message: 'No hay datos para guardar' };
    }

    setGuardandoEnNube(true);
    
    try {
      const resultado = await firebaseService.guardarDatos(clientes, deudas, inversiones);
      
      if (resultado.success) {
        setFirebaseConectado(true);
        console.log('✅ Guardado exitoso');
      } else {
        setFirebaseConectado(false);
      }
      
      return resultado;
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setFirebaseConectado(false);
      return { success: false, message: error.message };
    } finally {
      setGuardandoEnNube(false);
    }
  }, [misClientes, misDeudas, misInversiones]);

  // Funciones básicas de gestión
  const agregarCliente = useCallback((nuevoCliente) => {
    setMisClientes(prev => {
      const capital = parseFloat(nuevoCliente.capital);
      const tasa = parseFloat(nuevoCliente.tasaInteres) / 100;
      const meses = parseInt(nuevoCliente.plazoMeses);
      
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
      const capital = parseFloat(nuevaDeuda.capital);
      const tasa = parseFloat(nuevaDeuda.tasaInteres) / 100;
      const meses = parseInt(nuevaDeuda.plazoMeses);
      
      let cuotaMensual = 0;
      if (tasa > 0) {
        const tasaMensual = tasa / 12;
        cuotaMensual = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
      } else {
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

  const registrarPagoCliente = useCallback((clienteId, monto, fecha) => {
    setMisClientes(prev => prev.map(cliente => {
      if (cliente.id === clienteId) {
        const nuevoSaldo = Math.max(0, cliente.saldoPendiente - monto);
        const nuevoPagado = cliente.pagosRecibidos + monto;
        
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
        
        const nuevoId = deuda.historialPagos?.length > 0 
          ? Math.max(...deuda.historialPagos.map(p => p.id)) + 1 
          : 1;
        
        const nuevoPago = {
          id: nuevoId,
          fecha: fecha || new Date().toISOString().split('T')[0],
          monto: Math.round(monto * 100) / 100,
          tipo: monto >= deuda.cuotaMensual ? 'Cuota Regular' : 'Pago Parcial'
        };

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

  // Estados simples para alertas
  const [alertas, setAlertas] = useState([]);
  const eliminarAlerta = useCallback((alertaId) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
  }, []);

  // Cálculos básicos
  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const recursosDisponibles = totalPorCobrar + misInversiones.reduce((acc, i) => acc + i.gananciaActual, 0);
  const cobertura = totalPorPagar > 0 ? (recursosDisponibles / totalPorPagar) * 100 : 100;

  return {
    // Estados
    misClientes,
    misDeudas,
    misInversiones,
    alertas,
    firebaseConectado,
    guardandoEnNube,
    
    // Cálculos
    totalPorCobrar,
    totalPorPagar,
    balanceNeto,
    recursosDisponibles,
    cobertura,
    
    // Acciones
    agregarCliente,
    agregarDeuda,
    agregarInversion,
    registrarPagoCliente,
    pagarDeuda,
    eliminarCliente,
    eliminarDeuda,
    actualizarGanancias,
    editarInversion,
    eliminarAlerta,
    guardarEnFirebase,
    
    // Setters directos
    setMisClientes,
    setMisDeudas,
    setAlertas
  };
};

export default useFinancialData;
