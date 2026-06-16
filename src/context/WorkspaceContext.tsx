'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VM, VMTemplate, VMActivityLog, FleetUtilization, VMStatus, User } from '../types';
import * as mockApi from '../services/mockApi';

interface WorkspaceContextType {
  activePersona: 'developer' | 'admin';
  setActivePersona: (persona: 'developer' | 'admin') => void;
  vms: VM[];
  templates: VMTemplate[];
  logs: VMActivityLog[];
  fleetData: FleetUtilization | null;
  loadingVms: boolean;
  loadingTemplates: boolean;
  loadingLogs: boolean;
  loadingFleet: boolean;
  currentUser: User;
  refreshFleet: () => Promise<void>;
  updateVmStatus: (id: string, status: VMStatus) => Promise<void>;
  createNewVM: (name: string, templateId: string) => Promise<void>;
  removeVM: (id: string) => Promise<void>;
  createNewTemplate: (template: Omit<VMTemplate, 'id'>) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersonaState] = useState<'developer' | 'admin'>('developer');
  const [vms, setVms] = useState<VM[]>([]);
  const [templates, setTemplates] = useState<VMTemplate[]>([]);
  const [logs, setLogs] = useState<VMActivityLog[]>([]);
  const [fleetData, setFleetData] = useState<FleetUtilization | null>(null);

  const [loadingVms, setLoadingVms] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingFleet, setLoadingFleet] = useState(true);

  // Alex is the default logged-in developer, Sarah is the admin
  const currentUser: User = activePersona === 'developer' 
    ? {
        id: 'usr-alex',
        name: 'Alex Carter',
        email: 'alex.carter@ascendra.dev',
        role: 'developer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      }
    : {
        id: 'usr-sarah',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@ascendra.dev',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      };

  // Sync activePersona class to <html> or <body> for visual themes
  const setActivePersona = (persona: 'developer' | 'admin') => {
    setActivePersonaState(persona);
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('dark'); // Unified light-theme look for both views
    }
  };

  // Initialize and subscribe to live updates
  useEffect(() => {
    // Subscribe to VM updates
    const unsubscribeVMs = mockApi.subscribeVMs((updatedVMs) => {
      setVms(updatedVMs);
      setLoadingVms(false);
      // Whenever VMs change, auto-trigger a fleet utilization refresh
      fetchFleetData();
    });

    // Subscribe to log updates
    const unsubscribeLogs = mockApi.subscribeLogs((updatedLogs) => {
      setLogs(updatedLogs);
      setLoadingLogs(false);
    });

    // Fetch templates once
    const fetchTemplates = async () => {
      try {
        const data = await mockApi.getTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Failed to fetch templates', err);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();

    return () => {
      unsubscribeVMs();
      unsubscribeLogs();
    };
  }, []);

  const fetchFleetData = async () => {
    try {
      const data = await mockApi.getFleetUtilization();
      setFleetData(data);
    } catch (err) {
      console.error('Failed to fetch fleet data', err);
    } finally {
      setLoadingFleet(false);
    }
  };

  const refreshFleet = async () => {
    setLoadingFleet(true);
    await fetchFleetData();
  };

  const updateVmStatus = async (id: string, status: VMStatus) => {
    try {
      await mockApi.updateVMStatus(id, status);
      // In-memory array inside mockApi is updated and it notifies subscription
    } catch (err) {
      console.error('Failed to update VM status', err);
      throw err;
    }
  };

  const createNewVM = async (name: string, templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      await mockApi.createVM({
        name,
        templateId,
        ownerId: currentUser.id,
        status: 'starting',
        costPerHour: template.costPerHour,
      });
    } catch (err) {
      console.error('Failed to create VM', err);
      throw err;
    }
  };

  const removeVM = async (id: string) => {
    try {
      await mockApi.deleteVM(id);
    } catch (err) {
      console.error('Failed to remove VM', err);
      throw err;
    }
  };

  const createNewTemplate = async (templateData: Omit<VMTemplate, 'id'>) => {
    try {
      const newTpl = await mockApi.createTemplate(templateData);
      setTemplates(prev => [...prev, newTpl]);
    } catch (err) {
      console.error('Failed to create template', err);
      throw err;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activePersona,
        setActivePersona,
        vms,
        templates,
        logs,
        fleetData,
        loadingVms,
        loadingTemplates,
        loadingLogs,
        loadingFleet,
        currentUser,
        refreshFleet,
        updateVmStatus,
        createNewVM,
        removeVM,
        createNewTemplate,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
