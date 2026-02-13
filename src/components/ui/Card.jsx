import { clsx } from 'clsx';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={clsx('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div
      className={clsx('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2
      className={clsx('text-xl font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={clsx('text-sm text-gray-600 text-md', className)}
      {...props}
    >
      {children}
    </p>
  );
}
