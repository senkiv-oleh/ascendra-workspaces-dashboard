'use client';

import React from 'react';
import { useVMs, useFleetUtilization, useTemplates } from '../../hooks/useApi';
import { MetricCard } from '../../components/admin/MetricCard';
import { UtilizationCharts } from '../../components/admin/UtilizationCharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Cpu, 
  Layers, 
  Users, 
  DollarSign, 
  RefreshCw, 
  ShieldAlert, 
  Activity,
  Server
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { vms } = useVMs();
  const { templates } = useTemplates();
  const { fleetData, loading, refresh } = useFleetUtilization();

  // Identify Hot VMs (>90% CPU) and Underutilized running VMs (<5% CPU)
  const runningVMs = vms.filter((vm) => vm.status === 'running');
  const hotVMs = runningVMs.filter((vm) => vm.cpuUsagePercent >= 90);
  
  // Underutilized = CPU < 5% AND status is running
  const underutilizedVMs = runningVMs.filter((vm) => vm.cpuUsagePercent < 5);

  if (loading || !fleetData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Fleet Overview</h1>
            <p className="text-sm text-zinc-500">Loading infrastructure stats...</p>
          </div>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border border-zinc-200/80 rounded-xl p-6 space-y-4 bg-white">
              <div className="flex justify-between">
                <div className="space-y-2 w-full mr-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24 mt-2" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-500 dark:text-zinc-200" />
            Admin Fleet Command Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time server infrastructure KPIs and resource load aggregation.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          className="border border-zinc-200 dark:border-zinc-800"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Force Sync
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Instances"
          value={fleetData.totalVMs}
          icon={<Layers className="h-4.5 w-4.5" />}
          description="Total VMs provisioned"
          trend={{ value: '100% cap', direction: 'neutral' }}
        />
        <MetricCard
          title="Active (Online)"
          value={fleetData.activeVMs}
          icon={<Server className="h-4.5 w-4.5" />}
          description="Instances running online"
          trend={{ 
            value: `${Math.round((fleetData.activeVMs / fleetData.totalVMs) * 100)}% active`, 
            direction: 'neutral' 
          }}
        />
        <MetricCard
          title="Fleet Avg CPU"
          value={`${fleetData.totalCpuPercent}%`}
          icon={<Cpu className="h-4.5 w-4.5" />}
          description="Aggregate CPU utilization"
          trend={{ value: 'Normal load', direction: 'neutral' }}
        />
        <MetricCard
          title="Fleet Avg RAM"
          value={`${fleetData.totalMemoryPercent}%`}
          icon={<Cpu className="h-4.5 w-4.5 rotate-90" />}
          description="Aggregate memory usage"
          trend={{ value: 'Stable', direction: 'neutral' }}
        />
        <MetricCard
          title="Hourly Rate"
          value={`$${fleetData.totalCostPerHour}`}
          icon={<DollarSign className="h-4.5 w-4.5" />}
          description="Aggregated cloud spend"
          trend={{ value: 'Cost optimized', direction: 'neutral' }}
        />
      </div>

      {/* Utilization Charts Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Capacity Load Trends
        </h3>
        <UtilizationCharts trendData={fleetData.utilizationTrend} />
      </div>

      {/* Grid: Alert Center & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Center */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center">
                <ShieldAlert className="h-4.5 w-4.5 mr-2 text-red-600" />
                Alerts & Security Center
              </CardTitle>
            </div>
            <Badge variant="danger" className="text-[10px] font-mono py-0.5">
              {hotVMs.length + underutilizedVMs.length} issues detected
            </Badge>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            
            {/* Hot VMs Alerts */}
            {hotVMs.map((vm) => (
              <div
                key={vm.id}
                className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/30 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 status-pulse-anim" />
                  <div>
                    <span className="font-bold text-zinc-900">{vm.name}</span>
                    <span className="text-zinc-550 ml-1.5">is running hot</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="danger" className="font-mono">{vm.cpuUsagePercent}% CPU</Badge>
                  <Link href={`/developer/${vm.id}`} className="text-indigo-650 hover:text-indigo-700 hover:underline font-semibold font-bold">
                    Drill down
                  </Link>
                </div>
              </div>
            ))}

            {/* Underutilized VMs Alerts */}
            {underutilizedVMs.map((vm) => (
              <div
                key={vm.id}
                className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50/30 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <span className="font-bold text-zinc-900">{vm.name}</span>
                    <span className="text-zinc-550 ml-1.5">is underutilized (idle)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="warning" className="font-mono">{vm.cpuUsagePercent}% CPU</Badge>
                  <Link href={`/developer/${vm.id}`} className="text-indigo-650 hover:text-indigo-700 hover:underline font-semibold font-bold">
                    Drill down
                  </Link>
                </div>
              </div>
            ))}

            {hotVMs.length === 0 && underutilizedVMs.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-400">
                No active performance warnings or resource anomalies reported.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Infrastructure Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-2.5">
            <Link href="/admin/inventory" className="block w-full">
              <Button variant="secondary" className="w-full justify-start text-xs font-semibold py-2.5">
                <Layers className="h-4 w-4 mr-2 text-zinc-450" />
                Audit Full VM Inventory
              </Button>
            </Link>
            <Link href="/admin/templates" className="block w-full">
              <Button variant="secondary" className="w-full justify-start text-xs font-semibold py-2.5">
                <Cpu className="h-4 w-4 mr-2 text-zinc-450" />
                Modify Workspace Sizes
              </Button>
            </Link>
            
            {/* System Info Block */}
            <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg mt-4 text-[10px] text-zinc-500 leading-relaxed font-mono">
              <div className="flex justify-between border-b border-zinc-200/60 pb-1.5 mb-1.5">
                <span>Active Users</span>
                <span className="font-bold text-zinc-800 flex items-center">
                  <Users className="h-3 w-3 mr-1 text-zinc-400" /> {fleetData.activeUsersCount} devs
                </span>
              </div>
              <p>Fleet Scheduler: Active</p>
              <p className="mt-1 text-zinc-400">Auto-stop inactive boxes every 4 hrs.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
