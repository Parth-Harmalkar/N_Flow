'use client';

import React, { useState } from 'react';
import { createMeeting } from '@/app/admin/actions/workforce';
import { Video, Calendar, Users, Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeetingSchedulerProps {
  profiles: any[];
}

export const MeetingScheduler = ({ profiles }: MeetingSchedulerProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createMeeting({
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      meet_link: meetLink,
      attendees: selectedAttendees
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setMeetLink('');
      setSelectedAttendees([]);
      alert('Strategic Briefing Scheduled Successfully.');
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const toggleAttendee = (id: string) => {
    setSelectedAttendees(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Briefing Title</label>
        <input 
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Mission Critical Intel Sync"
          className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission Objective</label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Strategic deployment and identity-resolution briefing..."
          className="w-full h-20 bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
         <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Activation Time</label>
            <input 
               required
               type="datetime-local"
               value={startTime}
               onChange={e => setStartTime(e.target.value)}
               className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] transition-all"
            />
         </div>
         <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Deactivation Time</label>
            <input 
               required
               type="datetime-local"
               value={endTime}
               onChange={e => setEndTime(e.target.value)}
               className="w-full bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] transition-all"
            />
         </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission Link (Meet/Zoom)</label>
        <div className="relative">
           <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
           <input 
             required
             value={meetLink}
             onChange={e => setMeetLink(e.target.value)}
             placeholder="https://meet.google.com/..."
             className="w-full pl-9 bg-[var(--surface-3)] border border-[var(--surface-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:ring-1 focus:ring-[var(--brand-primary)] outline-none"
           />
        </div>
      </div>

      <div className="space-y-2">
         <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)] flex items-center justify-between">
            Assign Personnel
            <span className="text-[var(--brand-primary)]">{selectedAttendees.length} Selected</span>
         </label>
         <div className="max-h-32 overflow-y-auto rounded-lg border border-[var(--surface-border)] bg-[var(--surface-3)] divide-y divide-[var(--surface-border)] custom-scrollbar">
            {profiles.map(p => (
               <div 
                  key={p.id} 
                  onClick={() => toggleAttendee(p.id)}
                  className="flex items-center justify-between px-3 py-2 hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
               >
                  <span className="text-[11px] font-bold text-[var(--foreground)]">{p.name}</span>
                  {selectedAttendees.includes(p.id) ? (
                     <Check className="h-3.5 w-3.5 text-[var(--status-success)]" />
                  ) : (
                     <Plus className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
                  )}
               </div>
            ))}
         </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-xl bg-[var(--brand-primary)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--brand-accent)] shadow-lg shadow-[rgba(99,102,241,0.2)] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Initialize Strategic Session
      </button>
    </form>
  );
};
