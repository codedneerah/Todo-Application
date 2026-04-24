import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function LoginNotification() {
  const { loginNotification, clearLoginNotification } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loginNotification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearLoginNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginNotification, clearLoginNotification]);

  if (!loginNotification || !visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border transition-all duration-500 transform ${
        loginNotification.type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-blue-50 border-blue-200 text-blue-800"
      }`}
      role="alert"
    >
      <p className="text-sm font-medium">{loginNotification.message}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
}

