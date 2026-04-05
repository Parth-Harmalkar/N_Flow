"use client";

import React, { useState, useEffect } from "react";
import { Shield, Search, Filter, AlertCircle, Activity, MoreVertical, ExternalLink, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { getRisks } from "../actions/risks";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getRisks().then(setRisks).finally(() => setLoading(false));
  }, []);

  const filtered = risks.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = risks.filter((r) => !r.is_resolved).length;
  const mitigatedCount = risks.filter((r) => r.is_resolved).length;

  const levelStyle: Record<string, string> = {
    critical: "badge-red",
    high: "badge-amber",
    medium: "badge-violet",
    low: "badge-cyan",
  };

  return (
    <Container
      title="Strategic Risk Oversight"
      subtitle="Mitigation monitoring and vulnerability trajectory analysis."
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-1)] px-4 py-2">
            <Activity className="h-4 w-4 text-[var(--status-warning)] animate-pulse" />
            <span className="text-sm font-bold text-[var(--foreground)]">{risks.length} signals</span>
          </div>
          <button className="btn-primary">
            <ShieldAlert className="h-4 w-4" /> Export Audit
          </button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          { label: "Total signals", value: risks.length },
          { label: "Active exposure", value: activeCount },
          { label: "Mitigated", value: mitigatedCount },
        ].map((s, i) => (
          <div key={i} className="dark-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)]">{s.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-[var(--foreground)]">{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="dark-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
          <input
            type="search"
            placeholder="Search risk fingerprints..."
            className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="button" className="btn-ghost text-xs">
          <Filter className="h-4 w-4" /> Criticality
        </button>
      </div>

      {/* Risk list */}
      <div className="grid grid-cols-1 gap-4 md:gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-[var(--surface-1)] border border-[var(--surface-border)]" />
          ))
        ) : filtered.length === 0 ? (
          <div className="dark-card py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-2)]">
              <ShieldCheck className="h-7 w-7 text-[var(--status-success)]" />
            </div>
            <h4 className="font-bold text-[var(--foreground)]">Zero risk surface</h4>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">No active vulnerabilities require mitigation.</p>
          </div>
        ) : (
          filtered.map((risk, index) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4) }}
            >
              <div className="dark-card group p-6 transition-shadow">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Level marker */}
                  <div className={cn(
                    "flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl font-bold",
                    risk.level === "critical" ? "bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.2)] text-[var(--status-danger)]" :
                      risk.level === "high" ? "bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] text-[var(--status-warning)]" :
                        "bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-[var(--brand-primary)]"
                  )}>
                    <AlertTriangle className="h-7 w-7 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider">{risk.level}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-[var(--foreground-subtle)]" />
                      <p className="text-xs text-[var(--foreground-subtle)] uppercase tracking-widest">
                        {risk.tasks?.title || "System Core"}
                      </p>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] truncate">{risk.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">{risk.description}</p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-start gap-4 lg:border-l lg:border-[var(--surface-border)] lg:pl-6 lg:items-end">
                    <span className={cn("badge", risk.is_resolved ? "badge-green" : "badge-red")}>
                      {risk.is_resolved ? "Mitigated" : "Active Threat"}
                    </span>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] p-2.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] p-2.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-[var(--surface-border)] pt-5">
                  <div className="flex items-center gap-2">
                    <span className="pulse-dot amber" />
                    <span className="text-xs text-[var(--foreground-subtle)] uppercase tracking-widest">
                      Vuln ID: FPT-{risk.id.slice(0, 8)}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    Updated {new Date().toLocaleDateString([], { month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Container>
  );
}