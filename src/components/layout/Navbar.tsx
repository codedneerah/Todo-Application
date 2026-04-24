import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Notifications from '../Notifications';
import { FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { User } from '../../types';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { user, signOut, isAuthenticated } = useAuth() as {
    user: User | null;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
  };
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
    <>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only fixed top-0 left-0 bg-blue-600 text-white px-4 py-2 z-50">
        Skip to main content
      </a>

      <nav
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2"
                aria-label="TodoApp Home"
              >
                <span aria-hidden="true">📝</span>
                <span>TodoApp</span>
              </Link>
            </div>

            {/* Navigation Items - Right Side */}
            <div className="flex items-center gap-6">
              {isAuthenticated && (
                <>
                  {/* Notifications */}
                  <Notifications />

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                    aria-label="View your profile"
                  >
                    <FaUser size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  {/* User Info */}
                  <div
                    className="hidden md:block text-sm text-gray-700 font-medium"
                    aria-live="polite"
                  >
                    Welcome, <span className="text-blue-600">{user?.name || user?.email || 'Guest'}</span>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-3 py-2 transition-colors bg-gray-50 hover:bg-gray-100"
                    aria-label="Sign out of your account"
                  >
                    <FaSignOutAlt size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  {/* Sign In Link */}
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2 transition-colors"
                    aria-label="Sign in to your account"
                  >
                    <FaSignInAlt size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    to="/register"
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors font-medium"
                    aria-label="Create a new account"
                  >
                    <span aria-hidden="true">+</span>
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

