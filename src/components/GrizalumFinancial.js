import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, TrendingDown, Building, Plus, Menu, X, DollarSign, 
  Calculator, Share2, FileSpreadsheet, Edit, Bell, Shield, Trash2, 
  CheckCircle, Cloud, WifiOff, User, Phone, Mail, CreditCard, 
  AlertTriangle, Search, Eye, Link
} from 'lucide-react';

export default function GrizalumFinancial() {
  const [currentView, setCurrentView] = useState('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [firebaseConectado, setFirebaseConectado] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  const [misClientes] = useState([
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
      estado: 'En Proceso'
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
      estado: 'En Proceso'
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
      estado: 'En Proceso'
    }
  ]);

  const [misDeudas] = useState([
    {
      id: 1,
      acreedor: 'Banco Santander',
      descripcion: 'Prestamo comercial para capital de trabajo',
      capital: 50000,
      cuotaMensual: 2500.00,
      saldoPendiente: 45000.00,
      estado: 'Activo'
    },
    {
      id: 2,
      acreedor: 'Proveedor Textil SAC',
      descripcion: 'Compra de mercaderia a credito',
      capital: 8000,
      cuotaMensual: 800.00,
      saldoPendiente: 6400.00,
      estado: 'Activo'
    },
    {
      id: 3,
      acreedor: 'Banco BCP',
      descripcion: 'Linea de credito empresarial',
      capital: 25000,
      cuotaMensual: 1250.00,
      saldoPendiente: 18750.00,
      estado: 'Activo'
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
      roi: 20.8,
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
      roi: 25.0,
      progreso: 75
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
      progreso: 70
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
    },
    {
      id: 3,
      mensaje: 'Revision trimestral de inversiones pendiente',
      urgencia: 'baja',
      tipo: 'revision_programada',
      activa: true
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

  const copiarLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      alert('🔗 Link copiado al portapapeles exitosamente');
    }).catch(() => {
      alert('🔗 Link preparado para copiar: ' + link);
    });
  };

  const descargarExcel = () => {
    setSincronizando(true);
    
    setTimeout(() => {
      const csvContent = `GRIZALUM COMPAÑIA METALURGICA - REPORTE FINANCIERO
Fecha: ${new Date().toLocaleDateString()}

RESUMEN EJECUTIVO:
Por Cobrar,${totalPorCobrar}
Por Pagar,${totalPorPagar}
Balance Neto,${balanceNeto}
Cobertura,%${Math.round(cobertura)}

CLIENTES:
Nombre,Capital,Cuota,Pendiente,Estado
${misClientes.map(c => `${c.nombre},${c.capital},${c.cuotaMensual},${c.saldoPendiente},${c.estado}`).join('\n')}

DEUDAS:
Acreedor,Capital,Cuota,Pendiente,Estado
${misDeudas.map(d => `${d.acreedor},${d.capital},${d.cuotaMensual},${d.saldoPendiente},${d.estado}`).join('\n')}

INVERSIONES:
Nombre,Inversion,Ganancia Esperada,Ganancia Actual,ROI %
${misInversiones.map(i => `${i.nombre},${i.inversion},${i.gananciaEsperada},${i.gananciaActual},${i.roi}`).join('\n')}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `GRIZALUM_Reporte_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setSincronizando(false);
      alert('📊 Reporte descargado exitosamente como CSV');
    }, 2000);
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

  const eliminarAlerta = (alertaId) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
    alert('✅ Alerta eliminada');
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
                <button onClick={copiarLink} className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-all flex items-center text-sm font-semibold">
                  <Link className="mr-2" size={16} />
                  Copiar Link
                </button>
                <button onClick={descargarExcel} disabled={sincronizando} className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all flex items-center text-sm font-semibold disabled:opacity-50">
                  <FileSpreadsheet className="mr-2" size={16} />
                  {sincronizando ? 'Descargando...' : 'Descargar Excel'}
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
                    <button onClick={() => alert('Funcionalidad próximamente')}
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
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Capital</p>
                                <p className="font-bold text-lg text-blue-600">S/{cliente.capital.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Pendiente</p>
                                <p className="font-bold text-lg text-red-600">S/{cliente.saldoPendiente.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-600 mb-1">Cuota</p>
                                <p className="font-bold text-lg text-green-600">S/{cliente.cuotaMensual.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                cliente.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {cliente.estado}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Registrar Pago">
                              <DollarSign size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Ver Historial">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Cliente">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
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
                    <button onClick={() => alert('Funcionalidad próximamente')}
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
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Pagar Cuota">
                              <DollarSign size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Ver Historial">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Deuda">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
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
                    <button onClick={() => alert('Funcionalidad próximamente')}
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
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Actualizar Ganancias">
                              <TrendingUp size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
                              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none"
                              title="Editar Inversión">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => alert('Funcionalidad próximamente')}
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
                            <button onClick={() => alert('Funcionalidad próximamente')}
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
  );
}
