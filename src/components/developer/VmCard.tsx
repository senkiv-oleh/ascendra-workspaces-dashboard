'use client';

import React from 'react';
import { VM, VMTemplate } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Play, 
  Square, 
  RotateCw, 
  Terminal, 
  Cpu, 
  HardDrive, 
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface VmCardProps {
  vm: VM;
  template?: VMTemplate;
  isMutating: boolean;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export const VmCard: React.FC<VmCardProps> = ({
  vm,
  template,
  isMutating,
  onStart,
  onStop,
  onRestart,
}) => {
  const isTransitioning = vm.status === 'starting' || vm.status === 'stopping' || isMutating;

  // Determine resource usage colors based on warning thresholds
  const getResourceColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-amber-500';
    return 'bg-emerald-500 dark:bg-zinc-200';
  };

  // Determine status badge details
  const getStatusBadge = () => {
    switch (vm.status) {
      case 'running':
        return (
          <Badge variant="success" className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 status-pulse-anim inline-block" />
            <span>Running</span>
          </Badge>
        );
      case 'stopped':
        return (
          <Badge variant="secondary" className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 inline-block" />
            <span>Stopped</span>
          </Badge>
        );
      case 'starting':
        return (
          <Badge variant="warning" className="flex items-center space-x-1.5 animate-pulse">
            <svg className="animate-spin h-3 w-3 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Starting</span>
          </Badge>
        );
      case 'stopping':
        return (
          <Badge variant="warning" className="flex items-center space-x-1.5 animate-pulse">
            <svg className="animate-spin h-3 w-3 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Stopping</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOpenIde = () => {
    // Open in stub window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Ascendra Workspace IDE - ${vm.name}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="bg-gray-950 text-gray-100 flex flex-col h-screen font-sans justify-center items-center">
            <div class="text-center p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-md">
              <div class="bg-indigo-650 text-white rounded-full p-4 inline-block mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h1 class="text-2xl font-bold mb-2">Connecting to Workspace...</h1>
              <p class="text-gray-400 text-sm mb-6">Spinning up VS Code Web container for <strong>${vm.name}</strong> (${vm.ipAddress})</p>
              <div class="animate-pulse bg-indigo-550 h-1.5 w-full rounded-full overflow-hidden mb-6">
                <div class="bg-indigo-600 h-full w-2/3 rounded-full"></div>
              </div>
              <button onclick="window.close()" class="px-5 py-2 bg-gray-800 hover:bg-gray-750 text-xs font-semibold rounded-md border border-gray-700 transition">
                Close Connection
              </button>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <Card className={`group flex flex-col justify-between overflow-hidden relative border ${
      isTransitioning ? 'border-amber-200 dark:border-amber-900 bg-amber-50/5 dark:bg-amber-950/5' : ''
    }`}>
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Link 
                href={`/developer/${vm.id}`}
                className="font-bold text-base hover:text-indigo-600 dark:hover:text-zinc-350 transition-colors flex items-center group/title"
              >
                <span>{vm.name}</span>
                <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-indigo-600 dark:text-zinc-300" />
              </Link>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              IP: {vm.ipAddress}
            </p>
          </div>
          {getStatusBadge()}
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Machine spec description */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-2">
            <Terminal className="h-3.5 w-3.5" />
            <span>{template?.name || 'General Instance'} • {template?.os}</span>
          </div>

          {/* Resources Status Panel */}
          <div className="space-y-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
            {/* CPU Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center">
                  <Cpu className="h-3.5 w-3.5 mr-1 text-zinc-400" /> CPU
                </span>
                <span className="font-mono">{vm.status === 'running' ? `${vm.cpuUsagePercent}%` : '0%'}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getResourceColor(vm.status === 'running' ? vm.cpuUsagePercent : 0)}`} 
                  style={{ width: `${vm.status === 'running' ? vm.cpuUsagePercent : 0}%` }}
                />
              </div>
            </div>

            {/* Memory Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center">
                  <Database className="h-3.5 w-3.5 mr-1 text-zinc-400" /> RAM
                </span>
                <span className="font-mono">{vm.status === 'running' ? `${vm.memoryUsagePercent}%` : '0%'}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getResourceColor(vm.status === 'running' ? vm.memoryUsagePercent : 0)}`} 
                  style={{ width: `${vm.status === 'running' ? vm.memoryUsagePercent : 0}%` }}
                />
              </div>
            </div>

            {/* Disk Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center">
                  <HardDrive className="h-3.5 w-3.5 mr-1 text-zinc-400" /> Storage
                </span>
                <span className="font-mono">{vm.diskUsagePercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getResourceColor(vm.diskUsagePercent)}`} 
                  style={{ width: `${vm.diskUsagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Card Actions Footer */}
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1">
          {vm.status === 'stopped' ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onStart}
              disabled={isTransitioning}
              className="px-2.5 py-1 text-xs"
            >
              <Play className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400 fill-emerald-600/30" />
              Start
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onStop}
                disabled={isTransitioning}
                className="px-2.5 py-1 text-xs text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Square className="h-3.5 w-3.5 mr-1 fill-red-600/20" />
                Stop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRestart}
                disabled={isTransitioning}
                className="p-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                title="Restart VM"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        {vm.status === 'running' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenIde}
            disabled={isTransitioning}
            className="text-xs shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open in IDE
          </Button>
        ) : (
          <span className="text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
            Offline
          </span>
        )}
      </div>
    </Card>
  );
};
