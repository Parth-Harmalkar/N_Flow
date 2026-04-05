"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { BarChart3, Calendar, Filter, Activity, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const barData = [45, 62, 58, 84, 76, 92, 70, 85, 60, 75, 90, 65];

  return (
    <Container
      title="Strategic Analytics"
      subtitle="Comprehensive data oversight, performance metrics, and risk trajectory forecasting."
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-[var(--surface-2)] border border-[var(--surface-border)] p-1">
            <button className="flex items-center gap-2 rounded-md bg-[var(--surface-3)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] shadow-sm">
              <Calendar className="h-3.5 w-3.5" /> Last 30 days
            </button>
            <button className="ml-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              <Filter className="h-3.5 w-3.5" /> Global
            </button>
          </div>
          <button className="btn-primary text-xs">Generate export</button>
        </div>
      }
    >
      {/* Top metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {[
          { label: "Execution Velocity", value: "94.2%", trend: "+2.4%", icon: Zap, color: "text-[var(--status-warning)]", pos: true },
          { label: "Mitigation Power", value: "88.1%", trend: "+5.1%", icon: ShieldCheck, color: "text-[var(--brand-accent)]", pos: true },
          { label: "Incident Drift", value: "1.2%", trend: "-0.4%", icon: Activity, color: "text-[var(--brand-secondary)]", pos: false },
        ].map((m, i) => (
          <div key={i} className="dark-card p-5">
            <div className="flex items-center gap-4">
              <div className={cn("rounded-lg bg-[var(--surface-2)] p-3", m.color)}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground-muted)]">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black tracking-tight text-[var(--foreground)]">{m.value}</h3>
                  <span className={cn("badge", m.pos ? "badge-green" : "badge-cyan")}>{m.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 md:gap-5">
        {/* Bar chart */}
        <div className="dark-card overflow-hidden lg:col-span-8">
          <div className="flex flex-col gap-4 border-b border-[var(--surface-border)] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="flex items-center gap-2.5 font-bold text-[var(--foreground)]">
                <BarChart3 className="h-5 w-5 text-[var(--brand-primary)]" />
                Task completion dynamics
              </h4>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">Daily performance output vs strategic targets.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                <div className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" /> Historical
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                <div className="h-2 w-2 rounded-full bg-[var(--surface-3)]" /> Baseline
              </div>
            </div>
          </div>

          <div className="px-6 pb-10 pt-6">
            <div className="flex h-52 items-end gap-2">
              {barData.map((h, i) => (
                <div key={i} className="group relative flex flex-1 flex-col justify-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative w-full min-h-[4px] rounded-md transition-all",
                      h > 80 ? "bg-[var(--brand-primary)]" : h > 60 ? "bg-[rgba(99,102,241,0.3)]" : "bg-[var(--surface-3)]"
                    )}
                    style={h > 80 ? { boxShadow: "0 0 12px rgba(99,102,241,0.45)" } : {}}
                  >
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 scale-0 rounded-md border border-[var(--surface-border)] bg-[var(--surface-2)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)] shadow-xl transition-transform group-hover:scale-100 whitespace-nowrap">
                      {h} units
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="dark-card flex flex-col lg:col-span-4 p-6">
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Audit intelligence</h4>
            <p className="mt-1 text-lg font-bold text-[var(--foreground)]">Strategic insight feed</p>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            {[
              { title: "Region variance detected", desc: "Security anomalies in APAC decreased by 12% in the last cycle.", icon: ShieldCheck, color: "text-[var(--brand-secondary)]" },
              { title: "Efficiency benchmarking", desc: "Personnel output trending toward 92% mission benchmark.", icon: Activity, color: "text-[var(--brand-accent)]" },
              { title: "Throughput optimization", desc: "Task processing exceeding standard SLA by 4.2 minutes.", icon: Zap, color: "text-[var(--status-warning)]" },
            ].map((insight, i) => (
              <div key={i} className="flex gap-4">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]", insight.color)}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)]">{insight.title}</h5>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--foreground-muted)]">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-ghost mt-8 w-full justify-center text-sm">Configure data streams</button>
        </div>
      </div>
    </Container>
  );
}