import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Error al registrar usuario');
            }
        } catch {
            setError('Error de conexión. Intentá de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
        border: '2px solid var(--input-border)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        outline: 'none',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-color)',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = 'var(--input-focus)';
        e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = 'var(--input-border)';
        e.target.style.boxShadow = 'none';
    };

    if (success) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-color)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '2px solid var(--input-border)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px var(--shadow-color)',
                    padding: '2.5rem',
                    maxWidth: '420px',
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📬</div>
                    <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ¡Cuenta creada!
                    </h2>
                    <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Te enviamos un email a <strong>{email}</strong> con un enlace para activar tu cuenta. Revisá también la carpeta de spam.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'var(--button-bg)',
                            color: 'var(--button-text)',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-bg)')}
                    >
                        Aceptar
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
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            boxSizing: 'border-box',
        }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '2px solid var(--input-border)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px var(--shadow-color)',
                padding: '2rem',
                maxWidth: '420px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--input-focus)' }}>🚀</div>
                    <h1 style={{
                        color: 'var(--text-color)',
                        marginBottom: '0.25rem',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                    }}>
                        RedditClon
                    </h1>
                    <p style={{ color: 'var(--text-color)', fontSize: '1rem', opacity: 0.8, margin: 0 }}>
                        Creá tu cuenta
                    </p>
                </div>

                {/* Form */}
                <div style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '0.75rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-color)', opacity: 0.6,
                            }}>👤</div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Nombre de usuario"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--input-border)', margin: '0.75rem 0' }} />

                        {/* Email */}
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '0.75rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-color)', opacity: 0.6,
                            }}>✉️</div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--input-border)', margin: '0.75rem 0' }} />

                        {/* Password */}
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '0.75rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-color)', opacity: 0.6,
                            }}>🔒</div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Contraseña"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--input-border)', margin: '0.75rem 0' }} />

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '0.75rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-color)', opacity: 0.6,
                            }}>🔐</div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirmar contraseña"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--input-border)', margin: '0.75rem 0' }} />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: 'var(--button-bg)',
                                color: 'var(--button-text)',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.3s ease',
                                boxShadow: loading ? 'none' : '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--button-hover)')}
                            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--button-bg)')}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    {/* Link to Login */}
                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                        <span style={{ color: 'var(--text-color)', opacity: 0.7, fontSize: '0.9rem' }}>
                            ¿Ya tenés cuenta?{' '}
                        </span>
                        <a
                            href="/login"
                            style={{
                                color: 'var(--input-focus)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
                            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                            Iniciá sesión
                        </a>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {error && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        maxWidth: '400px', width: '90%',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Error</h3>
                        <p style={{ color: 'var(--text-color)', marginBottom: '2rem' }}>{error}</p>
                        <button
                            onClick={() => setError('')}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: 'var(--input-focus)',
                                color: 'white', border: 'none',
                                borderRadius: '8px', cursor: 'pointer',
                                fontSize: '1rem', fontWeight: 'bold',
                            }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
