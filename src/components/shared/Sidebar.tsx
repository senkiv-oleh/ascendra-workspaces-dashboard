'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Server, 
  Layers, 
  Settings, 
  Activity, 
  FileText, 
  Sliders, 
  FolderGit2,
  Lock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePersona, vms, templates } = useWorkspace();
  const pathname = usePathname();

  // Dynamic calculations for side panels
  const activeVMsCount = vms.filter(v => v.status === 'running').length;
  const totalVMsCount = vms.length;

  // Let's compute aggregate cores/ram for developers
  const totalCoresUsed = vms
    .filter(v => v.status === 'running')
    .reduce((sum, v) => {
      const t = templates.find(tpl => tpl.id === v.templateId);
      return sum + (t ? t.cpuCores : 0);
    }, 0);

  interface SidebarLink {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
    disabled?: boolean;
  }

  const developerLinks: SidebarLink[] = [
    { href: '/developer', label: 'My Machines', icon: Server },
    { href: '/developer/docs', label: 'API & SSH Keys', icon: FolderGit2, disabled: true },
    { href: '/developer/settings', label: 'Settings', icon: Settings, disabled: true },
  ];

  const adminLinks: SidebarLink[] = [
    { href: '/admin', label: 'Fleet Overview', icon: Activity },
    { href: '/admin/inventory', label: 'VM Inventory', icon: Layers },
    { href: '/admin/templates', label: 'VM Templates', icon: Sliders },
  ];

  const currentLinks = activePersona === 'developer' ? developerLinks : adminLinks;

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between shrink-0 transition-colors duration-200">
      <div className="flex flex-col space-y-6 py-6 px-4">
        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Navigation
          </span>
          <nav className="flex flex-col space-y-1 mt-2">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href) && !pathname.includes('inventory') && !pathname.includes('templates'));
              
              if (link.disabled) {
                return (
                  <div
                    key={link.href}
                    className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </div>
                    <Lock className="h-3 w-3 opacity-60" />
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-150 text-indigo-650 dark:bg-zinc-850 dark:text-zinc-100 font-bold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Resources / Quotas Widgets */}
        {activePersona === 'developer' ? (
          <div className="p-3 bg-indigo-50/40 dark:bg-zinc-900/30 border border-indigo-100/40 dark:border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                VPCU QUOTA
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-zinc-300">
                {totalCoresUsed} / 16 Cores
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200/60 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 dark:bg-zinc-100 transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalCoresUsed / 16) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-medium">
              Running: <strong className="text-zinc-700 dark:text-zinc-300">{activeVMsCount} VMs</strong> ({totalVMsCount} total)
            </p>
          </div>
        ) : (
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                FLEET CAPACITY
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Running
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] flex items-center justify-center text-zinc-300 font-bold font-mono">
                  G
                </div>
                <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] flex items-center justify-center text-zinc-300 font-bold font-mono">
                  M
                </div>
                <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] flex items-center justify-center text-zinc-300 font-bold font-mono animate-pulse">
                  GPU
                </div>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                3 Instance templates online
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
        <div className="flex items-center justify-between">
          <span>Fleet Region</span>
          <span className="font-semibold text-zinc-650 dark:text-zinc-300">us-east-2</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Status</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Optimal</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
