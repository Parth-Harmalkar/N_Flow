"use client";

import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, Calendar as CalendarIcon, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MissionEvent {
  id: string;
  title: string;
  type: 'briefing' | 'deadline';
  date: Date;
  priority?: string;
}

interface MissionCalendarProps {
  attendance?: any[];
  meetings?: any[];
  tasks?: any[];
  isAdmin?: boolean;
}

export const MissionCalendar = ({ attendance = [], meetings = [], tasks = [], isAdmin = false }: MissionCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const getAttendanceStatus = (day: Date) => {
    const record = attendance?.find(a => isSameDay(new Date(a.date), day));
    return record?.status || null;
  };

  const getDayEvents = (day: Date): MissionEvent[] => {
    const dayMeetings = (meetings || [])
      .filter(m => isSameDay(new Date(m.start_time), day))
      .map(m => ({ id: m.id, title: m.title, type: 'briefing' as const, date: new Date(m.start_time) }));
    
    const dayTasks = (tasks || [])
      .filter(t => t.deadline && isSameDay(new Date(t.deadline), day))
      .map(t => ({ id: t.id, title: t.title, type: 'deadline' as const, date: new Date(t.deadline), priority: t.priority }));
    
    return [...dayMeetings, ...dayTasks];
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleEventClick = (event: MissionEvent) => {
    if (event.type === 'briefing') {
      router.push(isAdmin ? '/admin/meetings' : '/employee/dashboard');
    } else {
      router.push(isAdmin ? '/admin/tasks' : '/employee/tasks');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--foreground)]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--surface-border)] hover:bg-[var(--surface-3)] transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--surface-border)] hover:bg-[var(--surface-3)] transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] text-center pb-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const status = getAttendanceStatus(day);
          const events = getDayEvents(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={i} 
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-[var(--surface-border)] transition-all group",
                !isCurrentMonth ? "opacity-20 bg-[var(--surface-1)]" : "bg-[var(--surface-2)] hover:border-[var(--brand-primary)]",
                isToday && "ring-2 ring-[var(--brand-primary)] shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-[var(--brand-primary-dim)]"
              )}
            >
               <span className={cn(
                 "text-[10px] font-black text-[var(--foreground-muted)] mb-1 group-hover:text-[var(--foreground)] transition-colors",
                 isToday && "text-[var(--brand-primary)]"
               )}>
                  {format(day, 'd')}
               </span>
               
               <div className="flex items-center justify-center gap-1 flex-wrap px-1">
                  {status && (
                    <>
                       {status === 'present' && <Check className="h-2.5 w-2.5 text-[var(--status-success)]" />}
                       {status === 'absent' && <X className="h-2.5 w-2.5 text-[var(--status-danger)]" />}
                       {status === 'lop' && <AlertTriangle className="h-2.5 w-2.5 text-[var(--status-danger)] animate-pulse" />}
                       {status === 'leave' && <CalendarIcon className="h-2.5 w-2.5 text-[var(--brand-primary)]" />}
                    </>
                  )}
                  {events.map((event, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                         e.stopPropagation();
                         handleEventClick(event);
                      }}
                      title={`${event.type.toUpperCase()}: ${event.title}`}
                      className="hover:scale-125 transition-transform"
                    >
                      {event.type === 'briefing' ? (
                        <Zap className="h-2.5 w-2.5 text-[var(--brand-accent)] fill-[var(--brand-accent)] transition-colors" />
                      ) : (
                        <AlertCircle className={cn(
                          "h-2.5 w-2.5",
                          event.priority === 'urgent' ? "text-[var(--status-danger)]" : "text-[var(--brand-primary)]"
                        )} />
                      )}
                    </button>
                  ))}
               </div>

               {status === 'lop' && (
                  <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--status-danger)]" />
               )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-[var(--surface-border)] grid grid-cols-2 sm:grid-cols-4 gap-4">
         {[
           { label: 'Operational (Present)', icon: Check, color: 'text-[var(--status-success)]' },
           { label: 'Strategic LOP', icon: AlertTriangle, color: 'text-[var(--status-danger)]' },
           { label: 'Briefing (Meeting)', icon: Zap, color: 'text-[var(--brand-accent)]' },
           { label: 'Misson Deadline', icon: AlertCircle, color: 'text-[var(--brand-primary)]' },
         ].map((l, i) => (
           <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">
              <l.icon className={cn("h-3 w-3", l.color)} />
              {l.label}
           </div>
         ))}
      </div>
    </div>
  );
};
