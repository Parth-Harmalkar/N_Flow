"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
import { getMyTasks } from "@/app/employee/actions/logs";
import { Calendar, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "completed").length;
    const open = total - done;
    return { total, done, open };
  }, [tasks]);

  return (
    <Container
      title="My assignments"
      subtitle="Everything assigned to you in one bento grid — status, due dates, and priority at a glance."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          { label: "Assigned to you", value: summary.total },
          { label: "Open", value: summary.open },
          { label: "Completed", value: summary.done },
        ].map((s, i) => (
          <Panel key={i}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-black text-brand-primary">
              {loading ? "—" : s.value}
            </p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-[var(--radius-premium)] bg-white shadow-[var(--shadow-soft-xl)]"
            />
          ))
        ) : tasks.length === 0 ? (
          <Panel gridClassName="col-span-full" className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner">
              <ListTodo className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-black text-brand-primary">No assignments yet</p>
            <p className="mt-1 text-sm text-slate-500">When tasks are assigned to you, they appear here as tiles.</p>
          </Panel>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.35) }}
              className="min-w-0"
            >
              <Panel className="flex h-full flex-col border border-slate-100">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
                      task.priority === "urgent" && "border-red-100 bg-red-50 text-red-700",
                      task.priority === "high" && "border-orange-100 bg-orange-50 text-orange-700",
                      task.priority === "medium" && "border-purple-100 bg-purple-50 text-brand-highlight",
                      (task.priority === "low" || !task.priority) && "border-slate-100 bg-slate-50 text-slate-600"
                    )}
                  >
                    {(task.priority || "medium").toString()}
                  </span>
                  {task.status === "completed" ? (
                    <span className="flex items-center gap-1 text-[10px] font-black text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-600">
                      <Clock className="h-3.5 w-3.5" />
                      Open
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black leading-tight text-brand-primary">{task.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">
                  {task.description || "No description."}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Calendar className="h-4 w-4" />
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline"}
                </div>
              </Panel>
            </motion.div>
          ))
        )}
      </div>
    </Container>
  );
}
