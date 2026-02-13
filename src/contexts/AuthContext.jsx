import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getCurrentUser, connectWebSocket, disconnectWebSocket } from '../api/todos';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginNotification, setLoginNotification] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Connect to WebSocket on app start if user exists
          connectWebSocket(handleWebSocketMessage);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // User not authenticated, clear any stale data
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

  const handleWebSocketMessage = (data) => {
    console.log('📨 Received WebSocket message:', data);
    // Handle real-time updates here
    // Invalidate queries or update state as needed
  };

  const signIn = async (credentials) => {
    try {
      const response = await login(credentials);
      const userData = response.user || response.data?.user || response;
      const token = response.token || response.data?.token;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);

      // Connect WebSocket after login
      connectWebSocket(handleWebSocketMessage);

      // Show login notification
      setLoginNotification({
        type: 'success',
        message: `Welcome back, ${userData.name || userData.email}!`,
        timestamp: Date.now(),
      });

      // Clear notification after 5 seconds
      setTimeout(() => setLoginNotification(null), 5000);

      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await register(userData);
      const user = response.user || response.data?.user || response;
      const token = response.token || response.data?.token;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      // Connect WebSocket after signup
      connectWebSocket(handleWebSocketMessage);

      // Show signup notification
      setLoginNotification({
        type: 'success',
        message: `Welcome to Todo App, ${user.name || user.email}!`,
        timestamp: Date.now(),
      });

      // Clear notification after 5 seconds
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

      // Show logout notification
      setLoginNotification({
        type: 'info',
        message: 'You have been logged out successfully.',
        timestamp: Date.now(),
      });

      // Clear notification after 3 seconds
      setTimeout(() => setLoginNotification(null), 3000);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local data even if logout fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      disconnectWebSocket();
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    loginNotification,
    clearLoginNotification: () => setLoginNotification(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
