import React from "react";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { LeaveRequestForm } from "@/components/employee/LeaveRequestForm";
import { ClipboardList, History, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RequestLeavePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch Personal Leave History
  const { data: leaves } = await supabase
    .from("leaves")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const pendingLeaves = leaves?.filter(l => l.status === 'pending') || [];
  const historyLeaves = leaves?.filter(l => l.status !== 'pending') || [];

  return (
    <Container 
      title="Request Strategic Absence" 
      subtitle="Personnel Lifecycle • Leave Authorization Registry"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Request Form */}
        <div className="lg:col-span-4">
           <div className="dark-card h-fit overflow-hidden sticky top-6">
              <div className="border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
                 <h4 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">
                    <ClipboardList className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    New Authorization Request
                 </h4>
              </div>
              <div className="p-6">
                 <LeaveRequestForm />
              </div>
           </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           {/* Pending Requests */}
           {pendingLeaves.length > 0 && (
              <div className="dark-card overflow-hidden">
                 <div className="flex items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
                    <Clock className="h-4 w-4 text-[var(--status-warning)] animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">Pending Intakes</h4>
                 </div>
                 <div className="divide-y divide-[var(--surface-border)]">
                    {pendingLeaves.map(leave => (
                       <LeaveHistoryItem key={leave.id} leave={leave} />
                    ))}
                 </div>
              </div>
           )}

           {/* History */}
           <div className="dark-card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
                 <History className="h-4 w-4 text-[var(--brand-primary)]" />
                 <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">Authorization History</h4>
              </div>
              <div className="divide-y divide-[var(--surface-border)]">
                 {historyLeaves.length === 0 && (
                    <div className="py-20 text-center">
                       <p className="text-xs text-[var(--foreground-muted)]">No previous authorization records detected.</p>
                    </div>
                 )}
                 {historyLeaves.map(leave => (
                    <LeaveHistoryItem key={leave.id} leave={leave} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </Container>
  );
}

function LeaveHistoryItem({ leave }: { leave: any }) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-[var(--surface-2)] transition-colors">
       <div className="flex items-start gap-4">
          <div className={cn(
             "flex h-10 w-10 flex-none items-center justify-center rounded-lg border",
             leave.status === 'approved' ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[var(--status-success)]" :
             leave.status === 'rejected' ? "bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] text-[var(--status-danger)]" :
             "bg-[var(--surface-2)] border-[var(--surface-border)] text-[var(--foreground-subtle)]"
          )}>
             {leave.status === 'approved' ? <CheckCircle2 className="h-5 w-5" /> : 
              leave.status === 'rejected' ? <XCircle className="h-5 w-5" /> : 
              <Clock className="h-5 w-5" />}
          </div>
          <div>
             <h5 className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)]">
                {leave.type} Absence
             </h5>
             <p className="mt-0.5 text-sm font-bold text-[var(--foreground)]">
                {format(new Date(leave.start_date), "MMM dd")} — {format(new Date(leave.end_date), "MMM dd, yyyy")}
             </p>
             <p className="mt-1 text-xs text-[var(--foreground-muted)] line-clamp-1 italic">
                "{leave.reason}"
             </p>
          </div>
       </div>
       <span className={cn(
          "badge text-[9px] font-bold uppercase",
          leave.status === 'approved' ? "badge-green" :
          leave.status === 'rejected' ? "badge-red" : "badge-violet"
       )}>
          {leave.status}
       </span>
    </div>
  );
}
