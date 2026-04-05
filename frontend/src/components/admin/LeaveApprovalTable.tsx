'use client';

import React, { useState } from 'react';
import { updateLeaveStatus } from '@/app/admin/actions/workforce';
import { Check, X, Calendar, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface LeaveApprovalTableProps {
  leaves: any[];
}

export const LeaveApprovalTable = ({ leaves }: LeaveApprovalTableProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (leaveId: string, status: 'approved' | 'rejected') => {
    setLoading(leaveId);
    const result = await updateLeaveStatus(leaveId, status);
    if (result.error) {
      alert(result.error);
    }
    setLoading(null);
  };

  if (leaves.length === 0) {
    return (
      <div className="py-20 text-center">
        <ClipboardList className="mx-auto h-12 w-12 text-[var(--surface-border)]" />
        <h3 className="mt-4 text-sm font-bold text-[var(--foreground)]">No leave requests found.</h3>
        <p className="text-xs text-[var(--foreground-muted)]">All mission personnel are accounted for.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-1)]">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Personnel</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Interval</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Category / Intel</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Resolution</th>
            <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-1)]">
          {leaves.map((leave) => (
            <tr key={leave.id} className="group hover:bg-[var(--surface-2)] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--brand-primary)]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--foreground)]">{leave.profiles.name}</h5>
                    <p className="text-[10px] text-[var(--foreground-muted)]">{leave.profiles.employee_id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-[var(--foreground)] font-bold tracking-tight">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    <span>{format(new Date(leave.start_date), "MMM dd")} - {format(new Date(leave.end_date), "MMM dd")}</span>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <div>
                    <span className="badge badge-slate text-[9px] py-0.5 font-bold uppercase">{leave.type}</span>
                    <p className="mt-1 text-[10px] text-[var(--foreground-muted)] line-clamp-1 flex items-center gap-1.5">
                       <MessageSquare className="h-3 w-3" /> {leave.reason}
                    </p>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <span className={cn(
                   "badge text-[9px] py-0.5 font-bold uppercase",
                   leave.status === 'approved' ? 'badge-green' : 
                   leave.status === 'rejected' ? 'badge-red' : 'badge-violet'
                 )}>
                   {leave.status}
                 </span>
              </td>
              <td className="px-6 py-4 text-right">
                {leave.status === 'pending' ? (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleUpdate(leave.id, 'approved')}
                      disabled={loading === leave.id}
                      className="rounded-lg bg-[var(--status-success-dim)] p-2 text-[var(--status-success)] hover:bg-[var(--status-success)] hover:text-white transition-all shadow-sm"
                      title="Validate Deployment"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdate(leave.id, 'rejected')}
                      disabled={loading === leave.id}
                      className="rounded-lg bg-[var(--status-danger-dim)] p-2 text-[var(--status-danger)] hover:bg-[var(--status-danger)] hover:text-white transition-all shadow-sm"
                      title="Deny Authorization"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Resolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { ClipboardList } from 'lucide-react';
