import { clsx } from 'clsx';
import React, { HTMLAttributes } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
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

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <h3
      className={clsx('mb-2 font-semibold', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <div
      className={clsx('text-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
