import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);

      if (!response.success) {
        setError(response.message);
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Caja principal que encierra todo */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '2px solid var(--input-border)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px var(--shadow-color)',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Título y subtítulo dentro de la caja */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--input-focus)'
          }}>
            🚀
          </div>
          <h1 style={{
            color: 'var(--text-color)',
            marginBottom: '0.5rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            RedditClon
          </h1>
          <p style={{
            color: 'var(--text-color)',
            fontSize: '1.1rem',
            opacity: 0.8
          }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Layout horizontal: izquierda usuarios, derecha formulario */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2rem',
          width: '100%',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          {/* Sección izquierda: Usuarios de Prueba (sin caja interna) */}
          <div style={{
            flex: 1,
            padding: '1.5rem 0' /* Sin fondo ni borde */
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-color)',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              🔑 Usuarios de Prueba
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-color)',
              opacity: 0.8
            }}>
              <div>
                <strong>Usuario:</strong> user / password
              </div>
              <div>
                <strong>Admin:</strong> admin / admin
              </div>
            </div>
          </div>

          {/* Línea divisoria delgada */}
          <div style={{
            width: '1px',
            backgroundColor: 'var(--input-border)',
            alignSelf: 'stretch'
          }}></div>

          {/* Sección derecha: Formulario de Login (sin caja interna) */}
          <div style={{
            flex: 1,
            padding: '2rem 0' /* Sin fondo ni borde */
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-color)',
                  opacity: 0.6,
                  fontSize: '1rem'
                }}>
                  👤
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: `2px solid var(--input-border)`,
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--input-focus)';
                    (e.target as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--input-border)';
                    (e.target as HTMLElement).style.boxShadow = 'none';
                  }}
                  placeholder="Usuario"
                />
              </div>

              {/* Línea divisoria entre inputs */}
              <hr style={{
                border: 'none',
                borderTop: '1px solid var(--input-border)',
                margin: '1rem 0'
              }} />

              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-color)',
                  opacity: 0.6,
                  fontSize: '1rem'
                }}>
                  🔒
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: `2px solid var(--input-border)`,
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--input-focus)';
                    (e.target as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'var(--input-border)';
                    (e.target as HTMLElement).style.boxShadow = 'none';
                  }}
                  placeholder="Contraseña"
                />
              </div>

              {/* Forgot Password Link */}
              <div style={{
                textAlign: 'right',
                marginBottom: '1rem'
              }}>
                <a
                  href="/forgot-password"
                  style={{
                    color: 'var(--input-focus)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.opacity = '1'}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {error && (
                <>
                  {/* Línea divisoria antes del error */}
                  <hr style={{
                    border: 'none',
                    borderTop: '1px solid var(--input-border)',
                    margin: '1rem 0'
                  }} />
                  <div style={{
                    backgroundColor: 'var(--error-bg)',
                    color: 'var(--error-text)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    border: `1px solid var(--error-border)`,
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}>
                    ⚠️ {error}
                  </div>
                </>
              )}

              {/* Línea divisoria antes del botón */}
              <hr style={{
                border: 'none',
                borderTop: '1px solid var(--input-border)',
                margin: '1rem 0'
              }} />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: loading ? 'var(--button-bg)' : 'var(--input-focus)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 2px 10px rgba(0, 123, 255, 0.3)'
                }}
                onMouseOver={(e) => !loading && ((e.target as HTMLElement).style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => !loading && ((e.target as HTMLElement).style.backgroundColor = 'var(--input-focus)')}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
