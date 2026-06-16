import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-zinc-200/80 bg-white text-zinc-950 shadow-sm transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 border-b border-zinc-100/80 dark:border-zinc-800/80 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', children, ...props }) => {
  return (
    <p
      className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex items-center p-6 pt-0 border-t border-zinc-100/50 dark:border-zinc-800/50 mt-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
