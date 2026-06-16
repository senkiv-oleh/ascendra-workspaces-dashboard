'use client';

import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useRouter } from 'next/navigation';
import { Code, Shield, Cpu, Terminal, ArrowRight, Zap, Layers } from 'lucide-react';

export default function LandingPage() {
  const { setActivePersona } = useWorkspace();
  const router = useRouter();

  const handleSelectPersona = (persona: 'developer' | 'admin') => {
    setActivePersona(persona);
    if (persona === 'developer') {
      router.push('/developer');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-800/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-zinc-900/80 backdrop-blur-md bg-zinc-950/45">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-650 text-white shadow-md">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            ASCENDRA
          </span>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          SECURE WORKSPACE TELEMETRY
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-5xl mx-auto w-full z-10">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-950/50 border border-indigo-900/40 text-indigo-300">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Developer Machine Fleet Orchestrator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Select Your Command Console
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Welcome to the Ascendra control portal. Access your assigned dev containers or oversee global fleet health metrics.
          </p>
        </div>

        {/* Persona Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Developer Card */}
          <div 
            onClick={() => handleSelectPersona('developer')}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-850 bg-zinc-900/35 hover:bg-zinc-900/60 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-indigo-550/5"
          >
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950 border border-indigo-900/40 text-indigo-400 group-hover:scale-110 transition-transform">
                <Code className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Developer Console
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Provision new environments, access your IDE code editor, query credentials, and manage running container lifecycles.
                </p>
              </div>

              {/* Developer Bullet List */}
              <ul className="space-y-2 text-[11px] text-zinc-500 font-mono">
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-400 mr-2" />
                  Live Resource Gauges (CPU, Memory)
                </li>
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-400 mr-2" />
                  Lifecycle State Transitions (Start/Stop)
                </li>
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-indigo-400 mr-2" />
                  Interactive IDE & SSH Key Access
                </li>
              </ul>
            </div>

            <div className="flex items-center text-xs font-semibold text-indigo-400 mt-8 group-hover:translate-x-1.5 transition-transform">
              <span>Launch Workspaces</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          </div>

          {/* Admin Card */}
          <div 
            onClick={() => handleSelectPersona('admin')}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-850 bg-zinc-900/35 hover:bg-zinc-900/60 hover:border-zinc-300/40 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-zinc-300/5"
          >
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                  Admin Command Fleet
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitor tenant allocations, analyze aggregate resource metrics, edit machine sizing configurations, and audit waste/anomalies.
                </p>
              </div>

              {/* Admin Bullet List */}
              <ul className="space-y-2 text-[11px] text-zinc-500 font-mono">
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-zinc-450 mr-2" />
                  Aggregate KPI Telemetry Panels
                </li>
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-zinc-450 mr-2" />
                  Idle VM detection & Security alerts
                </li>
                <li className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-zinc-450 mr-2" />
                  Machine Instance Template Configs CRUD
                </li>
              </ul>
            </div>

            <div className="flex items-center text-xs font-semibold text-zinc-350 mt-8 group-hover:translate-x-1.5 transition-transform">
              <span>Launch Command Center</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-[10px] text-zinc-650 font-mono border-t border-zinc-900/80 backdrop-blur-md bg-zinc-950/45">
        <span>© 2026 Ascendra Infrastructure Systems • ISO-27001 Certified</span>
      </footer>
    </div>
  );
}
