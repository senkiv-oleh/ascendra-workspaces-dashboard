'use client';

import React, { useState } from 'react';
import { useVMs } from '@/hooks/useVMs';
import { useTemplates } from '@/hooks/useTemplates';

import { VmCard } from './VmCard';
import { Skeleton } from '../ui/Skeleton';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { 
  Plus, 
  Search, 
  Terminal, 
  HelpCircle, 
  X,
  ServerCrash
} from 'lucide-react';

export const VmList: React.FC = () => {
  const { vms, loading, mutatingId, startVM, stopVM, restartVM, createVM } = useVMs();
  const { templates } = useTemplates();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped' | 'transitioning'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVmName, setNewVmName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Filter VMs
  const filteredVMs = vms.filter((vm) => {
    const matchesSearch = vm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vm.ipAddress.includes(searchTerm);
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'running') return matchesSearch && vm.status === 'running';
    if (statusFilter === 'stopped') return matchesSearch && vm.status === 'stopped';
    if (statusFilter === 'transitioning') {
      return matchesSearch && (vm.status === 'starting' || vm.status === 'stopping');
    }
    return matchesSearch;
  });

  const handleCreateVM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVmName.trim() || !selectedTemplateId) return;

    setIsCreating(true);
    try {
      await createVM(newVmName, selectedTemplateId);
      setNewVmName('');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const getTemplateOptions = () => {
    return [
      { value: '', label: 'Select VM configuration size...' },
      ...templates.map((t) => ({
        value: t.id,
        label: `${t.name} (${t.cpuCores} Cores, ${t.memoryGB}GB RAM) - $${t.costPerHour}/hr`,
      })),
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Virtual Machines
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Provision, manage, and connect to your cloud workstations.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (templates.length > 0) {
              setSelectedTemplateId(templates[0].id);
            }
            setIsModalOpen(true);
          }}
          className="shadow-md"
        >
          <Plus className="h-4.5 w-4.5 mr-2" />
          Provision Workspace
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search VMs by name or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tab-style Filters */}
        <div className="flex space-x-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 rounded-lg overflow-x-auto shrink-0">
          {(['all', 'running', 'stopped', 'transitioning'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2.5 pt-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex justify-between pt-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVMs.length === 0 ? (
        // Empty State
        <div className="text-center py-16 px-4 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white/40 dark:bg-zinc-950/20 max-w-lg mx-auto">
          <ServerCrash className="h-10 w-10 text-zinc-400 dark:text-zinc-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No virtual machines found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'No instances match your current filters. Try resetting search term.'
              : 'You have not provisioned any workspace workstations yet.'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Provision My First VM
            </Button>
          )}
        </div>
      ) : (
        // Grid of VM cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVMs.map((vm) => (
            <VmCard
              key={vm.id}
              vm={vm}
              template={templates.find((t) => t.id === vm.templateId)}
              isMutating={mutatingId === vm.id}
              onStart={() => startVM(vm.id)}
              onStop={() => stopVM(vm.id)}
              onRestart={() => restartVM(vm.id)}
            />
          ))}
        </div>
      )}

      {/* Provision VM Drawer/Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6">
            
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Modal Title */}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-indigo-600 dark:text-zinc-150" />
                Provision Workspace Instance
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Configure specs to spin up a new virtual workstation.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateVM} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                  Workspace Name
                </label>
                <Input
                  required
                  placeholder="e.g., node-deep-learning"
                  value={newVmName}
                  onChange={(e) => setNewVmName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                  Template Configuration
                </label>
                <Select
                  options={getTemplateOptions()}
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  required
                />
              </div>

              {/* Policy alert stub */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-850 rounded-lg text-[10px] text-zinc-500 dark:text-zinc-400 flex items-start space-x-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-indigo-500 dark:text-zinc-350" />
                <span>
                  By provisioning this workspace, you agree to comply with your team&apos;s standard developer quota limits. Instances auto-terminate after 12 hours of inactivity.
                </span>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isCreating}
                >
                  Provision Node
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
