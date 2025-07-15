import React from 'react';
import { Loader, Shield, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import useAuth from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import GrizalumFinancial from './components/GrizalumFinancial';
import './App.css';

function App() {
  // 🔐 HOOK DE AUTENTICACIÓN
  const { 
    user, 
    loading, 
    authChecked, 
    isAuthenticated, 
    logout,
    userName,
    userEmail,
    lastLogin,
    hasRole
  } = useAuth();

  // 🔄 PANTALLA DE CARGA INICIAL
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <img 
              src="/grizalum-logo.png.jpg"
              alt="GRIZALUM"
              className="w-16 h-16 object-contain rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              GRIZ
            </div>
          </div>
          <div className="mb-6">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-2">GRIZALUM</h2>
            <p className="text-blue-200">COMPAÑÍA METÁLURGICA</p>
            <p className="text-white/70 text-sm mt-2">Iniciando sistema seguro...</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
            <Shield size={16} />
            <span>Verificando autenticación</span>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 SI NO ESTÁ AUTENTICADO - MOSTRAR LOGIN
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // ✅ SI ESTÁ AUTENTICADO - MOSTRAR APLICACIÓN PRINCIPAL CON HEADER DE USUARIO
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER DE USUARIO AUTENTICADO */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* INFO DEL USUARIO */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : userEmail?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {userName || userEmail?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userEmail}
                  </p>
                </div>
              </div>
              
              {/* BADGE DE ROL */}
              <div className="hidden md:block">
                {hasRole('admin') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Shield size={12} className="mr-1" />
                    Administrador
                  </span>
                )}
                {hasRole('user') && !hasRole('admin') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Usuario
                  </span>
                )}
              </div>
            </div>

            {/* CONTROLES DE SESIÓN */}
            <div className="flex items-center space-x-4">
              
              {/* ESTADO DE CONEXIÓN */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Wifi size={16} className="text-green-500" />
                <span>Conectado</span>
              </div>
              
              {/* ÚLTIMA CONEXIÓN */}
              {lastLogin && (
                <div className="hidden lg:block text-xs text-gray-400">
                  Último acceso: {new Date(lastLogin).toLocaleDateString()}
                </div>
              )}
              
              {/* BOTÓN DE LOGOUT */}
              <button
                onClick={async () => {
                  const confirmLogout = window.confirm('¿Está seguro de cerrar sesión?');
                  if (confirmLogout) {
                    const result = await logout();
                    if (result.success) {
                      // El hook automáticamente redirigirá al login
                      console.log('✅ Sesión cerrada correctamente');
                    }
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
              >
                <Shield size={16} className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICACIÓN DE BIENVENIDA (solo al login) */}
      {user && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <span className="font-semibold">¡Bienvenido a GRIZALUM!</span>
                  {hasRole('admin') && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      🔐 Acceso de Administrador
                    </span>
                  )}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Sistema Financiero Profesional - Sesión iniciada correctamente
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APLICACIÓN FINANCIERA PRINCIPAL */}
      <div className="relative">
        <GrizalumFinancial />
      </div>

      {/* FOOTER DE SEGURIDAD */}
      <div className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-green-400" />
                <span>Sesión Segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi size={16} className="text-blue-400" />
                <span>Firebase Auth</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              © 2025 GRIZALUM Compañía Metálurgica • Sistema Financiero v2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
