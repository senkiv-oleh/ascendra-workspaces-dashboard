import { useWorkspace } from '@/context/WorkspaceContext';
import { useState } from 'react';


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

