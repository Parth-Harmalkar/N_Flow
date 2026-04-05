"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { BarChart3, Calendar, Filter, Activity, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { CompletionRadial } from "@/components/analytics/CompletionRadial";
import type { PerformanceMetric } from "@/lib/analytics";

interface Props {
  metrics: PerformanceMetric[]
}

export default function AnalyticsDashboard({ metrics }: Props) {
  // Aggregate data for various charts
  const performanceData = metrics.map(m => ({ name: m.name, hours: m.hours }))
  
  const totalTasks = metrics.reduce((acc, m) => acc + m.tasks, 0)
  const avgCompletion = metrics.reduce((acc, m) => acc + m.completionRate, 0) / (metrics.length || 1)
  const totalLate = metrics.reduce((acc, m) => acc + m.lateLogs, 0)

  const radialData = [
    { name: 'Completed', value: Math.round(avgCompletion), color: 'var(--brand-primary)' },
    { name: 'Pending', value: Math.round(100 - avgCompletion), color: 'rgba(255,255,255,0.05)' }
  ]

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
          { label: "Execution Velocity", value: `${Math.round(avgCompletion)}%`, trend: "+2.4%", icon: Zap, color: "text-[var(--status-warning)]", pos: true },
          { label: "Mitigation Power", value: `${totalTasks > 0 ? Math.round((totalTasks - totalLate) / totalTasks * 100) : 0}%`, trend: "+5.1%", icon: ShieldCheck, color: "text-[var(--brand-accent)]", pos: true },
          { label: "Incident Drift", value: `${totalLate}`, trend: "-0.4%", icon: Activity, color: "text-[var(--brand-secondary)]", pos: false },
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
                Productivity Dynamics
              </h4>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">Total hours worked per personnel vs strategic targets.</p>
            </div>
          </div>

          <div className="px-6 pb-10 pt-6">
            <PerformanceChart data={performanceData} />
          </div>
        </div>

        {/* Completion Radial */}
        <div className="dark-card flex flex-col lg:col-span-4 overflow-hidden">
          <div className="border-b border-[var(--surface-border)] px-6 py-5">
            <h4 className="font-bold text-[var(--foreground)]">Mission Completion</h4>
            <p className="text-xs text-[var(--foreground-muted)]">Overall task success rate</p>
          </div>
          <div className="flex flex-1 items-center justify-center p-6">
            <CompletionRadial data={radialData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-5">
        {/* Insights */}
        <div className="dark-card flex flex-col p-6 lg:col-span-1">
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Audit intelligence</h4>
            <p className="mt-1 text-lg font-bold text-[var(--foreground)]">Strategic insight feed</p>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            {[
              { title: "Personnel hours tracking", desc: `Aggregated data for ${metrics.length} employees verified.`, icon: ShieldCheck, color: "text-[var(--brand-secondary)]" },
              { title: "Anomaly detection", desc: `Total of ${totalLate} late submissons detected in current cycle.`, icon: Activity, color: "text-[var(--brand-accent)]" },
              { title: "Operational efficiency", desc: `Average completion rate is trending at ${Math.round(avgCompletion)}%.`, icon: Zap, color: "text-[var(--status-warning)]" },
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
        </div>

        {/* Status Table (Mocking dynamic status table) */}
        <div className="dark-card lg:col-span-2 overflow-hidden">
          <div className="border-b border-[var(--surface-border)] px-6 py-5">
            <h4 className="font-bold text-[var(--foreground)]">Personnel Status</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-2)]">
                  <th className="px-6 py-3 font-bold text-[var(--foreground-muted)] uppercase tracking-tighter text-[10px]">Name</th>
                  <th className="px-6 py-3 font-bold text-[var(--foreground-muted)] uppercase tracking-tighter text-[10px]">Hours</th>
                  <th className="px-6 py-3 font-bold text-[var(--foreground-muted)] uppercase tracking-tighter text-[10px]">Tasks</th>
                  <th className="px-6 py-3 font-bold text-[var(--foreground-muted)] uppercase tracking-tighter text-[10px]">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {metrics.map((m, i) => (
                  <tr key={i} className="group hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-6 py-4 font-bold text-[var(--foreground)]">{m.name}</td>
                    <td className="px-6 py-4 text-[var(--foreground-muted)]">{m.hours}h</td>
                    <td className="px-6 py-4 text-[var(--foreground-muted)]">{m.tasks}</td>
                    <td className="px-6 py-4 text-[var(--foreground-muted)]">{m.completionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}
