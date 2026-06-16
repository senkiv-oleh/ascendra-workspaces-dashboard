import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:bg-zinc-700/80 border border-zinc-200/40 dark:border-zinc-700/40',
    outline: 'border border-zinc-300 bg-transparent hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900',
    ghost: 'hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-950/80 dark:text-red-300 dark:hover:bg-red-900/80 dark:border dark:border-red-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2 text-sm h-9 w-9',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
