import React from "react";
import { Container } from "@/components/ui/Container";
import { getEmployeeDetailMetrics } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { EmployeeAttendanceGrid } from "@/components/admin/EmployeeAttendanceGrid";
import { LogAuditTrail } from "@/components/admin/LogAuditTrail";
import { PersonalPerformanceChart } from "@/components/analytics/PersonalPerformanceChart";
import { PersonnelActions } from "@/components/admin/PersonnelActions";
import { TaskItemActions } from "@/components/admin/TaskItemActions";
import { Briefcase, Clock, Calendar, CheckCircle2, AlertTriangle, FileText, Zap, TrendingUp, ShieldAlert, History } from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EmployeeDetailPage({ params }: any) {
  const { id } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Fetch Profile and Auth User
  const [
    { data: profile },
    authResponse
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    adminClient.auth.admin.getUserById(id)
  ]);

  const authUser = authResponse?.data?.user;

  if (!profile) {
    return (
      <Container title="User Not Found">
        <p className="text-[var(--foreground-muted)]">No personnel matches this identifier.</p>
      </Container>
    );
  }

  // 2. Fetch Metrics
  const { logs, tasks, attendance, meetings } = await getEmployeeDetailMetrics(id);

  // 3. Simple stats
  const totalHours = logs.reduce((acc, l) => {
    const s = new Date(l.start_time).getTime();
    const e = new Date(l.end_time).getTime();
    return acc + (e - s) / (1000 * 60 * 60);
  }, 0);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  // 4. Calculate 7-day trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayHours = logs
      .filter(l => l.created_at.startsWith(dateStr))
      .reduce((acc, l) => {
        const s = new Date(l.start_time).getTime();
        const e = new Date(l.end_time).getTime();
        return acc + (e - s) / (1000 * 60 * 60);
      }, 0);

    return { date: dayName, hours: Math.round(dayHours * 10) / 10 };
  });

  return (
    <Container 
      title={profile.name} 
      subtitle={`Personnel ID: ${profile.employee_id} • ${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 md:gap-8"
      >
        {/* Left Column: Stats & Analysis */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Aggregate Hours", value: `${Math.round(totalHours * 10) / 10}h`, icon: Clock, color: "text-[var(--brand-accent)]" },
              { label: "Completed Output", value: completedTasks, icon: CheckCircle2, color: "text-[var(--status-success)]" },
              { label: "Pending Workflow", value: pendingTasks, icon: AlertTriangle, color: "text-[var(--status-warning)]" },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="dark-card p-5 bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)]"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg bg-[var(--surface-3)] p-2.5 border border-[var(--surface-border)]", s.color)}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[var(--foreground)]">{s.value}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">{s.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="dark-card overflow-hidden">
             <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-2.5">
                   <TrendingUp className="h-4 w-4 text-[var(--brand-primary)]" />
                   <h4 className="text-sm font-bold text-[var(--foreground)] tracking-tight">Daily Performance Velocity</h4>
                </div>
                <div className="flex items-center gap-2">
                   <span className="badge badge-green text-[9px]">+12% vs last week</span>
                </div>
             </div>
             <div className="p-6">
                <PersonalPerformanceChart data={last7Days} />
             </div>
          </div>

          {/* Attendance History */}
          <EmployeeAttendanceGrid attendance={attendance} employeeName={profile.name} />



          <PersonnelActions 
            userId={id} 
            userName={profile.name} 
            userEmail={authUser?.email || ""}
            userEmployeeId={profile.employee_id || "N/A"}
            userRole={profile.role}
          />
        </div>


        {/* Right Column: Active Assignments */}
        <div className="lg:col-span-4">
          <div className="dark-card flex h-full flex-col bg-gradient-to-b from-[var(--surface-1)] to-[var(--surface-2)]">
            <div className="border-b border-[var(--surface-border)] bg-[var(--surface-2)]/50 backdrop-blur-md px-6 py-5">
              <h4 className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                <Briefcase className="h-4 w-4 text-[var(--brand-primary)]" />
                Strategic Assignments
              </h4>
            </div>
            <div className="flex-1 space-y-4 p-6 overflow-y-auto scrollbar-hide">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--foreground-muted)]">
                  No tasks assigned to this personnel.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="group relative rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-4 transition-all hover:border-[var(--brand-primary-dim)] hover:bg-[var(--surface-3)]">
                    <div className="flex items-start justify-between gap-2">
                       <h5 className="text-sm font-bold text-[var(--foreground)]">{task.title}</h5>
                       <div className="flex items-center gap-2">
                         <div className="opacity-0 transition-opacity group-hover:opacity-100">
                           <TaskItemActions taskId={task.id} status={task.status} />
                         </div>
                         <span className={cn(
                           "h-2.5 w-2.5 rounded-full shrink-0 flex-none",
                           task.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 
                           task.priority === 'high' ? 'bg-orange-400' : 'bg-blue-400'
                         )} />
                       </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={cn(
                        "badge text-[9px] py-0.5 font-bold tracking-tight",
                        task.status === 'completed' ? 'badge-green' : 'badge-violet'
                      )}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[var(--foreground-muted)] flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
