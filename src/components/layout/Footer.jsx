import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand/About */}
          <section aria-labelledby="footer-brand">
            <h3 id="footer-brand" className="text-white font-bold text-lg mb-4">
              TodoApp
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern task management application built with React, helping you organize and manage your daily tasks efficiently.
            </p>
          </section>

          {/* Quick Links */}
          <nav aria-labelledby="footer-links">
            <h3 id="footer-links" className="text-white font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <section aria-labelledby="footer-social">
            <h3 id="footer-social" className="text-white font-bold text-lg mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4" role="list">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                aria-label="Visit our GitHub"
                role="listitem"
              >
                <FaGithub size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                aria-label="Follow us on Twitter"
                role="listitem"
              >
                <FaTwitter size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                aria-label="Connect on LinkedIn"
                role="listitem"
              >
                <FaLinkedin size={20} aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        {/* Bottom Info */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} TodoApp. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            >
              Accessibility
            </a>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8 pt-4 border-t border-gray-800 text-sm text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <FaHeart className="text-red-500" aria-hidden="true" /> for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
