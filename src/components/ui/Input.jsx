import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(
  (
    {
      className,
      type = 'text',
      disabled = false,
      error = false,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500'
            : 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
