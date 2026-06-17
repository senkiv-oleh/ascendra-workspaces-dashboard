import { useWorkspace } from '@/context/WorkspaceContext';

export const useFleetUtilization = () => {
    const { fleetData, loadingFleet, refreshFleet } = useWorkspace();
    return {
        fleetData,
        loading: loadingFleet,
        refresh: refreshFleet,
    };
};
