import React from "react";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { MeetingScheduler } from "@/components/admin/MeetingScheduler";
import { Video, Calendar, Users, ShieldAlert, Clock } from "lucide-react";
import { format } from "date-fns";

import { MissionCalendar } from "@/components/shared/MissionCalendar";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const supabase = await createClient();

  // 1. Fetch Meetings
  const { data: meetings } = await supabase
    .from("meetings")
    .select("*, meeting_attendees(count)")
    .order("start_time", { ascending: true });

  // 2. Fetch Tasks (Deadlines)
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .not("deadline", "is", null);

  // 3. Fetch Profiles for the scheduler
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, employee_id")
    .order("name");

  const upcomingCount = meetings?.filter(m => new Date(m.start_time) > new Date()).length || 0;

  return (
    <Container 
      title="Strategic Briefing Control" 
      subtitle="Mission Coordination • Google Meet Integration"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
           <div className="dark-card h-fit overflow-hidden sticky top-6">
              <div className="border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
                 <h4 className="flex items-center gap-2.5 text-sm font-bold text-[var(--foreground)]">
                    <Video className="h-4 w-4 text-[var(--brand-primary)]" />
                    Initialize Briefing
                 </h4>
              </div>
              <div className="p-6">
                 <MeetingScheduler profiles={profiles || []} />
              </div>
           </div>
        </div>

        {/* Right Column: Command Calendar */}
        <div className="lg:col-span-8">
           <div className="dark-card min-h-[600px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-8 py-6">
                 <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[var(--brand-primary)]" />
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Mission Command Calendar</h4>
                       <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter mt-0.5">Strategic Orientation & Operational Thresholds</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black text-[var(--brand-primary)] uppercase">{upcomingCount} Upcoming Briefings</span>
                       <span className="text-[10px] font-black text-[var(--brand-accent)] uppercase">{tasks?.length || 0} Open Deadlines</span>
                    </div>
                 </div>
              </div>
              
              <div className="p-8 flex-1">
                 <MissionCalendar 
                    meetings={meetings || []} 
                    tasks={tasks || []} 
                    isAdmin={true} 
                 />
              </div>
           </div>
        </div>
      </div>
    </Container>
  );
}

