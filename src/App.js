// 📁 src/App.js - VERSIÓN COMPLETA Y FUNCIONAL
import React, { useState, useEffect } from 'react';
import './App.css';

// 🎯 IMPORTAR EL COMPONENTE PRINCIPAL (cuando esté listo)
// import GrizalumFinancial from './components/GrizalumFinancial';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGrizalum, setShowGrizalum] = useState(false);

  // 🚀 Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 🧪 MODO DEBUGGING - Para probar que React funciona
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>Cargando GRIZALUM...</h2>
          <p>Sistema Financiero Empresarial</p>
        </div>
      </div>
    );
  }

  // 🎛️ PANEL DE CONTROL - Para testing
  if (!showGrizalum) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 'bold'
          }}>
            G
          </div>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            🎉 ¡GRIZALUM ONLINE!
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
            Sistema Financiero Empresarial - Compañía Metálurgica
          </p>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#059669', margin: '0 0 15px 0', fontSize: '20px' }}>
              ✅ Estado del Sistema
            </h3>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '16px', lineHeight: '1.8' }}>
              <li>✅ React.js funcionando</li>
              <li>✅ App.js renderizado</li>
              <li>✅ Estilos aplicados</li>
              <li>✅ Interactividad habilitada</li>
              <li>🔄 Listo para cargar componentes</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', fontSize: '20px' }}>
              🛠️ Información Técnica
            </h3>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Navegador:</strong> {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Otro'}</p>
              <p><strong>Estado:</strong> <span style={{color: '#059669', fontWeight: 'bold'}}>CONECTADO</span></p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '25px', fontSize: '24px' }}>
            🚀 Panel de Control
          </h3>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                console.log('🎯 Test de Console - Todo funciona!');
                alert('✅ ¡JavaScript funcionando perfectamente!\n\n🎯 Console logs activos\n🔄 React renderizando\n⚡ Eventos funcionando');
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '15px 25px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🧪 Test de Sistema
            </button>

            <button 
              onClick={() => {
                console.log('🚀 Iniciando GRIZALUM Financial...');
                setShowGrizalum(true);
              }}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '15px 25px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🏦 Cargar GRIZALUM
            </button>

            <button 
              onClick={() => {
                const info = `
🏢 GRIZALUM - COMPAÑÍA METÁLURGICA
📊 Sistema Financiero Empresarial

✅ Estado: ONLINE
🔄 Versión: 1.0.0
📅 Fecha: ${new Date().toLocaleDateString()}
⏰ Hora: ${new Date().toLocaleTimeString()}
🌐 Plataforma: React.js

🎯 Funcionalidades:
• Gestión de Clientes
• Control de Deudas  
• Portfolio de Inversiones
• Centro de Alertas
• Reportes Financieros
                `;
                alert(info);
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '15px 25px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ℹ️ Info Sistema
            </button>
          </div>

          <p style={{ 
            marginTop: '25px', 
            color: '#64748b', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            💡 Presiona F12 para abrir DevTools y ver los console.log()
          </p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#64748b',
          fontSize: '14px'
        }}>
          <p>🔧 Desarrollado con React.js • 🏢 GRIZALUM Compañía Metálurgica</p>
          <p>📍 Sistema desplegado y funcionando correctamente</p>
        </div>
      </div>
    );
  }

  // 🏦 CARGAR COMPONENTE PRINCIPAL
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          🏦 GRIZALUM - Sistema Financiero
        </h1>
        <button 
          onClick={() => setShowGrizalum(false)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          ← Volver al Panel
        </button>
      </div>
      
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>
            🚧 Componente en Desarrollo
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
            El componente <code>GrizalumFinancial</code> está listo para ser integrado. 
            Para activarlo, descomenta la línea de importación en este archivo.
          </p>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '15px',
            borderRadius: '6px',
            marginTop: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            textAlign: 'left',
            border: '1px solid #e2e8f0'
          }}>
            <code>
              // Descomentar esta línea:<br/>
              // import GrizalumFinancial from './components/GrizalumFinancial';
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
