import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (authState.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          boxShadow: `0 2px 10px var(--shadow-color)`
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid var(--input-focus)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ margin: 0, color: 'var(--text-color)' }}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!authState.isAuthenticated) {
    return <Login />;
  }

  // Si está autenticado, mostrar el dashboard unificado
  return <Dashboard />;
};

export default AppContent;
