import type { Metadata } from 'next';
import './globals.css';
import { WorkspaceProvider } from '../context/WorkspaceContext';

export const metadata: Metadata = {
  title: 'Ascendra Workspaces Command Center',
  description: 'High-density workspace administration and developer environment management console.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
        <WorkspaceProvider>
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
