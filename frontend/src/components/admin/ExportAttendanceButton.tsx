'use client';

import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportAttendanceToCSV } from '@/utils/export';
import { cn } from '@/lib/utils';

interface ExportAttendanceButtonProps {
  attendance: any[];
  employeeName: string;
}

export const ExportAttendanceButton = ({ attendance, employeeName }: ExportAttendanceButtonProps) => {
  const [loading, setLoading] = React.useState(false);

  const handleExport = () => {
    setLoading(true);
    try {
      exportAttendanceToCSV(attendance, employeeName);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || !attendance || attendance.length === 0}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-[var(--surface-3)] border border-[var(--surface-border)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] hover:bg-[var(--surface-border)] hover:text-[var(--brand-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        loading && "animate-pulse"
      )}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Export Lifecycle Logs
    </button>
  );
};
