// 🔥 AGREGAR ESTAS LÍNEAS EN useFinancialData.js

// 📍 UBICACIÓN: Después de los estados principales (misClientes, misDeudas, misInversiones)

// 🔄 ESTADOS PARA FIREBASE
const [cargandoDatos, setCargandoDatos] = useState(true);
const [guardandoEnNube, setGuardandoEnNube] = useState(false);
const [errorConexion, setErrorConexion] = useState(null);
const [ultimoGuardadoNube, setUltimoGuardadoNube] = useState(null);

// 💾 FUNCIÓN PARA GUARDAR EN FIREBASE
const guardarEnFirebase = useCallback(async (clientes = misClientes, deudas = misDeudas, inversiones = misInversiones) => {
  setGuardandoEnNube(true);
  setErrorConexion(null);
  
  try {
    const resultado = await firebaseService.guardarDatos(clientes, deudas, inversiones);
    
    if (resultado.success) {
      setUltimoGuardadoNube(new Date());
      setFirebaseConectado(true);
      console.log('✅ Guardado en Firebase exitoso');
    } else {
      setErrorConexion(resultado.message);
      setFirebaseConectado(false);
    }
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error al guardar:', error);
    setErrorConexion('Error de conexión');
    setFirebaseConectado(false);
    return { success: false, message: error.message };
  } finally {
    setGuardandoEnNube(false);
  }
}, [misClientes, misDeudas, misInversiones]);

// 📥 FUNCIÓN PARA CARGAR DATOS INICIALES
const cargarDatosIniciales = useCallback(async () => {
  setCargandoDatos(true);
  
  try {
    const resultado = await firebaseService.cargarDatos();
    
    if (resultado.success && resultado.datos) {
      // Cargar datos desde Firebase
      if (resultado.datos.clientes?.length > 0) {
        setMisClientes(resultado.datos.clientes);
      }
      if (resultado.datos.deudas?.length > 0) {
        setMisDeudas(resultado.datos.deudas);
      }
      if (resultado.datos.inversiones?.length > 0) {
        setMisInversiones(resultado.datos.inversiones);
      }
      
      setFirebaseConectado(true);
      console.log('✅ Datos cargados desde Firebase');
    } else {
      console.log('📝 Usando datos por defecto (primera vez)');
      setFirebaseConectado(false);
    }
    
  } catch (error) {
    console.error('❌ Error al cargar:', error);
    setErrorConexion('Error al cargar datos');
    setFirebaseConectado(false);
  } finally {
    setCargandoDatos(false);
  }
}, []);

// 🚀 CARGAR DATOS AL INICIAR
useEffect(() => {
  cargarDatosIniciales();
}, [cargarDatosIniciales]);

// 🔄 GUARDAR AUTOMÁTICAMENTE CUANDO CAMBIAN LOS DATOS
useEffect(() => {
  // Solo guardar si ya terminó de cargar y no estamos guardando
  if (!cargandoDatos && !guardandoEnNube && (misClientes.length > 0 || misDeudas.length > 0)) {
    const timeout = setTimeout(() => {
      guardarEnFirebase();
    }, 2000); // Esperar 2 segundos después del último cambio
    
    return () => clearTimeout(timeout);
  }
}, [misClientes, misDeudas, misInversiones, cargandoDatos, guardandoEnNube, guardarEnFirebase]);

// 🔄 VERIFICAR CONEXIÓN PERIÓDICAMENTE
useEffect(() => {
  const verificarConexion = async () => {
    const conectado = await firebaseService.verificarConexion();
    setFirebaseConectado(conectado);
  };
  
  // Verificar cada 30 segundos
  const interval = setInterval(verificarConexion, 30000);
  
  return () => clearInterval(interval);
}, []);
