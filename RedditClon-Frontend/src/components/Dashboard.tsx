import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { authState, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = authState.user?.isAdmin;
  const borderColor = isAdmin ? 'var(--admin-color)' : 'var(--success-color)';
  const titleColor = isAdmin ? 'var(--admin-color)' : 'var(--success-color)';
  const titleText = isAdmin ? '🔧 Administrador Conectado' : 'Usuario Conectado';

  return (
    <div style={{
      backgroundColor: 'var(--bg-color)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px var(--shadow-color)',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'var(--text-color)',
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          RedditClon
        </h1>

        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          border: `2px solid ${borderColor}`
        }}>
          <h2 style={{
            color: titleColor,
            margin: '0 0 1rem 0',
            fontSize: '1.5rem'
          }}>
            {titleText}
          </h2>

          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: 'var(--text-color)'
          }}>
            <strong>Usuario:</strong> {authState.user?.username}
          </div>

          <div style={{
            fontSize: '1.1rem',
            color: 'var(--text-color)'
          }}>
            <strong>Rol:</strong>
            <span style={{
              backgroundColor: borderColor,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              marginLeft: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              {authState.user?.userType}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: isAdmin ? '#dc3545' : 'var(--admin-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#c82333'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = isAdmin ? '#dc3545' : 'var(--admin-color)'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
