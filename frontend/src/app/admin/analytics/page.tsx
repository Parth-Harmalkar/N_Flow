"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
import { BarChart3, Calendar, Filter, Activity, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <Container 
      title="Strategic Analytics" 
      subtitle="Comprehensive data oversight, performance metrics, and risk trajectory forecasting."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl bg-slate-100/70 p-1.5 shadow-inner">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-brand-primary shadow-sm transition-all md:px-4"
            >
              <Calendar className="h-4 w-4 shrink-0" />
              Last 30 days
            </button>
            <button
              type="button"
              className="ml-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black text-slate-500 transition-all hover:bg-white/80 hover:text-slate-700 md:px-4"
            >
              <Filter className="h-4 w-4 shrink-0" />
              Global segment
            </button>
          </div>
          <button
            type="button"
            className="rounded-xl bg-brand-accent px-6 py-3 text-sm font-black text-brand-primary shadow-[0_12px_32px_-8px_rgba(245,158,11,0.45)] transition-all hover:opacity-95"
          >
            Generate export
          </button>
        </div>
      }
    >
      {/* Top Level Intelligence Cluster */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {[
          { label: "Execution Velocity", value: "94.2%", trend: "+2.4%", icon: Zap, color: "text-brand-accent", bg: "bg-amber-50/50" },
          { label: "Mitigation Power", value: "88.1%", trend: "+5.1%", icon: ShieldCheck, color: "text-brand-highlight", bg: "bg-purple-50/50" },
          { label: "Incident Drift", value: "1.2%", trend: "-0.4%", icon: Activity, color: "text-blue-500", bg: "bg-blue-50/50" }
        ].map((m, i) => (
          <Panel key={i} className="group">
            <div className="flex items-center gap-6">
              <div className={cn("rounded-2xl p-4 shadow-inner transition-shadow group-hover:shadow-md md:rounded-[1.25rem] md:p-5", m.bg, m.color)}>
                <m.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">{m.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-4xl font-black text-brand-primary tracking-tighter">{m.value}</h3>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                    m.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                  )}>
                    {m.trend}
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch md:gap-5">
        <Panel
          gridClassName="lg:col-span-8 min-h-0"
          className="overflow-hidden"
          noPadding
        >
          <div className="flex flex-col gap-6 border-b border-slate-100 px-7 py-7 md:flex-row md:items-center md:justify-between md:px-9 md:py-8">
            <div className="min-w-0">
              <h4 className="flex items-center gap-3 text-xl font-black tracking-tight text-brand-primary">
                <BarChart3 className="h-6 w-6 shrink-0 text-brand-accent" />
                Task completion dynamics
              </h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                Aggregated daily performance output vs strategic mission targets.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-highlight" />
                Historical
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-200" />
                Baseline
              </div>
            </div>
          </div>

          <div className="flex min-h-[22rem] flex-col px-7 pb-12 pt-8 md:min-h-[26rem] md:px-9 md:pb-14 md:pt-10">
            <div className="flex min-h-[200px] flex-1 items-end justify-between gap-3 px-2 pb-4 md:gap-5 md:px-4 md:pb-6">
              {[45, 62, 58, 84, 76, 92, 70, 85, 60, 75, 90, 65].map((h, i) => (
                <div
                  key={i}
                  className="group relative flex h-full min-h-0 min-w-0 flex-1 flex-col justify-end"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-slate-50/60 opacity-0 transition-opacity group-hover:opacity-100 md:rounded-2xl" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative w-full min-h-[6px] rounded-lg transition-all duration-500 md:rounded-xl",
                      h > 80
                        ? "bg-brand-highlight shadow-lg shadow-brand-highlight/25"
                        : h > 60
                          ? "bg-brand-primary/25 shadow-md"
                          : "bg-slate-100"
                    )}
                  >
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 scale-0 rounded-lg bg-slate-900 px-2 py-1.5 text-[10px] font-black text-white shadow-xl transition-transform group-hover:scale-100">
                      {h} units
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel gridClassName="lg:col-span-4 min-h-0" className="flex flex-col">
          <div className="mb-8">
            <h4 className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Audit intelligence
            </h4>
            <p className="text-xl font-black tracking-tight text-brand-primary md:text-2xl">
              Strategic insight feed
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-8">
            {[
              {
                title: "Region variance detected",
                desc: "Security anomalies in the APAC region decreased by 12% in the last cycle.",
                icon: ShieldCheck,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                title: "Efficiency benchmarking",
                desc: "Personnel output is trending toward the optimal 92% mission benchmark.",
                icon: Activity,
                color: "text-brand-highlight",
                bg: "bg-purple-50",
              },
              {
                title: "Throughput optimization",
                desc: "Task processing is currently exceeding standard SLA by 4.2 minutes.",
                icon: Zap,
                color: "text-brand-accent",
                bg: "bg-amber-50",
              },
            ].map((insight, idx) => (
              <div key={idx} className="flex gap-4 md:gap-5">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm md:h-14 md:w-14 md:rounded-2xl",
                    insight.bg,
                    insight.color
                  )}
                >
                  <insight.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h5 className="mb-1 text-base font-black text-brand-primary">{insight.title}</h5>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-10 w-full rounded-xl bg-brand-primary py-4 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition-all hover:bg-brand-primary/95 md:mt-12 md:rounded-2xl md:py-5"
          >
            Configure data streams
          </button>
        </Panel>
      </div>
    </Container>
  );
}
