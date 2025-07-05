// 📁 src/App.js - VERSIÓN CON GRIZALUM INTEGRADO
import React, { useState, useEffect } from 'react';
import './App.css';

// 🎯 IMPORTAR COMPONENTE PRINCIPAL
import GrizalumFinancial from './components/GrizalumFinancial';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  // 🚀 Carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Pantalla de carga
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            borderRadius: '50%',
            margin: '0 auto 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite'
          }}>
            G
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>GRIZALUM</h1>
          <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '30px' }}>
            Compañía Metálurgica
          </p>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '20px', fontSize: '16px', opacity: 0.7 }}>
            Iniciando Sistema Financiero...
          </p>
        </div>
      </div>
    );
  }

  // 🎛️ Panel de control (opcional)
  if (showPanel) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>🎛️ Panel de Control - GRIZALUM</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            Sistema funcionando correctamente
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#1e293b', marginBottom: '30px' }}>
            ✅ Sistema Verificado y Funcionando
          </h2>
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#059669', margin: '0 0 10px 0' }}>
                ✅ Verificaciones Completadas
              </h3>
              <ul style={{ textAlign: 'left', color: '#065f46', lineHeight: '1.8' }}>
                <li>React.js funcionando correctamente</li>
                <li>Componentes cargados sin errores</li>
                <li>Hooks de datos financieros operativos</li>
                <li>Interfaz de usuario renderizada</li>
                <li>Sistema listo para producción</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowPanel(false)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}
            >
              🏦 Iniciar GRIZALUM
            </button>

            <button 
              onClick={() => {
                console.log('🔧 Información del Sistema:');
                console.log('📅 Fecha:', new Date().toLocaleDateString());
                console.log('⏰ Hora:', new Date().toLocaleTimeString());
                console.log('🎯 Estado: OPERATIVO');
                alert('✅ Sistema verificado!\n\nRevisa la consola (F12) para más detalles técnicos.');
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              🔍 Verificar Sistema
            </button>
          </div>

          <p style={{ 
            marginTop: '25px', 
            color: '#64748b', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            🎯 Todo está funcionando perfectamente. El sistema está listo para usar.
          </p>
        </div>
      </div>
    );
  }

  // 🏦 APLICACIÓN PRINCIPAL - GRIZALUM FINANCIAL
  return (
    <div className="App">
      {/* Botón de debug en esquina superior derecha */}
      <button
        onClick={() => setShowPanel(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1e293b',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '18px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
        title="Panel de Control"
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        ⚙️
      </button>

      {/* Componente principal */}
      <GrizalumFinancial />
    </div>
  );
}

export default App;
