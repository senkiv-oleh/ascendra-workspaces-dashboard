import {useWorkspace} from "@/context/WorkspaceContext";
import {useEffect, useState} from "react";
import {  VMActivityLog } from '@/types';

export const useActivityLogs = (vmId?: string) => {
    const { logs, loadingLogs } = useWorkspace();
    const [filteredLogs, setFilteredLogs] = useState<VMActivityLog[]>([]);

    useEffect(() => {
        if (vmId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
