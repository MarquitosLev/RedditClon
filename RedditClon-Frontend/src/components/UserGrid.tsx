import React, { useEffect, useState } from 'react';


interface User {
    id: number;
    username: string;
    password: string; // Hashed
    createdAt: string;
    roles: string[];
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserGrid;
