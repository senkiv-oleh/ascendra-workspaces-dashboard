export type VMStatus = 'running' | 'stopped' | 'starting' | 'stopping';

export interface VMMetricSnapshot {
  timestamp: string;
  cpu: number;
  memory: number;
}

export interface VM {
  id: string;
  name: string;
  status: VMStatus;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  ipAddress: string;
  ownerId: string;
  templateId: string;
  createdAt: string;
  costPerHour: number;
  metricsHistory: VMMetricSnapshot[];
}

export interface VMTemplate {
  id: string;
  name: string;
  description: string;
  cpuCores: number;
  memoryGB: number;
  storageGB: number;
  os: 'Ubuntu 22.04 LTS' | 'Debian 12' | 'Windows Server 2022' | 'macOS Sonoma';
  costPerHour: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer';
  avatarUrl?: string;
}

export interface Policy {
  id: string;
  name: string;
  maxVmsPerUser: number;
  allowedTemplates: string[]; // List of VMTemplate IDs allowed under this policy
}

export interface FleetTrendPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  count: number;
}

export interface FleetUtilization {
  totalVMs: number;
  activeVMs: number;
  totalCpuPercent: number;
  totalMemoryPercent: number;
  activeUsersCount: number;
  totalCostPerHour: number;
  utilizationTrend: FleetTrendPoint[];
}

export interface VMActivityLog {
  id: string;
  vmId: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  userEmail: string;
}
