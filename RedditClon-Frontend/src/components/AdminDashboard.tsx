import React, { useState } from 'react';
import UserGrid from './UserGrid';

import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [refreshKey] = useState(0);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-color)', margin: 0 }}>
          Dashboard de Usuarios
        </h1>
        <Link to="/admin/create-user" style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'opacity 0.2s'
        }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ➕ Crear Usuario
        </Link>
      </div>

      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '20px'
      }}>
        <UserGrid key={refreshKey} />
      </div>
    </div>
  );
};

export default AdminDashboard;
