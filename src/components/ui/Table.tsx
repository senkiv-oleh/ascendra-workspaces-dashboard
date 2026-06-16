import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className="relative w-full overflow-auto border border-zinc-200/60 dark:border-zinc-800/80 rounded-lg">
      <table className={`w-full caption-bottom text-sm border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', children, ...props }) => {
  return (
    <thead className={`bg-zinc-50/70 dark:bg-zinc-900/50 border-b border-zinc-200/60 dark:border-zinc-800/80 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', children, ...props }) => {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>{children}</tbody>;
};

export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', children, ...props }) => {
  return (
    <tfoot className={`bg-zinc-900 font-medium text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 ${className}`} {...props}>
      {children}
    </tfoot>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = '', children, ...props }) => {
  return (
    <tr
      className={`border-b border-zinc-200/60 dark:border-zinc-800/80 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 data-[state=selected]:bg-zinc-100 dark:data-[state=selected]:bg-zinc-800 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = '', children, ...props }) => {
  return (
    <th
      className={`h-10 px-4 text-left align-middle font-semibold text-zinc-500 dark:text-zinc-400 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = '', children, ...props }) => {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};
