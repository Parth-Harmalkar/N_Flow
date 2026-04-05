import React from "react";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/utils/supabase/server";
import { LeaveApprovalTable } from "@/components/admin/LeaveApprovalTable";
import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeavesPage() {
  const supabase = await createClient();

  // 1. Fetch Leaves with Profile Info
  const { data: leaves } = await supabase
    .from("leaves")
    .select("*, profiles(name, employee_id)")
    .order("created_at", { ascending: false });

  const pendingCount = leaves?.filter(l => l.status === 'pending').length || 0;
  const approvedCount = leaves?.filter(l => l.status === 'approved').length || 0;
  const rejectedCount = leaves?.filter(l => l.status === 'rejected').length || 0;

  return (
    <Container 
      title="Strategic Leave Registry" 
      subtitle="Operational Workforce Intake • Status Resolution"
    >
      <div className="flex flex-col gap-6">
        {/* Stats Banner */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
           {[
             { label: "Pending Intake", value: pendingCount, icon: Clock, color: "text-[var(--status-warning)]" },
             { label: "Validated Authorizations", value: approvedCount, icon: CheckCircle2, color: "text-[var(--status-success)]" },
             { label: "Strategic Denials", value: rejectedCount, icon: XCircle, color: "text-[var(--status-danger)]" },
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

        {/* Leave Requests List */}
        <div className="dark-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
             <ClipboardList className="h-4 w-4 text-[var(--brand-primary)]" />
             <h4 className="text-sm font-bold text-[var(--foreground)]">Mission Intake Queue</h4>
          </div>
          
          <LeaveApprovalTable leaves={leaves || []} />
        </div>
      </div>
    </Container>
  );
}
