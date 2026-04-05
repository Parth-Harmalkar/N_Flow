// ============================================================
// EMPLOYEE DASHBOARD  →  save as: app/employee/dashboard/page.tsx
// ============================================================
"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { AlertCircle, Briefcase, ListTodo, Shield, Activity, ChevronRight, Zap, ShieldCheck, Timer } from "lucide-react";
import { motion } from "framer-motion";
import LogSubmissionForm from "@/components/employee/LogSubmissionForm";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard() {
  const stats = [
    { name: "Active Assignments", value: "03", icon: Zap, color: "text-[var(--status-warning)]" },
    { name: "Verified Logs", value: "14", icon: ShieldCheck, color: "text-[var(--brand-accent)]" },
    { name: "Operational Drift", value: "0.2h", icon: Timer, color: "text-[var(--brand-secondary)]" },
  ];

  return (
    <Container title="Operational Terminal" subtitle="Personal workflow orchestration and activity synchronization.">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 xl:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="dark-card flex items-center gap-6 p-8">
            <div className={cn("rounded-lg bg-[var(--surface-2)] p-3", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)]">{stat.name}</p>
              <h3 className="text-3xl font-black tracking-tight text-[var(--foreground)]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
        {/* Activity log form */}
        <div className="dark-card overflow-hidden lg:col-span-8">
          <div className="flex flex-col gap-6 border-b border-[var(--surface-border)] px-8 py-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-[var(--brand-primary)]">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-[var(--foreground)]">Activity Synchronization</h2>
                <p className="text-xs text-[var(--foreground-muted)]">Transmit real-time operational status updates.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-1.5">
              <span className="pulse-dot green" />
              <span className="text-xs font-bold text-[var(--foreground-muted)]">Terminal Online</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <LogSubmissionForm />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {/* Task queue */}
          <div className="dark-card flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-4 border-b border-[var(--surface-border)] p-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--brand-accent)]">
                <ListTodo className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Queued Protocols</h3>
                <p className="text-xs text-[var(--foreground-subtle)]">02 Assignments remaining</p>
              </div>
            </div>
            <div className="space-y-4 p-8">
              {[
                { title: "Strategic Risk Audit v2", type: "Security", status: "Critical", icon: Shield },
                { title: "Personnel Node Registry", type: "Admin", status: "Routine", icon: Briefcase },
              ].map((task, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] p-4 transition-all hover:border-[var(--surface-border-hover)] hover:bg-[var(--surface-3)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      task.status === "Critical" ? "bg-[rgba(239,68,68,0.1)] text-[var(--status-danger)]" : "bg-[var(--surface-3)] text-[var(--foreground-subtle)]"
                    )}>
                      <task.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                      <p className="text-xs text-[var(--foreground-subtle)]">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "Critical" && <span className="pulse-dot red" />}
                    <ChevronRight className="h-4 w-4 text-[var(--foreground-subtle)] group-hover:text-[var(--foreground)] transition-colors" />
                  </div>
                </motion.div>
              ))}
              <div className="rounded-lg border border-dashed border-[var(--surface-border)] py-8 text-center">
                <AlertCircle className="mx-auto mb-2 h-6 w-6 text-[var(--foreground-subtle)] opacity-30" />
                <p className="text-xs text-[var(--foreground-subtle)]">End of directive queue</p>
              </div>
            </div>
          </div>

          {/* Safety directive */}
          <div className="brand-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[var(--brand-primary)] opacity-10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.08)] text-[var(--brand-accent)]">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Safety Directive</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">SE-04 Calibration</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                Execute equipment calibration protocols before mandatory log submission.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="pulse-dot amber" />
                <span className="text-xs font-bold text-[var(--foreground-subtle)] uppercase tracking-widest">System Integrity Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}