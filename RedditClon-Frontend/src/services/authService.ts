import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


// Configurar axios para incluir credenciales en las peticiones
axios.defaults.withCredentials = true;

export interface User {
  username: string;
  roles: string[];
  isAdmin: boolean;
  userType: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username?: string;
  roles?: string[];
  isAdmin?: boolean;
  userType?: 'ADMIN' | 'USER';
}


class AuthService {
  private user: User | null = null;
  private isAuthenticated = false;

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log(`[FRONTEND] Intentando login con usuario: ${username}`);

      // Hacer login con el endpoint personalizado
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: username,
        password: password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        console.log(`[FRONTEND] Login exitoso para usuario: ${username}, tipo: ${response.data.userType}`);

        this.user = {
          username: response.data.username,
          roles: response.data.roles,
          isAdmin: response.data.isAdmin,
          userType: response.data.userType
        };
        this.isAuthenticated = true;

        // Guardar en localStorage para persistir la sesión
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('isAuthenticated', 'true');

        return {
          success: true,
          message: 'Login exitoso',
          username: this.user.username,
          roles: this.user.roles,
          isAdmin: this.user.isAdmin,
          userType: this.user.userType
        };
      } else {
        console.log(`[FRONTEND] Login fallido: ${response.data.message}`);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error: any) {
      console.error('[FRONTEND] Error en login:', error);
      const errorMessage = error.response?.data?.message || 'Error de conexión';
      console.log(`[FRONTEND] Mensaje de error: ${errorMessage}`);
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('[FRONTEND] Iniciando logout...');
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true
      });
      console.log('[FRONTEND] Logout exitoso');
    } catch (error) {
      console.error('[FRONTEND] Error en logout:', error);
    } finally {
      // Siempre limpiar el estado local, independientemente del resultado del servidor
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      console.log('[FRONTEND] Estado local limpiado');
    }
  }

  async checkAuth(): Promise<{ isAuthenticated: boolean; user: User | null; loading: boolean }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`);

      if (response.data.authenticated) {
        this.user = {
          username: response.data.username,
          roles: response.data.roles,
          isAdmin: response.data.isAdmin,
          userType: response.data.userType
        };
        this.isAuthenticated = true;

        // Actualizar localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }

    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      loading: false
    };
  }

  // Restaurar estado desde localStorage
  restoreAuthState(): { isAuthenticated: boolean; user: User | null; loading: boolean } {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');

    if (storedUser && storedAuth === 'true') {
      try {
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Error parseando usuario guardado:', error);
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }

    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      loading: false
    };
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  isUserAdmin(): boolean {
    return this.user?.isAdmin || false;
  }
}

export const authService = new AuthService();
