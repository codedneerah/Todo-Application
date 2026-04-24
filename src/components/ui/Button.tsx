import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner'; // Optional loading spinner

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    disabled = false,
    isLoading = false,
    children,
    ...props
  }, ref) => {
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost: 'text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md h-9',
      md: 'px-4 py-2 text-sm rounded-lg h-10',
      lg: 'px-6 py-3 text-base rounded-lg h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant as keyof typeof variants],
          sizes[size as keyof typeof sizes],
          className
        )}
        {...props}
      >
        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

