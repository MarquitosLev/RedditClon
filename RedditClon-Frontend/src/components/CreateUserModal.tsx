import React, { useState } from 'react';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password, isAdmin })
            });

            if (response.ok) {
                alert('Usuario creado exitosamente');
                setUsername('');
                setEmail('');
                setPassword('');
                setIsAdmin(false);
                onUserCreated();
                onClose();
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-color)',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

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
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'
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
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'
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
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="isAdminModal"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="isAdminModal" style={{ color: 'var(--text-color)' }}>Es Administrador</label>
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
        </div>
    );
};

export default CreateUserModal;
