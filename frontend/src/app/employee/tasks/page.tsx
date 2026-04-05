"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { getMyTasks } from "@/app/employee/actions/logs";
import { Calendar, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTasks().then(setTasks).finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "completed").length;
    return { total, done, open: total - done };
  }, [tasks]);

  const priorityBadge: Record<string, string> = {
    urgent: "badge-red", high: "badge-amber", medium: "badge-violet", low: "badge-cyan",
  };

  return (
    <Container
      title="My Assignments"
      subtitle="Everything assigned to you — status, due dates, and priority at a glance."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          { label: "Assigned to you", value: summary.total },
          { label: "Open", value: summary.open },
          { label: "Completed", value: summary.done },
        ].map((s, i) => (
          <div key={i} className="dark-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)]">{s.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-[var(--foreground)]">{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-[var(--surface-1)] border border-[var(--surface-border)]" />
          ))
        ) : tasks.length === 0 ? (
          <div className="col-span-full dark-card py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-2)]">
              <ListTodo className="h-7 w-7 text-[var(--foreground-subtle)]" />
            </div>
            <p className="font-bold text-[var(--foreground)]">No assignments yet</p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">When tasks are assigned to you, they appear here.</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.35) }}
            >
              <div className="dark-card flex h-full flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className={cn("badge", priorityBadge[task.priority] || "badge-slate")}>
                    {(task.priority || "medium").toString()}
                  </span>
                  {task.status === "completed" ? (
                    <span className="badge badge-green"><CheckCircle2 className="h-3 w-3" /> Done</span>
                  ) : (
                    <span className="badge badge-amber"><Clock className="h-3 w-3" /> Open</span>
                  )}
                </div>
                <h3 className="font-bold leading-tight text-[var(--foreground)]">{task.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--foreground-muted)]">
                  {task.description || "No description."}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-[var(--surface-border)] pt-4 text-xs text-[var(--foreground-subtle)]">
                  <Calendar className="h-3.5 w-3.5" />
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                    : "No deadline"}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Container>
  );
}