'use client';

import React, { useState } from 'react';
import { requestLeave } from '@/app/admin/actions/workforce';
import { ClipboardList, Calendar, CheckCircle2, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LeaveRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await requestLeave({
      type,
      start_date: startDate,
      end_date: endDate,
      reason
    });

    if (result.success) {
      setSuccess(true);
      setType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-[var(--status-success-dim)] p-4 text-[var(--status-success)] border border-[rgba(34,197,94,0.2)] animate-in fade-in slide-in-from-top-4">
           <CheckCircle2 className="h-5 w-5" />
           <p className="text-xs font-bold uppercase tracking-tight">Mission Authorization Request Transmitted.</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Absence Category</label>
        <select 
          required
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2.5 text-xs text-[var(--foreground)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none appearance-none"
        >
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="earned">Earned Leave</option>
          <option value="other">Other Absence</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Start Deployment</label>
            <input 
               required
               type="date"
               value={startDate}
               onChange={e => setStartDate(e.target.value)}
               className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] transition-all"
            />
         </div>
         <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">End Deployment</label>
            <input 
               required
               type="date"
               value={endDate}
               onChange={e => setEndDate(e.target.value)}
               className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] transition-all"
            />
         </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Justification / Intelligence</label>
        <textarea 
          required
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Strategic reasons for absence..."
          className="w-full h-32 bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2.5 text-xs text-[var(--foreground)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none resize-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-xl bg-[var(--brand-primary)] py-3.5 text-xs font-extrabold text-white transition-all hover:bg-[var(--brand-accent)] shadow-lg shadow-[rgba(99,102,241,0.2)] disabled:opacity-50 group active:scale-[0.98]"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
        Transmit Intake Token
      </button>

      <p className="mt-2 text-[9px] text-center text-[var(--foreground-muted)] font-medium leading-relaxed">
         Requests are subject to strategic validation by Administrative Command. Maintain operational awareness.
      </p>
    </form>
  );
};
