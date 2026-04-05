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
    { label: "Critical Risks", value: stats?.unresolvedRisks, icon: AlertCircle, color: "text-[var(--status-danger)]", glow: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.15)" },
    { label: "System Events", value: stats?.recentLogs, icon: ClipboardList, color: "text-[var(--brand-accent)]", glow: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.15)" },
  ];

  const barData = [40, 75, 45, 90, 65, 80, 55, 95, 70, 85, 60, 45];

  return (
    <Container
      title="Executive Overview"
      subtitle={`System synchronization active — telemetry verified at ${stats?.lastUpdate || "--:--"}`}
      actions={
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Deploy Initiative
        </button>
      }
    >

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="dark-card group relative overflow-hidden p-5"
              style={{ borderColor: card.border, boxShadow: `0 4px 24px ${card.glow}, 0 1px 0 rgba(255,255,255,0.04) inset` }}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10 blur-2xl"
                style={{ background: card.glow.replace("0.12", "1").replace("0.1", "1") }} />
              <div className="mb-4 flex items-center justify-between">
                <div className={cn("rounded-lg p-2.5", card.color, "bg-[rgba(255,255,255,0.05)]")}>
                  <card.icon className="h-5 w-5" />
                </div>
                <span className="badge badge-green">
                  <ArrowUpRight className="h-2.5 w-2.5" /> Live
                </span>
              </div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)]">{card.label}</p>
              {loading ? (
                <div className="mt-1.5 h-9 w-16 animate-pulse rounded-lg bg-[var(--surface-3)]" />
              ) : (
                <h3 className="mt-1 text-3xl font-black tracking-tight text-[var(--foreground)]">{card.value}</h3>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
        {/* Velocity chart */}
        <div className="dark-card overflow-hidden lg:col-span-8">
          <div className="flex flex-col gap-6 border-b border-[var(--surface-border)] px-8 py-7 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="flex items-center gap-3 text-lg font-bold text-[var(--foreground)]">
                <Activity className="h-5 w-5 text-[var(--brand-primary)]" />
                System Velocity Monitor
              </h4>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Processing speed and endpoint latency analysis.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="pulse-dot green" />
              <span className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-widest">Network Online</span>
            </div>
          </div>

          <div className="px-8 pb-10 pt-8">
            <div className="flex h-48 items-end gap-1.5">
              {barData.map((h, i) => (
                <div key={i} className="group relative flex flex-1 flex-col justify-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative w-full min-h-[4px] rounded-md transition-all",
                      h > 80 ? "bg-[var(--brand-primary)]" : h > 55 ? "bg-[rgba(99,102,241,0.35)]" : "bg-[var(--surface-3)]"
                    )}
                    style={h > 80 ? { boxShadow: "0 0 12px rgba(99,102,241,0.5)" } : {}}
                  >
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 scale-0 rounded-md bg-[var(--surface-3)] border border-[var(--surface-border)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)] shadow-xl transition-transform group-hover:scale-100 whitespace-nowrap">
                      {h} ms
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--surface-border)] pt-6">
              {[
                { icon: Shield, label: "Security Engine", status: "Optimal", color: "text-[var(--brand-secondary)]" },
                { icon: Zap, label: "Data Throughput", status: "High Velocity", color: "text-[var(--status-warning)]" },
                { icon: Globe, label: "Edge Endpoints", status: "100% Online", color: "text-[var(--brand-accent)]" },
              ].map((mod, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("rounded-lg bg-[var(--surface-2)] p-2.5", mod.color)}>
                    <mod.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">{mod.label}</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{mod.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {/* Growth card */}
          <div className="brand-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--brand-primary)] opacity-10 blur-3xl" />
            <div className="relative z-10">
              <h4 className="flex items-center gap-2 text-base font-bold text-[var(--foreground)]">
                <TrendingUp className="h-5 w-5 text-[var(--brand-accent)]" />
                Strategic Growth
              </h4>
              <p className="mt-1 text-xs text-[var(--foreground-subtle)]">Quarterly operational target</p>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-bold text-[var(--foreground-muted)]">
                  <span>Resource Sync</span>
                  <span className="text-[var(--brand-accent)]">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{ boxShadow: "0 0 12px rgba(99,102,241,0.6)" }}
                  />
                </div>
              </div>

              <button className="btn-ghost mt-6 w-full justify-center text-xs">
                Generate Insight Report
              </button>
            </div>
          </div>

          {/* Audit trail */}
          <div className="dark-card flex-1 p-8">
            <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">
              System Audit Trail
            </h4>
            <div className="space-y-4">
              {[
                { msg: "Personnel onboarding pending review.", type: "info" },
                { msg: "Server endpoint optimized (London).", type: "success" },
                { msg: "Blocked unauthorized login (Berlin).", type: "danger" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: alert.type === "danger" ? "var(--status-danger)" : alert.type === "success" ? "var(--status-success)" : "var(--status-info)",
                    }}
                  />
                  <p className="text-sm text-[var(--foreground-muted)]">{alert.msg}</p>
                </div>
              ))}
            </div>
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