"use client";

import React, { useState } from "react";
import { Clock, Calendar, FileText, Link, ChevronDown, ChevronUp, Link as LinkIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_URL = "https://jqqgqtszqffwbzqnyvck.supabase.co/storage/v1/object/public/logs/";

interface LogAuditTrailProps {
  logs: any[];
}

export function LogAuditTrail({ logs }: LogAuditTrailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resolveProofUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STORAGE_URL}${url}`;
  };

  if (logs.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--foreground-muted)]">
        <FileText className="mx-auto mb-3 h-8 w-8 opacity-20" />
        No work logs submitted for this cycle.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--surface-border)]">
      {logs.slice(0, 15).map((log) => (
        <div key={log.id} className="flex flex-col">
          <div 
            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
            className="group flex items-start justify-between gap-4 p-6 transition-colors hover:bg-[var(--surface-2)] cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[var(--foreground)] leading-tight line-clamp-1 group-hover:line-clamp-none">
                {log.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--foreground-muted)]">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="h-3 w-3" />
                  {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(log.start_time).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {log.proof_url && (
                 <LinkIcon className="h-3.5 w-3.5 text-[var(--brand-primary)] opacity-60" />
              )}
              {expandedId === log.id ? (
                <ChevronUp className="h-4 w-4 opacity-40" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-40" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === log.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[var(--surface-3)]/30 border-t border-[var(--surface-border)]"
              >
                <div className="p-6 space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">Detailed Submission Description</h5>
                    <p className="text-xs leading-relaxed text-[var(--foreground-muted)] whitespace-pre-wrap">
                      {log.description}
                    </p>
                  </div>
                  
                  {log.proof_url && (
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-[var(--surface-1)] p-3 border border-[var(--surface-border)] shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[rgba(99,102,241,0.1)] text-[var(--brand-primary)]">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">Proof of Work Asset</p>
                          <p className="text-xs truncate font-medium text-[var(--brand-primary)] font-mono">{log.proof_url}</p>
                        </div>
                      </div>
                      <a 
                        href={resolveProofUrl(log.proof_url)!} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-primary py-1.5 px-4 text-[10px] font-black uppercase tracking-wider"
                      >
                        Inspect
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

