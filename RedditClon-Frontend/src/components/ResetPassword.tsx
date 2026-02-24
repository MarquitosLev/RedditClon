import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Token no proporcionado');
            setValidatingToken(false);
            return;
        }

        // Validar el token
        const validateToken = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/validate-token/${token}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();
                setTokenValid(data.valid);

                if (!data.valid) {
                    setError('El token es inválido o ha expirado');
                }
            } catch (error) {
                setError('Error al validar el token');
            } finally {
                setValidatingToken(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Contraseña actualizada exitosamente. Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Error al restablecer la contraseña');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-color)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div style={{
                    color: 'var(--text-color)',
                    fontSize: '1.2rem'
                }}>
                    Validando token...
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-color)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div style={{
                    backgroundColor: 'var(--error-bg)',
                    color: 'var(--error-text)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--error-border)',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                    <h2 style={{ marginBottom: '1rem' }}>Token Inválido</h2>
                    <p style={{ marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--input-focus)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Solicitar Nuevo Token
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'var(--bg-color)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '2px solid var(--input-border)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px var(--shadow-color)',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        color: 'var(--input-focus)'
                    }}>
                        🔐
                    </div>
                    <h1 style={{
                        color: 'var(--text-color)',
                        marginBottom: '0.5rem',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Restablecer Contraseña
                    </h1>
                    <p style={{
                        color: 'var(--text-color)',
                        fontSize: '0.95rem',
                        opacity: 0.8
                    }}>
                        Ingresa tu nueva contraseña
                    </p>
                </div>

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
                            🔒
                        </div>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                border: '2px solid var(--input-border)',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-color)'
                            }}
                            placeholder="Nueva contraseña (mín. 6 caracteres)"
                        />
                    </div>

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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                border: '2px solid var(--input-border)',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                boxSizing: 'border-box',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-color)'
                            }}
                            placeholder="Confirmar contraseña"
                        />
                    </div>

                    {message && (
                        <div style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            marginBottom: '1rem',
                            border: '1px solid #c3e6cb',
                            fontSize: '0.9rem'
                        }}>
                            ✅ {message}
                        </div>
                    )}

                    {error && (
                        <div style={{
                            backgroundColor: 'var(--error-bg)',
                            color: 'var(--error-text)',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            marginBottom: '1rem',
                            border: '1px solid var(--error-border)',
                            fontSize: '0.9rem'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

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
                            boxShadow: loading ? 'none' : '0 2px 10px rgba(0, 123, 255, 0.3)',
                            marginBottom: '1rem'
                        }}
                    >
                        {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'transparent',
                            color: 'var(--input-focus)',
                            border: '2px solid var(--input-focus)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ← Volver al Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
