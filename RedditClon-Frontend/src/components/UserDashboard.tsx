import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { authState, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-color)',
      padding: '2rem',
      width: '100%',
      height: '100%'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
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
          border: `2px solid var(--success-color)`
        }}>
          <h2 style={{
            color: 'var(--success-color)',
            margin: '0 0 1rem 0',
            fontSize: '1.5rem'
          }}>
            Usuario Conectado
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
              backgroundColor: 'var(--success-color)',
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
            backgroundColor: 'var(--admin-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#c82333'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--admin-color)'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
