'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Shield, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PersonaToggle: React.FC = () => {
  const { activePersona, setActivePersona } = useWorkspace();
  const router = useRouter();

  const handleSwitch = (persona: 'developer' | 'admin') => {
    setActivePersona(persona);
    if (persona === 'developer') {
      router.push('/developer');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
      <button
        onClick={() => handleSwitch('developer')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
          activePersona === 'developer'
            ? 'bg-white text-indigo-650 shadow-sm dark:bg-zinc-750 dark:text-zinc-50'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        <Code className="h-3.5 w-3.5" />
        <span>Developer</span>
      </button>

      <button
        onClick={() => handleSwitch('admin')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
          activePersona === 'admin'
            ? 'bg-white text-indigo-650 shadow-sm dark:bg-zinc-750 dark:text-zinc-50'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        <Shield className="h-3.5 w-3.5" />
        <span>Admin Fleet</span>
      </button>
    </div>
  );
};
