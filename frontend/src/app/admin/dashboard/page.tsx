"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CreateTaskModal } from "@/components/admin/CreateTaskModal";
import { Panel } from "@/components/ui/GlassCard";
import {
  Users, CheckSquare, AlertCircle, ClipboardList,
  TrendingUp, Plus, Activity, ArrowUpRight,
  Shield, Zap, Globe
} from "lucide-react";
import { getDashboardStats } from "../actions/stats";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const metricCards = [
    { label: "Active Personnel", value: stats?.employees, icon: Users, color: "text-[var(--brand-secondary)]", glow: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.15)" },
    { label: "Pending Tasks", value: stats?.activeTasks, icon: CheckSquare, color: "text-[var(--brand-primary)]", glow: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.15)" },
    { label: "Mission Events", value: stats?.recentLogs, icon: ClipboardList, color: "text-[var(--brand-accent)]", glow: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.15)" },
  ];

  return (
    <Container
      title="Executive Overview"
      subtitle={`System synchronization active — telemetry verified at ${stats?.lastUpdate || "--:--"}`}
      actions={
        <div className="flex gap-3">
          <button className="btn-ghost" onClick={() => window.location.href = '/admin/users'}>
            <Users className="h-4 w-4" /> Personnel Registry
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Deploy Initiative
          </button>
        </div>
      }
    >

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="dark-card group relative overflow-hidden p-6"
              style={{ borderColor: card.border, boxShadow: `0 4px 24px ${card.glow}, 0 1px 0 rgba(255,255,255,0.04) inset` }}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10 blur-2xl"
                style={{ background: card.glow.replace("0.12", "1").replace("0.1", "1") }} />
              <div className="mb-4 flex items-center justify-between">
                <div className={cn("rounded-lg p-2.5", card.color, "bg-[rgba(255,255,255,0.05)]")}>
                  <card.icon className="h-6 w-6" />
                </div>
                <span className="badge badge-green">
                  <ArrowUpRight className="h-2.5 w-2.5" /> High Sync
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--foreground-muted)]">{card.label}</p>
              {loading ? (
                <div className="mt-1.5 h-10 w-20 animate-pulse rounded-lg bg-[var(--surface-3)]" />
              ) : (
                <h3 className="mt-1 text-4xl font-black tracking-tight text-[var(--foreground)]">{card.value}</h3>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
        {/* Quick Management */}
        <div className="dark-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="flex items-center gap-3 text-lg font-bold text-[var(--foreground)]">
              <Zap className="h-5 w-5 text-[var(--brand-primary)]" />
              Mission Command
            </h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)]">Active Control</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
             <button 
               onClick={() => window.location.href = '/admin/users'}
               className="flex items-center justify-between p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] transition-all hover:border-[var(--brand-primary-dim)] hover:translate-x-1"
             >
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--brand-secondary)]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[var(--foreground)]">Manage Personnel</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] uppercase">Onboard, decommissioning, & access</p>
                  </div>
               </div>
               <ArrowUpRight className="h-4 w-4 text-[var(--foreground-muted)]" />
             </button>

             <button 
               onClick={() => window.location.href = '/admin/tasks'}
               className="flex items-center justify-between p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] transition-all hover:border-[var(--brand-primary-dim)] hover:translate-x-1"
             >
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--brand-primary)]">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[var(--foreground)]">Strategic Roadmap</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] uppercase">Mission planning & deployment</p>
                  </div>
               </div>
               <ArrowUpRight className="h-4 w-4 text-[var(--foreground-muted)]" />
             </button>
          </div>
        </div>

        {/* System Integrity */}
        <div className="dark-card p-8">
           <div className="flex items-center justify-between mb-8">
            <h4 className="flex items-center gap-3 text-lg font-bold text-[var(--foreground)]">
              <Shield className="h-5 w-5 text-[var(--status-success)]" />
              Intelligence Center
            </h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)]">Synchronized</span>
          </div>

          <div className="p-10 rounded-2xl border border-[var(--surface-border)] bg-[rgba(255,255,255,0.02)] text-center">
             <Globe className="h-12 w-12 text-[var(--brand-primary)] mx-auto mb-4 opacity-50" />
             <h5 className="text-sm font-bold text-[var(--foreground)] mb-2">Network Transparency High</h5>
             <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
               All mission vectors are currently aligned with the strategic baseline. 
               Personnel audits are ready for executive review in the Intelligence suite.
             </p>
             <button 
               onClick={() => window.location.href = '/admin/analytics'}
               className="mt-6 btn-ghost text-xs w-full justify-center"
             >
               View Performance Intelligence
             </button>
          </div>
        </div>
      </div>


      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { return; }}
      />
    </Container>
  );
}