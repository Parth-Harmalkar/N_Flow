"use client";

import React, { useState } from "react";
import { Clock, Calendar, FileText, Link, ChevronDown, ChevronUp, Link as LinkIcon, ExternalLink, CheckCircle2, Zap, AlertCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_URL = "https://jqqgqtszqffwbzqnyvck.supabase.co/storage/v1/object/public/logs/";

interface AuditItem {
  id: string;
  type: 'log' | 'task' | 'meeting';
  title: string;
  description?: string;
  timestamp: string;
  status?: string;
  meta?: any;
}

interface LogAuditTrailProps {
  logs: any[];
  tasks: any[];
  meetings: any[];
}

export function LogAuditTrail({ logs = [], tasks = [], meetings = [] }: LogAuditTrailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Normalize data for the audit trail
  const auditItems: AuditItem[] = [
    ...logs.map(l => ({
      id: `log-${l.id}`,
      type: 'log' as const,
      title: l.description.split('\n')[0],
      description: l.description,
      timestamp: l.created_at || l.start_time,
      meta: { start: l.start_time, end: l.end_time, proof: l.proof_url }
    })),
    ...tasks.filter(t => t.status === 'completed').map(t => ({
      id: `task-${t.id}`,
      type: 'task' as const,
      title: `Completed Mission: ${t.title}`,
      description: t.description,
      timestamp: t.updated_at || t.deadline,
      status: t.status
    })),
    ...meetings.map(m => ({
      id: `meeting-${m.id}`,
      type: 'meeting' as const,
      title: `Attended Strategic Briefing: ${m.title}`,
      description: m.description,
      timestamp: m.start_time,
      meta: { link: m.meet_link }
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const resolveProofUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STORAGE_URL}${url}`;
  };

  if (auditItems.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--foreground-muted)]">
        <FileText className="mx-auto mb-3 h-8 w-8 opacity-20" />
        No strategic audit data available for this personnel.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--surface-border)]">
      {auditItems.slice(0, 20).map((item) => (
        <div key={item.id} className="flex flex-col">
          <div 
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="group flex items-start justify-between gap-4 p-6 transition-colors hover:bg-[var(--surface-2)] cursor-pointer"
          >
            <div className="flex gap-4 min-w-0 flex-1">
              <div className={cn(
                "p-2.5 rounded-xl shrink-0 h-fit",
                item.type === 'log' ? "bg-[var(--surface-3)] text-[var(--brand-primary)]" :
                item.type === 'task' ? "bg-green-500/10 text-green-400" :
                "bg-orange-500/10 text-orange-400"
              )}>
                 {item.type === 'log' ? <Clock className="h-4 w-4" /> :
                  item.type === 'task' ? <CheckCircle2 className="h-4 w-4" /> :
                  <Zap className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[var(--foreground)] leading-tight line-clamp-1 group-hover:line-clamp-none">
                  {item.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-[var(--foreground-muted)] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {item.type === 'log' && item.meta?.start && (
                    <span className="flex items-center gap-1.5 text-[var(--brand-primary)]">
                       <History className="h-3 w-3" />
                       Cycle Duration
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {(item.type === 'log' && item.meta?.proof) || (item.type === 'meeting' && item.meta?.link) ? (
                 <LinkIcon className="h-3.5 w-3.5 text-[var(--brand-primary)] opacity-60" />
              ) : null}
              {expandedId === item.id ? (
                <ChevronUp className="h-4 w-4 opacity-40" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-40" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[var(--surface-3)]/30 border-t border-[var(--surface-border)]"
              >
                <div className="p-6 space-y-4">
                  {item.description && (
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">Audit Detail</h5>
                      <p className="text-xs leading-relaxed text-[var(--foreground-muted)] whitespace-pre-wrap">
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {item.type === 'log' && item.meta?.proof && (
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-[var(--surface-1)] p-3 border border-[var(--surface-border)] shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[rgba(99,102,241,0.1)] text-[var(--brand-primary)]">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Proof of Work Asset</p>
                          <p className="text-xs truncate font-medium text-[var(--brand-primary)] font-mono">{item.meta.proof}</p>
                        </div>
                      </div>
                      <a 
                        href={resolveProofUrl(item.meta.proof)!} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-primary py-1.5 px-4 text-[10px] font-black uppercase tracking-wider"
                      >
                        Inspect
                      </a>
                    </div>
                  )}

                  {item.type === 'meeting' && item.meta?.link && (
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-[var(--surface-1)] p-3 border border-[var(--surface-border)] shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--brand-accent-dim)] text-[var(--brand-accent)]">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Briefing Access</p>
                          <p className="text-xs truncate font-medium text-[var(--brand-accent)] font-mono">{item.meta.link}</p>
                        </div>
                      </div>
                      <a 
                        href={item.meta.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-ghost py-1.5 px-4 text-[10px] font-black uppercase tracking-wider border-[rgba(245,158,11,0.2)]"
                      >
                        Join Session
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
