"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, AlertCircle, Activity, MoreVertical, ExternalLink, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getRisks } from '../actions/risks';
import { Container } from '@/components/ui/Container';
import { Panel } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const riskLevels = {
  low: 'text-blue-600 bg-blue-50 border-blue-100',
  medium: 'text-amber-600 bg-amber-50 border-amber-100',
  high: 'text-orange-600 bg-orange-50 border-orange-100',
  critical: 'text-red-600 bg-red-50 border-red-100',
};

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRisks = async () => {
    try {
      const data = await getRisks();
      setRisks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const filteredRisks = risks.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = risks.filter((r) => !r.is_resolved).length;
  const mitigatedCount = risks.filter((r) => r.is_resolved).length;

  return (
    <Container 
      title="Strategic Risk Oversight" 
      subtitle="Mitigation monitoring and vulnerability trajectory analysis."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-2.5 shadow-[var(--shadow-soft-xl)] sm:flex">
            <Activity className="h-5 w-5 shrink-0 text-brand-accent animate-pulse" />
            <span className="text-sm font-black tracking-tight text-brand-primary">
              {risks.length} signals
            </span>
          </div>
          <button className="bg-brand-primary text-white px-8 py-3.5 rounded-[2rem] font-black text-sm shadow-[0_20px_40px_rgba(30,27,75,0.2)] hover:opacity-90 transition-all flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Export Audit Trace
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          { label: 'Total signals', value: loading ? '—' : risks.length },
          { label: 'Active exposure', value: loading ? '—' : activeCount },
          { label: 'Mitigated', value: loading ? '—' : mitigatedCount },
        ].map((s, i) => (
          <Panel key={i}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-black text-brand-primary">{s.value}</p>
          </Panel>
        ))}
      </div>

      <Panel noPadding className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
          <div className="relative min-w-0 w-full flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search risk fingerprints and vulnerability signatures..."
              className="w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium shadow-inner transition-all placeholder:text-slate-400 focus:border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/15"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <button
              type="button"
              className="flex items-center gap-2 whitespace-nowrap text-sm font-black text-slate-500 hover:text-brand-primary"
            >
              <Filter className="h-5 w-5 shrink-0" />
              Criticality focus
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-[var(--radius-premium)] bg-white shadow-[var(--shadow-soft-xl)]"
            />
          ))
        ) : filteredRisks.length === 0 ? (
          <Panel gridClassName="w-full" className="py-16 text-center md:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
              <ShieldCheck className="h-9 w-9 text-green-500" />
            </div>
            <h4 className="text-2xl font-black tracking-tight text-brand-primary md:text-3xl">Zero risk surface</h4>
            <p className="mt-2 text-sm font-medium text-slate-500">
              No active vulnerabilities currently require mitigation.
            </p>
          </Panel>
        ) : filteredRisks.map((risk, index) => (
          <motion.div 
            key={risk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.4) }}
            className="min-w-0 w-full"
          >
            <Panel className="group border border-slate-100 transition-shadow hover:shadow-[0_24px_50px_-20px_rgba(30,27,75,0.12)]">
               <div className="flex flex-col lg:flex-row gap-10">
                  {/* Visual Impact Marker */}
                  <div className={cn(
                    "flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl font-black italic shadow-lg transition-shadow group-hover:shadow-md md:rounded-2xl",
                    risk.level === 'critical' ? 'bg-red-500 text-white' : 
                    risk.level === 'high' ? 'bg-orange-500 text-white' : 
                    'bg-brand-primary text-white'
                  )}>
                    <AlertTriangle className="w-8 h-8 mb-1" />
                    <span className="text-[10px] uppercase tracking-tighter">{risk.level}</span>
                  </div>

                  {/* Core Intelligence */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200">
                        <Shield className="w-4 h-4" />
                      </span>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Origin: {risk.tasks?.title || 'System Core'}</p>
                    </div>
                    <h3 className="text-2xl font-black text-brand-primary mb-3 leading-none group-hover:text-brand-highlight transition-colors truncate">
                      {risk.title}
                    </h3>
                    <p className="text-base text-slate-500 font-medium leading-relaxed max-w-3xl">
                      {risk.description}
                    </p>
                  </div>

                  {/* Operational Status */}
                  <div className="flex flex-col md:flex-row lg:flex-col justify-between items-end gap-6 shrink-0 lg:border-l lg:border-slate-50 lg:pl-10">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5 opacity-50">Current Exposure</p>
                       <span className={cn(
                          "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                          risk.is_resolved 
                            ? 'bg-slate-50 border-slate-100 text-slate-300' 
                            : 'bg-red-50 border-red-100 text-red-600 shadow-xl shadow-red-500/20 active-glow'
                        )}>
                          {risk.is_resolved ? 'Mitigated' : 'Active Threat'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="p-4 rounded-2xl bg-slate-50 text-slate-300 hover:text-brand-primary hover:bg-white hover:shadow-2xl transition-all">
                        <ExternalLink className="w-5 h-5 font-black" />
                      </button>
                      <button className="p-4 rounded-2xl bg-slate-50 text-slate-200 hover:text-brand-primary hover:bg-white hover:shadow-2xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
               </div>
               
               {/* Metadata Footer */}
               <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vulnerability ID: FPT-{risk.id.slice(0,8)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-300">
                    <Activity className="w-4 h-4 opacity-30" />
                    <span>Updated {new Date().toLocaleDateString([], { month: 'long', day: 'numeric' })}</span>
                  </div>
               </div>
            </Panel>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
