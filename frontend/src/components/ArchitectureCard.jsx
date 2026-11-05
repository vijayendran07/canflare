import React from 'react';
import { Layers, ShieldCheck, Database, Box, Terminal, Cpu } from 'lucide-react';

export default function ArchitectureCard() {
  const stackItems = [
    {
      title: 'Frontend (Vite + React 19)',
      icon: Cpu,
      tech: 'React, Vite, Tailwind CSS v4',
      details: 'Fast HMR, optimized production build, responsive utility classes',
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
    {
      title: 'State Management (Redux Toolkit)',
      icon: Box,
      tech: '@reduxjs/toolkit, react-redux',
      details: 'Modular slices (cart, auth, health) with createAsyncThunk',
      color: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
    {
      title: 'API Client Layer (Axios)',
      icon: Layers,
      tech: 'Axios Instance + Interceptors',
      details: 'Auto-attaches JWT, standard error normalization, base URLs',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Backend API (Express.js)',
      icon: Terminal,
      tech: 'Node.js, Express 4, Morgan, CORS',
      details: 'Modular routing, JSON parsing, centralized error handling middleware',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Database (MongoDB + Mongoose)',
      icon: Database,
      tech: 'Mongoose ODM, Connection pooling',
      details: 'Resilient failover with serverSelectionTimeoutMS, ready for schemas',
      color: 'border-green-500/30 text-green-400 bg-green-500/10',
    },
    {
      title: 'Security & Environment',
      icon: ShieldCheck,
      tech: 'dotenv, .gitignore protection',
      details: 'Environment secrets isolated in .env, strict CORS origin controls',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-cyan-400" /> Professional Architecture Configured
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stackItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                  <span className="text-[11px] text-cyan-400/90 font-mono">{item.tech}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

