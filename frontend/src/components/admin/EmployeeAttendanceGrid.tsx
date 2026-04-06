'use client';

import React from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle, Calendar } from 'lucide-react';
import { ExportAttendanceButton } from './ExportAttendanceButton';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave';
}

interface EmployeeAttendanceGridProps {
  attendance: AttendanceRecord[];
  employeeName?: string;
}

export const EmployeeAttendanceGrid = ({ attendance, employeeName }: EmployeeAttendanceGridProps) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendance.find(a => a.date === dateStr);
    return {
      date,
      dateStr,
      status: record?.status || 'none'
    };
  });

  return (
    <div className="dark-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--surface-3)]">
            <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)] tracking-tight">Deployment History (30D)</h4>
            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter">Strategic Unit Readiness</p>
          </div>
        </div>
        {employeeName && (
          <ExportAttendanceButton attendance={attendance} employeeName={employeeName} />
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {last30Days.map((day, i) => (
            <div 
              key={i} 
              title={`${format(day.date, 'MMMM dd')}: ${day.status.toUpperCase()}`}
              className={cn(
                "relative aspect-square rounded-lg border border-[var(--surface-border)] flex items-center justify-center transition-all group hover:scale-105",
                day.status === 'present' ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)]" :
                day.status === 'absent' ? "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]" :
                day.status === 'leave' ? "bg-[rgba(99,102,241,0.1)] border-[rgba(99,102,241,0.2)]" :
                "bg-[var(--surface-1)] opacity-40"
              )}
            >
              <span className="absolute top-1 left-1.5 text-[8px] font-bold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]">
                {format(day.date, 'd')}
              </span>
              
              {day.status === 'present' && <Check className="h-3 w-3 text-[var(--status-success)]" />}
              {day.status === 'absent' && <X className="h-3 w-3 text-[var(--status-danger)]" />}
              {day.status === 'leave' && <Calendar className="h-3 w-3 text-[var(--brand-primary)]" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-[var(--surface-border)]">
          {[
            { label: 'Operational', color: 'bg-[var(--status-success)]' },
            { label: 'Absent', color: 'bg-[var(--status-danger)]' },
            { label: 'Approved Leave', color: 'bg-[var(--brand-primary)]' },
            { label: 'No Mission Log', color: 'bg-[var(--surface-3)]' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2">
               <div className={cn("h-2 w-2 rounded-full", l.color)} />
               <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
