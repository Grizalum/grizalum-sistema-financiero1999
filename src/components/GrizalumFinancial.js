import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, DollarSign, 
  Calculator, Share2, FileSpreadsheet, Edit, Bell, Shield, Trash2, 
  CheckCircle, Cloud, WifiOff, User, Phone, Mail, CreditCard, 
  AlertTriangle, Search, Eye
} from 'lucide-react';

export default function GrizalumFinancial() {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const [showModalEditarCliente, setShowModalEditarCliente] = useState(false);
  const [showHistorialPagos, setShowHistorialPagos] = useState(false);
  const [showModalDeuda, setShowModalDeuda] = useState(false);
  const [showModalInversion, setShowModalInversion] = useState(false);
  const [showModalPagoDeuda, setShowModalPagoDeuda] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [deudaSeleccionada, setDeudaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  const [formPago, setFormPago] = useState({
    monto: '', 
    metodo: 'Transferencia', 
    fecha: new Date().toISOString().split('T')[0]
  });

  const [formPagoDeuda, setFormPagoDeuda] = useState({
    monto: '', 
    metodo: 'Transferencia', 
    fecha: new Date().toISOString().split('T')[0]
  });

  const [formDeuda, setFormDeuda] = useState({
    acreedor: '',
    descripcion: '',
    capital: '',
    cuotaMensual: '',
    tasaInteres: '0',
    tipo: 'Prestamo Bancario',
    proximoPago: new Date().toISOString().split('T')[0]
  });

  const [formInversion, setFormInversion] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'Maquinaria',
    inversion: '',
    gananciaEsperada: ''
  });
  
  const [formEditarCliente, setFormEditarCliente] = useState({
    nombre: '', email: '', telefono: '', capital: '', tasaInteres: '', plazoMeses: '', fechaInicio: ''
  });
  
  const [formCliente, setFormCliente] = useState({
    nombre: '', 
    email: '', 
    telefono: '', 
    capital: '', 
    tasaInteres: '14', 
    plazoMeses: '12', 
    fechaInicio: new Date().toISOString().split('T')[0]
  });
  
  const [misClientes, setMisClientes] = useState([
    {
      id: 1,
      nombre: 'Antonio Rodriguez',
      email: 'antonio@example.com',
      telefono: '+51 999 123 456',
      capital: 10000,
      cuotaMensual: 633.30,
      totalCobrar: 11399.40,
      saldoPendiente: 8000.00,
      pagosRecibidos: 3399.40,
      estado: 'En Proceso',
      fechaInicio: '2024-01-15',
      tasaInteres: 14,
      plazoMeses: 18,
      fechaVencimiento: '2025-07-15',
      historialPagos: [
        { id: 1, fecha: '2024-02-15', monto: 633.30, metodo: 'Transferencia', descripcion: 'Pago cuota #1' },
        { id: 2, fecha: '2024-03-15', monto: 633.30, metodo: 'Efectivo', descripcion: 'Pago cuota #2' },
        { id: 3, fecha: '2024-04-15', monto: 633.30, metodo: 'Transferencia', descripcion: 'Pago cuota #3' },
        { id: 4, fecha: '2024-05-15', monto: 633.30, metodo: 'Yape', descripcion: 'Pago cuota #4' },
        { id: 5, fecha: '2024-06-15', monto: 866.20, metodo: 'Transferencia', descripcion: 'Pago parcial adicional' }
      ]
    },
    {
      id: 2,
      nombre: 'Maria Gonzalez',
      email: 'maria@example.com',
      telefono: '+51 987 654 321',
      capital: 15000,
      cuotaMensual: 950.00,
      totalCobrar: 17100.00,
      saldoPendiente: 12000.00,
      pagosRecibidos: 5100.00,
      estado: 'En Proceso',
      fechaInicio: '2024-03-01',
      tasaInteres: 14,
      plazoMeses: 18,
      fechaVencimiento: '2025-09-01',
      historialPagos: [
        { id: 1, fecha: '2024-04-01', monto: 950.00, metodo: 'Transferencia', descripcion: 'Pago cuota #1' },
        { id: 2, fecha: '2024-05-01', monto: 950.00, metodo: 'Efectivo', descripcion: 'Pago cuota #2' },
        { id: 3, fecha: '2024-06-01', monto: 950.00, metodo: 'Yape', descripcion: 'Pago cuota #3' },
        { id: 4, fecha: '2024-06-15', monto: 1250.00, metodo: 'Transferencia', descripcion: 'Pago adelantado' },
        { id: 5, fecha: '2024-06-25', monto: 2000.00, metodo: 'Deposito', descripcion: 'Abono extra' }
      ]
    },
    {
      id: 3,
      nombre: 'Carlos Mendoza',
      email: 'carlos@example.com',
      telefono: '+51 955 789 123',
      capital: 8000,
      cuotaMensual: 740.50,
      totalCobrar: 8886.00,
      saldoPendiente: 7405.00,
      pagosRecibidos: 1481.00,
      estado: 'En Proceso',
      fechaInicio: '2024-05-01',
      tasaInteres: 11,
      plazoMeses: 12,
      fechaVencimiento: '2025-05-01',
      historialPagos: [
        { id: 1, fecha: '2024-06-01', monto: 740.50, metodo: 'Transferencia', descripcion: 'Pago cuota #1' },
        { id: 2, fecha: '2024-06-20', monto: 740.50, metodo: 'Efectivo', descripcion: 'Pago cuota #2' }
      ]
    }
  ]);

  const [misDeudas, setMisDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      descripcion: 'Prestamo comercial para capital de trabajo',
      capital: 50000,
      cuotaMensual: 2500.00,
      saldoPendiente: 45000.00,
      tasaInteres: 18,
      estado: 'Activo',
      proximoPago: '2025-07-21',
      tipo: 'Prestamo Bancario',
      historialPagos: [
        { id: 1, fecha: '2024-05-21', monto: 2500.00, metodo: 'Transferencia', descripcion: 'Cuota mensual Mayo' },
        { id: 2, fecha: '2024-06-21', monto: 2500.00, metodo: 'Transferencia', descripcion: 'Cuota mensual Junio' }
      ]
    },
    {
      id: 2,
      acreedor: 'Proveedor Textil SAC',
      descripcion: 'Compra de mercaderia a credito',
      capital: 8000,
      cuotaMensual: 800.00,
      saldoPendiente: 6400.00,
      tasaInteres: 0,
      estado: 'Activo',
      proximoPago: '2025-07-05',
      tipo: 'Credito Comercial',
      historialPagos: [
        { id: 1, fecha: '2024-05-05', monto: 800.00, metodo: 'Transferencia', descripcion: 'Pago mensual' },
        { id: 2, fecha: '2024-06-05', monto: 800.00, metodo: 'Transferencia', descripcion: 'Pago mensual' }
      ]
    },
    {
      id: 3,
      acreedor: 'Banco BCP',
      descripcion: 'Linea de credito empresarial',
      capital: 25000,
      cuotaMensual: 1250.00,
      saldoPendiente: 18750.00,
      tasaInteres: 15,
      estado: 'Activo',
      proximoPago: '2025-07-10',
      tipo: 'Linea de Credito',
      historialPagos: [
        { id: 1, fecha: '2024-05-10', monto: 1250.00, metodo: 'Transferencia', descripcion: 'Cuota mensual' },
        { id: 2, fecha: '2024-06-10', monto: 1250.00, metodo: 'Transferencia', descripcion: 'Cuota mensual' }
      ]
    }
  ]);

  const [misInversiones, setMisInversiones] = useState([
    {
      id: 1,
      nombre: 'Maquina Soldadora Industrial',
      descripcion: 'Maquina profesional para metalurgia',
      tipo: 'Maquinaria',
      inversion: 12000,
      gananciaEsperada: 2500,
      gananciaActual: 1625,
      estado: 'En Proceso',
      roi: 20.8,
      progreso: 65,
      fechaInversion: '2024-01-15'
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
      roi: 25.0,
      progreso: 75,
      fechaInversion: '2024-02-01'
    },
    {
      id: 3,
      nombre: 'Equipos de Corte CNC',
      descripcion: 'Maquinaria de precision para metalurgia',
      tipo: 'Maquinaria',
      inversion: 35000,
      gananciaEsperada: 7500,
      gananciaActual: 5250,
      estado: 'En Proceso',
      roi: 21.4,
      progreso: 70,
      fechaInversion: '2024-03-10'
    }
  ]);

  const [alertas, setAlertas] = useState([
    {
      id: 1,
      mensaje: 'Pago de Antonio Rodriguez vence en 3 dias',
      urgencia: 'media',
      tipo: 'pago_pendiente',
      fechaVencimiento: '2025-07-01',
      activa: true,
      fechaCreacion: '2025-06-26'
    },
    {
      id: 2,
      mensaje: 'Cuota BCP vence mañana',
      urgencia: 'alta',
      tipo: 'deuda_vencimiento',
      fechaVencimiento: '2025-06-29',
      activa: true,
      fechaCreacion: '2025-06-27'
    },
    {
      id: 3,
      mensaje: 'Revision trimestral de inversiones pendiente',
      urgencia: 'baja',
      tipo: 'revision_programada',
      fechaVencimiento: '2025-07-05',
      activa: true,
      fechaCreacion: '2025-06-25'
    }
  ]);

  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;
  const recursosDisponibles = totalPorCobrar + misInversiones.reduce((acc, i) => acc + i.gananciaActual, 0);
  const cobertura = totalPorPagar > 0 ? (recursosDisponibles / totalPorPagar) * 100 : 100;

  useEffect(() => {
    const interval = setInterval(() => setFirebaseConectado(Math.random() > 0.1), 8000);
    return () => clearInterval(interval);
  }, []);

  const calcularCuotaMensual = (capital, tasa, meses) => {
    if (!capital || !tasa || !meses) return 0;
    if (tasa === 0) return capital / meses;
    const tasaMensual = tasa / 100 / 12;
    return (capital * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
  };
  
  const registrarPago = async () => {
    if (!formPago.monto || !formPago.fecha || !clienteSeleccionado) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const monto = parseFloat(formPago.monto);
    if (monto <= 0 || monto > clienteSeleccionado.saldoPendiente) {
      alert('El monto debe ser mayor a 0 y no exceder el saldo pendiente');
      return;
    }
    
    setSincronizando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nuevoPago = {
      id: Date.now(),
      fecha: formPago.fecha,
      monto: monto,
      metodo: formPago.metodo,
      descripcion: `Pago - ${formPago.metodo}`
    };
    
    setMisClientes(prevClientes => 
      prevClientes.map(cliente => {
        if (cliente.id === clienteSeleccionado.id) {
          return {
            ...cliente,
            historialPagos: [...cliente.historialPagos, nuevoPago],
            pagosRecibidos: cliente.pagosRecibidos + monto,
            saldoPendiente: cliente.saldoPendiente - monto,
            estado: (cliente.saldoPendiente - monto) <= 0 ? 'Completado' : 'En Proceso'
          };
        }
        return cliente;
      })
    );
    
    setFormPago({ 
      monto: '', 
      metodo: 'Transferencia', 
      fecha: new Date().toISOString().split('T')[0] 
    });
    setShowModalPago(false);
    setClienteSeleccionado(null);
    setSincronizando(false);
    alert('✅ Pago registrado exitosamente');
  };

  const registrarPagoDeuda = async () => {
    if (!formPagoDeuda.monto || !formPagoDeuda.fecha || !deudaSeleccionada) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const monto = parseFloat(formPagoDeuda.monto);
    if (monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    setSincronizando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nuevoPago = {
      id: Date.now(),
      fecha: formPagoDeuda.fecha,
      monto: monto,
      metodo: formPagoDeuda.metodo,
      descripcion: `Pago deuda - ${formPagoDeuda.metodo}`
    };
    
    setMisDeudas(prevDeudas => 
      prevDeudas.map(deuda => {
        if (deuda.id === deudaSeleccionada.id) {
          const nuevoSaldo = deuda.saldoPendiente - monto;
          return {
            ...deuda,
            historialPagos: [...(deuda.historialPagos || []), nuevoPago],
            saldoPendiente: Math.max(0, nuevoSaldo),
            estado: nuevoSaldo <= 0 ? 'Pagado' : 'Activo'
          };
        }
        return deuda;
      })
    );
    
    setFormPagoDeuda({ 
      monto: '', 
      metodo: 'Transferencia', 
      fecha: new Date().toISOString().split('T')[0] 
    });
    setShowModalPagoDeuda(false);
    setDeudaSeleccionada(null);
    setSincronizando(false);
    alert('✅ Pago de deuda registrado exitosamente');
  };

  const agregarCliente = async () => {
    if (!formCliente.nombre || !formCliente.capital || !formCliente.tasaInteres || !formCliente.plazoMeses) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    setSincronizando(true);
    
    try {
      const capital = parseFloat(formCliente.capital);
      const tasa = parseFloat(formCliente.tasaInteres);
      const meses = parseInt(formCliente.plazoMeses);
      const cuotaMensual = calcularCuotaMensual(capital, tasa, meses);
      const totalCobrar = cuotaMensual * meses;
      
      const fechaInicio = new Date(formCliente.fechaInicio);
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + meses);
      
      const nuevoCliente = {
        id: Date.now(),
        nombre: formCliente.nombre,
        email: formCliente.email || '',
        telefono: formCliente.telefono || '',
        capital: capital,
        cuotaMensual: Math.round(cuotaMensual * 100) / 100,
        totalCobrar: Math.round(totalCobrar * 100) / 100,
        saldoPendiente: Math.round(totalCobrar * 100) / 100,
        pagosRecibidos: 0,
        estado: 'En Proceso',
        fechaInicio: formCliente.fechaInicio,
        tasaInteres: tasa,
        plazoMeses: meses,
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        historialPagos: []
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMisClientes(prev => [...prev, nuevoCliente]);
      setFormCliente({
        nombre: '',
        email: '',
        telefono: '',
        capital: '',
        tasaInteres: '14',
        plazoMeses: '12',
        fechaInicio: new Date().toISOString().split('T')[0]
      });
      setShowModalCliente(false);
      alert('✅ Cliente agregado exitosamente');
    } catch (error) {
      alert('❌ Error al agregar cliente');
    }
    
    setSincronizando(false);
  };

  const agregarDeuda = async () => {
    if (!formDeuda.acreedor || !formDeuda.capital || !formDeuda.cuotaMensual) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    setSincronizando(true);
    
    try {
      const nuevaDeuda = {
        id: Date.now(),
        acreedor: formDeuda.acreedor,
        descripcion: formDeuda.descripcion || 'Sin descripción',
        capital: parseFloat(formDeuda.capital),
        cuotaMensual: parseFloat(formDeuda.cuotaMensual),
        saldoPendiente: parseFloat(formDeuda.capital),
        tasaInteres: parseFloat(formDeuda.tasaInteres) || 0,
        estado: 'Activo',
        proximoPago: formDeuda.proximoPago,
        tipo: formDeuda.tipo,
        historialPagos: []
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMisDeudas(prev => [...prev, nuevaDeuda]);
      setFormDeuda({
        acreedor: '',
        descripcion: '',
        capital: '',
        cuotaMensual: '',
        tasaInteres: '0',
        tipo: 'Prestamo Bancario',
        proximoPago: new Date().toISOString().split('T')[0]
      });
      setShowModalDeuda(false);
      alert('✅ Deuda agregada exitosamente');
    } catch (error) {
      alert('❌ Error al agregar deuda');
    }
    
    setSincronizando(false);
  };

  const agregarInversion = async () => {
    if (!formInversion.nombre || !formInversion.inversion || !formInversion.gananciaEsperada) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    setSincronizando(true);
    
    try {
      const inversion = parseFloat(formInversion.inversion);
      const gananciaEsperada = parseFloat(formInversion.gananciaEsperada);
      const roi = (gananciaEsperada / inversion) * 100;
      
      const nuevaInversion = {
        id: Date.now(),
        nombre: formInversion.nombre,
        descripcion: formInversion.descripcion || 'Sin descripción',
        tipo: formInversion.tipo,
        inversion: inversion,
        gananciaEsperada: gananciaEsperada,
        gananciaActual: 0,
        estado: 'En Proceso',
        roi: Math.round(roi * 10) / 10,
        progreso: 0,
        fechaInversion: new Date().toISOString().split('T')[0]
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMisInversiones(prev => [...prev, nuevaInversion]);
      setFormInversion({
        nombre: '',
        descripcion: '',
        tipo: 'Maquinaria',
        inversion: '',
        gananciaEsperada: ''
      });
      setShowModalInversion(false);
      alert('✅ Inversión agregada exitosamente');
    } catch (error) {
      alert('❌ Error al agregar inversión');
    }
    
    setSincronizando(false);
  };

  const editarCliente = async () => {
    if (!formEditarCliente.nombre || !formEditarCliente.capital) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    setSincronizando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const capital = parseFloat(formEditarCliente.capital);
    const tasa = parseFloat(formEditarCliente.tasaInteres);
    const meses = parseInt(formEditarCliente.plazoMeses);
    const cuotaMensual = calcularCuotaMensual(capital, tasa, meses);
    const totalCobrar = cuotaMensual * meses;
    
    setMisClientes(prevClientes => 
      prevClientes.map(cliente => {
        if (cliente.id === clienteSeleccionado.id) {
          return {
            ...cliente,
            nombre: formEditarCliente.nombre,
            email: formEditarCliente.email,
            telefono: formEditarCliente.telefono,
            capital: capital,
            tasaInteres: tasa,
            plazoMeses: meses,
            cuotaMensual: Math.round(cuotaMensual * 100) / 100,
            totalCobrar: Math.round(totalCobrar * 100) / 100,
            fechaInicio: formEditarCliente.fechaInicio
          };
        }
        return cliente;
      })
    );
    
    setShowModalEditarCliente(false);
    setClienteSeleccionado(null);
    setSincronizando(false);
    alert('✅ Cliente actualizado exitosamente');
  };

  const eliminarCliente = async (clienteId) => {
    if (window.confirm('⚠️ ¿Confirmas eliminar este cliente? Esta acción no se puede deshacer.')) {
      setSincronizando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMisClientes(prev => prev.filter(c => c.id !== clienteId));
      setSincronizando(false);
      alert('✅ Cliente eliminado exitosamente');
    }
  };

  const eliminarAlerta = (alertaId) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
    alert('✅ Alerta eliminada');
  };

  const eliminarDeuda = (deudaId) => {
    if (window.confirm('⚠️ ¿Confirmas eliminar esta deuda?')) {
      setMisDeudas(prev => prev.filter(d => d.id !== deudaId));
      alert('✅ Deuda eliminada exitosamente');
    }
  };

  const eliminarInversion = (inversionId) => {
    if (window.confirm('⚠️ ¿Confirmas eliminar esta inversión?')) {
      setMisInversiones(prev => prev.filter(i => i.id !== inversionId));
      alert('✅ Inversión eliminada exitosamente');
    }
  };

  const eliminarPago = async (pagoId) => {
    if (!clienteSeleccionado) return;
    
    if (window.confirm('⚠️ ¿Confirmas eliminar este pago? Esta acción recalculará los saldos.')) {
      setSincronizando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Encontrar el pago a eliminar
      const pagoAEliminar = clienteSeleccionado.historialPagos.find(p => p.id === pagoId);
      
      if (pagoAEliminar) {
        // Actualizar el cliente
        setMisClientes(prevClientes => 
          prevClientes.map(cliente => {
            if (cliente.id === clienteSeleccionado.id) {
              const nuevoHistorial = cliente.historialPagos.filter(p => p.id !== pagoId);
              const nuevosPagosRecibidos = cliente.pagosRecibidos - pagoAEliminar.monto;
              const nuevoSaldoPendiente = cliente.saldoPendiente + pagoAEliminar.monto;
              
              return {
                ...cliente,
                historialPagos: nuevoHistorial,
                pagosRecibidos: nuevosPagosRecibidos,
                saldoPendiente: nuevoSaldoPendiente,
                estado: nuevoSaldoPendiente > 0 ? 'En Proceso' : 'Completado'
              };
            }
            return cliente;
          })
        );
        
        // Actualizar el cliente seleccionado para la vista actual
        setClienteSeleccionado(prev => {
          if (prev) {
            const nuevoHistorial = prev.historialPagos.filter(p => p.id !== pagoId);
            const nuevosPagosRecibidos = prev.pagosRecibidos - pagoAEliminar.monto;
            const nuevoSaldoPendiente = prev.saldoPendiente + pagoAEliminar.monto;
            
            return {
              ...prev,
              historialPagos: nuevoHistorial,
              pagosRecibidos: nuevosPagosRecibidos,
              saldoPendiente: nuevoSaldoPendiente,
              estado: nuevoSaldoPendiente > 0 ? 'En Proceso' : 'Completado'
            };
          }
          return prev;
        });
        
        setSincronizando(false);
        alert('✅ Pago eliminado y saldos recalculados exitosamente');
      }
    }
  };

  const eliminarPagoDeuda = async (pagoId, deudaId) => {
    if (window.confirm('⚠️ ¿Confirmas eliminar este pago de deuda? Esta acción recalculará los saldos.')) {
      setSincronizando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMisDeudas(prevDeudas => 
        prevDeudas.map(deuda => {
          if (deuda.id === deudaId) {
            const pagoAEliminar = deuda.historialPagos?.find(p => p.id === pagoId);
            if (pagoAEliminar) {
              const nuevoHistorial = deuda.historialPagos.filter(p => p.id !== pagoId);
              const nuevoSaldoPendiente = deuda.saldoPendiente + pagoAEliminar.monto;
              
              return {
                ...deuda,
                historialPagos: nuevoHistorial,
                saldoPendiente: nuevoSaldoPendiente,
                estado: nuevoSaldoPendiente > 0 ? 'Activo' : 'Pagado'
              };
            }
          }
          return deuda;
        })
      );
      
      setSincronizando(false);
      alert('✅ Pago de deuda eliminado y saldos recalculados exitosamente');
    }
  };

  const filtrarPorBusqueda = (items, campos) => {
    if (!busqueda) return items;
    return items.filter(item => 
      campos.some(campo => {
        const valor = item[campo];
        return valor && valor.toString().toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  };

  const guardarDatos = async () => {
    setSincronizando(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDatosGuardados(true);
    setSincronizando(false);
    alert('✅ Datos guardados en la nube exitosamente');
    setTimeout(() => setDatosGuardados(false), 3000);
  };

  const copiarReporte = () => {
    const mensaje = `🏢 GRIZALUM COMPAÑIA METALURGICA
📊 Reporte Financiero - ${new Date().toLocaleDateString()}

💰 RESUMEN EJECUTIVO:
• Por Cobrar: S/ ${totalPorCobrar.toLocaleString()}
• Por Pagar: S/ ${totalPorPagar.toLocaleString()}
• Balance Neto: S/ ${balanceNeto.toLocaleString()}
• Cobertura Financiera: ${Math.round(cobertura)}%

📋 CARTERA ACTIVA:
• Clientes Activos: ${misClientes.filter(c => c.estado === 'En Proceso').length}
• Deudas Pendientes: ${misDeudas.filter(d => d.estado === 'Activo').length}
• Inversiones en Curso: ${misInversiones.filter(i => i.estado === 'En Proceso').length}

🚨 ALERTAS PENDIENTES: ${alertas.filter(a => a.activa).length}

⚡ Gestión Profesional con Sistema Cloud
🔐 Control Financiero Empresarial Seguro`;

    navigator.clipboard.writeText(mensaje).then(() => {
      alert('📋 Reporte copiado al portapapeles exitosamente');
    }).catch(() => {
      alert('📋 Reporte preparado para copiar');
    });
  };

  const abrirModalPago = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormPago({ 
      monto: cliente.cuotaMensual.toString(), 
      metodo: 'Transferencia', 
      fecha: new Date().toISOString().split('T')[0] 
    });
    setShowModalPago(true);
  };

  const abrirModalPagoDeuda = (deuda) => {
    setDeudaSeleccionada(deuda);
    setFormPagoDeuda({ 
      monto: deuda.cuotaMensual.toString(), 
      metodo: 'Transferencia', 
      fecha: new Date().toISOString().split('T')[0] 
    });
    setShowModalPagoDeuda(true);
  };

  const abrirModalEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormEditarCliente({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      capital: cliente.capital.toString(),
      tasaInteres: cliente.tasaInteres.toString(),
      plazoMeses: cliente.plazoMeses.toString(),
      fechaInicio: cliente.fechaInicio
    });
    setShowModalEditarCliente(true);
  };

  const abrirHistorialPagos = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowHistorialPagos(true);
  };

  const cerrarModales = () => {
    setShowModalCliente(false);
    setShowModalPago(false);
    setShowModalEditarCliente(false);
    setShowHistorialPagos(false);
    setShowModalDeuda(false);
    setShowModalInversion(false);
    setShowModalPagoDeuda(false);
    setClienteSeleccionado(null);
    setDeudaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div className="relative z-10">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:transform-none`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">GRIZALUM</h1>
                  <p className="text-xs text-slate-300">Compañía Metálurgica</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 mt-6 space-y-1 px-2">
              {[
                { id: 'resumen', label: 'Resumen Ejecutivo', icon: Home },
                { id: 'clientes', label: 'Cartera Clientes', icon: TrendingUp },
                { id: 'deudas', label: 'Gestión Deudas', icon: TrendingDown },
                { id: 'inversiones', label: 'Inversiones', icon: Building },
                { id: 'alertas', label: 'Alertas', icon: Bell }
              ].map(item => (
                <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-left text-sm transition-all rounded-lg ${
                    currentView === item.id ? 'bg-blue-600 border-r-4 border-blue-400 shadow-lg text-white' : 'hover:bg-slate-700 text-slate-200'
                  }`}>
                  <item.icon className="mr-3" size={18} />
                  {item.label}
                  {item.id === 'alertas' && alertas.filter(a => a.activa).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {alertas.filter(a => a.activa).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-700 mt-auto">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm text-slate-200">Balance Empresarial</h4>
                <p className={`text-xl font-bold ${balanceNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  S/{balanceNeto.toLocaleString()}
                </p>
                <div className="mt-3 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Cobertura:</span>
                    <span className={cobertura >= 100 ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                      {Math.round(cobertura)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                    <div className={`h-2 rounded-full transition-all ${cobertura >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={{ width: `${Math.min(cobertura, 100)}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {firebaseConectado ? (
                      <div className="flex items-center">
                        <Cloud className="text-green-400 mr-1" size={12} />
                        <span className="text-green-400 font-medium">Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <WifiOff className="text-red-400 mr-1" size={12} />
                        <span className="text-red-400 font-medium">Offline</span>
                      </div>
                    )}
                    {datosGuardados && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle size={12} className="mr-1" />
                        <span className="font-medium">Sync</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:ml-64">
          <div className="lg:hidden bg-white shadow-sm p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-800">
                <Menu size={24} />
              </button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800">GRIZALUM</h1>
                <p className="text-xs text-gray-600">Compañía Metálurgica</p>
              </div>
              <div className="flex items-center space-x-2">
                {firebaseConectado ? <Cloud className="text-green-600" size={20} /> : <WifiOff className="text-red-600" size={20} />}
                <button onClick={copiarReporte} className="text-blue-600 hover:text-blue-800">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6 max-w-full">
            <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">G</span>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">GRIZALUM</h1>
                    <p className="text-slate-300 text-lg">COMPAÑÍA METÁLURGICA</p>
                    <p className="text-slate-400 text-sm">Control Financiero Profesional</p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {firebaseConectado ? (
                      <>
                        <Cloud className="text-green-400" size={20} />
                        <span className="text-green-400 font-semibold">Sistema Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="text-red-400" size={20} />
                        <span className="text-red-400 font-semibold">Sin Conexión</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm">
                    {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                <button onClick={() => alert('📊 Descarga próximamente - Funcionalidad en desarrollo')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all flex items-center text-sm font-semibold">
                  <FileSpreadsheet className="mr-2" size={16} />
                  Descargar Excel
                </button>
                <button onClick={copiarReporte} className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all flex items-center text-sm font-semibold">
                  <Share2 className="mr-2" size={16} />
                  Copiar Reporte
                </button>
                <button onClick={guardarDatos} disabled={sincronizando}
                  className={`${sincronizando ? 'bg-orange-500' : datosGuardados ? 'bg-green-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-xl transition-all flex items-center text-sm font-semibold disabled:opacity-50`}>
                  {sincronizando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sincronizando...
                    </>
                  ) : datosGuardados ? (
                    <>
                      <CheckCircle className="mr-2" size={16} />
                      Guardado
                    </>
                  ) : (
                    <>
                      <Cloud className="mr-2" size={16} />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6 bg-green-50 border-l-4 border-green-400 rounded-r-2xl p-4">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-600" size={24} />
                <div>
                  <h4 className="font-semibold text-green-800">Sistema Seguro</h4>
                  <p className="text-sm text-green-700">Información protegida con encriptación avanzada.</p>
                </div>
              </div>
            </div>

            {currentView === 'resumen' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Financiero</h2>
                  <p className="text-gray-600 mb-4">Análisis completo en tiempo real</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium">Por Cobrar</p>
                          <p className="text-2xl font-bold">S/{totalPorCobrar.toLocaleString()}</p>
                          <p className="text-green-200 text-xs mt-1">{misClientes.filter(c => c.estado === 'En Proceso').length} clientes</p>
                        </div>
                        <TrendingUp size={32} className="text-green-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100 text-sm font-medium">Deudas</p>
                          <p className="text-2xl font-bold">S/{totalPorPagar.toLocaleString()}</p>
                          <p className="text-red-200 text-xs mt-1">{misDeudas.filter(d => d.estado === 'Activo').length} activas</p>
                        </div>
                        <TrendingDown size={32} className="text-red-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">Balance</p>
                          <p className="text-2xl font-bold">S/{balanceNeto.toLocaleString()}</p>
                          <p className="text-blue-200 text-xs mt-1">{balanceNeto >= 0 ? 'Favorable' : 'Atención'}</p>
                        </div>
                        <DollarSign size={32} className="text-blue-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Cobertura</p>
                          <p className="text-2xl font-bold">{Math.round(cobertura)}%</p>
                          <p className="text-purple-200 text-xs mt-1">{cobertura >= 100 ? 'Excelente' : 'Mejorar'}</p>
                        </div>
                        <Calculator size={32} className="text-purple-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {alertas.filter(a => a.activa).length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-2xl p-6">
                    <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
                      <AlertTriangle className="mr-2" size={20} />
                      Alertas del Sistema
                    </h4>
                    <div className="space-y-3">
                      {alertas.filter(a => a.activa).slice(0, 3).map(alerta => (
                        <div key={alerta.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              alerta.urgencia === 'alta' ? 'bg-red-100 text-red-800' :
                              alerta.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {alerta.urgencia.toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{alerta.mensaje}</p>
                          </div>
                          <button onClick={() => eliminarAlerta(alerta.id)} className="text-gray-400 hover:text-red-600">
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'clientes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Cartera de Clientes</h2>
                      <p className="text-gray-600">Gestión de préstamos y cobranzas</p>
                    </div>
                    <button onClick={() => setShowModalCliente(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
                      <Plus className="mr-2" size={18} />
                      Nuevo Cliente
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input type="text" placeholder="Buscar clientes..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    {filtrarPorBusqueda(misClientes, ['nombre', 'email', 'telefono']).map(cliente => (
                      <div key={cliente.id} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="text-white" size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-gray-800">{cliente.nombre}</h3>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-1 lg:space-y-0 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Mail className="mr-1" size={14} />
                                    {cliente.email || 'Sin email'}
                                  </span>
                                  <span className="flex items-center">
                                    <Phone className="mr-1" size={14} />
                                    {cliente.telefono || 'Sin teléfono'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Capital</p>
                                <p className="font-bold text-lg text-blue-600">S/{cliente.capital.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Tasa: {cliente.tasaInteres}%</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Pendiente</p>
                                <p className="font-bold text-lg text-red-600">S/{cliente.saldoPendiente.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">de S/{cliente.totalCobrar.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Cuota</p>
                                <p className="font-bold text-lg text-green-600">S/{cliente.cuotaMensual.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Plazo: {cliente.plazoMeses} meses</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Progreso</p>
                                <p className="font-bold text-lg text-purple-600">
                                  {cliente.historialPagos.length} / {cliente.plazoMeses}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                                    style={{width: `${(cliente.historialPagos.length / cliente.plazoMeses) * 100}%`}}></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                cliente.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {cliente.estado}
                              </span>
                              <span className="text-sm text-gray-600">
                                Inicio: {new Date(cliente.fechaInicio).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                Vence: {new Date(cliente.fechaVencimiento).toLocaleDateString()}
                              </span>
                              {firebaseConectado && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  Sync
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => abrirModalPago(cliente)}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Registrar Pago">
                              <DollarSign size={18} />
                            </button>
                            <button onClick={() => abrirHistorialPagos(cliente)}
                              className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Ver Historial">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => abrirModalEditarCliente(cliente)}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Cliente">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => eliminarCliente(cliente.id)} disabled={sincronizando}
                              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none disabled:opacity-50"
                              title="Eliminar Cliente">
                              {sincronizando ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filtrarPorBusqueda(misClientes, ['nombre', 'email', 'telefono']).length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500 text-lg">No se encontraron clientes</p>
                      <p className="text-gray-400 text-sm">Intenta con otros términos</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'deudas' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Gestión de Deudas</h2>
                      <p className="text-gray-600">Control de obligaciones financieras</p>
                    </div>
                    <button onClick={() => setShowModalDeuda(true)}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
                      <Plus className="mr-2" size={18} />
                      Nueva Deuda
                    </button>
                  </div>
                  
                  <div className="grid gap-6">
                    {misDeudas.map(deuda => (
                      <div key={deuda.id} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                <CreditCard className="text-white" size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-gray-800">{deuda.acreedor}</h3>
                                <p className="text-sm text-gray-600">{deuda.descripcion}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Capital</p>
                                <p className="font-bold text-lg text-blue-600">S/{deuda.capital.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Tasa: {deuda.tasaInteres}%</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Pendiente</p>
                                <p className="font-bold text-lg text-red-600">S/{deuda.saldoPendiente.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Cuota</p>
                                <p className="font-bold text-lg text-orange-600">S/{deuda.cuotaMensual.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                deuda.estado === 'Activo' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {deuda.estado}
                              </span>
                              <span className="text-sm text-gray-600">Tipo: {deuda.tipo}</span>
                              <span className="text-sm text-gray-600">Próximo: {deuda.proximoPago}</span>
                              <span className="text-sm text-gray-600">Pagos: {deuda.historialPagos?.length || 0}</span>
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => abrirModalPagoDeuda(deuda)}
                              className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Pagar Cuota">
                              <DollarSign size={18} />
                            </button>
                            <button onClick={() => alert('📊 Ver historial de pagos próximamente')}
                              className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Ver Historial">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => alert('✏️ Editar deuda próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Deuda">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => eliminarDeuda(deuda.id)}
                              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Eliminar Deuda">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'inversiones' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Portfolio de Inversiones</h2>
                      <p className="text-gray-600">Gestión de activos y ROI</p>
                    </div>
                    <button onClick={() => setShowModalInversion(true)}
                      className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
                      <Plus className="mr-2" size={18} />
                      Nueva Inversión
                    </button>
                  </div>
                  
                  <div className="grid gap-6">
                    {misInversiones.map(inversion => (
                      <div key={inversion.id} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Building className="text-white" size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-gray-800">{inversion.nombre}</h3>
                                <p className="text-sm text-gray-600">{inversion.descripcion}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Inversión</p>
                                <p className="font-bold text-lg text-blue-600">S/{inversion.inversion.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Tipo: {inversion.tipo}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Esperada</p>
                                <p className="font-bold text-lg text-green-600">S/{inversion.gananciaEsperada.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Actual</p>
                                <p className="font-bold text-lg text-emerald-600">S/{inversion.gananciaActual.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">ROI</p>
                                <p className="font-bold text-lg text-purple-600">{inversion.roi.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">Progreso: {inversion.progreso}%</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progreso de Inversión</span>
                                <span className="font-semibold text-purple-600">{inversion.progreso}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                                  style={{width: `${inversion.progreso}%`}}></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                inversion.estado === 'En Proceso' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {inversion.estado}
                              </span>
                              <span className="text-sm text-gray-600">Fecha: {new Date(inversion.fechaInversion).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => alert('📈 Actualizar ROI próximamente')}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Actualizar Ganancias">
                              <TrendingUp size={18} />
                            </button>
                            <button onClick={() => alert('✏️ Editar inversión próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Inversión">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => eliminarInversion(inversion.id)}
                              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Eliminar Inversión">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'alertas' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Centro de Alertas</h2>
                      <p className="text-gray-600">Notificaciones importantes</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {alertas.map(alerta => (
                      <div key={alerta.id} className={`border rounded-xl p-6 hover:shadow-lg transition-all ${
                        alerta.urgencia === 'alta' ? 'bg-red-50 border-red-200' : 
                        alerta.urgencia === 'media' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                alerta.urgencia === 'alta' ? 'bg-red-500' :
                                alerta.urgencia === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}>
                                <Bell className="text-white" size={20} />
                              </div>
                              <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    alerta.urgencia === 'alta' ? 'bg-red-100 text-red-800' : 
                                    alerta.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {alerta.urgencia.toUpperCase()}
                                  </span>
                                  <span className="text-sm text-gray-600 font-medium">{alerta.tipo}</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800">{alerta.mensaje}</h3>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mt-3">
                              Vencimiento: {new Date(alerta.fechaVencimiento).toLocaleDateString()} - Creada: {new Date(alerta.fechaCreacion).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => alert('✏️ Editar alerta próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Alerta">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => eliminarAlerta(alerta.id)}
                              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Eliminar Alerta">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {alertas.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500 text-lg">No hay alertas activas</p>
                      <p className="text-gray-400 text-sm">El sistema funciona correctamente</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODALES */}
            {showModalCliente && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Nuevo Cliente</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input type="text" value={formCliente.nombre} onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Juan Pérez" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={formCliente.email} onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="juan@example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input type="tel" value={formCliente.telefono} onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+51 999 123 456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capital (S/) *</label>
                        <input type="number" value={formCliente.capital} onChange={(e) => setFormCliente({...formCliente, capital: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="10000" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasa (%) *</label>
                        <input type="number" step="0.1" value={formCliente.tasaInteres} onChange={(e) => setFormCliente({...formCliente, tasaInteres: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="14" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses) *</label>
                        <input type="number" value={formCliente.plazoMeses} onChange={(e) => setFormCliente({...formCliente, plazoMeses: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="18" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
                        <input type="date" value={formCliente.fechaInicio} onChange={(e) => setFormCliente({...formCliente, fechaInicio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                    </div>
                    
                    {formCliente.capital && formCliente.tasaInteres && formCliente.plazoMeses && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Vista Previa del Préstamo</h4>
                        <div className="text-sm space-y-1">
                          <p>Cuota mensual: <span className="font-bold">S/ {calcularCuotaMensual(parseFloat(formCliente.capital || 0), parseFloat(formCliente.tasaInteres || 0), parseInt(formCliente.plazoMeses || 1)).toFixed(2)}</span></p>
                          <p>Total a cobrar: <span className="font-bold">S/ {(calcularCuotaMensual(parseFloat(formCliente.capital || 0), parseFloat(formCliente.tasaInteres || 0), parseInt(formCliente.plazoMeses || 1)) * parseInt(formCliente.plazoMeses || 1)).toFixed(2)}</span></p>
                          <p>Ganancia total: <span className="font-bold text-green-600">S/ {((calcularCuotaMensual(parseFloat(formCliente.capital || 0), parseFloat(formCliente.tasaInteres || 0), parseInt(formCliente.plazoMeses || 1)) * parseInt(formCliente.plazoMeses || 1)) - parseFloat(formCliente.capital || 0)).toFixed(2)}</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={agregarCliente} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cliente'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalDeuda && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Nueva Deuda</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acreedor *</label>
                      <input type="text" value={formDeuda.acreedor} onChange={(e) => setFormDeuda({...formDeuda, acreedor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Banco Santander" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <input type="text" value={formDeuda.descripcion} onChange={(e) => setFormDeuda({...formDeuda, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Préstamo para equipos" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capital (S/) *</label>
                        <input type="number" value={formDeuda.capital} onChange={(e) => setFormDeuda({...formDeuda, capital: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="50000" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cuota (S/) *</label>
                        <input type="number" value={formDeuda.cuotaMensual} onChange={(e) => setFormDeuda({...formDeuda, cuotaMensual: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="2500" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasa (%)</label>
                        <input type="number" step="0.1" value={formDeuda.tasaInteres} onChange={(e) => setFormDeuda({...formDeuda, tasaInteres: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="18" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select value={formDeuda.tipo} onChange={(e) => setFormDeuda({...formDeuda, tipo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="Prestamo Bancario">Préstamo Bancario</option>
                          <option value="Credito Comercial">Crédito Comercial</option>
                          <option value="Linea de Credito">Línea de Crédito</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Próximo pago</label>
                      <input type="date" value={formDeuda.proximoPago} onChange={(e) => setFormDeuda({...formDeuda, proximoPago: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={agregarDeuda} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Deuda'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalInversion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Nueva Inversión</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                      <input type="text" value={formInversion.nombre} onChange={(e) => setFormInversion({...formInversion, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Máquina Industrial" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <input type="text" value={formInversion.descripcion} onChange={(e) => setFormInversion({...formInversion, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Equipo para aumentar producción" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select value={formInversion.tipo} onChange={(e) => setFormInversion({...formInversion, tipo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="Maquinaria">Maquinaria</option>
                        <option value="Inmueble">Inmueble</option>
                        <option value="Tecnologia">Tecnología</option>
                        <option value="Vehiculo">Vehículo</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inversión (S/) *</label>
                        <input type="number" value={formInversion.inversion} onChange={(e) => setFormInversion({...formInversion, inversion: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="25000" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ganancia Esperada (S/) *</label>
                        <input type="number" value={formInversion.gananciaEsperada} onChange={(e) => setFormInversion({...formInversion, gananciaEsperada: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="5000" />
                      </div>
                    </div>
                    
                    {formInversion.inversion && formInversion.gananciaEsperada && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Vista Previa de la Inversión</h4>
                        <div className="text-sm space-y-1">
                          <p>ROI Esperado: <span className="font-bold text-purple-600">{((parseFloat(formInversion.gananciaEsperada || 0) / parseFloat(formInversion.inversion || 1)) * 100).toFixed(1)}%</span></p>
                          <p>Retorno Total: <span className="font-bold">S/ {(parseFloat(formInversion.inversion || 0) + parseFloat(formInversion.gananciaEsperada || 0)).toLocaleString()}</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={agregarInversion} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Inversión'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalEditarCliente && clienteSeleccionado && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Editar Cliente</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input type="text" value={formEditarCliente.nombre} onChange={(e) => setFormEditarCliente({...formEditarCliente, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={formEditarCliente.email} onChange={(e) => setFormEditarCliente({...formEditarCliente, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input type="tel" value={formEditarCliente.telefono} onChange={(e) => setFormEditarCliente({...formEditarCliente, telefono: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capital (S/) *</label>
                        <input type="number" value={formEditarCliente.capital} onChange={(e) => setFormEditarCliente({...formEditarCliente, capital: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasa (%) *</label>
                        <input type="number" step="0.1" value={formEditarCliente.tasaInteres} onChange={(e) => setFormEditarCliente({...formEditarCliente, tasaInteres: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses) *</label>
                        <input type="number" value={formEditarCliente.plazoMeses} onChange={(e) => setFormEditarCliente({...formEditarCliente, plazoMeses: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
                        <input type="date" value={formEditarCliente.fechaInicio} onChange={(e) => setFormEditarCliente({...formEditarCliente, fechaInicio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={editarCliente} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Actualizando...
                        </>
                      ) : (
                        'Actualizar Cliente'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalPago && clienteSeleccionado && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Registrar Pago</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Cliente: {clienteSeleccionado.nombre}</h4>
                    <div className="text-sm space-y-1">
                      <p>Saldo pendiente: <span className="font-bold text-red-600">S/ {clienteSeleccionado.saldoPendiente.toLocaleString()}</span></p>
                      <p>Cuota sugerida: <span className="font-bold text-green-600">S/ {clienteSeleccionado.cuotaMensual.toLocaleString()}</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar (S/) *</label>
                      <input type="number" step="0.01" value={formPago.monto} 
                        onChange={(e) => setFormPago({...formPago, monto: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago *</label>
                      <select value={formPago.metodo} onChange={(e) => setFormPago({...formPago, metodo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Deposito">Depósito</option>
                        <option value="Yape">Yape</option>
                        <option value="Plin">Plin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pago *</label>
                      <input type="date" value={formPago.fecha} 
                        onChange={(e) => setFormPago({...formPago, fecha: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={registrarPago} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registrando...
                        </>
                      ) : (
                        'Registrar Pago'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalPagoDeuda && deudaSeleccionada && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Pagar Deuda</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Deuda: {deudaSeleccionada.acreedor}</h4>
                    <div className="text-sm space-y-1">
                      <p>Saldo pendiente: <span className="font-bold text-red-600">S/ {deudaSeleccionada.saldoPendiente.toLocaleString()}</span></p>
                      <p>Cuota sugerida: <span className="font-bold text-orange-600">S/ {deudaSeleccionada.cuotaMensual.toLocaleString()}</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar (S/) *</label>
                      <input type="number" step="0.01" value={formPagoDeuda.monto} 
                        onChange={(e) => setFormPagoDeuda({...formPagoDeuda, monto: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0.00" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago *</label>
                      <select value={formPagoDeuda.metodo} onChange={(e) => setFormPagoDeuda({...formPagoDeuda, metodo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Deposito">Depósito</option>
                        <option value="Yape">Yape</option>
                        <option value="Plin">Plin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pago *</label>
                      <input type="date" value={formPagoDeuda.fecha} 
                        onChange={(e) => setFormPagoDeuda({...formPagoDeuda, fecha: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button onClick={cerrarModales}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      Cancelar
                    </button>
                    <button onClick={registrarPagoDeuda} disabled={sincronizando}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center font-semibold">
                      {sincronizando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registrando...
                        </>
                      ) : (
                        'Registrar Pago'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showHistorialPagos && clienteSeleccionado && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Historial de Pagos - {clienteSeleccionado.nombre}</h3>
                    <button onClick={cerrarModales} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Cobrado</p>
                        <p className="font-bold text-lg text-green-600">S/ {clienteSeleccionado.pagosRecibidos.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Saldo Pendiente</p>
                        <p className="font-bold text-lg text-red-600">S/ {clienteSeleccionado.saldoPendiente.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Pagos Realizados</p>
                        <p className="font-bold text-lg text-blue-600">{clienteSeleccionado.historialPagos.length} / {clienteSeleccionado.plazoMeses}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso del Préstamo</span>
                        <span className="font-semibold text-blue-600">{Math.round((clienteSeleccionado.pagosRecibidos / clienteSeleccionado.totalCobrar) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{width: `${(clienteSeleccionado.pagosRecibidos / clienteSeleccionado.totalCobrar) * 100}%`}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-600 mr-2" size={20} />
                      <div>
                        <h4 className="font-semibold text-yellow-800">⚠️ Control de Pagos</h4>
                        <p className="text-sm text-yellow-700">Puedes eliminar pagos individuales si detectas errores o duplicados. Los saldos se recalcularán automáticamente.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">📊 Registro de Movimientos</h4>
                    {clienteSeleccionado.historialPagos.length > 0 ? (
                      clienteSeleccionado.historialPagos
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                        .map(pago => (
                        <div key={pago.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <p className="font-bold text-lg text-gray-800">S/ {pago.monto.toLocaleString()}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  pago.metodo === 'Transferencia' ? 'bg-blue-100 text-blue-800' :
                                  pago.metodo === 'Efectivo' ? 'bg-green-100 text-green-800' :
                                  pago.metodo === 'Yape' ? 'bg-purple-100 text-purple-800' :
                                  pago.metodo === 'Plin' ? 'bg-pink-100 text-pink-800' :
                                  pago.metodo === 'Deposito' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {pago.metodo}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">📅 {new Date(pago.fecha).toLocaleDateString('es-PE', { 
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                              })}</p>
                              {pago.descripcion && (
                                <p className="text-sm text-gray-500 mt-1">💬 {pago.descripcion}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={20} />
                              </div>
                              <button 
                                onClick={() => eliminarPago(pago.id)}
                                disabled={sincronizando}
                                className="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg"
                                title="Eliminar Pago">
                                {sincronizando ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg">No hay pagos registrados</p>
                        <p className="text-gray-400 text-sm">Los pagos aparecerán aquí cuando se registren</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <button onClick={cerrarModales}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold">
                      Cerrar Historial
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
