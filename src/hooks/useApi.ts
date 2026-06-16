import { useWorkspace } from '../context/WorkspaceContext';
import { useState, useEffect } from 'react';
import { VM, VMTemplate, VMActivityLog, FleetUtilization } from '../types';
import * as mockApi from '../services/mockApi';

export const useVMs = () => {
  const { 
    vms, 
    loadingVms, 
    updateVmStatus, 
    createNewVM, 
    removeVM 
  } = useWorkspace();

  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const startVM = async (id: string) => {
    setMutatingId(id);
    try {
      await updateVmStatus(id, 'starting');
    } finally {
      setMutatingId(null);
    }
  };

  const stopVM = async (id: string) => {
    setMutatingId(id);
    try {
      await updateVmStatus(id, 'stopping');
    } finally {
      setMutatingId(null);
    }
  };

  const restartVM = async (id: string) => {
    setMutatingId(id);
    try {
      // Transition stop -> start
      await updateVmStatus(id, 'stopping');
      setTimeout(async () => {
        await updateVmStatus(id, 'starting');
      }, 1000);
    } finally {
      setMutatingId(null);
    }
  };

  return {
    vms,
    loading: loadingVms,
    mutatingId,
    startVM,
    stopVM,
    restartVM,
    createVM: createNewVM,
    deleteVM: removeVM,
  };
};

export const useTemplates = () => {
  const { templates, loadingTemplates, createNewTemplate } = useWorkspace();
  return {
    templates,
    loading: loadingTemplates,
    createTemplate: createNewTemplate,
  };
};

export const useFleetUtilization = () => {
  const { fleetData, loadingFleet, refreshFleet } = useWorkspace();
  return {
    fleetData,
    loading: loadingFleet,
    refresh: refreshFleet,
  };
};

export const useActivityLogs = (vmId?: string) => {
  const { logs, loadingLogs } = useWorkspace();
  const [filteredLogs, setFilteredLogs] = useState<VMActivityLog[]>([]);

  useEffect(() => {
    if (vmId) {
      setFilteredLogs(logs.filter((log) => log.vmId === vmId));
    } else {
      setFilteredLogs(logs);
    }
  }, [logs, vmId]);

  return {
    logs: filteredLogs,
    loading: loadingLogs,
  };
};

// Hook for fetching a single VM with local state (useful for detail page drills)
export const useVMDetail = (id: string) => {
  const { vms } = useWorkspace();
  const [vm, setVm] = useState<VM | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const found = vms.find((v) => v.id === id);
    if (found) {
      setVm(found);
      setError(null);
    } else {
      setError('Virtual Machine not found');
    }
    setLoading(false);
  }, [vms, id]);

  return {
    vm,
    loading,
    error,
  };
};
