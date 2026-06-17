'use client';

import React, { useState } from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import { usePolicies } from '@/hooks/usePolicies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Plus, 
  Cpu, 
  Database, 
  HardDrive, 
  Terminal, 
  DollarSign, 
  X, 
  SlidersHorizontal,
  Info,
  Shield,
  Lock,
  Clock
} from 'lucide-react';

export default function VmTemplatesPage() {
  const { templates, loading: templatesLoading, createTemplate } = useTemplates();
  const { policies, loading: policiesLoading } = usePolicies();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cpuCores, setCpuCores] = useState(2);
  const [memoryGB, setMemoryGB] = useState(8);
  const [storageGB, setStorageGB] = useState(80);
  const [os, setOs] = useState<'Ubuntu 22.04 LTS' | 'Debian 12' | 'Windows Server 2022' | 'macOS Sonoma'>('Ubuntu 22.04 LTS');
  const [costPerHour, setCostPerHour] = useState(0.045);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setIsSubmitting(true);
    try {
      await createTemplate({
        name,
        description,
        cpuCores: Number(cpuCores),
        memoryGB: Number(memoryGB),
        storageGB: Number(storageGB),
        os,
        costPerHour: Number(costPerHour),
      });

      // Reset
      setName('');
      setDescription('');
      setCpuCores(2);
      setMemoryGB(8);
      setStorageGB(80);
      setOs('Ubuntu 22.04 LTS');
      setCostPerHour(0.045);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOsOptions = () => {
    return [
      { value: 'Ubuntu 22.04 LTS', label: 'Ubuntu 22.04 LTS' },
      { value: 'Debian 12', label: 'Debian 12' },
      { value: 'Windows Server 2022', label: 'Windows Server 2022' },
      { value: 'macOS Sonoma', label: 'macOS Sonoma' },
    ];
  };

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-indigo-650" />
            VM Instance Templates
          </h1>
          <p className="text-sm text-zinc-500">
            Define machine profiles, configure system sizes, and set billing costs.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="shadow-md"
        >
          <Plus className="h-4.5 w-4.5 mr-2" />
          Create New Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templatesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-zinc-200 rounded-xl p-6 bg-white animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="flex flex-col justify-between hover:border-zinc-300 transition-all duration-200">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold text-zinc-900">{tpl.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-250 text-zinc-500 py-0.5">
                      {tpl.id}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-zinc-500 line-clamp-2 mt-1 min-h-[32px]">
                    {tpl.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5 pt-1 text-xs font-medium border-t border-zinc-100 mt-2">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 flex items-center">
                      <Cpu className="h-3.5 w-3.5 mr-2 text-zinc-400" /> Cores
                    </span>
                    <span className="font-mono text-zinc-800">{tpl.cpuCores} vCPUs</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 flex items-center">
                      <Database className="h-3.5 w-3.5 mr-2 text-zinc-400" /> Memory
                    </span>
                    <span className="font-mono text-zinc-800">{tpl.memoryGB} GB RAM</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 flex items-center">
                      <HardDrive className="h-3.5 w-3.5 mr-2 text-zinc-400" /> SSD Disk
                    </span>
                    <span className="font-mono text-zinc-800">{tpl.storageGB} GB SSD</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 flex items-center">
                      <Terminal className="h-3.5 w-3.5 mr-2 text-zinc-400" /> Image OS
                    </span>
                    <span className="text-zinc-800">{tpl.os}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="bg-zinc-50/50 py-4 border-t border-zinc-100 px-6 mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500 flex items-center font-medium">
                  <DollarSign className="h-4 w-4 mr-1 text-zinc-400" /> Billing Cost
                </span>
                <span className="font-mono text-emerald-600 font-bold text-sm">
                  ${tpl.costPerHour.toFixed(3)}/hr
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Governance & Resource Policies */}
      <div className="border-t border-zinc-250 pt-8 mt-12 space-y-6">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center text-zinc-900">
            <Shield className="h-5 w-5 mr-2 text-indigo-600" />
            Active Governance Policies & Quotas
          </h2>
          <p className="text-sm text-zinc-500">
            Global fleet constraints mapping developer profiles and auto-shutdown rules to team structures.
          </p>
        </div>

        {policiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-200 rounded-xl p-6 bg-white animate-pulse h-40" />
            <div className="border border-zinc-200 rounded-xl p-6 bg-white animate-pulse h-40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="bg-white border border-zinc-200 hover:border-zinc-350 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                          <Lock className="h-4 w-4 mr-2 text-indigo-500" />
                          {policy.name}
                        </CardTitle>
                        {policy.appliesToTeam && (
                          <p className="text-[10px] text-indigo-650 font-mono font-bold mt-0.5">
                            APPLIES TO: {policy.appliesToTeam.toUpperCase()}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-zinc-250 text-zinc-500 bg-white">
                        {policy.id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 text-xs font-medium">
                    <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Max VMs Per User</span>
                      <span className="font-mono font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                        {policy.maxVmsPerUser} instances
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-500 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-zinc-400" /> Idle Auto-Stop Timeout
                      </span>
                      <span className="font-mono text-zinc-800 font-semibold">
                        {policy.idleTimeoutMinutes} minutes ({policy.idleTimeoutMinutes / 60} hrs)
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-zinc-500 block">Allowed Hardware Profiles</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {policy.allowedTemplates.map((tplId) => {
                          const matchedTpl = templates.find((t) => t.id === tplId);
                          return (
                            <Badge 
                              key={tplId} 
                              variant="outline" 
                              className="text-[10px] font-mono border border-zinc-200/60 font-medium py-0.5 bg-zinc-50"
                            >
                              {matchedTpl ? matchedTpl.name : tplId}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </div>
                <CardFooter className="text-[10px] text-zinc-450 border-t border-zinc-100 py-3 bg-zinc-50/50 px-6 mt-4">
                  Created: {new Date(policy.createdAt).toLocaleDateString()} • System Policy Enforced
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Template Drawer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 text-zinc-900">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-450 hover:bg-zinc-150 hover:text-zinc-800 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Title */}
            <div className="mb-5">
              <h2 className="text-lg font-black text-zinc-900 flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-indigo-600" />
                Create Instance Profile
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Configure specs and billing values for the new template size.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">Template Name</label>
                <Input
                  required
                  placeholder="e.g., GP-Heavy-4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">Description</label>
                <Input
                  required
                  placeholder="e.g., Balanced computing core for general workloads"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Hardware Spec Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600">CPU Cores</label>
                  <Input
                    type="number"
                    min={1}
                    max={128}
                    required
                    value={cpuCores}
                    onChange={(e) => setCpuCores(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600">RAM (GB)</label>
                  <Input
                    type="number"
                    min={1}
                    max={1024}
                    required
                    value={memoryGB}
                    onChange={(e) => setMemoryGB(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600">Disk (GB)</label>
                  <Input
                    type="number"
                    min={10}
                    max={10000}
                    required
                    value={storageGB}
                    onChange={(e) => setStorageGB(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600">Image OS</label>
                  <Select
                    options={getOsOptions()}
                    value={os}
                    onChange={(e) => setOs(e.target.value as any)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600">Cost per Hour ($)</label>
                  <Input
                    type="number"
                    step={0.001}
                    min={0}
                    required
                    value={costPerHour}
                    onChange={(e) => setCostPerHour(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Info alerts */}
              <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg text-[10px] text-zinc-500 flex items-start space-x-2 leading-relaxed">
                <Info className="h-4 w-4 shrink-0 text-indigo-500" />
                <span>
                  Adding this template registers it on-the-fly inside the mock database. Registered sizes instantly show up in the developer&apos;s workspace provision dropdown menu options.
                </span>
              </div>

              {/* Actions */}
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
                  loading={isSubmitting}
                >
                  Create Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
