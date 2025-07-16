import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, DollarSign, 
  Calculator, Share2, FileSpreadsheet, Edit, Bell, Shield, Trash2, 
  CheckCircle, Cloud, WifiOff, User, Phone, Mail, CreditCard, 
  AlertTriangle, Eye, Link, Save, Download, Clock, RefreshCw, RotateCcw, LogOut
} from 'lucide-react';
import useFinancialData from '../hooks/useFinancialData';
import { 
  obtenerHistorial, 
  restaurarDesdeHistorial 
} from '../services/historialService';
export default function GrizalumFinancial() {
  // Hook de datos financieros
  const {
    misClientes,
    misDeudas,
    misInversiones,
    agregarInversion,
    actualizarGanancias,
    editarInversion,
    eliminarInversion,
    eliminarRegistroGanancia,
    alertas,
    firebaseConectado,
    totalPorCobrar,
    totalPorPagar,
    balanceNeto,
    cobertura,
    registrarPagoCliente,
    pagarDeuda,
    eliminarCliente,
    eliminarDeuda,
    eliminarPagoHistorial,
    eliminarPagoHistorialDeuda,
    eliminarAlerta,
    agregarCliente,
    agregarDeuda,
    obtenerProximasFechasCobro,    
    limpiarAlertasClientePagado,
    setMisClientes,
    setMisDeudas,
    setMisInversiones,
    guardarEnFirebase
  } = useFinancialData();
  
const watermarkStyle = {
  backgroundImage: 'url(/grizalum-logo.png.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: '300px 300px',
  backgroundAttachment: 'fixed',
  opacity: '0.3',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  pointerEvents: 'none'
};
  
  // Estados de UI 
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [ultimoGuardado, setUltimoGuardado] = useState(null);
  const [guardandoAutomatico, setGuardandoAutomatico] = useState(false);
  const [datosModificados, setDatosModificados] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState('');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({});
  const [montoPago, setMontoPago] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState('');
  const [formCliente, setFormCliente] = useState({
  nombre: '',
  email: '',
  telefono: '',
  capital: '',
  tasaInteres: '',
  plazoMeses: '',
  fechaInicio: new Date().toISOString().split('T')[0]
});
const [formDeuda, setFormDeuda] = useState({
  acreedor: '',
  descripcion: '',
  capital: '',
  tasaInteres: '',
  plazoMeses: '',
  fechaInicio: new Date().toISOString().split('T')[0],
  proximoVencimiento: ''
});
  const [formInversion, setFormInversion] = useState({
  nombre: '',
  descripcion: '',
  tipo: 'Maquinaria',
  inversion: '',
  gananciaEsperada: '',
  fechaInicio: new Date().toISOString().split('T')[0]
});
  const [formActualizarGanancias, setFormActualizarGanancias] = useState({
  gananciaActual: '',
  fecha: new Date().toISOString().split('T')[0],
  notas: ''
});
  const [formEditarInversion, setFormEditarInversion] = useState({
  nombre: '',
  descripcion: '',
  tipo: '',
  inversion: '',
  gananciaEsperada: ''
});
  const proximasFechas = obtenerProximasFechasCobro();  
  // FUNCIÓN PARA CREAR SNAPSHOT MANUAL
const crearSnapshotManual = async () => {
  try {
    const { guardarSnapshot } = await import('../services/historialService');
    return await guardarSnapshot(misClientes, misDeudas, misInversiones, 'manual');
  } catch (error) {
    console.error('Error creando snapshot:', error);
    return { success: false, error: error.message };
  }
};

// 🆕 ESTADOS PARA HISTORIAL
const [historialData, setHistorialData] = useState([]);
const [cargandoHistorial, setCargandoHistorial] = useState(false);
const [message, setMessage] = useState('');
const [messageType, setMessageType] = useState('');

// FUNCIÓN PARA MOSTRAR MENSAJES
const showMessage = (text, type = 'info') => {
  setMessage(text);
  setMessageType(type);
  setTimeout(() => {
    setMessage('');
    setMessageType('');
  }, 5000);
};

// FUNCIÓN PARA CARGAR HISTORIAL
const cargarHistorial = async () => {
  setCargandoHistorial(true);
  try {
    const resultado = await obtenerHistorial();
    if (resultado.success) {
      setHistorialData(resultado.historial);
    } else {
      showMessage('Error cargando historial', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  } finally {
    setCargandoHistorial(false);
  }
};

// CARGAR HISTORIAL AL CAMBIAR A ESA VISTA
useEffect(() => {
  if (currentView === 'historial') {
    cargarHistorial();
  }
}, [currentView]);
  
// ✅ CARGAR DATOS AL INICIO - SIN SOBRESCRIBIR
useEffect(() => {
  console.log('📋 Componente montado - datos del hook disponibles');
  console.log('📊 Clientes cargados:', misClientes.length);
  console.log('💳 Deudas cargadas:', misDeudas.length);
  console.log('💰 Inversiones cargadas:', misInversiones.length);
}, [misClientes, misDeudas, misInversiones]);
  
// 🚀 GUARDADO AUTOMÁTICO DESHABILITADO
// useEffect(() => {
//   if (misClientes.length === 0 && misDeudas.length === 0 && misInversiones.length === 0) {
//     return;
//   }

//   console.log('🚀 GUARDADO AUTOMÁTICO');
  
//   const timer = setTimeout(async () => {
//     try {
//       const resultado = await guardarEnFirebase(misClientes, misDeudas, misInversiones);
//       if (resultado.success) {
//         console.log('✅ GUARDADO EXITOSO');
//         setUltimoGuardado(new Date());
//       }
//     } catch (error) {
//       console.error('❌ Error:', error);
//     }
//   }, 1000);

//   return () => clearTimeout(timer);
// }, [misClientes, misDeudas, misInversiones, guardarEnFirebase]);

  const calcularEstadoDeuda = (deuda) => {
    const hoy = new Date();
    const fechaVencimiento = new Date(deuda.proximoVencimiento);
    const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    // Calcular cuotas esperadas vs pagadas
    const fechaInicio = new Date(deuda.fechaInicio);
    const cuotasEsperadas = deuda.plazoMeses; // Total de cuotas del contrato
    const cuotasPagadas = Math.floor((deuda.totalPagado || 0) / deuda.cuotaMensual);
    const cuotasAtrasadas = Math.max(0, cuotasEsperadas - cuotasPagadas);
    
    // Determinar estado y urgencia
    let estado, mensaje, urgencia;
    
    if (diasRestantes < 0) {
      estado = 'vencido';
      mensaje = `Vencido ${Math.abs(diasRestantes)} días`;
      urgencia = 'alta';
    } else if (diasRestantes === 0) {
      estado = 'hoy';
      mensaje = 'Vence HOY';
      urgencia = 'alta';
    } else if (diasRestantes <= 3) {
      estado = 'atrasado';
      mensaje = `Vence en ${diasRestantes} días`;
      urgencia = 'alta';
    } else if (diasRestantes <= 7) {
      estado = 'proximo';
      mensaje = `Vence en ${diasRestantes} días`;
      urgencia = 'media';
    } else {
      estado = 'al-dia';
      mensaje = `Al día (${diasRestantes} días)`;
      urgencia = 'baja';
    }
    
    return {
      estado,
      mensaje,
      urgencia,
      diasRestantes,
      cuotasEsperadas,
      cuotasPagadas,
      cuotasAtrasadas
    };
  };
  
 const abrirModal = (tipo, item = null) => {
  setTipoModal(tipo);
  setItemSeleccionado(item);
  setModalAbierto(true);
  setMontoPago('');
  setNotas('');
  setFechaPago(new Date().toISOString().split('T')[0]);
   
  // Limpiar formulario de deuda si es nueva deuda
if (tipo === 'nueva_deuda') {
  setFormDeuda({
    acreedor: '',
    descripcion: '',
    capital: '',
    tasaInteres: '',
    plazoMeses: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    proximoVencimiento: ''
  });
}
  // Limpiar formulario de cliente si es nuevo cliente
  if (tipo === 'nuevo_cliente') {
    setFormCliente({
      nombre: '',
      email: '',
      telefono: '',
      capital: '',
      tasaInteres: '',
      plazoMeses: '',
      fechaInicio: new Date().toISOString().split('T')[0]
    });
  }
   if (tipo === 'nueva_inversion') {
  setFormInversion({
    nombre: '',
    descripcion: '',
    tipo: 'Maquinaria',
    inversion: '',
    gananciaEsperada: '',
    fechaInicio: new Date().toISOString().split('T')[0]
  });
}
   if (tipo === 'actualizar_ganancias') {
  setFormActualizarGanancias({
    gananciaActual: item.gananciaActual.toString(),
    fecha: new Date().toISOString().split('T')[0],
    notas: ''
  });
}
   if (tipo === 'editar_inversion') {
  setFormEditarInversion({
    nombre: item.nombre,
    descripcion: item.descripcion,
    tipo: item.tipo,
    inversion: item.inversion.toString(),
    gananciaEsperada: item.gananciaEsperada.toString()
  });
}
  
  // Cargar datos COMPLETOS para edición de cliente
if (tipo === 'editar_cliente' && item) {
  setDatosEdicion({
    nombre: item.nombre,
    email: item.email,
    telefono: item.telefono,
    capital: item.capital.toString(),
    tasaInteres: item.tasaInteres.toString(),
    plazoMeses: item.plazoMeses.toString(),
    fechaInicio: item.fechaInicio,
    estado: item.estado
  });
}

// 🔥 NUEVO: Cargar datos COMPLETOS para edición de deuda
if (tipo === 'editar_deuda' && item) {
  setDatosEdicion({
    acreedor: item.acreedor,
    descripcion: item.descripcion,
    capital: item.capital.toString(),
    tasaInteres: item.tasaInteres.toString(),
    plazoMeses: item.plazoMeses.toString(),
    fechaInicio: item.fechaInicio,
    proximoVencimiento: item.proximoVencimiento
  });
}
};
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoModal('');
    setItemSeleccionado(null);
    setMontoPago('');
    setNotas('');
  };
  const procesarPago = () => {
  // Validar que el monto sea válido
  if (!montoPago || parseFloat(montoPago) <= 0) {
    alert('Por favor ingrese un monto válido mayor a 0');
    return;
  }

  const monto = parseFloat(montoPago);
  
  if (tipoModal === 'pago_cliente') {
    // Validar que el monto no sea mayor al saldo pendiente
    if (monto > itemSeleccionado.saldoPendiente) {
      alert(`El monto no puede ser mayor al saldo pendiente: S/ ${itemSeleccionado.saldoPendiente.toLocaleString()}`);
      return;
    }
    
    // Registrar el pago del cliente
    registrarPagoCliente(itemSeleccionado.id, monto, fechaPago);
    alert(`Pago de S/ ${monto.toLocaleString()} registrado exitosamente para ${itemSeleccionado.nombre}`);
  } 
  else if (tipoModal === 'pago_deuda') {
    // Validar que el monto no sea mayor al saldo pendiente
    if (monto > itemSeleccionado.saldoPendiente) {
      alert(`El monto no puede ser mayor al saldo pendiente: S/ ${itemSeleccionado.saldoPendiente.toLocaleString()}`);
      return;
    }
    
    // Procesar el pago de la deuda
    pagarDeuda(itemSeleccionado.id, monto, fechaPago);
    alert(`Pago de S/ ${monto.toLocaleString()} aplicado exitosamente a ${itemSeleccionado.acreedor}`);
  }
  
  // Cerrar el modal después del pago
  cerrarModal();
};

const guardarEdicion = () => {
  if (tipoModal === 'editar_cliente') {
  // Validaciones completas
  if (!datosEdicion.nombre || !datosEdicion.email || !datosEdicion.capital || 
      !datosEdicion.tasaInteres || !datosEdicion.plazoMeses) {
    alert('Por favor complete todos los campos obligatorios');
    return;
  }
  
  if (parseFloat(datosEdicion.capital) <= 0 || parseFloat(datosEdicion.tasaInteres) < 0 || 
      parseInt(datosEdicion.plazoMeses) <= 0) {
    alert('Revise los valores numéricos ingresados');
    return;
  }
  
  // Recálculos automáticos completos
  const nuevoCapital = parseFloat(datosEdicion.capital);
  const nuevaTasa = parseFloat(datosEdicion.tasaInteres);
  const nuevosPlazo = parseInt(datosEdicion.plazoMeses);
  
  // Calcular nueva cuota mensual
  let nuevaCuota = 0;
  if (nuevaTasa > 0) {
    const tasaMensual = nuevaTasa / 100 / 12;
    const factor = Math.pow(1 + tasaMensual, nuevosPlazo);
    const denominador = factor - 1;
    
    if (denominador > 0) {
      nuevaCuota = nuevoCapital * (tasaMensual * factor) / denominador;
    } else {
      nuevaCuota = nuevoCapital / nuevosPlazo;
    }
  } else {
    nuevaCuota = nuevoCapital / nuevosPlazo;
  }
  
  const nuevoTotalCobrar = nuevaCuota * nuevosPlazo;
  const nuevoSaldoPendiente = nuevoTotalCobrar - itemSeleccionado.pagosRecibidos;
  
  // Actualizar cliente con todos los recálculos
  const clienteActualizado = {
    ...itemSeleccionado,
    nombre: datosEdicion.nombre,
    email: datosEdicion.email,
    telefono: datosEdicion.telefono,
    capital: nuevoCapital,
    tasaInteres: nuevaTasa,
    plazoMeses: nuevosPlazo,
    fechaInicio: datosEdicion.fechaInicio,
    estado: datosEdicion.estado,
    cuotaMensual: Math.round(nuevaCuota * 100) / 100,
    totalCobrar: Math.round(nuevoTotalCobrar * 100) / 100,
    saldoPendiente: Math.round(nuevoSaldoPendiente * 100) / 100
  };
  
  setMisClientes(prev => prev.map(c => 
    c.id === itemSeleccionado.id ? clienteActualizado : c
  ));
  
  alert(`Cliente ${datosEdicion.nombre} actualizado completamente`);
  cerrarModal();
}
  
 // 🔥 NUEVO: Edición COMPLETA de deudas
if (tipoModal === 'editar_deuda') {
  // Validaciones completas
  if (!datosEdicion.acreedor || !datosEdicion.descripcion || !datosEdicion.capital || 
      !datosEdicion.tasaInteres || !datosEdicion.plazoMeses) {
    alert('Por favor complete todos los campos obligatorios');
    return;
  }
  
  if (parseFloat(datosEdicion.capital) <= 0 || parseFloat(datosEdicion.tasaInteres) < 0 || 
      parseInt(datosEdicion.plazoMeses) <= 0) {
    alert('Revise los valores numéricos ingresados');
    return;
  }
  
  // 🧮 Recálculos automáticos para deudas
  const nuevoCapital = parseFloat(datosEdicion.capital);
  const nuevaTasa = parseFloat(datosEdicion.tasaInteres);
  const nuevosPlazo = parseInt(datosEdicion.plazoMeses);
  
  let nuevaCuota = 0;
  if (nuevaTasa > 0) {
    const tasaMensual = nuevaTasa / 100 / 12;
    const factor = Math.pow(1 + tasaMensual, nuevosPlazo);
    const denominador = factor - 1;
    
    if (denominador > 0) {
      nuevaCuota = nuevoCapital * (tasaMensual * factor) / denominador;
    } else {
      nuevaCuota = nuevoCapital / nuevosPlazo; // Sin interés
    }
  } else {
    // Sin interés, solo dividir el capital
    nuevaCuota = nuevoCapital / nuevosPlazo;
  }
  
  // Actualizar deuda con todos los recálculos
  const deudaActualizada = {
    ...itemSeleccionado,
    acreedor: datosEdicion.acreedor,
    descripcion: datosEdicion.descripcion,
    capital: nuevoCapital,
    tasaInteres: nuevaTasa,
    plazoMeses: nuevosPlazo,
    fechaInicio: datosEdicion.fechaInicio,
    cuotaMensual: Math.round(nuevaCuota * 100) / 100,
    saldoPendiente: Math.round((nuevoCapital - (itemSeleccionado.totalPagado || 0)) * 100) / 100,
    proximoVencimiento: datosEdicion.proximoVencimiento
  };
  
  setMisDeudas(prev => prev.map(d => 
    d.id === itemSeleccionado.id ? deudaActualizada : d
  ));
  
  alert(`Deuda de ${datosEdicion.acreedor} actualizada exitosamente`);
  cerrarModal();
}
};
  const eliminarItem = (tipo, id) => {
    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
      if (tipo === 'cliente') {     
        eliminarCliente(id);
        alert('Cliente eliminado');
      } else if (tipo === 'deuda') {
        eliminarDeuda(id);
        alert('Deuda eliminada');
      }
    }
  };

  const copiarReporte = () => {
    const mensaje = `GRIZALUM COMPAÑIA METALURGICA
Reporte Financiero - ${new Date().toLocaleDateString()}

RESUMEN EJECUTIVO:
• Por Cobrar: S/ ${totalPorCobrar.toLocaleString()}
• Por Pagar: S/ ${totalPorPagar.toLocaleString()}
• Balance Neto: S/ ${balanceNeto.toLocaleString()}
• Cobertura Financiera: ${Math.round(cobertura)}%

Control Financiero Empresarial Seguro`;

    navigator.clipboard.writeText(mensaje).then(() => {
      alert('Reporte copiado al portapapeles exitosamente');
    }).catch(() => {
      alert('Reporte preparado para copiar');
    });
  };

  const copiarLink = async () => {
  try {
        const link = window.location.href;  
    
    // Método 1: Clipboard API moderno
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
      alert('✅ Link copiado al portapapeles exitosamente');
    } else {
      // Método 2: Fallback para móviles
      const textArea = document.createElement('textarea');
      textArea.value = link;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        alert('✅ Link copiado al portapapeles');
      } catch (err) {
        alert(`📋 Copia este link: ${link}`);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (error) {
    console.error('Error copiando link:', error);
    alert(`📋 Copia manualmente: ${window.location.href}`);
  }
};

  const guardarEnNube = async () => {
  console.log('🔥 GUARDADO DESDE BOTÓN NARANJA INICIADO');
  setSincronizando(true);
  
  try {
    const resultado = await guardarEnFirebase(misClientes, misDeudas, misInversiones);
    
    if (resultado.success) {
      setDatosGuardados(true);
      alert('✅ ¡Datos guardados en Firebase exitosamente!');
      setTimeout(() => setDatosGuardados(false), 3000);
    } else {
      alert('❌ Error al guardar: ' + resultado.message);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Error: ' + error.message);
  } finally {
    setSincronizando(false);
  }
};
  
const autoSave = async () => {
  if (!datosModificados) return;
  
  setGuardandoAutomatico(true);
  
  try {
    // Simular guardado automático
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUltimoGuardado(new Date());
    setDatosModificados(false);
    setGuardandoAutomatico(false);
    
    console.log('✅ Datos guardados automáticamente');
  } catch (error) {
    console.error('❌ Error en autosave:', error);
    setGuardandoAutomatico(false);
  }
};

 return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">
  {tipoModal === 'pago_cliente' && 'Registrar Pago de Cliente'}
  {tipoModal === 'pago_deuda' && 'Pagar Deuda'}
  {tipoModal === 'historial' && 'Historial de Pagos'}
  {tipoModal === 'historial_inversion' && 'Historial de Ganancias'}
  {tipoModal === 'nuevo_cliente' && 'Nuevo Cliente'}
  {tipoModal === 'nueva_deuda' && 'Nueva Deuda'}
  {tipoModal === 'editar_cliente' && 'Editar Cliente'}
  {tipoModal === 'editar_deuda' && 'Editar Deuda'}
  {tipoModal === 'nueva_inversion' && 'Nueva Inversión'}
  {tipoModal === 'actualizar_ganancias' && 'Actualizar Ganancias'}
  {tipoModal === 'editar_inversion' && 'Editar Inversión'}
</h3>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              {tipoModal === 'nueva_deuda' && (
  <div className="space-y-4">
    <div className="bg-red-50 p-4 rounded-lg">
      <h4 className="font-semibold text-red-800">Agregar Nueva Deuda</h4>
      <p className="text-sm text-red-600">Complete la información de la obligación financiera</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Acreedor</label>
        <input
          type="text"
          value={formDeuda.acreedor}
          onChange={(e) => setFormDeuda(prev => ({...prev, acreedor: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Ej: Banco Santander"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Capital (S/)</label>
        <input
          type="number"
          value={formDeuda.capital}
          onChange={(e) => setFormDeuda(prev => ({...prev, capital: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="50000"
          step="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Interés (%)</label>
        <input
          type="number"
          value={formDeuda.tasaInteres}
          onChange={(e) => setFormDeuda(prev => ({...prev, tasaInteres: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="18"
          step="0.1"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Plazo (meses)</label>
        <input
          type="number"
          value={formDeuda.plazoMeses}
          onChange={(e) => setFormDeuda(prev => ({...prev, plazoMeses: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="24"
          min="1"
          max="120"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <input
          type="date"
          value={formDeuda.fechaInicio}
          onChange={(e) => setFormDeuda(prev => ({...prev, fechaInicio: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Próximo Vencimiento</label>
        <input
          type="date"
          value={formDeuda.proximoVencimiento}
          onChange={(e) => setFormDeuda(prev => ({...prev, proximoVencimiento: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
      <textarea
        value={formDeuda.descripcion}
        onChange={(e) => setFormDeuda(prev => ({...prev, descripcion: e.target.value}))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Descripción detallada de la deuda"
        rows="3"
      />
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => {
          if (!formDeuda.acreedor || !formDeuda.descripcion || !formDeuda.capital || !formDeuda.tasaInteres || !formDeuda.plazoMeses) {
            alert('Por favor complete todos los campos obligatorios');
            return;
          }
          
          if (parseFloat(formDeuda.capital) <= 0 || parseFloat(formDeuda.tasaInteres) < 0 || parseInt(formDeuda.plazoMeses) <= 0) {
            alert('Revise los valores numéricos ingresados');
            return;
          }
          
          try {
            agregarDeuda(formDeuda);
            alert(`Deuda de ${formDeuda.acreedor} agregada exitosamente`);
            cerrarModal();
          } catch (error) {
            console.error('Error al agregar deuda:', error);
            alert('Error al agregar la deuda. Revise los datos ingresados.');
          }
        }}
        className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all font-semibold"
      >
        Agregar Deuda
      </button>
    </div>
  </div>
)}
{tipoModal === 'nueva_inversion' && (
  <div className="space-y-4">
    <div className="bg-purple-50 p-4 rounded-lg">
      <h4 className="font-semibold text-purple-800">Agregar Nueva Inversión</h4>
      <p className="text-sm text-purple-600">Complete la información del activo o proyecto</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Inversión <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formInversion.nombre}
          onChange={(e) => setFormInversion(prev => ({...prev, nombre: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ej: Maquina Cortadora CNC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Inversión <span className="text-red-500">*</span>
        </label>
        <select
          value={formInversion.tipo}
          onChange={(e) => setFormInversion(prev => ({...prev, tipo: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="Maquinaria">Maquinaria</option>
          <option value="Inmueble">Inmueble</option>
          <option value="Vehículo">Vehículo</option>
          <option value="Herramientas">Herramientas</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto de Inversión (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formInversion.inversion}
          onChange={(e) => setFormInversion(prev => ({...prev, inversion: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="25000"
          step="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ganancia Esperada (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formInversion.gananciaEsperada}
          onChange={(e) => setFormInversion(prev => ({...prev, gananciaEsperada: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="5000"
          step="100"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <input
          type="date"
          value={formInversion.fechaInicio}
          onChange={(e) => setFormInversion(prev => ({...prev, fechaInicio: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción <span className="text-red-500">*</span>
      </label>
      <textarea
        value={formInversion.descripcion}
        onChange={(e) => setFormInversion(prev => ({...prev, descripcion: e.target.value}))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Descripción detallada de la inversión y sus beneficios esperados"
        rows="3"
      />
    </div>

    {/* Vista previa de ROI esperado */}
    {formInversion.inversion && formInversion.gananciaEsperada && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">Vista Previa de ROI:</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ROI Esperado:</span>
            <span className="font-bold text-blue-600 ml-1">
              {((parseFloat(formInversion.gananciaEsperada) / parseFloat(formInversion.inversion)) * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Retorno Total:</span>
            <span className="font-bold text-green-600 ml-1">
              S/ {(parseFloat(formInversion.inversion || 0) + parseFloat(formInversion.gananciaEsperada || 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )}

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => {
          // Validar campos obligatorios
          if (!formInversion.nombre || !formInversion.descripcion || !formInversion.inversion || !formInversion.gananciaEsperada) {
            alert('Por favor complete todos los campos obligatorios');
            return;
          }
          
          // Validar que los números sean válidos
          if (parseFloat(formInversion.inversion) <= 0 || parseFloat(formInversion.gananciaEsperada) <= 0) {
            alert('Los valores deben ser mayores a 0');
            return;
          }
          
          try {
            agregarInversion(formInversion);
            alert(`Inversión "${formInversion.nombre}" agregada exitosamente`);
            cerrarModal();
          } catch (error) {
            console.error('Error al agregar inversión:', error);
            alert('Error al agregar la inversión. Revise los datos ingresados.');
          }
        }}
        className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-all font-semibold"
      >
        💰 Agregar Inversión
      </button>
    </div>
  </div>
)}
{tipoModal === 'actualizar_ganancias' && (
  <div className="space-y-4">
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-semibold text-green-800">Actualizar Ganancias de Inversión</h4>
      <p className="text-sm text-green-600">Registre las ganancias actuales del proyecto</p>
    </div>

    {/* Información de la inversión */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h5 className="font-semibold text-gray-800">{itemSeleccionado?.nombre}</h5>
      <p className="text-sm text-gray-600">{itemSeleccionado?.descripcion}</p>
      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
        <div>
          <span className="text-gray-600">Inversión:</span>
          <span className="font-semibold text-blue-600 ml-1">S/ {itemSeleccionado?.inversion?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Esperada:</span>
          <span className="font-semibold text-green-600 ml-1">S/ {itemSeleccionado?.gananciaEsperada?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Actual:</span>
          <span className="font-semibold text-purple-600 ml-1">S/ {itemSeleccionado?.gananciaActual?.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
         Ganancia Adicional (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formActualizarGanancias.gananciaActual}
          onChange={(e) => setFormActualizarGanancias(prev => ({...prev, gananciaActual: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="1000"
          step="100"
          min="0"
        />
      </div>
       <p className="text-xs text-gray-500 mt-1">
       💡 Solo ingrese el monto adicional recibido (se sumará automáticamente)
      </p>     

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Actualización</label>
        <input
          type="date"
          value={formActualizarGanancias.fecha}
          onChange={(e) => setFormActualizarGanancias(prev => ({...prev, fecha: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas (Opcional)</label>
        <textarea
          value={formActualizarGanancias.notas}
          onChange={(e) => setFormActualizarGanancias(prev => ({...prev, notas: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Descripción de los logros o avances..."
          rows="3"
        />
      </div>
    </div>

    {/* Vista previa de cálculos */}
    {formActualizarGanancias.gananciaActual && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">Vista Previa de Resultados:</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nuevo ROI:</span>
            <span className="font-bold text-blue-600 ml-1">
              {((parseFloat(formActualizarGanancias.gananciaActual) / itemSeleccionado?.inversion) * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Nuevo Progreso:</span>
            <span className="font-bold text-green-600 ml-1">
              {Math.min((parseFloat(formActualizarGanancias.gananciaActual) / itemSeleccionado?.gananciaEsperada) * 100, 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    )}

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => {
          // Validar campos obligatorios
          if (!formActualizarGanancias.gananciaActual) {
            alert('Por favor ingrese la ganancia actual');
            return;
          }
          
          // Validar que el valor sea válido
          if (parseFloat(formActualizarGanancias.gananciaActual) < 0) {
            alert('La ganancia no puede ser negativa');
            return;
          }
          
          try {
            actualizarGanancias(
            itemSeleccionado.id, 
            formActualizarGanancias.gananciaActual,
            formActualizarGanancias.fecha,
            formActualizarGanancias.notas
            );
            alert(`Ganancias actualizadas exitosamente para "${itemSeleccionado.nombre}"`);
            cerrarModal();
          } catch (error) {
            console.error('Error al actualizar ganancias:', error);
            alert('Error al actualizar las ganancias. Intente nuevamente.');
          }
        }}
        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all font-semibold"
      >
        💰 Actualizar Ganancias
      </button>
    </div>
  </div>
)}
{tipoModal === 'editar_inversion' && (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800">Editar Información de la Inversión</h4>
      <p className="text-sm text-blue-600">Modifique los datos de la inversión</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Inversión <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formEditarInversion.nombre}
          onChange={(e) => setFormEditarInversion(prev => ({...prev, nombre: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Maquina Cortadora CNC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Inversión <span className="text-red-500">*</span>
        </label>
        <select
          value={formEditarInversion.tipo}
          onChange={(e) => setFormEditarInversion(prev => ({...prev, tipo: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Maquinaria">Maquinaria</option>
          <option value="Inmueble">Inmueble</option>
          <option value="Vehículo">Vehículo</option>
          <option value="Herramientas">Herramientas</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto de Inversión (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formEditarInversion.inversion}
          onChange={(e) => setFormEditarInversion(prev => ({...prev, inversion: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="25000"
          step="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ganancia Esperada (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formEditarInversion.gananciaEsperada}
          onChange={(e) => setFormEditarInversion(prev => ({...prev, gananciaEsperada: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="5000"
          step="100"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción <span className="text-red-500">*</span>
      </label>
      <textarea
        value={formEditarInversion.descripcion}
        onChange={(e) => setFormEditarInversion(prev => ({...prev, descripcion: e.target.value}))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Descripción detallada de la inversión"
        rows="3"
      />
    </div>

    {/* Vista previa de nuevos cálculos */}
    {formEditarInversion.inversion && formEditarInversion.gananciaEsperada && (
      <div className="bg-green-50 p-4 rounded-lg">
        <h5 className="font-semibold text-green-800 mb-2">Vista Previa de Nuevos Cálculos:</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nuevo ROI Esperado:</span>
            <span className="font-bold text-blue-600 ml-1">
              {((parseFloat(formEditarInversion.gananciaEsperada) / parseFloat(formEditarInversion.inversion)) * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Nuevo Retorno Total:</span>
            <span className="font-bold text-green-600 ml-1">
              S/ {(parseFloat(formEditarInversion.inversion || 0) + parseFloat(formEditarInversion.gananciaEsperada || 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )}

    <div className="bg-yellow-50 p-3 rounded-lg">
      <p className="text-sm text-yellow-800">
        <strong>⚠️ Importante:</strong> Al modificar los valores, se recalculará automáticamente el ROI y progreso basado en las ganancias actuales.
      </p>
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => {
          // Validar campos obligatorios
          if (!formEditarInversion.nombre || !formEditarInversion.descripcion || !formEditarInversion.inversion || !formEditarInversion.gananciaEsperada) {
            alert('Por favor complete todos los campos obligatorios');
            return;
          }
          
          // Validar que los números sean válidos
          if (parseFloat(formEditarInversion.inversion) <= 0 || parseFloat(formEditarInversion.gananciaEsperada) <= 0) {
            alert('Los valores deben ser mayores a 0');
            return;
          }
          
          try {
            editarInversion(itemSeleccionado.id, formEditarInversion);
            alert(`Inversión "${formEditarInversion.nombre}" actualizada exitosamente`);
            cerrarModal();
          } catch (error) {
            console.error('Error al editar inversión:', error);
            alert('Error al editar la inversión. Revise los datos ingresados.');
          }
        }}
        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold"
      >
        💾 Guardar Cambios
      </button>
    </div>
  </div>
)}
              {(tipoModal === 'pago_cliente' || tipoModal === 'pago_deuda') && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      {tipoModal === 'pago_cliente' ? itemSeleccionado?.nombre : itemSeleccionado?.acreedor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Saldo Pendiente: S/ {itemSeleccionado?.saldoPendiente?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cuota: S/ {itemSeleccionado?.cuotaMensual?.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto a Pagar</label>
                    <input
                      type="number"
                      value={montoPago}
                      onChange={(e) => setMontoPago(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input
                      type="date"
                      value={fechaPago}
                      onChange={(e) => setFechaPago(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={cerrarModal}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={procesarPago}
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all font-semibold"
                    >
                      Confirmar Pago
                    </button>
                  </div>
                </div>
              )}

              {tipoModal === 'historial' && itemSeleccionado && (
                <div className="space-y-4">
                 <div className="bg-gray-50 p-4 rounded-lg">
  <h4 className="font-semibold text-gray-800">{itemSeleccionado.nombre || itemSeleccionado.acreedor}</h4>
  <p className="text-sm text-gray-600">
    Capital: S/ {itemSeleccionado.capital?.toLocaleString()} | 
    Tasa: {itemSeleccionado.tasaInteres}% | 
    Plazo: {itemSeleccionado.plazoMeses} meses
  </p>
  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
    <div>
      <span className="text-gray-600">Total Pagado:</span>
      <span className="font-semibold text-green-600 ml-1">S/ {(itemSeleccionado.pagosRecibidos || itemSeleccionado.totalPagado || 0).toLocaleString()}</span>
    </div>
    <div>
      <span className="text-gray-600">Saldo Pendiente:</span>
      <span className="font-semibold text-red-600 ml-1">S/ {itemSeleccionado.saldoPendiente?.toLocaleString()}</span>
    </div>
  </div>
</div>
{tipoModal === 'historial_inversion' && itemSeleccionado && (
  <div className="space-y-4">
    <div className="bg-purple-50 p-4 rounded-lg">
      <h4 className="font-semibold text-purple-800">{itemSeleccionado.nombre}</h4>
      <p className="text-sm text-purple-600">{itemSeleccionado.descripcion}</p>
      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
        <div>
          <span className="text-gray-600">Inversión:</span>
          <span className="font-semibold text-blue-600 ml-1">S/ {itemSeleccionado.inversion?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Esperada:</span>
          <span className="font-semibold text-green-600 ml-1">S/ {itemSeleccionado.gananciaEsperada?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Actual:</span>
          <span className="font-semibold text-purple-600 ml-1">S/ {itemSeleccionado.gananciaActual?.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="max-h-64 overflow-y-auto">
      <h5 className="font-semibold mb-2">Historial de Ganancias:</h5>
      {itemSeleccionado.historialGanancias?.length > 0 ? (
        <div className="space-y-2">
          {itemSeleccionado.historialGanancias.map((registro) => (
            <div key={registro.id} className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">S/ {registro.gananciaActual.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">{registro.fecha}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      registro.diferencia >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {registro.diferencia >= 0 ? '+' : ''}{registro.diferencia.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      (Anterior: S/ {registro.gananciaAnterior.toLocaleString()})
                    </span>
                  </div>
                  {registro.notas && (
                    <p className="text-xs text-gray-600 italic">{registro.notas}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Está seguro de eliminar el registro de S/ ${registro.gananciaActual.toLocaleString()}?\n\nEsto recalculará automáticamente el ROI y progreso.`)) {
                      eliminarRegistroGanancia(itemSeleccionado.id, registro.id);
                    }
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Eliminar registro - Recalcula automáticamente"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay registros de ganancias</p>
      )}
    </div>

    <button
      onClick={cerrarModal}
      className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-all font-semibold"
    >
      Cerrar
    </button>
  </div>
)}
                  <div className="max-h-64 overflow-y-auto">
                    <h5 className="font-semibold mb-2">Historial de Pagos:</h5>
                    {itemSeleccionado.historialPagos?.length > 0 ? (
                      <div className="space-y-2">
                        {itemSeleccionado.historialPagos.map((pago) => (
                          <div key={pago.id} className="bg-white border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">S/ {pago.monto.toLocaleString()}</span>
                                  <span className="text-sm text-gray-600">{pago.fecha}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  pago.tipo === 'Cuota Regular' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {pago.tipo}
                                </span>
                              </div>
                              <button
  onClick={() => {
    if (window.confirm(`¿Está seguro de eliminar el pago de S/ ${pago.monto.toLocaleString()}?\n\nEsto actualizará automáticamente:\n• Saldo pendiente\n• Total pagado\n• Estado`)) {
      // ✅ DETECTAR si es cliente o deuda
      if (itemSeleccionado.nombre) {
        // Es un cliente (tiene nombre)
        eliminarPagoHistorial(itemSeleccionado.id, pago.id);
      } else if (itemSeleccionado.acreedor) {
        // Es una deuda (tiene acreedor)
        eliminarPagoHistorialDeuda(itemSeleccionado.id, pago.id);
      }
    }
  }}
  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
  title="Eliminar pago - Actualiza automáticamente los saldos"
>
  <Trash2 size={16} />
</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No hay pagos registrados</p>
                    )}
                  </div>

                  <button
                    onClick={cerrarModal}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    Cerrar
                  </button>
                </div>
              )}
{tipoModal === 'nuevo_cliente' && (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800">Agregar Nuevo Cliente</h4>
      <p className="text-sm text-blue-600">Complete la información del préstamo</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
        <input
          type="text"
          value={formCliente.nombre}
          onChange={(e) => setFormCliente(prev => ({...prev, nombre: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formCliente.email}
          onChange={(e) => setFormCliente(prev => ({...prev, email: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
        <input
          type="tel"
          value={formCliente.telefono}
          onChange={(e) => setFormCliente(prev => ({...prev, telefono: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+51 999 123 456"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Capital (S/)</label>
        <input
          type="number"
          value={formCliente.capital}
          onChange={(e) => setFormCliente(prev => ({...prev, capital: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10000"
          step="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Interés (%)</label>
        <input
          type="number"
          value={formCliente.tasaInteres}
          onChange={(e) => setFormCliente(prev => ({...prev, tasaInteres: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="14"
          step="0.1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Plazo (meses)</label>
        <input
          type="number"
          value={formCliente.plazoMeses}
          onChange={(e) => setFormCliente(prev => ({...prev, plazoMeses: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="18"
          min="1"
          max="60"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
      <input
        type="date"
        value={formCliente.fechaInicio}
        onChange={(e) => setFormCliente(prev => ({...prev, fechaInicio: e.target.value}))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => {
  // Validar campos obligatorios
  if (!formCliente.nombre || !formCliente.capital || !formCliente.tasaInteres || !formCliente.plazoMeses) {
    alert('Por favor complete todos los campos obligatorios');
    return;
  }
  
  // Validar que los números sean válidos
  if (parseFloat(formCliente.capital) <= 0 || parseFloat(formCliente.tasaInteres) <= 0 || parseInt(formCliente.plazoMeses) <= 0) {
    alert('Los valores numéricos deben ser mayores a 0');
    return;
  }
  
  try {
    agregarCliente(formCliente);
    alert(`Cliente ${formCliente.nombre} agregado exitosamente`);
    cerrarModal();
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    alert('Error al agregar el cliente. Revise los datos ingresados.');
  }
}}
        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all font-semibold"
      >
        Agregar Cliente
      </button>
    </div>
  </div>
)}
       {/* Formulario de edición de cliente COMPLETO */}
{tipoModal === 'editar_cliente' && (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800">Editar Información Completa del Cliente</h4>
      <p className="text-sm text-blue-600">Modifique todos los datos del préstamo</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nombre Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={datosEdicion.nombre || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, nombre: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={datosEdicion.email || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, email: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ejemplo@correo.com"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={datosEdicion.telefono || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, telefono: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+51 999 123 456"
        />
      </div>

      {/* Capital */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capital (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.capital || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, capital: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10000"
          step="100"
        />
      </div>

      {/* Tasa de Interés */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tasa de Interés (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.tasaInteres || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, tasaInteres: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="14"
          step="0.1"
          min="0"
        />
      </div>

      {/* Plazo en Meses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plazo (meses) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.plazoMeses || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, plazoMeses: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="18"
          min="1"
          max="60"
        />
      </div>

      {/* Fecha de Inicio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <input
          type="date"
          value={datosEdicion.fechaInicio || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, fechaInicio: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Estado del Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
        <select
          value={datosEdicion.estado || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, estado: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Suspendido">Suspendido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
    </div>

    {/* Vista previa de cálculos */}
    {datosEdicion.capital && datosEdicion.tasaInteres && datosEdicion.plazoMeses && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">Vista Previa de Cálculos:</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nueva Cuota Mensual:</span>
            <span className="font-bold text-blue-600 ml-1">
              S/ {(() => {
                const capital = parseFloat(datosEdicion.capital);
                const tasa = parseFloat(datosEdicion.tasaInteres);
                const meses = parseInt(datosEdicion.plazoMeses);
                
                // VALIDAR PRIMERO
                if (isNaN(capital) || isNaN(tasa) || isNaN(meses) || 
                    capital <= 0 || meses <= 0 || tasa < 0) {
                  return "0";
                }
  
                if (tasa > 0) {
                  const tasaMensual = tasa / 100 / 12;
                  const factor = Math.pow(1 + tasaMensual, meses);
                  const denominador = factor - 1;
    
                  if (denominador > 0) {
                    const cuota = capital * (tasaMensual * factor) / denominador;
                    return cuota.toLocaleString();
                  } else {
                    return (capital / meses).toLocaleString();
                  }
                } else {
                  return (capital / meses).toLocaleString();
                }
              })()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total a Cobrar:</span>
            <span className="font-bold text-green-600 ml-1">
              S/ {(() => {
                const capital = parseFloat(datosEdicion.capital);
                const tasa = parseFloat(datosEdicion.tasaInteres);
                const meses = parseInt(datosEdicion.plazoMeses);
                
                if (tasa > 0) {
                  const tasaMensual = tasa / 100 / 12;
                  const cuota = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
                  return (cuota * meses).toLocaleString();
                } else {
                  return capital.toLocaleString();
                }
              })()}
            </span>
          </div>
        </div>
      </div>
    )}

    <div className="bg-yellow-50 p-3 rounded-lg">
      <p className="text-sm text-yellow-800">
        <strong>⚠️ Importante:</strong> Al modificar capital, tasa o plazo, se recalculará automáticamente la cuota mensual, total a cobrar y saldo pendiente.
      </p>
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => guardarEdicion()}
        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold"
      >
        💾 Guardar Cambios Completos
      </button>
    </div>
  </div>
)}

{/* Formulario de edición de deuda */}
{tipoModal === 'editar_deuda' && (
  <div className="space-y-4">
    <div className="bg-orange-50 p-4 rounded-lg">
      <h4 className="font-semibold text-orange-800">Editar Información Completa de la Deuda</h4>
      <p className="text-sm text-orange-600">Modifique todos los datos necesarios</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Acreedor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Acreedor <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={datosEdicion.acreedor || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, acreedor: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Nombre del acreedor"
        />
      </div>

      {/* Capital */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capital (S/) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.capital || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, capital: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="50000"
          step="100"
        />
      </div>

      {/* Tasa de Interés */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tasa de Interés (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.tasaInteres || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, tasaInteres: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="18"
          step="0.1"
          min="0"
        />
      </div>

      {/* Plazo en Meses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plazo (meses) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={datosEdicion.plazoMeses || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, plazoMeses: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="24"
          min="1"
          max="120"
        />
      </div>

      {/* Fecha de Inicio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <input
          type="date"
          value={datosEdicion.fechaInicio || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, fechaInicio: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Próximo Vencimiento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Próximo Vencimiento</label>
        <input
          type="date"
          value={datosEdicion.proximoVencimiento || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, proximoVencimiento: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* Descripción */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción <span className="text-red-500">*</span>
      </label>
      <textarea
        value={datosEdicion.descripcion || ''}
        onChange={(e) => setDatosEdicion(prev => ({...prev, descripcion: e.target.value}))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Descripción detallada de la deuda"
        rows="3"
      />
    </div>

    {/* Vista previa de cálculos */}
    {datosEdicion.capital && datosEdicion.tasaInteres && datosEdicion.plazoMeses && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">Vista Previa de Cálculos:</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nueva Cuota Mensual:</span>
            <span className="font-bold text-blue-600 ml-1">
              S/ {(() => {
               const capital = parseFloat(datosEdicion.capital);
               const tasa = parseFloat(datosEdicion.tasaInteres);
               const meses = parseInt(datosEdicion.plazoMeses);
                
                // VALIDAR PRIMERO
                if (isNaN(capital) || isNaN(tasa) || isNaN(meses) || 
                 capital <= 0 || meses <= 0 || tasa < 0) {
                  return "0";
                  
                 }
  
               if (tasa > 0) {
                const tasaMensual = tasa / 100 / 12;
                const factor = Math.pow(1 + tasaMensual, meses);
               const denominador = factor - 1;
    
              if (denominador > 0) {
              const cuota = capital * (tasaMensual * factor) / denominador;
             return cuota.toLocaleString();
             } else {
             return (capital / meses).toLocaleString();
             }
             } else {
             return (capital / meses).toLocaleString();
            }
            })()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total a Pagar:</span>
            <span className="font-bold text-red-600 ml-1">
              S/ {(() => {
                const capital = parseFloat(datosEdicion.capital);
                const tasa = parseFloat(datosEdicion.tasaInteres);
                const meses = parseInt(datosEdicion.plazoMeses);
                
                if (tasa > 0) {
                  const tasaMensual = tasa / 100 / 12;
                  const cuota = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
                  return (cuota * meses).toLocaleString();
                } else {
                  return capital.toLocaleString();
                }
              })()}
            </span>
          </div>
        </div>
      </div>
    )}

    <div className="bg-yellow-50 p-3 rounded-lg">
      <p className="text-sm text-yellow-800">
        <strong>⚠️ Importante:</strong> Al modificar capital, tasa o plazo, se recalculará automáticamente la cuota mensual y los saldos.
      </p>
    </div>

    <div className="flex space-x-3 mt-6">
      <button
        onClick={cerrarModal}
        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
      >
        Cancelar
      </button>
      <button
        onClick={() => guardarEdicion()}
        className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all font-semibold"
      >
        💾 Guardar Cambios
      </button>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:transform-none`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                 <img 
                  src="/grizalum-logo.png.jpg" 
                  alt="GRIZALUM"
                  className="w-full h-full object-contain"
                  />
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
                { id: 'historial', label: 'Historial', icon: Shield },
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:ml-64 relative">
        
         <div 
         className="fixed inset-0 pointer-events-none" 
         style={watermarkStyle}
         />
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
                <button onClick={copiarReporte} className="text-blue-600 hover:text-blue-800">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6 max-w-full">
            <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-white p-2 shadow-lg">
                    <img 
                      src="/grizalum-logo.png.jpg"
                      alt="GRIZALUM Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      GRIZ
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">GRIZALUM</h1>
                    <p className="text-slate-300 text-lg">COMPAÑÍA METÁLURGICA</p>
                    <p className="text-slate-400 text-sm">Control Financiero Profesional</p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className={`${firebaseConectado ? 'text-green-400' : 'text-red-400'}`} size={20} />
                    <span className={`font-semibold ${firebaseConectado ? 'text-green-400' : 'text-red-400'}`}>
                      {firebaseConectado ? 'Sistema Online' : 'Sin Conexión'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
                  </p>
                 <div className="flex items-center space-x-2 mt-3">
  {/* Indicador de estado de autosave */}
  <div className="flex items-center space-x-2 text-xs">
    {guardandoAutomatico ? (
      <div className="flex items-center text-yellow-400">
        <div className="animate-spin rounded-full h-3 w-3 border border-yellow-400 border-t-transparent mr-1"></div>
        Guardando...
      </div>
    ) : ultimoGuardado ? (
      <div className="flex items-center text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Guardado {new Date(ultimoGuardado).toLocaleTimeString()}
      </div>
    ) : datosModificados ? (
      <div className="flex items-center text-orange-400">
        <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
        Cambios sin guardar
      </div>
    ) : (
      <div className="flex items-center text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Todo guardado
      </div>
    )}
  </div>
  
  <button 
    onClick={copiarLink}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all flex items-center text-sm"
    title="Copiar Link"
  >
    <Link size={16} className="mr-2" />
    Link
  </button>
  
  <button 
  onClick={() => {
    console.log('🚀 GUARDADO MANUAL - clientes:', misClientes);
    console.log('🚀 GUARDADO MANUAL - deudas:', misDeudas);
    guardarEnFirebase(misClientes, misDeudas, misInversiones);
  }}
    disabled={guardandoAutomatico || !firebaseConectado}
    className={`px-3 py-2 rounded-lg transition-all flex items-center text-sm ${
      !datosModificados ? 'bg-green-600 text-white' : 
      firebaseConectado ? 'bg-orange-600 hover:bg-orange-700 text-white' : 
      'bg-gray-400 text-gray-200 cursor-not-allowed'
    }`}
    title="Guardar manualmente"
  >
    {guardandoAutomatico ? (
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
    ) : !datosModificados ? (
      <CheckCircle size={16} className="mr-2" />
    ) : (
      <Save size={16} className="mr-2" />
    )}
    {!datosModificados ? 'Guardado' : 'Guardar'}
  </button>
      <button 
    onClick={async () => {
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toLocaleTimeString();
      
      // Crear reporte HTML
      const reporteHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>GRIZALUM - Backup ${fecha}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #1e40af; margin-bottom: 30px; }
        .section { margin: 20px 0; page-break-inside: avoid; }
        .section h2 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .balance { background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .client { background-color: #dbeafe; }
        .debt { background-color: #fee2e2; }
        .investment { background-color: #f3e8ff; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏭 GRIZALUM COMPAÑÍA METÁLURGICA</h1>
        <h2>Control Financiero Profesional</h2>
        <p><strong>Backup generado:</strong> ${fecha} a las ${hora}</p>
    </div>

    <div class="balance">
        <h2>💰 RESUMEN FINANCIERO</h2>
        <p><strong>Por Cobrar:</strong> S/ ${totalPorCobrar.toLocaleString()}</p>
        <p><strong>Por Pagar:</strong> S/ ${totalPorPagar.toLocaleString()}</p>
        <p><strong>Balance Neto:</strong> S/ ${balanceNeto.toLocaleString()}</p>
        <p><strong>Cobertura:</strong> ${Math.round(cobertura)}%</p>
    </div>

    <div class="section">
        <h2>👥 CARTERA DE CLIENTES (${misClientes.length})</h2>
        <table>
            <tr>
                <th>Cliente</th>
                <th>Capital</th>
                <th>Pendiente</th>
                <th>Cuota</th>
                <th>Pagado</th>
                <th>Estado</th>
            </tr>
            ${misClientes.map(c => `
            <tr class="client">
                <td><strong>${c.nombre}</strong><br>${c.email}<br>${c.telefono}</td>
                <td>S/ ${c.capital.toLocaleString()}</td>
                <td>S/ ${c.saldoPendiente.toLocaleString()}</td>
                <td>S/ ${c.cuotaMensual.toLocaleString()}</td>
                <td>S/ ${c.pagosRecibidos.toLocaleString()}</td>
                <td>${c.estado}</td>
            </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <h2>💳 GESTIÓN DE DEUDAS (${misDeudas.length})</h2>
        <table>
            <tr>
                <th>Acreedor</th>
                <th>Capital</th>
                <th>Pendiente</th>
                <th>Cuota</th>
                <th>Pagado</th>
                <th>Estado</th>
            </tr>
            ${misDeudas.map(d => `
            <tr class="debt">
                <td><strong>${d.acreedor}</strong><br>${d.descripcion}</td>
                <td>S/ ${d.capital.toLocaleString()}</td>
                <td>S/ ${d.saldoPendiente.toLocaleString()}</td>
                <td>S/ ${d.cuotaMensual.toLocaleString()}</td>
                <td>S/ ${(d.totalPagado || 0).toLocaleString()}</td>
                <td>${d.estado}</td>
            </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <h2>📈 INVERSIONES (${misInversiones.length})</h2>
        <table>
            <tr>
                <th>Proyecto</th>
                <th>Inversión</th>
                <th>Esperada</th>
                <th>Actual</th>
                <th>ROI</th>
                <th>Estado</th>
            </tr>
            ${misInversiones.map(i => `
            <tr class="investment">
                <td><strong>${i.nombre}</strong><br>${i.descripcion}</td>
                <td>S/ ${i.inversion.toLocaleString()}</td>
                <td>S/ ${i.gananciaEsperada.toLocaleString()}</td>
                <td>S/ ${i.gananciaActual.toLocaleString()}</td>
                <td>${i.roi.toFixed(1)}%</td>
                <td>${i.estado}</td>
            </tr>
            `).join('')}
        </table>
    </div>

    <div style="margin-top: 30px; text-align: center; color: #666;">
        <p>📄 Documento generado automáticamente por el Sistema Financiero GRIZALUM</p>
        <p>🔒 Información confidencial - Solo para uso interno</p>
    </div>
</body>
</html>`;

      // Crear y descargar archivo HTML
      const blob = new Blob([reporteHTML], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GRIZALUM-Backup-${fecha}.html`;
      link.click();
     // Backup solo en memoria (localStorage no disponible en Claude.ai)
       console.log('✅ Backup de datos preparado');
      
     alert('✅ Backup HTML descargado exitosamente');
    }}
    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all flex items-center text-sm"
    title="Descargar Backup HTML"
  >
    <Download size={16} className="mr-2" />
    Backup HTML
  </button>
</div>
                </div>
              </div>
            </div>

            {currentView === 'resumen' && (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Financiero</h2>
      <p className="text-gray-600 mb-4">Análisis completo en tiempo real</p>
      
      {/* GRID DE 4 TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjeta Por Cobrar */}
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

        {/* Tarjeta Deudas */}
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
        
        {/* Tarjeta Balance */}
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
        
        {/* Tarjeta Cobertura */}
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

    {/* SECCIÓN SEPARADA PARA PRÓXIMOS COBROS */}
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Próximos Cobros</h2>
      <div className="space-y-3">
        {proximasFechas && proximasFechas.length > 0 ? (
          proximasFechas.slice(0, 5).map(fecha => (
            <div key={fecha.clienteId} className={`p-4 rounded-lg border-l-4 ${
              fecha.estado === 'retrasado' ? 'border-red-500 bg-red-50' :
              fecha.estado === 'hoy' ? 'border-orange-500 bg-orange-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{fecha.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {fecha.estado === 'retrasado' ? `Retrasado ${Math.abs(fecha.diasRestantes)} días` :
                     fecha.estado === 'hoy' ? 'Cobrar HOY' :
                     `En ${fecha.diasRestantes} días`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">S/ {fecha.monto.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{fecha.proximaFecha}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No hay cobros pendientes</p>
        )}
      </div>
    </div>

    {/* ALERTAS DEL SISTEMA */}
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
          <p className="text-gray-600">Gestión profesional de préstamos y cobranzas</p>
        </div>
        <button onClick={() => abrirModal('nuevo_cliente')}
          className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
          <Plus className="mr-2" size={18} />
          Nuevo Cliente
        </button>
      </div>
      
      <div className="grid gap-6">
        {misClientes.map(cliente => {
          // 🔥 CALCULAR ESTADO DEL CLIENTE AUTOMÁTICAMENTE
          const hoy = new Date();
          const fechaInicio = new Date(cliente.fechaInicio);
          const numerosPagosRealizados = cliente.historialPagos?.length || 0;
          
          // 📅 CALCULAR PRÓXIMA FECHA DE COBRO
          const proximaFechaCobro = new Date(fechaInicio);
          proximaFechaCobro.setMonth(proximaFechaCobro.getMonth() + numerosPagosRealizados + 1);
          const diasRestantes = Math.ceil((proximaFechaCobro - hoy) / (1000 * 60 * 60 * 24));
          
         // 📊 CALCULAR PROGRESO DE PAGOS CORRECTO
          // Usar el total de cuotas del contrato, no las esperadas hasta hoy
          const pagosEsperados = cliente.plazoMeses; // Total de cuotas del contrato (18)
          const pagosRealizados = numerosPagosRealizados;
         const pagosAtrasados = Math.max(0, pagosEsperados - pagosRealizados);
          
          // 🎯 DETERMINAR ESTADO Y URGENCIA
          let estadoCobro, mensajeCobro, urgencia;
          
          if (diasRestantes < 0) {
            estadoCobro = 'moroso';
            mensajeCobro = `Moroso ${Math.abs(diasRestantes)} días`;
            urgencia = 'alta';
          } else if (diasRestantes === 0) {
            estadoCobro = 'hoy';
            mensajeCobro = 'Cobrar HOY';
            urgencia = 'alta';
          } else if (diasRestantes <= 3) {
            estadoCobro = 'urgente';
            mensajeCobro = `Vence en ${diasRestantes} días`;
            urgencia = 'alta';
          } else if (diasRestantes <= 7) {
            estadoCobro = 'proximo';
            mensajeCobro = `Vence en ${diasRestantes} días`;
            urgencia = 'media';
          } else {
            estadoCobro = 'al-dia';
            mensajeCobro = `Al día (${diasRestantes} días)`;
            urgencia = 'baja';
          }

          return (
            <div key={cliente.id} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-gray-800">{cliente.nombre}</h3>
                        {/* NUEVO: Indicador de estado automático */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                          estadoCobro === 'al-dia' ? 'bg-green-100 text-green-800' :
                          estadoCobro === 'proximo' ? 'bg-yellow-100 text-yellow-800' :
                          estadoCobro === 'hoy' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {estadoCobro === 'al-dia' && '✅'}
                          {estadoCobro === 'proximo' && '⚠️'}
                          {estadoCobro === 'hoy' && '🔥'}
                          {(estadoCobro === 'urgente' || estadoCobro === 'moroso') && '🚨'}
                          <span className="ml-1">{mensajeCobro}</span>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-1 lg:space-y-0 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="mr-1" size={14} />
                          {cliente.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="mr-1" size={14} />
                          {cliente.telefono}
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
                      <p className="text-xs text-gray-500">Plazo: {cliente.plazoMeses} meses</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Cuota</p>
                      <p className="font-bold text-lg text-green-600">S/{cliente.cuotaMensual.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Mensual</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Pagado</p>
                      <p className="font-bold text-lg text-emerald-600">S/{cliente.pagosRecibidos.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{cliente.historialPagos?.length || 0} pagos</p>
                    </div>
                  </div>

                  {/* NUEVO: Progreso de pagos automático */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso de Pagos</span>
                      <span className="text-sm font-bold text-green-600">
                        {pagosRealizados}/{pagosEsperados} cuotas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${
                        pagosRealizados >= pagosEsperados ? 'bg-green-500' : 'bg-red-500'
                      }`} style={{width: `${Math.min((pagosRealizados / Math.max(pagosEsperados, 1)) * 100, 100)}%`}}></div>
                    </div>
                    {pagosAtrasados > 0 && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">
                        ⚠️ {pagosAtrasados} cuota{pagosAtrasados > 1 ? 's' : ''} pendiente{pagosAtrasados > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      cliente.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                      cliente.estado === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cliente.estado}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Inicio: {new Date(cliente.fechaInicio).toLocaleDateString()}</span>
                      <span className={`font-semibold ${
                        diasRestantes <= 0 ? 'text-red-600' :
                        diasRestantes <= 7 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        Próximo: {proximaFechaCobro.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  <button 
                    onClick={() => abrirModal('pago_cliente', cliente)}
                    className={`p-3 rounded-lg transition-all shadow-lg flex-1 lg:flex-none text-white ${
                      urgencia === 'alta' ? 'bg-red-500 hover:bg-red-600 animate-pulse' :
                      urgencia === 'media' ? 'bg-orange-500 hover:bg-orange-600' :
                      'bg-green-500 hover:bg-green-600'
                    }`}
                    title="Registrar Pago">
                    <DollarSign size={18} />
                  </button>
                  <button 
                    onClick={() => abrirModal('historial', cliente)}
                    className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Ver Historial">
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => abrirModal('editar_cliente', cliente)}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Editar Cliente">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => eliminarItem('cliente', cliente.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Eliminar Cliente">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

            {currentView === 'deudas' && (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Deudas</h2>
          <p className="text-gray-600">Control automático de obligaciones financieras</p>
        </div>
        <button onClick={() => abrirModal('nueva_deuda')}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
          <Plus className="mr-2" size={18} />
          Nueva Deuda
        </button>
      </div>
      
      <div className="grid gap-6">
        {misDeudas.map(deuda => {
          const estadoDeuda = calcularEstadoDeuda(deuda);
          
          return (
            <div key={deuda.id} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-gray-800">{deuda.acreedor}</h3>
                        {/* NUEVO: Indicador de estado automático */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                          estadoDeuda.estado === 'al-dia' ? 'bg-green-100 text-green-800' :
                          estadoDeuda.estado === 'proximo' ? 'bg-yellow-100 text-yellow-800' :
                          estadoDeuda.estado === 'hoy' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {estadoDeuda.estado === 'al-dia' && '✅'}
                          {estadoDeuda.estado === 'proximo' && '⚠️'}
                          {estadoDeuda.estado === 'hoy' && '🔥'}
                          {(estadoDeuda.estado === 'atrasado' || estadoDeuda.estado === 'vencido') && '🚨'}
                          <span className="ml-1">{estadoDeuda.mensaje}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{deuda.descripcion}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Capital</p>
                      <p className="font-bold text-lg text-blue-600">S/{deuda.capital.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Tasa: {deuda.tasaInteres}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Pendiente</p>
                      <p className="font-bold text-lg text-red-600">S/{deuda.saldoPendiente.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Plazo: {deuda.plazoMeses} meses</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Cuota</p>
                      <p className="font-bold text-lg text-orange-600">S/{deuda.cuotaMensual.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Mensual</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Pagado</p>
                      <p className="font-bold text-lg text-emerald-600">S/{(deuda.totalPagado || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{deuda.historialPagos?.length || 0} pagos</p>
                    </div>
                  </div>

                  {/* NUEVO: Progreso de pagos automático */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso de Pagos</span>
                      <span className="text-sm font-bold text-purple-600">
                        {estadoDeuda.cuotasPagadas}/{estadoDeuda.cuotasEsperadas} cuotas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${
                        estadoDeuda.cuotasPagadas >= estadoDeuda.cuotasEsperadas ? 'bg-green-500' : 'bg-red-500'
                      }`} style={{width: `${Math.min((estadoDeuda.cuotasPagadas / Math.max(estadoDeuda.cuotasEsperadas, 1)) * 100, 100)}%`}}></div>
                    </div>
                    {estadoDeuda.cuotasAtrasadas > 0 && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">
                        ⚠️ {estadoDeuda.cuotasAtrasadas} cuota{estadoDeuda.cuotasAtrasadas > 1 ? 's' : ''} pendiente{estadoDeuda.cuotasAtrasadas > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      deuda.estado === 'Activo' ? 'bg-red-100 text-red-800' : 
                      deuda.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deuda.estado}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Inicio: {new Date(deuda.fechaInicio).toLocaleDateString()}</span>
                      <span className={`font-semibold ${
                        estadoDeuda.diasRestantes <= 0 ? 'text-red-600' :
                        estadoDeuda.diasRestantes <= 7 ? 'text-orange-600' : 'text-purple-600'
                      }`}>
                        Próximo: {new Date(deuda.proximoVencimiento).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div> 
                        
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  <button 
                    onClick={() => abrirModal('pago_deuda', deuda)}
                    className={`p-3 rounded-lg transition-all shadow-lg flex-1 lg:flex-none text-white ${
                      estadoDeuda.urgencia === 'alta' ? 'bg-red-500 hover:bg-red-600 animate-pulse' :
                      estadoDeuda.urgencia === 'media' ? 'bg-orange-500 hover:bg-orange-600' :
                      'bg-green-500 hover:bg-green-600'
                    }`}
                    title="Pagar Cuota">
                    <DollarSign size={18} />
                  </button>
                  <button 
                    onClick={() => abrirModal('historial', deuda)}
                    className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Ver Historial">
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => abrirModal('editar_deuda', deuda)}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Editar Deuda">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => eliminarItem('deuda', deuda.id)}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Eliminar Deuda">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
                    <button onClick={() => abrirModal('nueva_inversion')}
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
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                           <button onClick={() => abrirModal('actualizar_ganancias', inversion)}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Actualizar Ganancias">
                              <TrendingUp size={18} />
                            </button>
                                <button onClick={() => abrirModal('historial_inversion', inversion)}
                                className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                                title="Ver Historial de Ganancias">
                                <Eye size={18} />
                            </button>
                            <button onClick={() => abrirModal('editar_inversion', inversion)}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Inversión">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => {
                            if (window.confirm(`¿Está seguro de eliminar la inversión "${inversion.nombre}"?`)) {
                            eliminarInversion(inversion.id);
                            alert(`Inversión "${inversion.nombre}" eliminada exitosamente`);
                            }
                            }}
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
          <p className="text-gray-600">
            {alertas.filter(a => a.activa).length} notificaciones activas • Sistema de monitoreo automático
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="bg-red-100 text-red-800 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
            🚨 Alta ({alertas.filter(a => a.urgencia === 'alta' && a.activa).length})
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
            ⚠️ Media ({alertas.filter(a => a.urgencia === 'media' && a.activa).length})
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
            📅 Baja ({alertas.filter(a => a.urgencia === 'baja' && a.activa).length})
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {alertas.map(alerta => (
          <div key={alerta.id} className={`border rounded-xl p-6 hover:shadow-lg transition-all ${
            alerta.urgencia === 'alta' ? 'bg-red-50 border-red-200 border-l-4 border-l-red-500' : 
            alerta.urgencia === 'media' ? 'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500' : 
            'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500'
          }`}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    alerta.urgencia === 'alta' ? 'bg-red-500' :
                    alerta.urgencia === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    {alerta.urgencia === 'alta' && '🚨'}
                    {alerta.urgencia === 'media' && '⚠️'}
                    {alerta.urgencia === 'baja' && '📅'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alerta.urgencia === 'alta' ? 'bg-red-100 text-red-800' : 
                        alerta.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alerta.urgencia.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {alerta.tipo.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{alerta.mensaje}</h3>
                  </div>
                </div>
              </div>
              
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                <button 
                  onClick={() => eliminarAlerta(alerta.id)}
                  className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all shadow-lg flex-1 lg:flex-none"
                  title="Eliminar Alerta"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {alertas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={40} />
           </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">¡Sistema en Perfecto Estado!</h3>
               <p className="text-gray-500 text-lg">No hay alertas activas</p>
               <p className="text-gray-400 text-sm">Todas las operaciones financieras están al día</p>
                 </div>
                 )}  
                </div>
               </div>
              )}
                )}

{currentView === 'historial' && (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Historial de Versiones</h2>
          <p className="text-gray-600">Sistema de respaldo automático en la nube</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              try {
                setMessage('Creando snapshot manual...', 'info');
                const resultado = await crearSnapshotManual();
                if (resultado.success) {
                  showMessage(`✅ Snapshot creado: ${resultado.fecha} ${resultado.hora}`, 'success');
                  cargarHistorial();
                } else {
                  showMessage('❌ Error creando snapshot', 'error');
                }
              } catch (error) {
                showMessage('❌ Error: ' + error.message, 'error');
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center text-sm font-medium shadow-lg"
          >
            <Save className="mr-2" size={16} />
            Crear Snapshot Manual
          </button>
          
          <button
            onClick={() => cargarHistorial()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center text-sm font-medium shadow-lg"
          >
            <RefreshCw className="mr-2" size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS DEL HISTORIAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Snapshots</p>
              <p className="text-2xl font-bold">{historialData.length}</p>
            </div>
            <Shield size={24} className="text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Último Backup</p>
              <p className="text-lg font-bold">
                {historialData[0] ? historialData[0].fecha : 'N/A'}
              </p>
            </div>
            <Clock size={24} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Protección</p>
              <p className="text-lg font-bold">
                {historialData.filter(h => h.tipoAccion.includes('antes_')).length}
              </p>
            </div>
            <Shield size={24} className="text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Automáticos</p>
              <p className="text-lg font-bold">
                {historialData.filter(h => h.tipoAccion === 'automatico').length}
              </p>
            </div>
            <Clock size={24} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* MENSAJES */}
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* LISTA DE SNAPSHOTS */}
      <div className="space-y-3">
        {cargandoHistorial ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando historial...</p>
          </div>
        ) : historialData.length === 0 ? (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No hay snapshots disponibles</h3>
            <p className="text-gray-500">Crea tu primer snapshot manual para empezar</p>
          </div>
        ) : (
          historialData.map((snapshot, index) => (
            <div key={snapshot.id} 
              className={`border rounded-xl p-6 hover:shadow-lg transition-all ${
                index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
              
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      snapshot.tipoAccion === 'automatico' ? 'bg-blue-100 text-blue-600' :
                      snapshot.tipoAccion === 'manual' ? 'bg-green-100 text-green-600' :
                      snapshot.tipoAccion.includes('antes_') ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {snapshot.tipoAccion === 'automatico' && <Clock size={20} />}
                      {snapshot.tipoAccion === 'manual' && <User size={20} />}
                      {snapshot.tipoAccion.includes('antes_') && <Shield size={20} />}
                      {snapshot.tipoAccion === 'al_cerrar' && <LogOut size={20} />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-800">
                          📅 {snapshot.fecha} - {snapshot.hora}
                        </h3>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                            ✨ MÁS RECIENTE
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <User className="mr-1" size={14} />
                          {snapshot.usuario}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          snapshot.tipoAccion === 'automatico' ? 'bg-blue-100 text-blue-800' :
                          snapshot.tipoAccion === 'manual' ? 'bg-green-100 text-green-800' :
                          snapshot.tipoAccion.includes('antes_') ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {snapshot.tipoAccion === 'automatico' && '🤖 Automático'}
                          {snapshot.tipoAccion === 'manual' && '👤 Manual'}
                          {snapshot.tipoAccion.includes('antes_eliminar') && '🛡️ Protección'}
                          {snapshot.tipoAccion === 'al_cerrar' && '🚪 Al cerrar'}
                          {snapshot.tipoAccion === 'antes_restaurar' && '🔄 Pre-restauración'}
                        </span>
                      </div>
                      
                      {/* RESUMEN DE DATOS */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-600 font-medium">Clientes</p>
                          <p className="text-xl font-bold text-blue-800">{snapshot.resumen.totalClientes}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-red-600 font-medium">Deudas</p>
                          <p className="text-xl font-bold text-red-800">{snapshot.resumen.totalDeudas}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-purple-600 font-medium">Inversiones</p>
                          <p className="text-xl font-bold text-purple-800">{snapshot.resumen.totalInversiones}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-green-600 font-medium">Por Cobrar</p>
                          <p className="text-lg font-bold text-green-800">S/ {snapshot.resumen.totalPorCobrar.toLocaleString()}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-orange-600 font-medium">Por Pagar</p>
                          <p className="text-lg font-bold text-orange-800">S/ {snapshot.resumen.totalPorPagar.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* BOTONES DE ACCIÓN */}
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  <button 
                    onClick={async () => {
                      if (window.confirm(`¿Restaurar datos desde ${snapshot.fecha} ${snapshot.hora}?\n\nEsto sobrescribirá todos los datos actuales.`)) {
                        try {
                          setMessage('Restaurando datos...', 'info');
                          const resultado = await restaurarDesdeHistorial(snapshot.id);
                          
                          if (resultado.success) {
                            setMisClientes(resultado.datos.clientes);
                            setMisDeudas(resultado.datos.deudas);
                            setMisInversiones(resultado.datos.inversiones);
                            
                            showMessage(resultado.message, 'success');
                            setCurrentView('resumen');
                          } else {
                            showMessage(resultado.message, 'error');
                          }
                        } catch (error) {
                          showMessage('❌ Error: ' + error.message, 'error');
                        }
                      }
                    }}
                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Restaurar Snapshot"
                  >
                    <RotateCcw size={18} />
                  </button>
                  
                  <button 
                    onClick={() => {
                      const detalles = `
DETALLES DEL SNAPSHOT

📅 Fecha: ${snapshot.fecha}
🕐 Hora: ${snapshot.hora}
👤 Usuario: ${snapshot.usuario}
🔧 Tipo: ${snapshot.tipoAccion}

📊 CONTENIDO:
- Clientes: ${snapshot.resumen.totalClientes}
- Deudas: ${snapshot.resumen.totalDeudas}  
- Inversiones: ${snapshot.resumen.totalInversiones}

💰 FINANCIERO:
- Por cobrar: S/ ${snapshot.resumen.totalPorCobrar.toLocaleString()}
- Por pagar: S/ ${snapshot.resumen.totalPorPagar.toLocaleString()}
- Balance: S/ ${(snapshot.resumen.totalPorCobrar - snapshot.resumen.totalPorPagar).toLocaleString()}

🆔 ID: ${snapshot.id}
                      `;
                      alert(detalles);
                    }}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                    title="Ver Detalles"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}
           </div>
        </div>
      </div>
    </div>
    </>
   );
}
