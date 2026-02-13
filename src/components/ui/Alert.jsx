import { clsx } from 'clsx';

export function Alert({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={clsx(
        'rounded-lg border px-4 py-3',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className, children, ...props }) {
  return (
    <h3
      className={clsx('mb-2 font-semibold', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function AlertDescription({ className, children, ...props }) {
  return (
    <div
      className={clsx('text-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
