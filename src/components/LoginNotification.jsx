import { useAuth } from '../contexts/AuthContext';
import { FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function LoginNotification() {
  const { loginNotification, clearLoginNotification } = useAuth();

  if (!loginNotification) return null;

  const getIcon = () => {
    switch (loginNotification.type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" size={20} />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" size={20} />;
      default:
        return <FaInfoCircle className="text-gray-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (loginNotification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className={`p-4 rounded-lg border shadow-lg ${getBgColor()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {loginNotification.message}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={clearLoginNotification}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
