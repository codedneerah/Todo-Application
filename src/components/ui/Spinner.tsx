import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export { Spinner };

