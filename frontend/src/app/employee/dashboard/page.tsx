import React from "react";
import { Container } from "@/components/ui/Container";
import { AlertCircle, Briefcase, ListTodo, Shield, Activity, ChevronRight, Zap, ShieldCheck, Timer, Calendar } from "lucide-react";
import LogSubmissionForm from "@/components/employee/LogSubmissionForm";
import { AttendanceActions } from "@/components/employee/AttendanceActions";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { getEmployeeDetailMetrics } from "@/lib/analytics";
import { redirect } from "next/navigation";
import * as motion from "framer-motion/client";

export const dynamic = "force-dynamic";

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch real metrics
  const { logs, tasks } = await getEmployeeDetailMetrics(user.id);

  // 2. Fetch Strategic Briefings (Meetings)
  const { data: meetingsData } = await supabase
    .from('meeting_attendees')
    .select(`
      meetings!inner (*)
    `)
    .eq('user_id', user.id)
    .gte('meetings.end_time', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
    .order('start_time', { referencedTable: 'meetings', ascending: true })
    .limit(4);

  // 3. Fetch Attendance Status for Today
  const today = new Date().toISOString().split('T')[0];
  const { data: attendance } = await supabase
    .from('attendance')
    .select('status, verified_by_admin, login_time, logout_time, total_hours')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  const meetings = (meetingsData as any)?.map((m: any) => m.meetings).filter(Boolean) || [];

  // Metrics calculation
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const verifiedLogsCount = logs.length;
  
  const totalHours = logs.reduce((acc, l) => {
    const s = new Date(l.start_time).getTime();
    const e = new Date(l.end_time).getTime();
    return acc + (e - s) / (1000 * 60 * 60);
  }, 0);

  const stats = [
    { name: "Active Assignments", value: activeTasksCount.toString().padStart(2, '0'), icon: Zap, color: "text-[var(--status-warning)]" },
    { name: "Verified Logs", value: verifiedLogsCount.toString().padStart(2, '0'), icon: ShieldCheck, color: "text-[var(--brand-accent)]" },
    { name: "Aggregate Mission", value: `${Math.round(totalHours * 10) / 10}h`, icon: Timer, color: "text-[var(--brand-secondary)]" },
  ];

  return (
    <Container title="Operational Terminal" subtitle="Personal workflow orchestration and mission-critical status monitoring.">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 lg:gap-8"
      >
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 xl:gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="dark-card flex items-center gap-6 p-8 bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)]"
            >
              <div className={cn("rounded-lg bg-[var(--surface-3)] p-3 border border-[var(--surface-border)]", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">{stat.name}</p>
                <h3 className="text-3xl font-black tracking-tight text-[var(--foreground)]">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
          {/* Main Column: Briefings */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="dark-card flex flex-col overflow-hidden bg-gradient-to-b from-[var(--surface-1)] to-[var(--surface-2)]">
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] px-8 py-7 bg-[var(--surface-2)]/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-[var(--brand-primary)]">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[var(--foreground)]">Strategic Briefings</h2>
                    <p className="text-xs text-[var(--foreground-muted)]">Upcoming mission-critical coordination sessions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-3)] px-3 py-1.5 shadow-sm">
                  <span className="pulse-dot green" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission Ready</span>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.length === 0 ? (
                  <div className="col-span-full rounded-2xl border-2 border-dashed border-[var(--surface-border)] py-20 text-center bg-[var(--surface-1)]">
                     <Zap className="mx-auto h-12 w-12 text-[var(--foreground-subtle)] opacity-10 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)]">No Active Briefings Detected</p>
                  </div>
                ) : (
                  meetings.map((m: any) => (
                    <div key={m.id} className="group rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-3)]/30 p-6 transition-all hover:border-[var(--brand-primary)] hover:shadow-xl hover:shadow-[rgba(99,102,241,0.1)]">
                       <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-[var(--surface-3)] text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors border border-[var(--surface-border)]">
                             <Calendar className="h-5 w-5" />
                          </div>
                          <span className="badge badge-violet text-[9px] font-black uppercase tracking-widest px-3">{new Date(m.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                       </div>
                       <div>
                          <h5 className="text-sm font-black text-[var(--foreground)] leading-tight mb-2">{m.title}</h5>
                          <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 italic mb-6 leading-relaxed">"{m.description}"</p>
                       </div>
                       <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--surface-border)]">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">
                             <Timer className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                             {new Date(m.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <a 
                            href={m.meet_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-[rgba(99,102,241,0.2)] hover:scale-105 active:scale-95 transition-all"
                          >
                             Connect <ChevronRight className="h-3 w-3" />
                          </a>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Protocols & Status */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="dark-card overflow-hidden bg-gradient-to-b from-[var(--surface-1)] to-[var(--surface-2)]">
               <div className="flex items-center justify-between border-b border-[var(--surface-border)] p-8 bg-[var(--surface-2)]/50 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                     <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border",
                        attendance?.status === 'present' ? "bg-[rgba(16,185,129,0.1)] text-[var(--status-success)] border-[rgba(16,185,129,0.1)]" :
                        attendance?.status === 'absent' ? "bg-[rgba(239,68,68,0.1)] text-[var(--status-danger)] border-[rgba(239,68,68,0.1)]" :
                        "bg-[var(--surface-3)] text-[var(--foreground-muted)] border-[var(--surface-border)]"
                     )}>
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-[var(--foreground)] tracking-tight">Deployment</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission Status</p>
                     </div>
                  </div>
                  <span className={cn(
                     "badge text-[9px] py-1 font-black uppercase tracking-widest px-3 rounded-md border",
                     attendance?.status === 'present' ? "bg-[rgba(16,185,129,0.1)] text-[var(--status-success)]" :
                     attendance?.status === 'absent' ? "bg-[rgba(239,68,68,0.1)] text-[var(--status-danger)]" :
                     "bg-[var(--surface-3)] text-[var(--foreground-muted)]"
                  )}>
                     {attendance?.status || 'Active Sync'}
                  </span>
               </div>
               <div className="p-8 space-y-6">
                  <p className="text-[10px] font-medium text-[var(--foreground-muted)] leading-relaxed italic">
                     {attendance?.status === 'present' ? "Deployment verified. Operational logs active." : 
                      attendance?.status === 'absent' ? "Strategic Absence: Authorization required." :
                      "Systems operational. Waiting for mission log initiation."}
                  </p>
                  
                  <AttendanceActions initialAttendance={attendance} />
               </div>
            </div>

            <div className="dark-card flex flex-col overflow-hidden bg-gradient-to-b from-[var(--surface-1)] to-[var(--surface-2)]">
              <div className="flex items-center gap-4 border-b border-[var(--surface-border)] p-8 bg-[var(--surface-2)]/50 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--brand-accent)] border border-[var(--surface-border)]">
                  <ListTodo className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--foreground)] tracking-tight">Active Protocols</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">{activeTasksCount} Assignments</p>
                </div>
              </div>
              <div className="space-y-4 p-8">
                {tasks.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-[var(--surface-border)] py-10 text-center bg-[var(--surface-1)]">
                    <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-[var(--status-success)] opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Directives Complete</p>
                  </div>
                ) : (
                  tasks.filter(t => t.status !== 'completed').map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-3)]/30 p-4 transition-all hover:bg-[var(--surface-3)] hover:border-[var(--brand-accent-dim)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                          task.priority === "urgent" ? "bg-[rgba(239,68,68,0.1)] text-[var(--status-danger)]" : "bg-[var(--surface-3)] text-[var(--foreground-subtle)]"
                        )}>
                          {task.priority === "urgent" ? <Shield className="h-4.5 w-4.5" /> : <Briefcase className="h-4.5 w-4.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[var(--foreground)] leading-tight">{task.title}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--foreground-muted)] mt-1">{task.priority}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)] group-hover:text-[var(--brand-accent)] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}