import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

// 🎯 FUNCIÓN PARA CREAR USUARIOS DEMO
export const createDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@grizalum.com',
      password: 'Grizalum2025!',
      displayName: 'Administrador GRIZALUM',
      role: 'admin'
    },
    {
      email: 'usuario@grizalum.com', 
      password: 'Grizalum2025!',
      displayName: 'Usuario GRIZALUM',
      role: 'user'
    },
    {
      email: 'contador@grizalum.com',
      password: 'Grizalum2025!',
      displayName: 'Contador GRIZALUM', 
      role: 'readonly'
    }
  ];

  const results = [];

  for (const userData of demoUsers) {
    try {
      console.log(`🔥 Creando usuario: ${userData.email}`);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: userData.displayName
      });

      console.log(`✅ Usuario ${userData.email} creado exitosamente`);
      
      results.push({
        success: true,
        email: userData.email,
        role: userData.role,
        message: 'Usuario creado exitosamente'
      });

    } catch (error) {
      console.error(`❌ Error creando ${userData.email}:`, error.code);
      
      let errorMessage = error.message;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El usuario ya existe';
          break;
        case 'auth/weak-password':
          errorMessage = 'Contraseña muy débil';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
      }

      results.push({
        success: false,
        email: userData.email,
        role: userData.role,
        message: errorMessage
      });
    }
  }

  return results;
};

// 🎯 FUNCIÓN PARA VERIFICAR SI EXISTEN USUARIOS DEMO
export const checkDemoUsers = async () => {
  try {
    // Esta función necesitaría Firebase Admin SDK para funcionar completamente
    // Por ahora, solo retornamos una promesa que resuelve
    console.log('🔍 Verificando usuarios demo...');
    
    return {
      adminExists: false, // Se actualizará según Firebase
      userExists: false,
      readonlyExists: false
    };
    
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
    return {
      adminExists: false,
      userExists: false, 
      readonlyExists: false
    };
  }
};

// 🎯 FUNCIÓN DE UTILIDAD PARA MOSTRAR RESULTADOS
export const showCreationResults = (results) => {
  console.log('\n🎯 RESULTADOS DE CREACIÓN DE USUARIOS:');
  console.log('=====================================');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.email} (${result.role}): ${result.message}`);
  });

  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Resumen: ${successful}/${total} usuarios creados exitosamente`);
  
  if (successful > 0) {
    console.log('\n🔐 CREDENCIALES DE ACCESO:');
    console.log('==========================');
    
    results.filter(r => r.success).forEach(result => {
      console.log(`👤 ${result.email}`);
      console.log(`🔑 Contraseña: Grizalum2025!`);
      console.log(`📋 Rol: ${result.role}`);
      console.log('---');
    });
  }
};
