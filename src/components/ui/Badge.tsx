import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2';

  const variants = {
    default: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 hover:opacity-90',
    secondary: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:opacity-90',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/40',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/40 dark:border-red-900/40',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/40',
    outline: 'text-zinc-950 border border-zinc-200 dark:text-zinc-50 dark:border-zinc-800',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
