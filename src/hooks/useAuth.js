import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const useAuth = () => {
  // 🔐 ESTADOS DE AUTENTICACIÓN
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // 🚀 ESCUCHAR CAMBIOS DE AUTENTICACIÓN
  useEffect(() => {
    console.log('🔐 Iniciando listener de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔥 Estado de auth cambió:', firebaseUser ? 'Usuario logueado' : 'Sin usuario');
      
      if (firebaseUser) {
        // Usuario autenticado
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata?.creationTime,
          lastLogin: firebaseUser.metadata?.lastSignInTime
        };
        
        setUser(userData);
        setError(null);
        console.log('✅ Usuario autenticado:', userData.email);
      } else {
        // Sin usuario
        setUser(null);
        console.log('❌ Sin usuario autenticado');
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    return () => {
      console.log('🔐 Limpiando listener de autenticación');
      unsubscribe();
    };
  }, []);

  // 🔑 FUNCIÓN DE LOGIN
  const login = useCallback(async (email, password) => {
    console.log('🔑 Intentando login para:', email);
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login exitoso:', userCredential.user.email);
      
      return {
        success: true,
        user: userCredential.user,
        message: '¡Bienvenido a GRIZALUM!'
      };
    } catch (error) {
      console.error('❌ Error en login:', error.code, error.message);
      
      let errorMessage = 'Error de autenticación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 📝 FUNCIÓN DE REGISTRO
  const register = useCallback(async (email, password, displayName) => {
    console.log('📝 Intentando registro para:', email);
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      console.log('✅ Registro exitoso:', userCredential.user.email);
      
      return {
        success: true,
        user: userCredential.user,
        message: '¡Cuenta creada exitosamente!'
      };
    } catch (error) {
      console.error('❌ Error en registro:', error.code, error.message);
      
      let errorMessage = 'Error al crear cuenta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este email';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚪 FUNCIÓN DE LOGOUT
  const logout = useCallback(async () => {
    console.log('🚪 Cerrando sesión...');
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      console.log('✅ Logout exitoso');
      
      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      console.error('❌ Error en logout:', error);
      
      setError('Error al cerrar sesión');
      return {
        success: false,
        message: 'Error al cerrar sesión'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 FUNCIÓN DE RECUPERAR CONTRASEÑA
  const resetPassword = useCallback(async (email) => {
    console.log('🔄 Enviando reset de contraseña a:', email);
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de reset enviado');
      
      return {
        success: true,
        message: 'Email de recuperación enviado. Revisa tu bandeja de entrada'
      };
    } catch (error) {
      console.error('❌ Error en reset:', error);
      
      let errorMessage = 'Error al enviar email de recuperación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🧹 FUNCIÓN PARA LIMPIAR ERRORES
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 🎯 VERIFICAR SI ES ADMIN
  const isAdmin = useCallback(() => {
    return user?.email === 'admin@grizalum.com';
  }, [user]);

  // 🎯 VERIFICAR ROLES
  const hasRole = useCallback((role) => {
    if (!user) return false;
    
    // Sistema simple de roles basado en email
    switch (role) {
      case 'admin':
        return user.email === 'admin@grizalum.com';
      case 'user':
        return user.email === 'usuario@grizalum.com' || user.email === 'admin@grizalum.com';
      case 'readonly':
        return true; // Todos pueden leer
      default:
        return false;
    }
  }, [user]);

  return {
    // Estados
    user,
    loading,
    error,
    authChecked,
    
    // Funciones
    login,
    register,
    logout,
    resetPassword,
    clearError,
    
    // Utilidades
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    hasRole,
    
    // Info del usuario
    userEmail: user?.email,
    userName: user?.displayName,
    userCreated: user?.createdAt,
    lastLogin: user?.lastLogin
  };
};

export default useAuth;
