import { Link } from "react-router-dom";
import SEOMeta from "../components/SEOMeta";
import { FaHome, FaArrowLeft, FaSearch, FaEnvelope } from "react-icons/fa";

export default function NotFound() {
  return (
    <>
      <SEOMeta
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to the homepage."
        keywords="404, not found, error, page not found"
      />
      <main
        role="main"
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
      >
        <div className="max-w-lg w-full text-center">
          {/* 404 Icon/Animation */}
          <div className="mb-8">
            <div className="inline-block">
              <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                404
              </div>
              <div className="text-6xl mb-6">🔍</div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Oops! We couldn't find the page you're looking for.
            </p>
            <p className="text-sm text-gray-500">
              The page might have been removed, or the link might be incorrect.
            </p>
          </div>

          {/* Helpful Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <FaSearch className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Lost your way?</p>
                  <p className="text-gray-600 text-sm">Check the URL or use the navigation below to find what you need.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Need help?</p>
                  <p className="text-gray-600 text-sm">Contact us if you believe this is an error.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <FaHome size={18} />
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              <FaArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Suggested Pages */}
          <div className="mt-10 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">You might want to visit:</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium px-3 py-2 rounded hover:bg-white transition-colors"
              >
                📋 All Tasks
              </Link>
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium px-3 py-2 rounded hover:bg-white transition-colors"
              >
                🔐 Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium px-3 py-2 rounded hover:bg-white transition-colors"
              >
                ✍️ Register
              </Link>
              <Link
                to="/profile"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium px-3 py-2 rounded hover:bg-white transition-colors"
              >
                👤 Profile
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 mt-8">
            Error Code: 404 | Page Not Found
          </p>
        </div>
      </main>
    </>
  );
}
