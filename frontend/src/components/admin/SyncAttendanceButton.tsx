'use client';

import React, { useState } from 'react';
import { syncDailyAttendance } from '@/app/admin/actions/workforce';
import { RefreshCw, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncAttendanceButtonProps {
  dateStr: string;
}

export const SyncAttendanceButton = ({ dateStr }: SyncAttendanceButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    const result = await syncDailyAttendance(dateStr);
    if (result.error) {
      alert(result.error);
    } else {
      alert(`Strategic Sync Complete for ${dateStr}. LOP logic applied.`);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-[var(--brand-primary-dim)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-primary)] transition-all hover:bg-[var(--brand-primary)] hover:text-white border border-[rgba(99,102,241,0.2)] shadow-sm",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
      Sync Daily Tokens
    </button>
  );
};
