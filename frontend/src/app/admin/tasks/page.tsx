"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, CheckCircle2, Clock, ListTodo, Calendar, MoreVertical, LayoutGrid, List } from "lucide-react";
import { getTasks } from "../actions/tasks";
import { CreateTaskModal } from "@/components/admin/CreateTaskModal";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const priorityBadge: Record<string, string> = {
  low: "badge-cyan",
  medium: "badge-violet",
  high: "badge-amber",
  urgent: "badge-red",
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchTasks = async () => {
    setLoading(true);
    try { setTasks(await getTasks()); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total, completed, pipeline: total - completed };
  }, [tasks]);

  return (
    <Container
      title="Strategic Task Control"
      subtitle="Oversee mission-critical deliverables and project velocity."
      actions={
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg bg-[var(--surface-2)] border border-[var(--surface-border)] p-1">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  viewMode === mode
                    ? "bg-[var(--surface-3)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                )}
              >
                {mode === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            Assign Initiative
          </button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 xl:gap-8">
        {[
          { label: "Total initiatives", value: summary.total, sub: "In registry" },
          { label: "In pipeline", value: summary.pipeline, sub: "Active or pending" },
          { label: "Completed", value: summary.completed, sub: "Closed out" },
        ].map((s, i) => (
          <div key={i} className="dark-card p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)]">{s.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-[var(--foreground)]">
              {loading ? "—" : s.value}
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="dark-card flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
          <input
            type="search"
            placeholder="Search tasks..."
            className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="button" className="btn-ghost text-xs">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* Task grid / list */}
      <div className={cn("grid gap-6 xl:gap-8", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-[var(--surface-1)] border border-[var(--surface-border)]" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full dark-card py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-2)]">
              <ListTodo className="h-7 w-7 text-[var(--foreground-subtle)]" />
            </div>
            <h4 className="font-bold text-[var(--foreground)]">Queue exhausted</h4>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">No active tasks — assign a new initiative.</p>
          </div>
        ) : (
          filtered.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.4) }}
            >
              <div className="dark-card flex h-full flex-col p-8">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className={cn("badge", priorityBadge[task.priority] || "badge-slate")}>
                    {String(task.priority || "medium").toUpperCase()}
                  </span>
                  <button type="button" className="rounded-lg p-1.5 text-[var(--foreground-subtle)] hover:bg-[var(--surface-2)] transition-colors" aria-label="More">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-bold leading-tight text-[var(--foreground)]">{task.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--foreground-muted)]">
                  {task.description || "No description provided."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-sm font-bold text-[var(--brand-accent)]">
                      {task.profiles?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)]">{task.profiles?.name || "Unassigned"}</p>
                      <p className="text-[10px] text-[var(--foreground-subtle)]">ID: {task.profiles?.employee_id || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-subtle)]">
                      <Calendar className="h-3.5 w-3.5" />
                      {task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"}
                    </div>
                    {task.status === "completed" ? (
                      <span className="badge badge-green"><CheckCircle2 className="h-3 w-3" /> Done</span>
                    ) : (
                      <span className="badge badge-amber"><Clock className="h-3 w-3" /> Open</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTasks} />
    </Container>
  );
}