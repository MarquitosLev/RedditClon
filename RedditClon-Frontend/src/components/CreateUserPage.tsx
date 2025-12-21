import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const CreateUserPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password, isAdmin })
            });

            if (response.ok) {
                alert('Usuario creado exitosamente');
                navigate('/admin/dashboard'); // Redirect to dashboard after creation
            } else {
                const data = await response.json();
                setError(data.message || 'Error al crear usuario');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '40px'
        }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                width: '100%',
                maxWidth: '500px'
            }}>
                <h2 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', textAlign: 'center' }}>Crear Nuevo Usuario</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#ffdddd',
                        color: '#d8000c',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--input-border)',
                                backgroundColor: 'var(--input-bg)', color: 'var(--text-color)'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--input-border)',
                                backgroundColor: 'var(--input-bg)', color: 'var(--text-color)'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--input-border)',
                                backgroundColor: 'var(--input-bg)', color: 'var(--text-color)'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="isAdminPage"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="isAdminPage" style={{ color: 'var(--text-color)' }}>Es Administrador</label>
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
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'normal' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserPage;
