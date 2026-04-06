"use client";

import React, { useState } from "react";
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
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List as ListIcon, 
  Clock, 
  Zap, 
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

interface MissionEvent {
  id: string;
  title: string;
  type: 'briefing' | 'deadline';
  date: Date;
  start_time?: string;
  description?: string;
  meet_link?: string;
  status?: string;
}

interface MissionCalendarProps {
  attendance?: any[];
  meetings?: any[];
  tasks?: any[];
  isAdmin?: boolean;
}

export const MissionCalendar = ({ attendance = [], meetings = [], tasks = [], isAdmin = false }: MissionCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const getEventsForDate = (day: Date): MissionEvent[] => {
    const dayMeetings = (meetings || [])
      .filter(m => isSameDay(new Date(m.start_time), day))
      .map(m => ({ 
        id: m.id, 
        title: m.title, 
        type: 'briefing' as const, 
        date: new Date(m.start_time),
        start_time: m.start_time,
        description: m.description,
        meet_link: m.meet_link
      }));
    
    const dayTasks = (tasks || [])
      .filter(t => t.deadline && isSameDay(new Date(t.deadline), day))
      .map(t => ({ 
        id: t.id, 
        title: t.title, 
        type: 'deadline' as const, 
        date: new Date(t.deadline),
        start_time: t.deadline,
        description: t.description,
        status: t.status
      }));

    return [...dayMeetings, ...dayTasks].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentDate(dir === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[var(--surface-2)]/40 p-4 rounded-2xl border border-[var(--surface-border)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--surface-3)]/50 p-1.5 rounded-xl border border-[var(--surface-border)]">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1.5 hover:bg-[var(--surface-border)] rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="min-w-[140px] text-center font-bold text-[var(--foreground)] tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-1.5 hover:bg-[var(--surface-border)] rounded-md transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] hover:opacity-80 transition-opacity"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[var(--surface-1)] p-1 rounded-xl border border-[var(--surface-border)] shadow-inner">
          <button 
            onClick={() => setView('grid')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              view === 'grid' 
                ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary-glow)]" 
                : "text-[var(--foreground-muted)] hover:bg-[var(--surface-3)]"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid View
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              view === 'list' 
                ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary-glow)]" 
                : "text-[var(--foreground-muted)] hover:bg-[var(--surface-3)]"
            )}
          >
            <ListIcon className="h-3.5 w-3.5" />
            List View
          </button>
        </div>
      </motion.div>

      {/* Main Viewport */}
      <motion.div 
        key={view}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="dark-card overflow-hidden bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] min-h-[600px]"
      >
        {view === 'grid' ? (
          <>
            <div className="grid grid-cols-7 border-b border-[var(--surface-border)] bg-[var(--surface-2)]/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);

                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "min-h-[140px] p-2 border-r border-b border-[var(--surface-border)] transition-colors hover:bg-[var(--surface-3)]/20",
                      !isCurrentMonth && "bg-[var(--surface-1)]/50 opacity-40",
                      isToday && "bg-[var(--brand-primary-dim)]/5"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all",
                        isToday ? "bg-[var(--brand-primary)] text-white shadow-md shadow-[var(--brand-primary-glow)]" : 
                        attendance.some(a => a.date === format(day, 'yyyy-MM-dd') && a.status === 'present') ? "bg-[var(--status-success-dim)] text-[var(--status-success)]" :
                        !isCurrentMonth ? "text-[var(--foreground-subtle)]" : "text-[var(--foreground)]"
                      )}>
                        {day.getDate()}
                      </span>
                      {attendance.some(a => a.date === format(day, 'yyyy-MM-dd') && a.status === 'present') && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-success)]" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          className={cn(
                            "px-2 py-1.5 rounded-md text-[10px] font-bold border flex items-center gap-1.5 transition-transform hover:scale-[1.02] cursor-default",
                            event.type === 'briefing' 
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-sm" 
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-sm"
                          )}
                        >
                          {event.type === 'briefing' ? <Zap className="h-3 w-3 shrink-0" /> : <Clock className="h-3 w-3 shrink-0" />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              if (dayEvents.length === 0) return null;

              const isToday = isSameDay(day, new Date());

              return (
                <div key={idx} className="flex flex-col p-6 group transition-colors hover:bg-[var(--surface-2)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "flex flex-col items-center justify-center w-14 h-14 rounded-2xl border border-[var(--surface-border)] shadow-sm transition-all group-hover:border-[var(--brand-primary)]",
                      isToday ? "bg-[var(--brand-primary)] border-none text-white shadow-xl shadow-[var(--brand-primary-glow)]" : "bg-[var(--surface-3)]"
                    )}>
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 leading-none mb-1">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xl font-black leading-none italic">
                        {format(day, 'dd')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)]">Strategic Operations Audit</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[var(--foreground-muted)]">{dayEvents.length} Mission Critical Event(s)</p>
                        {attendance.some(a => a.date === format(day, 'yyyy-MM-dd') && a.status === 'present') && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--status-success-dim)] text-[var(--status-success)] text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Present
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dayEvents.map(event => (
                      <motion.div 
                        key={event.id}
                        whileHover={{ x: 5 }}
                        className={cn(
                          "p-4 rounded-xl border transition-all flex items-start gap-4",
                          event.type === 'briefing' 
                            ? "bg-[rgba(245,158,11,0.03)] border-[rgba(245,158,11,0.1)] hover:border-[rgba(245,158,11,0.3)]" 
                            : "bg-[rgba(99,102,241,0.03)] border-[rgba(99,102,241,0.1)] hover:border-[rgba(99,102,241,0.3)]"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-lg shrink-0",
                          event.type === 'briefing' ? "bg-orange-500/10 text-orange-400" : "bg-indigo-500/10 text-indigo-400"
                        )}>
                          {event.type === 'briefing' ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h5 className="font-bold text-sm text-[var(--foreground)] truncate">{event.title}</h5>
                            <span className="text-[10px] font-mono opacity-50 font-black">
                              {event.start_time ? format(new Date(event.start_time), 'hh:mm a') : 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed mb-3">
                            {event.description || 'No additional mission intelligence provided for this assignment.'}
                          </p>
                          
                          {event.type === 'briefing' && event.meet_link && (
                            <a 
                              href={event.meet_link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                            >
                              <Zap className="h-3 w-3" />
                              Access Briefing
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {calendarDays.filter(d => getEventsForDate(d).length > 0).length === 0 && (
              <div className="py-32 text-center">
                 <div className="inline-flex p-5 rounded-3xl bg-[var(--surface-3)] mb-4 border border-[var(--surface-border)]">
                    <Info className="h-8 w-8 text-[var(--foreground-subtle)]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--foreground)]">Void Operations Detected</h3>
                 <p className="text-sm text-[var(--foreground-muted)] mt-2">No strategic events scheduled for this temporal cycle.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
