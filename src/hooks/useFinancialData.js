
import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para manejar toda la lógica financiera
const useFinancialData = () => {
  // Estados principales
  const [misClientes, setMisClientes] = useState([
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
      historialPagos: [
        { id: 1, fecha: '2024-07-01', monto: 633.30, tipo: 'Cuota Regular' },
        { id: 2, fecha: '2024-08-01', monto: 633.30, tipo: 'Cuota Regular' },
        { id: 3, fecha: '2024-09-01', monto: 633.30, tipo: 'Cuota Regular' }
      ]
    },
    {
      id: 2,
      nombre: 'Maria Gonzalez',
      email: 'maria@example.com',
      telefono: '+51 987 654 321',
      capital: 15000,
      tasaInteres: 12,
      plazoMeses: 18,
      cuotaMensual: 950.00,
      totalCobrar: 17100.00,
      saldoPendiente: 12000.00,
      pagosRecibidos: 5100.00,
      estado: 'En Proceso',
      fechaInicio: '2024-05-15',
      historialPagos: [
        { id: 1, fecha: '2024-06-15', monto: 950.00, tipo: 'Cuota Regular' },
        { id: 2, fecha: '2024-07-15', monto: 950.00, tipo: 'Cuota Regular' },
        { id: 3, fecha: '2024-08-15', monto: 500.00, tipo: 'Pago Parcial' }
      ]
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
  {
    id: 1,
    acreedor: 'Banco Santander',
    descripcion: 'Prestamo comercial para capital de trabajo',
    capital: 50000,
    tasaInteres: 18,
    plazoMeses: 24,
    cuotaMensual: 2500.00,
    saldoPendiente: 42500.00,
    totalPagado: 7500.00, // ✅ NUEVO
    estado: 'Activo',
    fechaInicio: '2024-01-01',
    proximoVencimiento: '2025-01-01',
    // ✅ NUEVO: Agregar historial de pagos
    historialPagos: [
      { id: 1, fecha: '2024-02-01', monto: 2500.00, tipo: 'Cuota Regular' },
      { id: 2, fecha: '2024-03-01', monto: 2500.00, tipo: 'Cuota Regular' },
      { id: 3, fecha: '2024-04-01', monto: 2500.00, tipo: 'Cuota Regular' }
    ]
  },
  {
    id: 2,
    acreedor: 'Proveedor Textil SAC',
    descripcion: 'Compra de mercaderia a credito',
    capital: 8000,
    tasaInteres: 0,
    plazoMeses: 10,
    cuotaMensual: 800.00,
    saldoPendiente: 6400.00,
    totalPagado: 1600.00, // ✅ NUEVO
    estado: 'Activo',
    fechaInicio: '2024-08-01',
    proximoVencimiento: '2024-12-15',
    // ✅ NUEVO: Agregar historial de pagos
    historialPagos: [
      { id: 1, fecha: '2024-09-01', monto: 800.00, tipo: 'Cuota Regular' },
      { id: 2, fecha: '2024-10-01', monto: 800.00, tipo: 'Cuota Regular' }
    ]
  }
]);
  const [misInversiones] = useState([
    {
      id: 1,
      nombre: 'Maquina Soldadora Industrial',
      descripcion: 'Maquina profesional para metalurgia',
      tipo: 'Maquinaria',
      inversion: 12000,
      gananciaEsperada: 2500,
      gananciaActual: 1625,
      estado: 'En Proceso',
      roi: 13.5,
      progreso: 65
    },
    {
      id: 2,
      nombre: 'Local Comercial Centro',
      descripcion: 'Alquiler de local estrategico',
      tipo: 'Inmueble',
      inversion: 25000,
      gananciaEsperada: 5000,
      gananciaActual: 3750,
      estado: 'En Proceso',
      roi: 15.0,
      progreso: 75
    }
  ]);

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
// Ejecutar alertas cada vez que cambien las deudas
useEffect(() => {
  generarAlertasVencimiento();
}, [misDeudas, generarAlertasVencimiento]);
  // Simulación de conexión
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFirebaseConectado(Math.random() > 0.1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return {
    // Estados
    misClientes,
    misDeudas,
    misInversiones,
    alertas,
    firebaseConectado,
    
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
    
    // Setters directos (para casos especiales)
    setMisClientes,
    setMisDeudas,
    setAlertas,
  };
};

export default useFinancialData;
