'use client';

import React, { use, useState } from 'react';
import { useVMDetail, useVMs, useTemplates, useActivityLogs } from '../../../hooks/useApi';
import { MetricChart } from '../../../components/developer/MetricChart';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  ArrowLeft, 
  Cpu, 
  HardDrive, 
  Database, 
  Clock, 
  DollarSign, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldAlert,
  Play,
  Square,
  RotateCw
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VmDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { vm, loading, error } = useVMDetail(id);
  const { mutatingId, startVM, stopVM, restartVM } = useVMs();
  const { templates } = useTemplates();
  const { logs } = useActivityLogs(id);

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !vm) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Machine Not Found
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          The requested virtual machine instance does not exist or has been decommissioned.
        </p>
        <Link href="/developer">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Machines
          </Button>
        </Link>
      </div>
    );
  }

  const template = templates.find((t) => t.id === vm.templateId);
  const isMutating = mutatingId === vm.id;
  const isTransitioning = vm.status === 'starting' || vm.status === 'stopping' || isMutating;

  const handleCopySsh = () => {
    navigator.clipboard.writeText(`ssh developer@${vm.ipAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (vm.status) {
      case 'running':
        return (
          <Badge variant="success" className="flex items-center space-x-1.5 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 status-pulse-anim" />
            <span className="text-xs font-semibold">Running</span>
          </Badge>
        );
      case 'stopped':
        return (
          <Badge variant="secondary" className="flex items-center space-x-1.5 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            <span className="text-xs font-semibold">Stopped</span>
          </Badge>
        );
      case 'starting':
        return (
          <Badge variant="warning" className="flex items-center space-x-1.5 px-3 py-1 animate-pulse">
            <svg className="animate-spin h-3.5 w-3.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold">Starting</span>
          </Badge>
        );
      case 'stopping':
        return (
          <Badge variant="warning" className="flex items-center space-x-1.5 px-3 py-1 animate-pulse">
            <svg className="animate-spin h-3.5 w-3.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold">Stopping</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOpenIde = () => {
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

  // Convert metricsHistory format to match MetricChart signature
  const cpuData = vm.metricsHistory.map((pt) => ({ timestamp: pt.timestamp, value: pt.cpu }));
  const ramData = vm.metricsHistory.map((pt) => ({ timestamp: pt.timestamp, value: pt.memory }));

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and back navigation */}
      <div>
        <Link 
          href="/developer" 
          className="inline-flex items-center text-xs font-semibold text-zinc-550 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Workspaces
        </Link>
      </div>

      {/* Hero Control Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 p-6 rounded-xl gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {vm.name}
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-xs font-mono text-zinc-550 dark:text-zinc-400">
            Node ID: {vm.id} • IP Address: <span className="font-bold select-all">{vm.ipAddress}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-0 sm:pl-4">
          {vm.status === 'stopped' ? (
            <Button
              variant="primary"
              onClick={() => startVM(vm.id)}
              disabled={isTransitioning}
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Power On
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={() => stopVM(vm.id)}
                disabled={isTransitioning}
              >
                <Square className="h-4 w-4 mr-2 fill-current" />
                Power Off
              </Button>
              <Button
                variant="secondary"
                onClick={() => restartVM(vm.id)}
                disabled={isTransitioning}
                title="Reboot Instance"
              >
                <RotateCw className="h-4 w-4 mr-1.5" />
                Reboot
              </Button>
            </>
          )}

          {vm.status === 'running' && (
            <Button
              variant="primary"
              onClick={handleOpenIde}
              disabled={isTransitioning}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open IDE
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs Details Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Workspace Specification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 text-sm font-medium">
              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-zinc-400" /> Cores (vCPUs)
                </span>
                <span className="font-mono text-zinc-900 dark:text-zinc-200">
                  {template?.cpuCores || 0} Cores
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-zinc-400" /> RAM Capacity
                </span>
                <span className="font-mono text-zinc-900 dark:text-zinc-200">
                  {template?.memoryGB || 0} GB
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <HardDrive className="h-4 w-4 mr-2 text-zinc-400" /> Storage
                </span>
                <span className="font-mono text-zinc-900 dark:text-zinc-200">
                  {template?.storageGB || 0} GB
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <Terminal className="h-4 w-4 mr-2 text-zinc-400" /> Operating System
                </span>
                <span className="text-zinc-900 dark:text-zinc-200">
                  {template?.os}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-zinc-400" /> Provisioned
                </span>
                <span className="text-zinc-900 dark:text-zinc-200 text-xs">
                  {new Date(vm.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-zinc-400" /> Resource Rate
                </span>
                <span className="font-mono text-zinc-900 dark:text-zinc-200">
                  ${vm.costPerHour.toFixed(3)}/hr
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-550 dark:text-zinc-400 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-zinc-400" /> Monthly Estimate
                </span>
                <span className="font-mono text-indigo-600 dark:text-zinc-200 font-bold">
                  ${(vm.costPerHour * 720).toFixed(2)}/mo
                </span>
              </div>
            </CardContent>
          </Card>

          {/* SSH Command Box */}
          <Card className="bg-zinc-950 text-zinc-100 border-zinc-800">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase font-mono">
                  SSH ACCESS
                </span>
                <button
                  onClick={handleCopySsh}
                  className="flex items-center text-[10px] text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded border border-zinc-800 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded border border-zinc-850/80 font-mono text-xs text-indigo-300 overflow-x-auto select-all whitespace-nowrap">
                ssh developer@{vm.ipAddress}
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Credentials use your local SSH key listed in Ascendra Settings. Default port is <code className="text-zinc-400">22</code>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Performance Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricChart
              data={cpuData}
              title="CPU Usage (Real-Time)"
              colorType={vm.status === 'running' ? (vm.cpuUsagePercent > 90 ? 'rose' : 'indigo') : 'indigo'}
              unit="%"
            />
            <MetricChart
              data={ramData}
              title="RAM Usage (Real-Time)"
              colorType={vm.status === 'running' ? 'emerald' : 'indigo'}
              unit="%"
            />
          </div>

          {/* Activity Logs for this specific VM */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-450">
                Instance Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event/Action</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs text-zinc-400 py-6">
                        No operations logged for this instance.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-semibold text-xs text-zinc-900 dark:text-zinc-200">
                          {log.action}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">
                          {log.userEmail}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-550 dark:text-zinc-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[10px] py-0.5">
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
