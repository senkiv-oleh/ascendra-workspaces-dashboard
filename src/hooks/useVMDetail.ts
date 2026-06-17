import { useWorkspace } from '@/context/WorkspaceContext';
import { useState, useEffect } from 'react';
import { VM } from '@/types';

export const useVMDetail = (id: string) => {
    const { vms } = useWorkspace();
    const [vm, setVm] = useState<VM | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
