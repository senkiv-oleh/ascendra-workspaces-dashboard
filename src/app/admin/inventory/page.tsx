'use client';

import React, { useState } from 'react';
import { useVMs, useTemplates } from '../../../hooks/useApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { 
  Search, 
  Layers, 
  Trash2, 
  Play, 
  Square, 
  Eye, 
  AlertTriangle, 
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';

export default function VmInventoryPage() {
  const { vms, loading, mutatingId, startVM, stopVM, deleteVM } = useVMs();
  const { templates } = useTemplates();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  
  // Sort State
  const [sortBy, setSortBy] = useState<'name' | 'cpu' | 'cost'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Hardcoded owner lookup
  const getOwnerName = (ownerId: string) => {
    return ownerId === 'usr-alex' ? 'Alex Carter' : 'Sarah Jenkins';
  };

  const getOwnerEmail = (ownerId: string) => {
    return ownerId === 'usr-alex' ? 'alex.carter@ascendra.dev' : 'sarah.jenkins@ascendra.dev';
  };

  const handleSort = (field: 'name' | 'cpu' | 'cost') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort VM inventory
  const processedVMs = vms
    .filter((vm) => {
      const matchesSearch = 
        vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vm.ipAddress.includes(searchTerm) ||
        getOwnerEmail(vm.ownerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getOwnerName(vm.ownerId).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'transitioning' && (vm.status === 'starting' || vm.status === 'stopping')) ||
        vm.status === statusFilter;
      
      const matchesTemplate = templateFilter === 'all' || vm.templateId === templateFilter;

      return matchesSearch && matchesStatus && matchesTemplate;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'cpu') {
        comparison = a.cpuUsagePercent - b.cpuUsagePercent;
      } else if (sortBy === 'cost') {
        comparison = a.costPerHour - b.costPerHour;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getTemplateOptions = () => {
    return [
      { value: 'all', label: 'All Templates' },
      ...templates.map((t) => ({ value: t.id, label: t.name })),
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: 'all', label: 'All Statuses' },
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
      { value: 'transitioning', label: 'Transitioning' },
    ];
  };

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center">
          <Layers className="h-5 w-5 mr-2 text-indigo-600" />
          Virtual Machine Inventory
        </h1>
        <p className="text-sm text-zinc-500">
          Search, audit, power-cycle, or decommission workspaces across the entire fleet.
        </p>
      </div>

      {/* Filters Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-zinc-200 bg-white rounded-xl shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by instance name, IP, or owner email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <Select
            options={getStatusOptions()}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>

        <div>
          <Select
            options={getTemplateOptions()}
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : processedVMs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 bg-white/40 rounded-xl">
          <p className="text-sm text-zinc-550">No matching virtual machine workspaces found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold cursor-pointer select-none" onClick={() => handleSort('name')}>
                <span className="flex items-center">
                  Instance Name <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-zinc-400" />
                </span>
              </TableHead>
              <TableHead className="text-zinc-500 font-bold">IP Address</TableHead>
              <TableHead className="text-zinc-500 font-bold">Owner</TableHead>
              <TableHead className="text-zinc-500 font-bold">Template Spec</TableHead>
              <TableHead className="text-zinc-500 font-bold cursor-pointer select-none" onClick={() => handleSort('cpu')}>
                <span className="flex items-center">
                  CPU Usage <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-zinc-400" />
                </span>
              </TableHead>
              <TableHead className="text-zinc-500 font-bold">RAM Usage</TableHead>
              <TableHead className="text-zinc-500 font-bold">Status</TableHead>
              <TableHead className="text-zinc-500 font-bold cursor-pointer select-none" onClick={() => handleSort('cost')}>
                <span className="flex items-center">
                  Cost/Hr <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-zinc-400" />
                </span>
              </TableHead>
              <TableHead className="text-zinc-500 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedVMs.map((vm) => {
              const tpl = templates.find((t) => t.id === vm.templateId);
              const isMutating = mutatingId === vm.id;
              const isTransitioning = vm.status === 'starting' || vm.status === 'stopping' || isMutating;
              
              // Flag checks
              const isHot = vm.status === 'running' && vm.cpuUsagePercent >= 90;
              const isUnderutilized = vm.status === 'running' && vm.cpuUsagePercent < 5;

              return (
                <TableRow key={vm.id} className="hover:bg-zinc-50/50">
                  {/* Name with Alert Flags */}
                  <TableCell className="font-bold text-zinc-900">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span>{vm.name}</span>
                        {isHot && (
                          <Badge variant="danger" className="text-[9px] py-0 px-1.5 font-mono" title="CPU exceeds 90%">
                            <ShieldAlert className="h-2.5 w-2.5 mr-1 inline" />
                            HOT
                          </Badge>
                        )}
                        {isUnderutilized && (
                          <Badge variant="warning" className="text-[9px] py-0 px-1.5 font-mono" title="Running under 5% CPU (Resource waste)">
                            <AlertTriangle className="h-2.5 w-2.5 mr-1 inline" />
                            IDLE
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono font-medium">{vm.id}</span>
                    </div>
                  </TableCell>

                  {/* IP */}
                  <TableCell className="font-mono text-xs text-zinc-600 select-all">
                    {vm.ipAddress}
                  </TableCell>

                  {/* Owner */}
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-zinc-800">{getOwnerName(vm.ownerId)}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{getOwnerEmail(vm.ownerId)}</span>
                    </div>
                  </TableCell>

                  {/* Template */}
                  <TableCell className="text-xs text-zinc-800">
                    {tpl ? (
                      <div>
                        <p className="font-semibold">{tpl.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{tpl.cpuCores} Cores • {tpl.memoryGB}GB RAM</p>
                      </div>
                    ) : (
                      'Unknown spec'
                    )}
                  </TableCell>

                  {/* CPU Gauge */}
                  <TableCell className="font-mono text-xs text-zinc-800">
                    {vm.status === 'running' ? (
                      <span className={isHot ? 'text-red-600 font-bold' : isUnderutilized ? 'text-amber-600' : 'text-zinc-800'}>
                        {vm.cpuUsagePercent}%
                      </span>
                    ) : (
                      '0%'
                    )}
                  </TableCell>

                  {/* RAM Gauge */}
                  <TableCell className="font-mono text-xs text-zinc-800 font-semibold">
                    {vm.status === 'running' ? `${vm.memoryUsagePercent}%` : '0%'}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {vm.status === 'running' ? (
                      <Badge variant="success" className="py-0.5">Running</Badge>
                    ) : vm.status === 'stopped' ? (
                      <Badge variant="secondary" className="py-0.5">Stopped</Badge>
                    ) : (
                      <Badge variant="warning" className="py-0.5 animate-pulse">{vm.status}</Badge>
                    )}
                  </TableCell>

                  {/* Cost */}
                  <TableCell className="font-mono text-xs text-zinc-800 font-bold">
                    ${vm.costPerHour.toFixed(3)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <Link href={`/developer/${vm.id}`}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                          title="Drill-down Monitor"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {vm.status === 'stopped' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startVM(vm.id)}
                          disabled={isTransitioning}
                          className="h-8 w-8 hover:bg-zinc-100 text-emerald-600 hover:text-emerald-700"
                          title="Power On Instance"
                        >
                          <Play className="h-4 w-4 fill-emerald-500/25" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => stopVM(vm.id)}
                          disabled={isTransitioning}
                          className="h-8 w-8 hover:bg-zinc-100 text-red-650 hover:text-red-750"
                          title="Power Off Instance"
                        >
                          <Square className="h-4 w-4 fill-red-650/25" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteVM(vm.id)}
                        disabled={isTransitioning}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-zinc-400"
                        title="Decommission Node"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
