"use client";

import React from 'react';
import { Panel } from "@/components/ui/GlassCard";
import { Container } from "@/components/ui/Container";
import { 
  AlertCircle, 
  Briefcase,
  ListTodo,
  Shield,
  Activity,
  ChevronRight,
  Zap,
  ShieldCheck,
  Timer
} from "lucide-react";
import { motion } from "framer-motion";
import LogSubmissionForm from "@/components/employee/LogSubmissionForm";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard() {
  const stats = [
    { name: "Active Assignments", value: "03", icon: Zap, color: "text-brand-accent", bg: "bg-amber-50/50" },
    { name: "Verified Logs", value: "14", icon: ShieldCheck, color: "text-brand-highlight", bg: "bg-purple-50/50" },
    { name: "Operational Drift", value: "0.2h", icon: Timer, color: "text-blue-500", bg: "bg-blue-50/50" },
  ];

  return (
    <Container 
      title="Operational Terminal" 
      subtitle="Personal workflow orchestration and activity synchronization."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {stats.map((stat, i) => (
          <Panel key={i} className="group">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={cn("rounded-2xl p-4 shadow-inner transition-shadow group-hover:shadow-md md:rounded-[1.25rem] md:p-5", stat.bg, stat.color)}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">{stat.name}</p>
                <h3 className="text-4xl font-black text-brand-primary tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch md:gap-5">
        <Panel
          gridClassName="lg:col-span-8 min-h-0 w-full min-w-0"
          noPadding
          className="min-h-0 overflow-hidden lg:min-h-[480px]"
        >
            <div className="flex flex-col gap-4 border-b border-slate-50 p-6 md:flex-row md:items-center md:justify-between md:p-8 lg:p-10">
              <div className="flex min-w-0 items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-brand-accent flex items-center justify-center shadow-lg">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-primary tracking-tight">Activity Synchronization</h2>
                  <p className="text-sm text-slate-400 font-medium">Transmit real-time operational status updates.</p>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-slate-50 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-primary shadow-[var(--shadow-soft-xl)] md:px-6 md:py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                Terminal Online
              </span>
            </div>
            <div className="p-6 md:p-10 lg:p-12">
              <LogSubmissionForm />
            </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-4 md:gap-5 lg:col-span-4 lg:h-full">
          <Panel noPadding className="flex min-h-0 flex-1 flex-col">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-highlight flex items-center justify-center">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest leading-none">Queued Protocols</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">02 Assignments Remaining</p>
                  </div>
                </div>
             </div>

             <div className="p-8 space-y-6 flex-1">
                {[
                  { title: "Strategic Risk Audit v2", type: "Security", status: "Critical", icon: Shield },
                  { title: "Personnel Node Registry", type: "Admin", status: "Routine", icon: Briefcase },
                ].map((task, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="p-6 rounded-[2rem] bg-white border border-slate-50 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{task.type}</span>
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shadow-sm",
                        task.status === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300'
                      )}>
                        <task.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-brand-primary leading-tight group-hover:text-brand-highlight transition-colors mb-4">{task.title}</h4>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", task.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-slate-300')} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.status}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-brand-primary transition-colors" />
                    </div>
                  </motion.div>
                ))}

                <div className="py-12 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem] bg-slate-50/20 mt-4">
                   <AlertCircle className="w-8 h-8 text-slate-100 mx-auto mb-3" />
                   <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[9px]">End of directive queue</p>
                </div>
             </div>
          </Panel>

          {/* Safety Directive Console */}
          <Panel className="bg-brand-primary text-white relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(30,27,75,0.4)]">
            <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none scale-150 rotate-12">
              <Shield className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent shadow-inner">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-white/50 mb-1">Safety Directive</h4>
                  <p className="text-sm font-black text-brand-accent">SE-04 Calibration</p>
                </div>
              </div>
              <p className="text-base font-medium leading-relaxed text-slate-300 mb-6">
                Execute equipment calibration protocols before mandatory log submission. 
              </p>
              <div className="py-3 px-6 bg-white/5 rounded-2xl border border-white/10 inline-flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-brand-highlight shadow-[0_0_10px_rgba(245,158,11,1)]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">System Integrity Active</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Container>
  );
}
