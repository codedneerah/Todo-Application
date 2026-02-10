import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getCurrentUser } from '../api/todos';

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
          setUser(JSON.parse(storedUser));
        } else {
          // Try to get current user from API if token exists
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch {
        // User not authenticated, clear any stale data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (credentials) => {
    const response = await login(credentials);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('authToken', response.token);

    // Show login notification
    setLoginNotification({
      type: 'success',
      message: `Welcome back, ${response.user.name || response.user.email}!`,
      timestamp: Date.now(),
    });

    // Clear notification after 5 seconds
    setTimeout(() => setLoginNotification(null), 5000);

    return response;
  };

  const signUp = async (userData) => {
    const response = await register(userData);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('authToken', response.token);

    // Show signup notification
    setLoginNotification({
      type: 'success',
      message: `Welcome to Todo App, ${response.user.name || response.user.email}!`,
      timestamp: Date.now(),
    });

    // Clear notification after 5 seconds
    setTimeout(() => setLoginNotification(null), 5000);

    return response;
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    // Show logout notification
    setLoginNotification({
      type: 'info',
      message: 'You have been logged out successfully.',
      timestamp: Date.now(),
    });

    // Clear notification after 3 seconds
    setTimeout(() => setLoginNotification(null), 3000);
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
