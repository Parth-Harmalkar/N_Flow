"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generatePerformanceSummary } from "@/app/admin/actions/ai-actions";

interface Props {
  userId: string;
}

export function EmployeeAnalysis({ userId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePerformanceSummary(userId);
      if (result.error) {
        setError(result.error);
      } else {
        setSummary(result.summary || "No summary generated.");
      }
    } catch (err) {
      setError("An unexpected error occurred during AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] p-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
          <h4 className="text-sm font-bold text-[var(--foreground)] tracking-tight">AI Performance Auditor</h4>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2 py-1.5 px-4 text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Synthesizing...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              {summary ? "Regenerate Analysis" : "Generate Insight"}
            </>
          )}
        </button>
      </div>

      <div className="p-6">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : summary ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground-muted)] prose-li:text-[var(--foreground-muted)]">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-[var(--surface-2)] p-4">
              <Sparkles className="h-8 w-8 text-[var(--foreground-subtle)] opacity-20" />
            </div>
            <p className="text-sm font-bold text-[var(--foreground)]">Deep Intelligence Audit</p>
            <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-[var(--foreground-muted)]">
              Click the button to run a cross-referenced AI analysis of this employee's recent task velocity and log integrity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
