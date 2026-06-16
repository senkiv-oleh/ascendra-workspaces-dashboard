'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PersonaToggle } from './PersonaToggle';
import { Terminal, Bell, Cpu } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { activePersona, currentUser } = useWorkspace();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-zinc-900 to-indigo-650 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              ASCENDRA
            </span>
          </Link>
          <span className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-tight bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
            <Terminal className="h-3 w-3" />
            <span>v1.0.4-beta</span>
          </div>
        </div>

        {/* Center & Right Items */}
        <div className="flex items-center space-x-4">
          <PersonaToggle />

          {/* User Details */}
          <div className="flex items-center space-x-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <button className="relative p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-zinc-100" />
            </button>
            
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 capitalize">
                {currentUser.role}
              </span>
            </div>

            {/* Avatar */}
            {currentUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
