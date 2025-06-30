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
  const [firebaseConectado, setFirebaseConectado] = useState(true);

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
      estado: 'En Proceso',
      fechaInicio: '2024-01-15',
      tasaInteres: 14,
      plazoMeses: 18,
      fechaVencimiento: '2025-07-15'
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
      tasaInteres: 18,
      estado: 'Activo',
      proximoPago: '2025-07-21',
      tipo: 'Prestamo Bancario'
    }
  ]);

  const totalPorCobrar = misClientes.reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalPorPagar = misDeudas.reduce((acc, d) => acc + d.saldoPendiente, 0);
  const balanceNeto = totalPorCobrar - totalPorPagar;

  useEffect(() => {
    const interval = setInterval(() => setFirebaseConectado(Math.random() > 0.1), 8000);
    return () => clearInterval(interval);
  }, []);

  const copiarReporte = () => {
    const mensaje = `🏢 GRIZALUM COMPAÑIA METALURGICA
📊 Reporte Financiero - ${new Date().toLocaleDateString()}

💰 RESUMEN EJECUTIVO:
- Por Cobrar: S/ ${totalPorCobrar.toLocaleString()}
- Por Pagar: S/ ${totalPorPagar.toLocaleString()}
- Balance Neto: S/ ${balanceNeto.toLocaleString()}

⚡ Gestión Profesional con Sistema Cloud
🔐 Control Financiero Empresarial Seguro`;

    navigator.clipboard.writeText(mensaje).then(() => {
      alert('📋 Reporte copiado al portapapeles exitosamente');
    }).catch(() => {
      alert('📋 Reporte preparado para copiar');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div className="relative z-10">
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
                        <p className="text-purple-100 text-sm font-medium">Sistema</p>
                        <p className="text-2xl font-bold">✅ OK</p>
                        <p className="text-purple-200 text-xs mt-1">Funcionando</p>
                      </div>
                      <Calculator size={32} className="text-purple-200" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-r-2xl p-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Shield className="text-green-600" size={32} />
                      <div>
                        <h3 className="text-2xl font-bold text-green-800">✅ Sistema GRIZALUM Funcionando</h3>
                        <p className="text-green-700 text-lg">Control Financiero Empresarial Operativo</p>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-green-800">🚀 React 18</p>
                            <p className="text-green-600">Ejecutándose</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-blue-800">⚡ Tailwind CSS</p>
                            <p className="text-blue-600">Cargado</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-purple-800">🎯 Lucide Icons</p>
                            <p className="text-purple-600">Activos</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-orange-800">💻 Sistema</p>
                            <p className="text-orange-600">Listo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}