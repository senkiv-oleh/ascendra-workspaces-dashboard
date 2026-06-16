'use client';

import React, { useEffect } from 'react';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setActivePersona } = useWorkspace();

  useEffect(() => {
    setActivePersona('developer');
  }, [setActivePersona]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-50 text-zinc-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
