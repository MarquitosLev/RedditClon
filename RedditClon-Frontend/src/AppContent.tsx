import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import SuggestionsButton from './components/SuggestionsButton';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (authState.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-color)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          boxShadow: `0 2px 10px var(--shadow-color)`
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid var(--input-focus)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ margin: 0, color: 'var(--text-color)' }}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!authState.isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            authState.isAuthenticated ? (
              authState.user?.isAdmin ? (
                <>
                  <AdminDashboard />
                  <SuggestionsButton />
                </>
              ) : (
                <>
                  <Dashboard />
                  <SuggestionsButton />
                </>
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppContent;
