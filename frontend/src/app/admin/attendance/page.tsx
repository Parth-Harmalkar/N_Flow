import React from "react";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { AttendanceTable } from "@/components/admin/AttendanceTable";
import { SyncAttendanceButton } from "@/components/admin/SyncAttendanceButton";
import { DateSelector } from "@/components/admin/DateSelector";
import { Calendar, Users, Briefcase, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AttendancePage({ searchParams }: any) {
  const supabase = await createClient();
  const { date } = await searchParams;
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  const dateStr = date || today;

  // 1. Fetch Profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, employee_id, role")
    .neq("role", "admin")
    .order("name");

  // 2. Fetch Attendance for the selected date
  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", dateStr);

  // 3. Fetch Leaves for the selected date
  const { data: leaves } = await supabase
    .from("leaves")
    .select("*")
    .lte("start_date", dateStr)
    .gte("end_date", dateStr)
    .eq("status", "approved");

  const totalPersonnel = profiles?.length || 0;
  const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
  const absentCount = attendance?.filter(a => a.status === 'absent').length || 0;
  const leaveCount = leaves?.length || 0;

  return (
    <Container 
      title="Attendance Registry" 
      subtitle={`Strategic Lifecycle Tracking • ${format(new Date(dateStr), "MMMM dd, yyyy")}`}
    >
      <div className="flex flex-col gap-6">
        {/* Date Selector & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] p-1.5 border border-[var(--surface-border)]">
              <a 
                href={`?date=${yesterday}`}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                  dateStr === yesterday ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[rgba(99,102,241,0.2)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                Yesterday
              </a>
              <a 
                href={`?date=${today}`}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                  dateStr === today ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[rgba(99,102,241,0.2)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                Today
              </a>
              <DateSelector dateStr={dateStr} />
           </div>
           
           <SyncAttendanceButton dateStr={dateStr} />
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
           {[
             { label: "Total Fleet", value: totalPersonnel, icon: Users, color: "text-[var(--brand-primary)]" },
             { label: "Active Presence", value: presentCount, icon: Briefcase, color: "text-[var(--status-success)]" },
             { label: "Strategic Absences", value: absentCount, icon: AlertCircle, color: "text-[var(--status-danger)]" },
             { label: "Approved Leave", value: leaveCount, icon: Calendar, color: "text-[var(--brand-accent)]" },
           ].map((s, i) => (
             <div key={i} className="dark-card p-5">
               <div className="flex items-center gap-3">
                 <div className="rounded-lg bg-[var(--surface-2)] p-2.5">
                   <s.icon className={`h-5 w-5 ${s.color}`} />
                 </div>
                 <div>
                   <h4 className="text-xl font-black text-[var(--foreground)]">{s.value}</h4>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">{s.label}</p>
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Attendance Controls & List */}
        <div className="dark-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--surface-3)]">
                   <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-[var(--foreground)]">Personnel Command Grid</h4>
                   <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter">Real-time status synchronization</p>
                </div>
             </div>
          </div>
          
          <AttendanceTable 
            profiles={profiles || []} 
            attendance={attendance || []} 
            leaves={leaves || []}
            dateStr={dateStr}
          />
        </div>
      </div>
    </Container>
  );
}
