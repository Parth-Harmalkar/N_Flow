import React from "react";
import { Container } from "@/components/ui/Container";
import { getEmployeeDetailMetrics } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/server";
import { EmployeeAnalysis } from "@/components/admin/EmployeeAnalysis";
import { Briefcase, Clock, Calendar, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export default async function EmployeeDetailPage({ params }: any) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    return (
      <Container title="User Not Found">
        <p className="text-[var(--foreground-muted)]">No personnel matches this identifier.</p>
      </Container>
    );
  }

  // 2. Fetch Metrics
  const { logs, tasks } = await getEmployeeDetailMetrics(id);

  // 3. Simple stats
  const totalHours = logs.reduce((acc, l) => {
    const s = new Date(l.start_time).getTime();
    const e = new Date(l.end_time).getTime();
    return acc + (e - s) / (1000 * 60 * 60);
  }, 0);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  return (
    <Container 
      title={profile.name} 
      subtitle={`Personnel ID: ${profile.employee_id} • ${profile.role.toUpperCase()}`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 md:gap-8">
        {/* Left Column: Stats & Analysis */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Aggregate Hours", value: `${Math.round(totalHours * 10) / 10}h`, icon: Clock, color: "text-[var(--brand-accent)]" },
              { label: "Completed Output", value: completedTasks, icon: CheckCircle2, color: "text-[var(--status-success)]" },
              { label: "Pending Workflow", value: pendingTasks, icon: AlertTriangle, color: "text-[var(--status-warning)]" },
            ].map((s, i) => (
              <div key={i} className="dark-card p-5">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg bg-[var(--surface-2)] p-2.5", s.color)}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[var(--foreground)]">{s.value}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Component */}
          <EmployeeAnalysis userId={id} />

          {/* Recent Logs List */}
          <div className="dark-card overflow-hidden">
            <div className="border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Verification Audit Log</h4>
            </div>
            <div className="divide-y divide-[var(--surface-border)]">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-sm text-[var(--foreground-muted)]">
                  <FileText className="mx-auto mb-3 h-8 w-8 opacity-20" />
                  No work logs submitted for this cycle.
                </div>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="group p-6 transition-colors hover:bg-[var(--surface-2)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[var(--foreground)] leading-tight">{log.description}</p>
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
                      <div className="flex shrink-0 items-center">
                        {log.is_duplicate && (
                          <span className="badge badge-red flex items-center gap-1.5 py-1 px-3">
                            <AlertTriangle className="h-3 w-3" /> HIGH RISK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Assignments */}
        <div className="lg:col-span-4">
          <div className="dark-card flex h-full flex-col">
            <div className="border-b border-[var(--surface-border)] px-6 py-5">
              <h4 className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                <Briefcase className="h-4 w-4 text-[var(--brand-primary)]" />
                Strategic Assignments
              </h4>
            </div>
            <div className="flex-1 space-y-4 p-6">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--foreground-muted)]">
                  No tasks assigned to this personnel.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="relative rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-4 transition-all hover:border-[var(--brand-primary-dim)]">
                    <div className="flex items-start justify-between gap-2">
                       <h5 className="text-sm font-bold text-[var(--foreground)]">{task.title}</h5>
                       <span className={cn(
                         "h-2 w-2 rounded-full shrink-0 mt-1.5",
                         task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                       )} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn(
                        "badge text-[9px] py-0.5",
                        task.status === 'completed' ? 'badge-green' : 'badge-violet'
                      )}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[var(--foreground-muted)]">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
