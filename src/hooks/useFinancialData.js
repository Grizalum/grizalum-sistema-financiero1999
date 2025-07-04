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
      saldoPendiente: 45000.00,
      estado: 'Activo',
      fechaInicio: '2024-01-01',
      proximoVencimiento: '2025-01-01'
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
      estado: 'Activo',
      fechaInicio: '2024-08-01',
      proximoVencimiento: '2024-12-15'
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
        
        const nuevoPago = {
          id: (cliente.historialPagos?.length || 0) + 1,
          fecha: fecha,
          monto: monto,
          tipo: monto >= cliente.cuotaMensual ? 'Cuota Regular' : 'Pago Parcial'
        };

        return {
          ...cliente,
          saldoPendiente: nuevoSaldo,
          pagosRecibidos: nuevoPagado,
          estado: nuevoSaldo === 0 ? 'Completado' : 'En Proceso',
          historialPagos: [...(cliente.historialPagos || []), nuevoPago]
        };
      }
      return cliente;
    }));
  }, []);

  const pagarDeuda = useCallback((deudaId, monto) => {
    setMisDeudas(prev => prev.map(deuda => {
      if (deuda.id === deudaId) {
        const nuevoSaldo = Math.max(0, deuda.saldoPendiente - monto);
        
        return {
          ...deuda,
          saldoPendiente: nuevoSaldo,
          estado: nuevoSaldo === 0 ? 'Pagado' : 'Activo'
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
          return {
            ...cliente,
            historialPagos: cliente.historialPagos.filter(p => p.id !== pagoId),
            pagosRecibidos: cliente.pagosRecibidos - pagoEliminado.monto,
            saldoPendiente: cliente.saldoPendiente + pagoEliminado.monto,
            estado: cliente.saldoPendiente + pagoEliminado.monto > 0 ? 'En Proceso' : cliente.estado
          };
        }
      }
      return cliente;
    }));
  }, []);

  const eliminarAlerta = useCallback((alertaId) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
  }, []);

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
    eliminarAlerta,
    
    // Setters directos (para casos especiales)
    setMisClientes,
    setMisDeudas,
    setAlertas
  };
};

export default useFinancialData;


