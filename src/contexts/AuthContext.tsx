import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, register, logout, connectWebSocket, disconnectWebSocket } from '../api/todos';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginNotification: {
    type: 'success' | 'info';
    message: string;
    timestamp: number;
  } | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (userData: { email: string; password: string; name: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  clearLoginNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginNotification, setLoginNotification] = useState<{
    type: 'success' | 'info';
    message: string;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          connectWebSocket(handleWebSocketMessage);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleWebSocketMessage = (data: unknown) => {
    console.log('📨 Received WebSocket message:', data);
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const response = await login(credentials);
      const userData = response.user || response.data?.user || response;
      const token = response.token || response.data?.token;

      setUser(userData as User);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token as string);

      connectWebSocket(handleWebSocketMessage);

      setLoginNotification({
        type: 'success',
        message: `Welcome back, ${userData.name || userData.email}!`,
        timestamp: Date.now(),
      });

      setTimeout(() => setLoginNotification(null), 5000);

      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await register(userData);
      const user = response.user || response.data?.user || response;
      const token = response.token || response.data?.token;

      setUser(user as User);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token as string);

      connectWebSocket(handleWebSocketMessage);

      setLoginNotification({
        type: 'success',
        message: `Welcome to Todo App, ${user.name || user.email}!`,
        timestamp: Date.now(),
      });

      setTimeout(() => setLoginNotification(null), 5000);

      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      disconnectWebSocket();

      setLoginNotification({
        type: 'info',
        message: 'You have been logged out successfully.',
        timestamp: Date.now(),
      });

      setTimeout(() => setLoginNotification(null), 3000);
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      disconnectWebSocket();
    }
  };

  const clearLoginNotification = () => setLoginNotification(null);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    loginNotification,
    clearLoginNotification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

