import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginResponse } from '../services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  // Restaurar estado de autenticación al cargar la app
  useEffect(() => {
    const restoreAuth = async () => {
      const restoredState = authService.restoreAuthState();
      setAuthState(restoredState);

      // Si hay un usuario guardado, verificar si sigue siendo válido
      if (restoredState.isAuthenticated) {
        await checkAuth();
      }
    };

    restoreAuth();
  }, []);

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    // No establecemos loading: true aquí para evitar desmontar el componente Login

    try {
      const response = await authService.login(username, password);

      if (response.success) {
        const newAuthState = {
          isAuthenticated: true,
          user: {
            username: response.username!,
            roles: response.roles!,
            isAdmin: response.isAdmin!,
            userType: response.userType!
          },
          loading: false
        };
        setAuthState(newAuthState);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      await authService.logout();
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  };

  const checkAuth = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const newAuthState = await authService.checkAuth();
      setAuthState(newAuthState);
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  };

  const value: AuthContextType = {
    authState,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
