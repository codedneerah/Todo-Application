import React from 'react';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className = '',
  size = 'md',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center min-h-[200px] py-12 ${className}`}
    >
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600 text-lg font-medium">{message}</p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
    </div>
  );
};

export default Loader;

