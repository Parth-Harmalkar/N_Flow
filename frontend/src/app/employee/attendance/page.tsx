import React from "react";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { MissionCalendar } from "@/components/shared/MissionCalendar";
import { Calendar, UserCheck, AlertTriangle, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch User Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  // 2. Fetch Personal Data (Only if not admin)
  let attendance = [];
  let meetings = [];
  let tasks = [];
  if (!isAdmin) {
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    attendance = attendanceData || [];

    const { data: meetingsData } = await supabase
      .from('meeting_attendees')
      .select(`
        meetings (*)
      `)
      .eq('user_id', user.id);
    
    meetings = (meetingsData as any)?.map((m: any) => m.meetings).filter(Boolean) || [];

    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_to", user.id)
      .not("deadline", "is", null);
    tasks = tasksData || [];
  }

  const presentCount = attendance?.filter((a: any) => a.status === 'present').length || 0;
  const lopCount = attendance?.filter((a: any) => a.status === 'lop').length || 0;

  return (
    <Container 
      title="My Attendance" 
      subtitle={isAdmin ? "Administrative Operational Overlook" : "Operational Lifecycle Tracking • Mission Logs Resolution"}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 md:gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="dark-card p-6">
              <h4 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)] mb-6">
                 <Clock className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                 Operational Status
              </h4>
              <div className="space-y-4">
                 {isAdmin ? (
                    <div className="p-6 rounded-xl border border-[var(--brand-primary-dim)] bg-[var(--brand-primary-dim)]">
                       <p className="text-xs font-bold text-[var(--brand-primary)] uppercase leading-relaxed text-center">
                          Administrative identities are excluded from strategic lifecycle tracking.
                       </p>
                    </div>
                 ) : (
                    <>
                       <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--surface-border)]">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-lg bg-[var(--status-success-dim)] flex items-center justify-center text-[var(--status-success)]">
                                <UserCheck className="h-4 w-4" />
                             </div>
                             <span className="text-xs font-bold text-[var(--foreground)]">Active Presence</span>
                          </div>
                          <span className="text-lg font-black text-[var(--foreground)]">{presentCount}</span>
                       </div>
                       <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--surface-border)]">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-lg bg-[var(--status-danger-dim)] flex items-center justify-center text-[var(--status-danger)]">
                                <AlertTriangle className="h-4 w-4" />
                             </div>
                             <span className="text-xs font-bold text-[var(--foreground)]">Loss of Pay</span>
                          </div>
                          <span className="text-lg font-black text-[var(--foreground)]">{lopCount}</span>
                       </div>
                    </>
                 )}
              </div>
              {!isAdmin && (
                <div className="mt-8 p-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.05)]">
                   <p className="text-[10px] text-[var(--status-danger)] font-bold uppercase leading-relaxed">
                      Note: Missing daily mission logs result in automatic LOP registration. Ensure all sorties are logged.
                   </p>
                </div>
              )}
           </div>
        </div>

        {/* Calendar Column */}
        <div className="lg:col-span-8">
           <div className="dark-card p-6 min-h-[500px]">
              <div className="flex items-center gap-3 mb-8">
                 <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
                 <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">Mission Calendar</h4>
              </div>
              <MissionCalendar 
                attendance={attendance || []} 
                meetings={meetings || []}
                tasks={tasks || []}
                isAdmin={false}
              />
           </div>
        </div>
      </div>
    </Container>
  );
}
