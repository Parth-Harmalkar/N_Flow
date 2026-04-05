"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ClipboardList, Filter, Search, Clock, User, ArrowRight, Download, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Link as LinkIcon, FileText, Hash, Calendar as CalendarIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STORAGE_URL = "https://jqqgqtszqffwbzqnyvck.supabase.co/storage/v1/object/public/logs/";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Logs
      const { data: logsData } = await supabase
        .from("logs")
        .select("*, profiles(name, employee_id)")
        .order("created_at", { ascending: false })
        .limit(300);
      
      // Fetch Personnel for filter
      const { data: pData } = await supabase
        .from("profiles")
        .select("id, name, employee_id")
        .order("name", { ascending: true });

      if (logsData) setLogs(logsData);
      if (pData) setPersonnel(pData);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    return logs.filter((log) => {
      // 1. Text Search
      const name = (log.profiles?.name || "").toLowerCase();
      const desc = (log.description || "").toLowerCase();
      const id = (log.profiles?.employee_id || "").toLowerCase();
      const matchesQuery = !q || name.includes(q) || desc.includes(q) || id.includes(q);

      // 2. Personnel Filter
      const matchesPersonnel = selectedPersonnel === "all" || log.user_id === selectedPersonnel;

      // 3. Date Filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const d = new Date(log.created_at);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = diff / (1000 * 60 * 60);
        if (dateFilter === "24h") matchesDate = hours <= 24;
        else if (dateFilter === "7d") matchesDate = hours <= 24 * 7;
        else if (dateFilter === "30d") matchesDate = hours <= 24 * 30;
      }

      return matchesQuery && matchesPersonnel && matchesDate;
    });
  }, [logs, query, selectedPersonnel, dateFilter]);

  // Grouping logic: Date -> Employee -> Actions
  const groupedLogs = useMemo(() => {
    const groups: { [date: string]: { [employeeId: string]: any[] } } = {};
    
    filtered.forEach(log => {
      const dateKey = new Date(log.created_at).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      const empId = log.profiles?.employee_id || "SYSTEM";
      
      if (!groups[dateKey]) groups[dateKey] = {};
      if (!groups[dateKey][empId]) groups[dateKey][empId] = [];
      groups[dateKey][empId].push(log);
    });
    
    return groups;
  }, [filtered]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const errors = filtered.filter((l) => l.status === "error").length;
    const ok = total - errors;
    const today = new Date().toDateString();
    const todayCount = filtered.filter((l) => new Date(l.created_at).toDateString() === today).length;
    return { total, ok, errors, todayCount };
  }, [filtered]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExport = () => {
    if (filtered.length === 0) return;
    
    const headers = ["Date", "Time", "Personnel", "Employee ID", "Description", "Start Time", "End Time", "Proof URL"];
    const csvContent = [
      headers.join(","),
      ...filtered.map(log => [
        new Date(log.created_at).toLocaleDateString(),
        new Date(log.created_at).toLocaleTimeString(),
        `"${log.profiles?.name || 'System'}"`,
        `"${log.profiles?.employee_id || 'N/A'}"`,
        `"${(log.description || '').replace(/"/g, '""')}"`,
        new Date(log.start_time).toISOString(),
        new Date(log.end_time).toISOString(),
        log.proof_url ? getFullProofUrl(log.proof_url) : "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Mission_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { label: "Refined count", value: stats.total, icon: ClipboardList, color: "text-[var(--brand-primary)]" },
    { label: "Successful", value: stats.ok, icon: CheckCircle2, color: "text-[var(--status-success)]" },
    { label: "Errors", value: stats.errors, icon: AlertTriangle, color: "text-[var(--status-danger)]" },
    { label: "Today", value: stats.todayCount, icon: Clock, color: "text-[var(--status-warning)]" },
  ];

  const getFullProofUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STORAGE_URL}${url}`;
  };

  return (
    <Container
      title="Activity Stream"
      subtitle="Operational timeline grouped by personnel to provide maximum clarity on daily progress."
      actions={
        <button 
          type="button" 
          onClick={handleExport}
          className="btn-primary"
          disabled={filtered.length === 0}
        >
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

      {/* Timeline Controls */}
      <div className="dark-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--surface-border)] p-4 md:flex-row md:items-center md:p-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by personnel name, action, or ID..."
              className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <CalendarIcon className="h-4 w-4 text-[var(--foreground-subtle)]" />
               <select 
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value as any)}
                 className="dark-input py-1.5 px-3 text-xs min-w-[120px]"
               >
                 <option value="all">All Timeline</option>
                 <option value="24h">Last 24h</option>
                 <option value="7d">Last 7 Days</option>
                 <option value="30d">Last 30 Days</option>
               </select>
            </div>
            <div className="flex items-center gap-2 border-l border-[var(--surface-border)] pl-3">
               <User className="h-4 w-4 text-[var(--foreground-subtle)]" />
               <select 
                 value={selectedPersonnel}
                 onChange={(e) => setSelectedPersonnel(e.target.value)}
                 className="dark-input py-1.5 px-3 text-xs min-w-[150px]"
               >
                 <option value="all">All Personnel</option>
                 {personnel.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        {/* Grouped Timeline */}
        <div className="bg-[var(--surface-1)]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-8 animate-pulse space-y-4">
                 <div className="h-6 w-48 bg-[var(--surface-3)] rounded" />
                 <div className="h-20 w-full bg-[var(--surface-2)] rounded-xl" />
              </div>
            ))
          ) : Object.keys(groupedLogs).length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ClipboardList className="mx-auto mb-4 h-10 w-10 text-[var(--foreground-subtle)] opacity-30" />
              <p className="font-semibold text-[var(--foreground)]">Strategic Silence</p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">No recorded actions match your current filters.</p>
            </div>
          ) : (
            Object.entries(groupedLogs).map(([date, employees]) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 border-y border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-3 shadow-sm">
                  <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--foreground-subtle)]">
                    <CalendarIcon className="h-3 w-3" /> {date}
                  </h3>
                </div>

                {/* Personnel Groups */}
                <div className="divide-y divide-[var(--surface-border)] p-4 space-y-4">
                  {Object.entries(employees).map(([empId, empLogs]) => {
                    const empName = empLogs[0].profiles?.name || "System";
                    return (
                      <div key={empId} className="dark-card overflow-hidden bg-[var(--surface-1)] border border-[var(--surface-border)]/50">
                        {/* Summary Header */}
                        <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)]/30 px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary-dim)] text-[var(--brand-primary)] text-xs font-black">
                              {empName.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-[var(--foreground)]">{empName}</p>
                               <p className="text-[10px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wider">{empId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-[var(--foreground-muted)]">
                             <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> 
                                {empLogs.length} Actions
                             </div>
                          </div>
                        </div>

                        {/* Individual Actions */}
                        <div className="divide-y divide-[var(--surface-border)]">
                          {empLogs.map((log) => (
                            <div key={log.id} className="flex flex-col">
                              <div 
                                onClick={() => toggleExpand(log.id)}
                                className={cn(
                                  "group flex cursor-pointer items-start justify-between gap-4 px-5 py-4 transition-all hover:bg-[rgba(99,102,241,0.03)]",
                                  expandedId === log.id && "bg-[rgba(99,102,241,0.05)]"
                                )}
                              >
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[10px] font-bold text-[var(--brand-primary)] opacity-80">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <span className="text-[10px] text-[var(--foreground-subtle)]">
                                        Mission Entry
                                      </span>
                                   </div>
                                   <p className="text-sm text-[var(--foreground)] font-medium leading-tight line-clamp-1 group-hover:line-clamp-none">
                                      {log.description}
                                   </p>
                                </div>
                                <div className="flex items-center gap-3">
                                   {log.proof_url && (
                                     <div className="h-6 w-6 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center">
                                        <LinkIcon className="h-3 w-3 text-[var(--brand-primary)]" />
                                     </div>
                                   )}
                                   <div className="text-[var(--foreground-subtle)]">
                                      {expandedId === log.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                   </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {expandedId === log.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-[var(--surface-2)]/40 border-t border-[var(--surface-border)]"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                                       <div className="space-y-4">
                                          <div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">Detailed Narrative</h5>
                                            <p className="text-xs leading-relaxed text-[var(--foreground-muted)] whitespace-pre-wrap">
                                               {log.description}
                                            </p>
                                          </div>
                                          <div className="flex gap-6 border-t border-[var(--surface-border)] pt-4">
                                             <div>
                                                <h5 className="text-[10px] font-bold text-[var(--foreground-subtle)] uppercase">Session</h5>
                                                <p className="text-xs font-mono text-[var(--foreground)]">
                                                  {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                             </div>
                                             <div>
                                                <h5 className="text-[10px] font-bold text-[var(--foreground-subtle)] uppercase">Hash Sync</h5>
                                                <p className="text-xs font-mono text-[var(--foreground-subtle)]">
                                                   {log.file_hash?.substring(0, 12)}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                       
                                       <div className="space-y-4">
                                          <div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">Cloud Asset Verification</h5>
                                            {log.proof_url ? (
                                              <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4 shadow-xl">
                                                <div className="flex items-center justify-between mb-4">
                                                  <div className="flex items-center gap-3">
                                                     <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[rgba(99,102,241,0.1)] text-[var(--brand-primary)]">
                                                        <FileText className="h-5 w-5" />
                                                     </div>
                                                     <div>
                                                        <p className="text-xs font-bold text-[var(--foreground)]">Work Proof Asset</p>
                                                        <p className="text-[10px] text-[var(--foreground-subtle)] font-mono truncate max-w-[150px]">
                                                          {log.proof_url}
                                                        </p>
                                                     </div>
                                                  </div>
                                                  <a 
                                                    href={getFullProofUrl(log.proof_url)!} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn-primary py-2 px-4 text-[10px] font-black uppercase tracking-wider"
                                                  >
                                                    Inspect Asset
                                                  </a>
                                                </div>
                                                <div className="rounded-lg bg-[var(--surface-2)] p-2 text-center">
                                                   <p className="text-[9px] text-[var(--foreground-subtle)] italic">Authenticated Link • Verified Hash Sync</p>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="rounded-xl border-2 border-dashed border-[var(--surface-border)] p-8 text-center text-[var(--foreground-subtle)]">
                                                 <AlertTriangle className="mx-auto mb-2 h-6 w-6 opacity-30" />
                                                 <p className="text-xs font-medium">No verified asset attached to this entry.</p>
                                              </div>
                                            )}
                                          </div>
                                       </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}