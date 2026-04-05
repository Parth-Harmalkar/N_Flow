"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { BarChart3, Calendar, Filter, Zap, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { PerformanceMetric } from "@/lib/analytics";

interface Props {
  metrics: PerformanceMetric[]
}

export default function AnalyticsDashboard({ metrics }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMetrics = metrics.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalTasks = metrics.reduce((acc, m) => acc + m.tasks, 0)
  const avgCompletion = metrics.reduce((acc, m) => acc + m.completionRate, 0) / (metrics.length || 1)
  const totalLate = metrics.reduce((acc, m) => acc + m.lateLogs, 0)

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {[
          { label: "Execution Velocity", value: `${Math.round(avgCompletion)}%`, trend: "+2.4%", icon: Zap, color: "text-[var(--status-warning)]", pos: true },
          { label: "Mitigation Power", value: `${totalTasks > 0 ? Math.round((totalTasks - totalLate) / totalTasks * 100) : 0}%`, trend: "+5.1%", icon: ShieldCheck, color: "text-[var(--brand-accent)]", pos: true },
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 md:gap-8">
        {/* Personnel Performance Drill-down */}
        <div className="dark-card lg:col-span-12 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[var(--surface-border)] px-8 py-7 md:flex-row md:items-center md:justify-between bg-[var(--surface-2)]/30">
            <div>
              <h4 className="flex items-center gap-2.5 font-bold text-[var(--foreground)] text-lg">
                <BarChart3 className="h-5 w-5 text-[var(--brand-primary)]" />
                Personnel Audit Registry
              </h4>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">Select an operative to view granular execution velocity and session history.</p>
            </div>
            <div className="relative min-w-[300px]">
               <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--foreground-subtle)]" />
               <input 
                 type="text" 
                 placeholder="Search personnel directory..." 
                 className="dark-input w-full pl-10 py-2 text-xs"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-1)]">
                  <th className="px-8 py-4 font-bold text-[var(--foreground-muted)] uppercase tracking-widest text-[10px]">Operative</th>
                  <th className="px-8 py-4 font-bold text-[var(--foreground-muted)] uppercase tracking-widest text-[10px]">Mission ID</th>
                  <th className="px-8 py-4 font-bold text-[var(--foreground-muted)] uppercase tracking-widest text-[10px]">Exec. Velocity</th>
                  <th className="px-8 py-4 font-bold text-[var(--foreground-muted)] uppercase tracking-widest text-[10px]">Aggregate Hours</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {filteredMetrics.map((m, i) => (
                  <tr key={i} className="group hover:bg-[rgba(99,102,241,0.03)] transition-all">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--brand-primary)] text-xs font-black shadow-sm">
                             {m.name.charAt(0)}
                          </div>
                          <span className="font-bold text-[var(--foreground)]">{m.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-mono text-[var(--foreground-subtle)]">{m.employeeId || "—"}</td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--surface-2)]">
                             <div 
                               className="h-full bg-[var(--brand-primary)] rounded-full" 
                               style={{ width: `${m.completionRate}%`, boxShadow: '0 0 8px rgba(99,102,241,0.4)' }} 
                             />
                          </div>
                          <span className="text-[11px] font-bold text-[var(--foreground)]">{m.completionRate}%</span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-[var(--foreground-muted)]">{m.hours}h</td>
                    <td className="px-8 py-4 text-right">
                       <Link 
                         href={`/admin/employees/${m.userId}`}
                         className="inline-flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] transition-all hover:bg-[var(--brand-primary)] hover:text-white"
                       >
                         View Individual Analytics <ArrowRight className="h-3 w-3" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aggregate Insights card */}
        <div className="dark-card flex flex-col p-8 lg:col-span-12">
          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-primary)] mb-2">Audit Intelligence</h4>
            <p className="text-xl font-bold text-[var(--foreground)] tracking-tight">Mission Trajectory Forecasting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Personnel Verification", desc: `Aggregated data for ${metrics.length} operatives verified.`, icon: ShieldCheck, color: "text-[var(--brand-secondary)]" },
              { title: "Execution Efficiency", desc: `Mean completion rate is trending at ${Math.round(avgCompletion)}% across all sectors.`, icon: Zap, color: "text-[var(--status-warning)]" },
              { title: "Network Integrity", desc: "Hash verification systems are active and monitoring work proofs in real-time.", icon: ShieldCheck, color: "text-[var(--brand-accent)]" },
            ].map((insight, i) => (
              <div key={i} className="flex gap-5">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-2)] shadow-sm", insight.color)}>
                  <insight.icon className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)]">{insight.title}</h5>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
