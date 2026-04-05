"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
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
        .select(
          `
          *,
          profiles (
            name,
            employee_id
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(80);

      if (data) setLogs(data);
      setLoading(false);
    };

    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- client singleton
  }, []);

  const stats = useMemo(() => {
    const total = logs.length;
    const errors = logs.filter((l) => l.status === "error").length;
    const ok = total - errors;
    const today = new Date().toDateString();
    const todayCount = logs.filter(
      (l) => new Date(l.created_at).toDateString() === today
    ).length;
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

  return (
    <Container
      title="Activity Stream"
      subtitle="Real-time audit trail of personnel actions, system events, and security audits."
      actions={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition-all hover:bg-brand-primary/92"
        >
          <Download className="h-4 w-4" />
          Export audit report
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        <Panel variant="highlight" className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Total logs</p>
            <h3 className="text-2xl font-black">{loading ? "—" : stats.total}</h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Successful</p>
            <h3 className="text-2xl font-black text-brand-primary">{loading ? "—" : stats.ok}</h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-red-50 p-3 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Errors</p>
            <h3 className="text-2xl font-black text-brand-primary">{loading ? "—" : stats.errors}</h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-brand-accent">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Today</p>
            <h3 className="text-2xl font-black text-brand-primary">{loading ? "—" : stats.todayCount}</h3>
          </div>
        </Panel>
      </div>

      <Panel noPadding className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-surface-border bg-slate-50/50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="relative min-w-0 w-full max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by employee, action, or ID..."
              className="w-full min-w-0 rounded-lg border border-surface-border bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Event category
          </button>
        </div>

        <div className="divide-y divide-surface-border">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse px-6 py-6">
                <div className="mb-2 h-4 w-1/4 rounded bg-slate-100" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-slate-400">
              <ClipboardList className="mx-auto mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium text-slate-600">No activity matches</p>
              <p className="mt-1 text-sm opacity-70">Try another search or check back after new events.</p>
            </div>
          ) : (
            filtered.map((log) => (
              <div
                key={log.id}
                className="group flex flex-col gap-4 px-6 py-5 transition-all hover:bg-slate-50/50 md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-white transition-colors group-hover:border-brand-accent/30">
                  <Clock className="h-5 w-5 text-slate-400 group-hover:text-brand-accent" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="flex flex-wrap items-center gap-2 font-medium text-slate-700">
                    <span className="font-bold text-brand-primary">{log.profiles?.name}</span>
                    <span className="font-normal text-slate-400">performed</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                      {log.description}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-1 md:text-right">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
                      log.status === "error"
                        ? "border-red-100 bg-red-50 text-red-600"
                        : "border-green-100 bg-green-50 text-green-600"
                    }`}
                  >
                    {log.status || "SUCCESS"}
                  </span>
                  <p className="flex items-center gap-1 text-xs text-slate-400 md:justify-end">
                    <User className="h-3 w-3" />
                    {log.profiles?.employee_id || "SYSTEM"}
                  </p>
                </div>

                <div className="hidden shrink-0 group-hover:flex">
                  <ArrowRight className="h-4 w-4 animate-pulse text-brand-accent" />
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </Container>
  );
}
