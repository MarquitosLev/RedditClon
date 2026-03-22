import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import SuggestionsButton from './components/SuggestionsButton';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MainLayout from './layouts/MainLayout';
import CreateUserPage from './components/CreateUserPage';
import Register from './components/Register';
import ActivateAccount from './components/ActivateAccount';

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
        <Route path="/register" element={!authState.isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            authState.isAuthenticated ? (
              <MainLayout>
                <Dashboard />
                <SuggestionsButton />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            authState.isAuthenticated && authState.user?.isAdmin ? (
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/admin/create-user"
          element={
            authState.isAuthenticated && authState.user?.isAdmin ? (
              <MainLayout>
                {/* Reuse AdminDashboard or a specific wrapper if needed, for now assumes CreateUserModal is part of AdminDashboard or needs a wrapper. 
                      Wait, the user wants a separate "page" or option? 
                      "opcion de crear usuario". If CreateUser is a Modal, maybe we can just render the modal or a page wrapper.
                      Let's check CreateUserModal.tsx later. For now, I'll direct to a placeholder or reuse AdminDashboard with a prop/state if possible, 
                      BUT better to assume I need to create a page for it OR just use the modal on top of dashboard?
                      The link in Navbar goes to /admin/create-user. So I need a Route. 
                  */}
                <div style={{ padding: '20px', color: 'var(--text-color)' }}>
                  <CreateUserPage />
                </div>
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
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
