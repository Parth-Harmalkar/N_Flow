"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ClipboardList, Filter, Search, Clock, User, ArrowRight, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("logs")
        .select("*, profiles(name, employee_id)")
        .order("created_at", { ascending: false })
        .limit(80);
      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = logs.length;
    const errors = logs.filter((l) => l.status === "error").length;
    const ok = total - errors;
    const today = new Date().toDateString();
    const todayCount = logs.filter((l) => new Date(l.created_at).toDateString() === today).length;
    return { total, ok, errors, todayCount };
  }, [logs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((log) => {
      const name = (log.profiles?.name || "").toLowerCase();
      const desc = (log.description || "").toLowerCase();
      const id = (log.profiles?.employee_id || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || id.includes(q);
    });
  }, [logs, query]);

  const statCards = [
    { label: "Total logs", value: stats.total, icon: ClipboardList, color: "text-[var(--brand-primary)]" },
    { label: "Successful", value: stats.ok, icon: CheckCircle2, color: "text-[var(--status-success)]" },
    { label: "Errors", value: stats.errors, icon: AlertTriangle, color: "text-[var(--status-danger)]" },
    { label: "Today", value: stats.todayCount, icon: Clock, color: "text-[var(--status-warning)]" },
  ];

  return (
    <Container
      title="Activity Stream"
      subtitle="Real-time audit trail of personnel actions, system events, and security audits."
      actions={
        <button type="button" className="btn-primary">
          <Download className="h-4 w-4" /> Export Report
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="dark-card flex items-center gap-4 p-5">
            <div className={`rounded-lg bg-[var(--surface-2)] p-3 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)]">{s.label}</p>
              <h3 className="text-2xl font-black text-[var(--foreground)]">{loading ? "—" : s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="dark-card overflow-hidden">
        {/* Search bar */}
        <div className="flex flex-col gap-4 border-b border-[var(--surface-border)] p-4 md:flex-row md:items-center md:p-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by employee, action, or ID..."
              className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
          <button type="button" className="btn-ghost text-xs">
            <Filter className="h-4 w-4" /> Event category
          </button>
        </div>

        {/* Log rows */}
        <div className="divide-y divide-[var(--surface-border)]">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse px-6 py-5">
                <div className="mb-2 h-3.5 w-1/4 rounded-md bg-[var(--surface-3)]" />
                <div className="h-3.5 w-1/2 rounded-md bg-[var(--surface-2)]" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ClipboardList className="mx-auto mb-4 h-10 w-10 text-[var(--foreground-subtle)] opacity-30" />
              <p className="font-semibold text-[var(--foreground)]">No activity matches</p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">Try another search or check back after new events.</p>
            </div>
          ) : (
            filtered.map((log) => (
              <div
                key={log.id}
                className="group flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] md:flex-row md:items-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] transition-colors group-hover:border-[rgba(99,102,241,0.3)]">
                  <Clock className="h-4 w-4 text-[var(--foreground-subtle)] group-hover:text-[var(--brand-primary)] transition-colors" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[var(--foreground-subtle)]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[var(--surface-border)]">•</span>
                    <span className="text-xs text-[var(--foreground-subtle)]">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
                    <span className="font-bold text-[var(--foreground)]">{log.profiles?.name}</span>
                    <span>performed</span>
                    <span className="rounded-md bg-[var(--surface-3)] border border-[var(--surface-border)] px-1.5 py-0.5 font-mono text-xs text-[var(--foreground)]">
                      {log.description}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-1 md:text-right">
                  <span className={`badge ${log.status === "error" ? "badge-red" : "badge-green"}`}>
                    {log.status || "SUCCESS"}
                  </span>
                  <p className="flex items-center gap-1 text-xs text-[var(--foreground-subtle)] md:justify-end">
                    <User className="h-3 w-3" />
                    {log.profiles?.employee_id || "SYSTEM"}
                  </p>
                </div>

                <div className="hidden shrink-0 group-hover:block">
                  <ArrowRight className="h-4 w-4 text-[var(--brand-primary)]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}