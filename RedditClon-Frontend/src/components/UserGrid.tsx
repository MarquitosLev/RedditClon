import React, { useEffect, useState } from 'react';


interface User {
    id: number;
    username: string;
    password: string; // Hashed
    createdAt: string;
    roles: string[];
    enabled: boolean;
}

const UserGrid: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/users', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, enabled: !currentStatus } : user
            ));
        } catch (err) {
            alert('Error updating user status');
            console.error(err);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-color)' }}>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: 'var(--text-color)',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--admin-color)', color: 'white' }}>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre de Usuario</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Contraseña (Cifrada)</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha de Alta</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Roles</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem' }}>{user.id}</td>
                            <td style={{ padding: '1rem' }}>{user.username}</td>
                            <td style={{ padding: '1rem', fontFamily: 'monospace', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.password}>
                                {user.password}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {user.roles.join(', ')}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: user.enabled ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    color: user.enabled ? '#4caf50' : '#f44336',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}>
                                    {user.enabled ? 'Activo' : 'Suspendido'}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {!user.roles.includes('ADMIN') && (
                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.enabled)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backgroundColor: user.enabled ? '#f44336' : '#4caf50',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            transition: 'opacity 0.2s'
                                        }}
                                        title={user.enabled ? 'Suspender usuario' : 'Reactivar usuario'}
                                    >
                                        {user.enabled ? 'Suspender' : 'Activar'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserGrid;
