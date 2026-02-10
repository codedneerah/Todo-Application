import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Notifications from '../Notifications';

export default function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Todo App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && <Notifications />}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Profile
                </Link>
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
