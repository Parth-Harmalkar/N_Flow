"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
import { 
  Users, 
  CheckSquare, 
  AlertCircle, 
  ClipboardList, 
  TrendingUp, 
  Plus, 
  Activity, 
  ArrowUpRight,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { getDashboardStats } from "../actions/stats";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const metricCards = [
    { label: "Active Personnel", value: stats?.employees, icon: Users, color: "text-blue-600", bg: "bg-blue-50/50" },
    { label: "Pending Tasks", value: stats?.activeTasks, icon: CheckSquare, color: "text-brand-highlight", bg: "bg-purple-50/50" },
    { label: "Critical Risks", value: stats?.unresolvedRisks, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50/50" },
    { label: "System Events", value: stats?.recentLogs, icon: ClipboardList, color: "text-slate-600", bg: "bg-slate-50/50" }
  ];

  return (
    <Container 
      title="Executive Overview" 
      subtitle={`System synchronization active. Local telemetry last verified at ${stats?.lastUpdate || '--:--'}`}
      actions={
        <button className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-sm font-black text-brand-primary shadow-[0_12px_32px_-8px_rgba(245,158,11,0.45)] transition-all hover:opacity-95 active:scale-[0.99] md:gap-3 md:px-8 md:py-3.5">
          <Plus className="w-5 h-5" />
          Deploy New Initiative
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {metricCards.map((card, i) => (
          <Panel key={i} className="group">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className={`rounded-2xl p-3.5 transition-shadow duration-300 group-hover:shadow-md md:p-4 md:rounded-3xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 italic">
                <ArrowUpRight className="w-3 h-3" />
                LIVE
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">{card.label}</p>
              {loading ? (
                <div className="h-10 w-16 bg-slate-100 animate-pulse rounded-xl" />
              ) : (
                <h3 className="text-4xl font-black text-brand-primary tracking-tighter">{card.value}</h3>
              )}
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch md:gap-5">
        <Panel
          gridClassName="lg:col-span-8 h-full min-h-0 w-full min-w-0 lg:min-h-[440px]"
          className="h-full min-h-0"
          noPadding
        >
          <div className="flex flex-col gap-6 border-b border-slate-100 px-7 py-7 md:flex-row md:items-center md:justify-between md:px-9 md:py-8">
            <div className="min-w-0 max-w-xl">
              <h4 className="flex items-center gap-3 text-xl font-black tracking-tight text-brand-primary">
                <Activity className="h-6 w-6 shrink-0 text-brand-accent" />
                System Velocity Monitor
              </h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Global processing speed and endpoint latency spectral analysis.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black tracking-widest text-slate-400">
                NETWORK CAPABLE
              </span>
            </div>
          </div>

          <div className="flex min-h-[280px] flex-1 flex-col justify-between gap-8 px-7 pb-10 pt-6 md:min-h-[320px] md:px-9 md:pb-12 md:pt-8">
            <div className="flex min-h-[180px] flex-1 items-end gap-1.5 px-3 pb-2 sm:gap-2 md:gap-3">
              {[40, 75, 45, 90, 65, 80, 55, 95, 70, 85, 60, 45].map((h, i) => (
                <div
                  key={i}
                  className="group flex h-full min-h-0 min-w-0 flex-1 flex-col justify-end"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'relative w-full min-h-[4px] rounded-xl transition-all duration-500 md:rounded-2xl',
                      h > 80
                        ? 'bg-brand-highlight shadow-[0_15px_30px_rgba(124,58,237,0.3)]'
                        : h > 50
                          ? 'bg-brand-primary/20'
                          : 'bg-slate-100'
                    )}
                  >
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 scale-0 rounded-xl bg-slate-900 px-2 py-1.5 text-[10px] font-black whitespace-nowrap text-white shadow-2xl transition-transform group-hover:scale-100">
                      V-{h} ms
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 border-t border-slate-100 px-1 pb-2 pt-10 sm:grid-cols-3 sm:gap-5 md:gap-8">
               {[
                 { icon: Shield, label: "Security Engine", status: "Optimal", color: "text-blue-500" },
                 { icon: Zap, label: "Data Throughput", status: "High Velocity", color: "text-amber-500" },
                 { icon: Globe, label: "Edge Endpoints", status: "100% Online", color: "text-purple-500" }
               ].map((mod, i) => (
                 <div key={i} className="flex min-w-0 items-center gap-3 md:gap-4">
                   <div className={cn("shrink-0 rounded-xl bg-slate-50 p-3.5 transition-colors md:rounded-2xl md:p-4", mod.color)}>
                    <mod.icon className="h-5 w-5 md:h-6 md:w-6" />
                   </div>
                   <div className="min-w-0 py-0.5">
                     <p className="mb-1 text-[10px] font-black uppercase leading-snug tracking-widest text-slate-500">{mod.label}</p>
                     <p className="text-sm font-black leading-tight text-brand-primary">{mod.status}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-4 md:gap-5 lg:col-span-4 lg:h-full">
          <Panel variant="purple" className="flex shrink-0 flex-col justify-between">
            <div>
              <h4 className="text-xl font-black mb-1.5 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-brand-accent" />
                Strategic Growth
              </h4>
              <p className="text-sm text-white/50 font-medium mb-8">Quarterly operational target.</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-xs font-black text-white/40 uppercase tracking-widest">
                  <span>Resource Sync</span>
                  <span>85%</span>
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '85%' }}
                     transition={{ duration: 2, ease: "circOut" }}
                     className="h-full bg-brand-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]" 
                  />
                </div>
              </div>
            </div>
            
            <button className="w-full rounded-xl bg-white py-4 text-sm font-black text-brand-primary shadow-sm transition-all hover:shadow-md active:scale-[0.99] md:py-5 md:rounded-2xl">
              Generate Insight Report
            </button>
          </Panel>

          <Panel gridClassName="min-h-0 flex-1" className="flex-1">
             <h4 className="mb-6 text-xs font-black uppercase leading-relaxed tracking-[0.2em] text-slate-500 md:text-sm md:text-slate-400">
               System audit trail
             </h4>
             <div className="space-y-5 md:space-y-6">
                {[
                   { msg: "Personnel onboarding pending review.", type: "notice" },
                   { msg: "Server endpoint optimized (London).", type: "success" },
                   { msg: "Blocked unauthorized login (Berlin).", type: "threat" }
                ].map((alert, i) => (
                  <div key={i} className="flex cursor-default items-start gap-3 md:gap-4">
                    <div className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                      alert.type === 'threat' ? 'bg-red-500' : alert.type === 'notice' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <p className="min-w-0 flex-1 text-sm font-bold leading-relaxed text-brand-primary">{alert.msg}</p>
                  </div>
                ))}
             </div>
          </Panel>
        </div>
      </div>
    </Container>
  );
}
