import { VM, VMTemplate, User, FleetUtilization, VMActivityLog, VMStatus, FleetTrendPoint, Policy } from '@/types';

const LATENCY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Templates
const mockTemplates: VMTemplate[] = [
  {
    id: 'tpl-general',
    name: 'General Purpose (GP-1)',
    description: 'Balanced performance for web servers, dev testing, and small databases.',
    cpuCores: 2,
    memoryGB: 8,
    storageGB: 80,
    os: 'Ubuntu 22.04 LTS',
    costPerHour: 0.045,
  },
  {
    id: 'tpl-memory',
    name: 'Memory Optimized (MEM-2)',
    description: 'High memory configuration for caching layers, in-memory DBs, and thick builds.',
    cpuCores: 8,
    memoryGB: 32,
    storageGB: 240,
    os: 'Debian 12',
    costPerHour: 0.22,
  },
  {
    id: 'tpl-gpu',
    name: 'GPU Deep Learning (GPU-16)',
    description: 'Equipped with NVIDIA Tensor core GPUs for neural network training and heavy graphic render workloads.',
    cpuCores: 16,
    memoryGB: 64,
    storageGB: 480,
    os: 'Ubuntu 22.04 LTS',
    costPerHour: 1.48,
  },
];

// Mock Users
const mockUsers: User[] = [
  {
    id: 'usr-alex',
    name: 'Alex Carter',
    email: 'alex.carter@ascendra.dev',
    role: 'developer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'usr-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@ascendra.dev',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Helper to generate historical metrics
const generateMetricsHistory = (cpuBase: number, memBase: number, count = 15) => {
  const history = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
    const cpuNoise = (Math.random() - 0.5) * 8; // +/- 4%
    const memNoise = (Math.random() - 0.5) * 4; // +/- 2%
    history.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: Math.max(0, Math.min(100, Math.round(cpuBase + cpuNoise))),
      memory: Math.max(0, Math.min(100, Math.round(memBase + memNoise))),
    });
  }
  return history;
};

// Initial VM state
let mockVMs: VM[] = [
  {
    id: 'vm-1',
    name: 'alex-dev-workhorse',
    status: 'running',
    cpuUsagePercent: 12,
    memoryUsagePercent: 42,
    diskUsagePercent: 31,
    ipAddress: '10.140.22.84',
    ownerId: 'usr-alex',
    templateId: 'tpl-general',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    costPerHour: 0.045,
    metricsHistory: generateMetricsHistory(12, 42),
  },
  {
    id: 'vm-2',
    name: 'gpu-training-box',
    status: 'running',
    cpuUsagePercent: 92,
    memoryUsagePercent: 86,
    diskUsagePercent: 64,
    ipAddress: '10.140.45.109',
    ownerId: 'usr-alex',
    templateId: 'tpl-gpu',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    costPerHour: 1.48,
    metricsHistory: generateMetricsHistory(92, 86),
  },
  {
    id: 'vm-3',
    name: 'staging-db-node',
    status: 'stopped',
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 78,
    ipAddress: '10.140.23.12',
    ownerId: 'usr-alex',
    templateId: 'tpl-memory',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    costPerHour: 0.22,
    metricsHistory: generateMetricsHistory(0, 0),
  },
  {
    id: 'vm-4',
    name: 'web-server-idle',
    status: 'running',
    cpuUsagePercent: 2,
    memoryUsagePercent: 8,
    diskUsagePercent: 14,
    ipAddress: '10.140.22.99',
    ownerId: 'usr-alex',
    templateId: 'tpl-general',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    costPerHour: 0.045,
    metricsHistory: generateMetricsHistory(2, 8),
  },
  {
    id: 'vm-5',
    name: 'legacy-testing-vm',
    status: 'starting',
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 12,
    ipAddress: '10.140.22.105',
    ownerId: 'usr-alex',
    templateId: 'tpl-general',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    costPerHour: 0.045,
    metricsHistory: generateMetricsHistory(0, 0),
  },
  {
    id: 'vm-6',
    name: 'temp-data-cruncher',
    status: 'stopping',
    cpuUsagePercent: 18,
    memoryUsagePercent: 24,
    diskUsagePercent: 41,
    ipAddress: '10.140.24.5',
    ownerId: 'usr-alex',
    templateId: 'tpl-memory',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    costPerHour: 0.22,
    metricsHistory: generateMetricsHistory(18, 24),
  },
];

// Activity logs storage
let mockLogs: VMActivityLog[] = [
  {
    id: 'log-1',
    vmId: 'vm-1',
    action: 'Power On',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'success',
    userEmail: 'alex.carter@ascendra.dev',
  },
  {
    id: 'log-2',
    vmId: 'vm-2',
    action: 'Provision Instance',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'success',
    userEmail: 'alex.carter@ascendra.dev',
  },
  {
    id: 'log-3',
    vmId: 'vm-3',
    action: 'Power Off',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'success',
    userEmail: 'alex.carter@ascendra.dev',
  },
];

// Pub-sub listeners for VM updates
type VMListener = (vms: VM[]) => void;
const vmListeners = new Set<VMListener>();

export const subscribeVMs = (listener: VMListener) => {
  vmListeners.add(listener);
  // Emit initial state immediately
  listener([...mockVMs]);
  return () => {
    vmListeners.delete(listener);
  };
};

const notifyVMListeners = () => {
  vmListeners.forEach((listener) => listener([...mockVMs]));
};

// Pub-sub listeners for Log updates
type LogListener = (logs: VMActivityLog[]) => void;
const logListeners = new Set<LogListener>();

export const subscribeLogs = (listener: LogListener) => {
  logListeners.add(listener);
  listener([...mockLogs]);
  return () => {
    logListeners.delete(listener);
  };
};

const notifyLogListeners = () => {
  logListeners.forEach((listener) => listener([...mockLogs]));
};

// Background State Machine Transitions Simulator
const handleVMStateTransitions = (vmId: string, targetStatus: 'running' | 'stopped') => {
  setTimeout(() => {
    const vmIndex = mockVMs.findIndex((v) => v.id === vmId);
    if (vmIndex === -1) return;

    const vm = mockVMs[vmIndex];
    // Check if the status is still starting/stopping (hasn't been force updated or deleted)
    if (vm.status === 'starting' && targetStatus === 'running') {
      const cpu = Math.floor(Math.random() * 25) + 5; // 5-30%
      const ram = Math.floor(Math.random() * 30) + 10; // 10-40%
      mockVMs[vmIndex] = {
        ...vm,
        status: 'running',
        cpuUsagePercent: cpu,
        memoryUsagePercent: ram,
        metricsHistory: generateMetricsHistory(cpu, ram),
      };

      // Add success log
      mockLogs = [
        {
          id: `log-${Date.now()}`,
          vmId: vm.id,
          action: 'Power On Transition Complete',
          timestamp: new Date().toISOString(),
          status: 'success',
          userEmail: 'system-scheduler@ascendra.dev',
        },
        ...mockLogs,
      ];
      notifyVMListeners();
      notifyLogListeners();
    } else if (vm.status === 'stopping' && targetStatus === 'stopped') {
      mockVMs[vmIndex] = {
        ...vm,
        status: 'stopped',
        cpuUsagePercent: 0,
        memoryUsagePercent: 0,
        metricsHistory: generateMetricsHistory(0, 0),
      };

      // Add success log
      mockLogs = [
        {
          id: `log-${Date.now()}`,
          vmId: vm.id,
          action: 'Power Off Transition Complete',
          timestamp: new Date().toISOString(),
          status: 'success',
          userEmail: 'system-scheduler@ascendra.dev',
        },
        ...mockLogs,
      ];
      notifyVMListeners();
      notifyLogListeners();
    }
  }, 4500); // 4.5 seconds for transitions
};

// Bootstrap initial background transitions
mockVMs.forEach((vm) => {
  if (vm.status === 'starting') {
    handleVMStateTransitions(vm.id, 'running');
  } else if (vm.status === 'stopping') {
    handleVMStateTransitions(vm.id, 'stopped');
  }
});

// API EXPORTS
export const getVMs = async (): Promise<VM[]> => {
  await delay(LATENCY_MS);
  return [...mockVMs];
};

export const getVMById = async (id: string): Promise<VM | undefined> => {
  await delay(LATENCY_MS);
  return mockVMs.find((v) => v.id === id);
};

export const updateVMStatus = async (id: string, status: VMStatus): Promise<VM> => {
  await delay(LATENCY_MS);
  const vmIndex = mockVMs.findIndex((v) => v.id === id);
  if (vmIndex === -1) {
    throw new Error('VM not found');
  }

  const prevVm = mockVMs[vmIndex];
  let cpu = prevVm.cpuUsagePercent;
  let ram = prevVm.memoryUsagePercent;

  if (status === 'stopped') {
    cpu = 0;
    ram = 0;
  }

  const updatedVM: VM = {
    ...prevVm,
    status,
    cpuUsagePercent: cpu,
    memoryUsagePercent: ram,
    metricsHistory: generateMetricsHistory(cpu, ram),
  };

  mockVMs[vmIndex] = updatedVM;

  // Add Log Entry
  const actionText = 
    status === 'starting' ? 'Initiated Power On' :
    status === 'stopping' ? 'Initiated Power Off' :
    status === 'running' ? 'Rebooted VM Instance' : 'Stopped VM Instance';

  mockLogs = [
    {
      id: `log-${Date.now()}`,
      vmId: id,
      action: actionText,
      timestamp: new Date().toISOString(),
      status: 'success',
      userEmail: 'alex.carter@ascendra.dev',
    },
    ...mockLogs,
  ];

  notifyVMListeners();
  notifyLogListeners();

  // If entering a transition state, trigger background state completion
  if (status === 'starting') {
    handleVMStateTransitions(id, 'running');
  } else if (status === 'stopping') {
    handleVMStateTransitions(id, 'stopped');
  }

  return updatedVM;
};

export const createVM = async (vmData: Omit<VM, 'id' | 'createdAt' | 'metricsHistory' | 'ipAddress' | 'cpuUsagePercent' | 'memoryUsagePercent' | 'diskUsagePercent'>): Promise<VM> => {
  await delay(LATENCY_MS);
  const newId = `vm-${Date.now()}`;
  
  // IP Generation
  const ip = `10.140.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
  
  const newVM: VM = {
    ...vmData,
    id: newId,
    status: 'starting',
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 10,
    ipAddress: ip,
    createdAt: new Date().toISOString(),
    metricsHistory: generateMetricsHistory(0, 0),
  };

  mockVMs = [...mockVMs, newVM];

  mockLogs = [
    {
      id: `log-${Date.now()}`,
      vmId: newId,
      action: 'Provision Instance',
      timestamp: new Date().toISOString(),
      status: 'success',
      userEmail: 'alex.carter@ascendra.dev',
    },
    ...mockLogs,
  ];

  notifyVMListeners();
  notifyLogListeners();

  // Trigger starting -> running transition
  handleVMStateTransitions(newId, 'running');

  return newVM;
};

export const deleteVM = async (id: string): Promise<boolean> => {
  await delay(LATENCY_MS);
  const exists = mockVMs.some((v) => v.id === id);
  if (!exists) return false;

  mockVMs = mockVMs.filter((v) => v.id !== id);
  mockLogs = mockLogs.filter((l) => l.vmId !== id);

  notifyVMListeners();
  notifyLogListeners();

  return true;
};

export const getTemplates = async (): Promise<VMTemplate[]> => {
  await delay(LATENCY_MS);
  return [...mockTemplates];
};

export const createTemplate = async (template: Omit<VMTemplate, 'id'>): Promise<VMTemplate> => {
  await delay(LATENCY_MS);
  const newTemplate: VMTemplate = {
    ...template,
    id: `tpl-${Date.now()}`,
  };
  mockTemplates.push(newTemplate);
  return newTemplate;
};

export const getFleetUtilization = async (): Promise<FleetUtilization> => {
  await delay(LATENCY_MS);
  
  const total = mockVMs.length;
  const active = mockVMs.filter((v) => v.status === 'running').length;
  
  const runningVMs = mockVMs.filter((v) => v.status === 'running');
  const totalCpu = runningVMs.reduce((sum, v) => sum + v.cpuUsagePercent, 0);
  const totalMem = runningVMs.reduce((sum, v) => sum + v.memoryUsagePercent, 0);

  const avgCpu = runningVMs.length ? Math.round(totalCpu / runningVMs.length) : 0;
  const avgMem = runningVMs.length ? Math.round(totalMem / runningVMs.length) : 0;
  const activeUsers = new Set(mockVMs.map((v) => v.ownerId)).size;
  const totalHourlyCost = mockVMs.reduce((sum, v) => sum + (v.status === 'running' || v.status === 'starting' || v.status === 'stopping' ? v.costPerHour : 0), 0);

  // Generate historical utilization trend for the fleet (last 7 data points)
  const trendPoints: FleetTrendPoint[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000 * 4); // 4-hour intervals
    const noiseCpu = (Math.random() - 0.5) * 15;
    const noiseMem = (Math.random() - 0.5) * 10;
    trendPoints.push({
      timestamp: time.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' }),
      cpu: Math.max(5, Math.min(95, Math.round(avgCpu + noiseCpu))),
      memory: Math.max(5, Math.min(95, Math.round(avgMem + noiseMem))),
      count: total,
    });
  }

  return {
    totalVMs: total,
    activeVMs: active,
    totalCpuPercent: avgCpu,
    totalMemoryPercent: avgMem,
    activeUsersCount: activeUsers,
    totalCostPerHour: parseFloat(totalHourlyCost.toFixed(3)),
    utilizationTrend: trendPoints,
  };
};

export const getActivityLogs = async (vmId?: string): Promise<VMActivityLog[]> => {
  await delay(LATENCY_MS);
  if (vmId) {
    return mockLogs.filter((l) => l.vmId === vmId);
  }
  return [...mockLogs];
};

export const getPolicies = async (): Promise<Policy[]> => {
  await delay(LATENCY_MS);
  return [
    {
      id: 'pol-standard',
      name: 'Standard Developer Policy',
      maxVmsPerUser: 4,
      idleTimeoutMinutes: 240,
      allowedTemplates: ['tpl-general', 'tpl-memory'],
      appliesToTeam: 'Engineering',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pol-gpu',
      name: 'AI Engineering GPU Policy',
      maxVmsPerUser: 8,
      idleTimeoutMinutes: 480,
      allowedTemplates: ['tpl-general', 'tpl-memory', 'tpl-gpu'],
      appliesToTeam: 'Data Science & AI',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};
