import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config/api';


interface User {
    id: number;
    username: string;
    email: string;
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
                const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
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
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
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
                overflow: 'hidden',
                fontSize: '14px' // Slightly smaller text for better fit
            }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--admin-color)', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Roles</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px' }}>{user.id}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.username}</td>
                            <td style={{ padding: '12px' }}>{user.email || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>
                                {user.roles.map(role => (
                                    <span key={role} style={{
                                        fontSize: '10px',
                                        backgroundColor: 'var(--input-bg)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        marginRight: '4px'
                                    }}>
                                        {role}
                                    </span>
                                ))}
                            </td>
                            <td style={{ padding: '12px' }}>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: user.enabled ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    color: user.enabled ? '#4caf50' : '#f44336',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                }}>
                                    {user.enabled ? 'Activo' : 'Suspendido'}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                {!user.roles.includes('ADMIN') && (
                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.enabled)}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backgroundColor: user.enabled ? '#f44336' : '#4caf50',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px',
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
