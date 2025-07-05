import React from 'react';

function App() {
  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#1e293b', fontSize: '36px', marginBottom: '20px' }}>
        🎉 GRIZALUM FUNCIONANDO
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#059669', marginBottom: '20px' }}>
          ✅ Sistema Base Funcionando
        </h2>
        
        <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6' }}>
          React está funcionando correctamente. 
          Ahora podemos agregar el sistema financiero paso a paso.
        </p>
        
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Estado del Sistema:</h3>
          <ul style={{ textAlign: 'left', color: '#4b5563' }}>
            <li>✅ React.js iniciado</li>
            <li>✅ App.js renderizado</li>
            <li>✅ Estilos aplicados</li>
            <li>🔄 Listo para componentes</li>
          </ul>
        </div>
        
        <p style={{ 
          marginTop: '25px', 
          fontSize: '14px', 
          color: '#6b7280',
          fontStyle: 'italic' 
        }}>
          Fecha: {new Date().toLocaleDateString()} | 
          Hora: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default App;
