import React, { useState } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User, ArrowRight, 
  Shield, AlertCircle, CheckCircle, Loader, 
  Building, Factory
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  // 🔐 HOOK DE AUTENTICACIÓN
  const { login, register, resetPassword, loading, error, clearError } = useAuth();

  // 🎯 ESTADOS DEL COMPONENTE
  const [mode, setMode] = useState('login'); // 'login', 'register', 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  // 📋 FORMULARIOS
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [resetForm, setResetForm] = useState({
    email: ''
  });

  // 🎨 FUNCIÓN PARA MOSTRAR MENSAJES
  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // 🔑 MANEJAR LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    if (!loginForm.email || !loginForm.password) {
      showMessage('Por favor complete todos los campos', 'error');
      return;
    }

    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  // 📝 MANEJAR REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      showMessage('Por favor complete todos los campos', 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    if (registerForm.password.length < 6) {
      showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    const result = await register(registerForm.email, registerForm.password, registerForm.name);
    
    if (result.success) {
      showMessage(result.message, 'success');
      setMode('login');
    } else {
      showMessage(result.message, 'error');
    }
  };

  // 🔄 MANEJAR RESET DE CONTRASEÑA
  const handleReset = async (e) => {
    e.preventDefault();
    clearError();

    if (!resetForm.email) {
      showMessage('Por favor ingrese su email', 'error');
      return;
    }

    const result = await resetPassword(resetForm.email);
    
    if (result.success) {
      showMessage(result.message, 'success');
      setMode('login');
    } else {
      showMessage(result.message, 'error');
    }
  };

  // 🎨 FUNCIÓN PARA CAMBIAR MODO
  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage('');
    setMessageType('');
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* FONDO ANIMADO */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 w-full max-w-md">
        {/* TARJETA DE LOGIN */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* HEADER CON LOGO */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                  <img 
                    src="/grizalum-logo.png.jpg"
                    alt="GRIZALUM Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    <Factory size={24} />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">GRIZALUM</h1>
            <p className="text-gray-600 font-medium">COMPAÑÍA METÁLURGICA</p>
            <p className="text-sm text-gray-500 mt-1">Sistema Financiero Profesional</p>
          </div>

          {/* MENSAJES */}
          {(message || error) && (
            <div className={`mb-6 p-4 rounded-xl flex items-center ${
              messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              messageType === 'error' || error ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {messageType === 'success' && <CheckCircle size={20} className="mr-2 flex-shrink-0" />}
              {(messageType === 'error' || error) && <AlertCircle size={20} className="mr-2 flex-shrink-0" />}
              <span className="text-sm font-medium">{message || error}</span>
            </div>
          )}

          {/* FORMULARIO DE LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Corporativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="admin@grizalum.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Acceder al Sistema
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORMULARIO DE REGISTRO */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Juan Pérez"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({...prev, confirmPassword: e.target.value}))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Repetir contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <User className="mr-2 h-5 w-5" />
                    Crear Cuenta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORMULARIO DE RESET */}
          {mode === 'reset' && (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email de Recuperación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="admin@grizalum.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Enviar Email de Recuperación
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* NAVEGACIÓN ENTRE MODOS */}
          <div className="mt-8 space-y-4">
            {mode === 'login' && (
              <>
                <div className="text-center">
                  <button
                    onClick={() => switchMode('reset')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
                  <button
                    onClick={() => switchMode('register')}
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                    disabled={loading}
                  >
                    Crear cuenta
                  </button>
                </div>
              </>
            )}

            {(mode === 'register' || mode === 'reset') && (
              <div className="text-center">
                <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
                <button
                  onClick={() => switchMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  disabled={loading}
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>

          {/* USUARIOS DEMO */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 text-center">👨‍💼 USUARIOS DEMO</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <span className="font-mono text-gray-800">admin@grizalum.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usuario:</span>
                <span className="font-mono text-gray-800">usuario@grizalum.com</span>
              </div>
              <div className="text-center text-gray-500">
                Contraseña: <span className="font-mono">Grizalum2025!</span>
              </div>
            </div>
          </div>
        </div>
{/* BOTÓN PARA CREAR USUARIOS DEMO */}
<div className="mt-4">
  <button
    onClick={async () => {
      try {
        const { createDemoUsers, showCreationResults } = await import('../utils/createDemoUsers');
        showMessage('Creando usuarios demo...', 'info');
        
        const results = await createDemoUsers();
        showCreationResults(results);
        
        const successful = results.filter(r => r.success).length;
        if (successful > 0) {
          showMessage(`${successful} usuarios demo creados exitosamente`, 'success');
        } else {
          showMessage('Los usuarios demo ya existen o hubo errores', 'error');
        }
      } catch (error) {
        console.error('Error creando usuarios:', error);
        showMessage('Error al crear usuarios demo', 'error');
      }
    }}
    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
    disabled={loading}
  >
    🚀 Crear Usuarios Demo
  </button>
</div>

        {/* FOOTER */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            © 2025 GRIZALUM Compañía Metálurgica
          </p>
          <p className="text-white/50 text-xs mt-1">
            Sistema Financiero Seguro v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
