import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
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
          border: `2px solid var(--admin-color)`
        }}>
          <h2 style={{
            color: 'var(--admin-color)',
            margin: '0 0 1rem 0',
            fontSize: '1.5rem'
          }}>
            🔧 Administrador Conectado
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
              backgroundColor: 'var(--admin-color)',
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

        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          border: `2px solid var(--admin-color)`
        }}>
          <h2 style={{
            color: 'var(--admin-color)',
            margin: '0 0 1rem 0',
            fontSize: '1.5rem'
          }}>
            👤 Crear Nuevo Usuario
          </h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const username = (form.elements.namedItem('username') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            const isAdmin = (form.elements.namedItem('isAdmin') as HTMLInputElement).checked;

            try {
              const response = await fetch('http://localhost:8080/api/admin/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password, isAdmin })
              });

              if (response.ok) {
                alert('Usuario creado exitosamente');
                form.reset();
              } else {
                if (response.status === 401 || response.status === 403) {
                  alert('Sesión expirada o sin permisos. Por favor, inicie sesión nuevamente.');
                  handleLogout();
                  return;
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                  const data = await response.json();
                  alert('Error: ' + data.message);
                } else {
                  const text = await response.text();
                  alert('Error del servidor: ' + (text || response.statusText));
                }
              }
            } catch (error) {
              console.error('Error creating user:', error);
              alert('Error al conectar con el servidor. Verifique que el backend esté corriendo.');
            }
          }}>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Usuario:</label>
              <input name="username" type="text" required style={{
                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'
              }} />
            </div>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Contraseña:</label>
              <input name="password" type="password" required style={{
                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'
              }} />
            </div>
            <div style={{ marginBottom: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              <input name="isAdmin" type="checkbox" id="isAdmin" style={{ marginRight: '0.5rem' }} />
              <label htmlFor="isAdmin" style={{ color: 'var(--text-color)' }}>Es Administrador</label>
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--admin-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Crear Usuario
            </button>
          </form>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#c82333'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#dc3545'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
