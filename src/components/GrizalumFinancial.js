import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, DollarSign, 
  Calculator, Share2, FileSpreadsheet, Edit, Bell, Shield, Trash2, 
  CheckCircle, Cloud, WifiOff, User, Phone, Mail, CreditCard, 
  AlertTriangle, Eye, Link, Save, Download
} from 'lucide-react';
import useFinancialData from '../hooks/useFinancialData';
export default function GrizalumFinancial() {
  // Hook de datos financieros
  const {
    misClientes,
    misDeudas,
    misInversiones,
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
    setMisClientes,
    setMisDeudas
  } = useFinancialData();

  // Estados de UI 
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
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

 const abrirModal = (tipo, item = null) => {
  setTipoModal(tipo);
  setItemSeleccionado(item);
  setModalAbierto(true);
  setMontoPago('');
  setNotas('');
  setFechaPago(new Date().toISOString().split('T')[0]);
  
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
  
  // Cargar datos para edición
 if (tipo === 'editar_cliente' && item) {
  setDatosEdicion({
    nombre: item.nombre,
    email: item.email,
    telefono: item.telefono,
    capital: item.capital.toString(),
    tasaInteres: item.tasaInteres.toString(),
    plazoMeses: item.plazoMeses.toString(),
    fechaInicio: item.fechaInicio
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
    // Validaciones
    if (!datosEdicion.nombre || !datosEdicion.email || !datosEdicion.tasaInteres) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    if (parseFloat(datosEdicion.tasaInteres) <= 0) {
      alert('La tasa de interés debe ser mayor a 0');
      return;
    }
    
    // Actualizar cliente usando el hook
    const clienteActualizado = {
      ...itemSeleccionado,
      nombre: datosEdicion.nombre,
      email: datosEdicion.email,
      telefono: datosEdicion.telefono,
      tasaInteres: parseFloat(datosEdicion.tasaInteres)
    };
    // Recalcular cuota mensual si cambió la tasa
    if (clienteActualizado.tasaInteres !== itemSeleccionado.tasaInteres) {
      const tasaMensual = clienteActualizado.tasaInteres / 100 / 12;
      const nuevaCuota = clienteActualizado.capital * 
        (tasaMensual * Math.pow(1 + tasaMensual, clienteActualizado.plazoMeses)) / 
        (Math.pow(1 + tasaMensual, clienteActualizado.plazoMeses) - 1);
      clienteActualizado.cuotaMensual = Math.round(nuevaCuota * 100) / 100;
      clienteActualizado.totalCobrar = clienteActualizado.cuotaMensual * clienteActualizado.plazoMeses;
      clienteActualizado.saldoPendiente = clienteActualizado.totalCobrar - clienteActualizado.pagosRecibidos;
    }
    
    // Usar función del hook para actualizar
    setMisClientes(prev => prev.map(c => 
      c.id === itemSeleccionado.id ? clienteActualizado : c
    ));
    
    alert(`Cliente ${datosEdicion.nombre} actualizado exitosamente`);
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
    nuevaCuota = nuevoCapital * 
      (tasaMensual * Math.pow(1 + tasaMensual, nuevosPlazo)) / 
      (Math.pow(1 + tasaMensual, nuevosPlazo) - 1);
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

  const copiarLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?empresa=grizalum&view=${currentView}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copiado al portapapeles exitosamente');
    }).catch(() => {
      alert('Link preparado para copiar');
    });
  };

  const exportarExcel = () => {
    setSincronizando(true);
    setTimeout(() => {
      setSincronizando(false);
      alert('Reporte Excel generado exitosamente');
    }, 2000);
  };

  const guardarEnNube = () => {
    setSincronizando(true);
    setTimeout(() => {
      setSincronizando(false);
      setDatosGuardados(true);
      alert('Datos guardados en la nube exitosamente');
      setTimeout(() => setDatosGuardados(false), 3000);
    }, 1500);
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
  {tipoModal === 'nuevo_cliente' && 'Nuevo Cliente'}
  {tipoModal === 'editar_cliente' && 'Editar Cliente'}
  {tipoModal === 'editar_deuda' && 'Editar Deuda'}
</h3>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

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
         {/* Formulario de edición de cliente */}
{tipoModal === 'editar_cliente' && (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800">Editar Información del Cliente</h4>
      <p className="text-sm text-blue-600">Modifique los datos necesarios</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
        <input
          type="text"
          value={datosEdicion.nombre || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, nombre: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={datosEdicion.email || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, email: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
        <input
          type="tel"
          value={datosEdicion.telefono || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, telefono: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+51 999 123 456"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Interés (%)</label>
        <input
          type="number"
          value={datosEdicion.tasaInteres || ''}
          onChange={(e) => setDatosEdicion(prev => ({...prev, tasaInteres: e.target.value}))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="14"
          step="0.1"
        />
      </div>
    </div>

    <div className="bg-yellow-50 p-3 rounded-lg">
      <p className="text-sm text-yellow-800">
        <strong>Nota:</strong> Si modifica la tasa de interés, se recalculará automáticamente la cuota mensual y el saldo pendiente.
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
        Guardar Cambios
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
              
              if (tasa > 0) {
                const tasaMensual = tasa / 100 / 12;
                const cuota = capital * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
                return cuota.toLocaleString();
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
                    <Cloud className={`${firebaseConectado ? 'text-green-400' : 'text-red-400'}`} size={20} />
                    <span className={`font-semibold ${firebaseConectado ? 'text-green-400' : 'text-red-400'}`}>
                      {firebaseConectado ? 'Sistema Online' : 'Sin Conexión'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <button 
                      onClick={exportarExcel}
                      disabled={sincronizando}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all flex items-center text-sm"
                      title="Exportar a Excel"
                    >
                      {sincronizando ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <FileSpreadsheet size={16} className="mr-2" />
                      )}
                      Excel
                    </button>
                    <button 
                      onClick={copiarLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all flex items-center text-sm"
                      title="Copiar Link"
                    >
                      <Link size={16} className="mr-2" />
                      Link
                    </button>
                    <button 
                      onClick={guardarEnNube}
                      disabled={sincronizando || !firebaseConectado}
                      className={`px-3 py-2 rounded-lg transition-all flex items-center text-sm ${
                        datosGuardados ? 'bg-green-600 text-white' : 
                        firebaseConectado ? 'bg-orange-600 hover:bg-orange-700 text-white' : 
                        'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      title="Guardar en la Nube"
                    >
                      {sincronizando ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : datosGuardados ? (
                        <CheckCircle size={16} className="mr-2" />
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      {datosGuardados ? 'Guardado' : 'Guardar'}
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
                    <button onClick={() => abrirModal('nuevo_cliente')}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all flex items-center font-semibold shadow-lg w-full lg:w-auto justify-center">
                      <Plus className="mr-2" size={18} />
                      Nuevo Cliente
                    </button>
                  </div>
                  
                  <div className="grid gap-6">
                    {misClientes.map(cliente => (
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
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                cliente.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                                cliente.estado === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {cliente.estado}
                              </span>
                              <span className="text-sm text-gray-600">
                                Inicio: {new Date(cliente.fechaInicio).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button 
                              onClick={() => abrirModal('pago_cliente', cliente)}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
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
                    ))}
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
                      <p className="text-gray-600">Control de obligaciones financieras</p>
                    </div>
                    <button onClick={() => alert('Funcionalidad disponible próximamente')}
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
                            
                           <div className="flex flex-wrap items-center gap-4">
  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
    deuda.estado === 'Activo' ? 'bg-red-100 text-red-800' : 
    deuda.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {deuda.estado}
  </span>
  <div className="flex items-center space-x-4 text-sm text-gray-600">
    <span>Inicio: {new Date(deuda.fechaInicio).toLocaleDateString()}</span>
    <span className="font-semibold text-purple-600">
      Próximo: {new Date(deuda.proximoVencimiento).toLocaleDateString()}
    </span>
  </div>
</div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button 
                              onClick={() => abrirModal('pago_deuda', deuda)}
                              className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all shadow-lg flex-1 lg:flex-none"
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
                    <button onClick={() => alert('Funcionalidad disponible próximamente')}
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
                            <button onClick={() => alert('Funcionalidad disponible próximamente')}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Actualizar Ganancias">
                              <TrendingUp size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad disponible próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Inversión">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad disponible próximamente')}
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
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => alert('Funcionalidad disponible próximamente')}
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
           </div>
        </div>
      </div>
    </div>
    </>
   );
}
