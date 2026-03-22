import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const ActivateAccount: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const hasActivated = useRef(false); // Guard contra React StrictMode double-invoke

    useEffect(() => {
        if (hasActivated.current) return; // Ya se ejecutó, no volver a llamar
        hasActivated.current = true;

        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('Token de activación no encontrado.');
            return;
        }

        const activate = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/activate/${token}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Cuenta activada exitosamente.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'No se pudo activar la cuenta.');
                }
            } catch {
                setStatus('error');
                setMessage('Error de conexión. Intentá de nuevo más tarde.');
            }
        };

        activate();
    }, [searchParams]);

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
                padding: '2.5rem',
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
            }}>
                {status === 'loading' && (
                    <>
                        <div style={{
                            width: '48px', height: '48px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid var(--input-focus)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1.5rem',
                        }} />
                        <p style={{ color: 'var(--text-color)', fontSize: '1rem' }}>Activando tu cuenta...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            ¡Cuenta activada!
                        </h2>
                        <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '1.75rem', lineHeight: '1.6' }}>
                            {message}
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
                            Ir al Login
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❌</div>
                        <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Error de activación
                        </h2>
                        <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '1.75rem', lineHeight: '1.6' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => navigate('/register')}
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
                            Volver al Registro
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivateAccount;
