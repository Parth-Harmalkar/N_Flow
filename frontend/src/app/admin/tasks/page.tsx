"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, ListTodo, Calendar, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { getTasks } from '../actions/tasks';
import { CreateTaskModal } from '@/components/admin/CreateTaskModal';
import { Container } from '@/components/ui/Container';
import { Panel } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const priorityColors = {
  low: 'text-blue-600 bg-blue-50 border-blue-100',
  medium: 'text-brand-highlight bg-purple-50 border-purple-100',
  high: 'text-orange-600 bg-orange-50 border-orange-100',
  urgent: 'text-red-600 bg-red-50 border-red-100',
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pipeline = total - completed;
    return { total, completed, pipeline };
  }, [tasks]);

  return (
    <Container
      title="Strategic Task Control"
      subtitle="Oversee mission-critical deliverables and project velocity."
      actions={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center rounded-2xl bg-slate-100/80 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-xl p-2 transition-all',
                viewMode === 'grid' ? 'bg-white text-brand-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-xl p-2 transition-all',
                viewMode === 'list' ? 'bg-white text-brand-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-sm font-black text-brand-primary shadow-[0_12px_32px_-8px_rgba(245,158,11,0.45)] transition-all hover:opacity-95"
          >
            <Plus className="h-5 w-5 shrink-0" />
            Assign Initiative
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          { label: 'Total initiatives', value: loading ? '—' : summary.total, sub: 'In registry' },
          { label: 'In pipeline', value: loading ? '—' : summary.pipeline, sub: 'Active or pending' },
          { label: 'Completed', value: loading ? '—' : summary.completed, sub: 'Closed out' },
        ].map((s, i) => (
          <Panel key={i} className="justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-brand-primary md:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">{s.sub}</p>
          </Panel>
        ))}
      </div>

      <Panel noPadding className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
          <div className="relative min-w-0 w-full flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search strategy components..."
              className="w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-inner transition-all placeholder:text-slate-400 focus:border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/15"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-black text-slate-500 transition-colors hover:text-brand-primary"
            >
              <Filter className="h-5 w-5 shrink-0 text-slate-400" />
              Pipeline filter
            </button>
          </div>
        </div>
      </Panel>

      <div
        className={cn(
          'grid gap-4 md:gap-5',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        )}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[var(--radius-premium)] bg-white shadow-[var(--shadow-soft-xl)]"
            />
          ))
        ) : filteredTasks.length === 0 ? (
          <Panel gridClassName="col-span-full w-full" className="py-14 text-center md:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
              <ListTodo className="h-9 w-9 text-slate-300" />
            </div>
            <h4 className="text-xl font-black text-brand-primary md:text-2xl">Queue exhausted</h4>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              No active tasks currently require administrative oversight. Assign a new initiative or adjust search.
            </p>
          </Panel>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.4) }}
              className="min-w-0"
            >
              <Panel className="flex h-full min-h-0 flex-col border border-slate-100">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      'shrink-0 rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest',
                      priorityColors[task.priority as keyof typeof priorityColors] ||
                        'border-slate-100 bg-slate-50 text-slate-500'
                    )}
                  >
                    {String(task.priority || 'medium').toUpperCase()}
                  </span>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-50 hover:text-brand-primary"
                    aria-label="More"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="mb-2 text-lg font-black leading-tight text-brand-primary md:text-xl">
                  {task.title}
                </h3>
                <p className="mb-8 line-clamp-3 flex-1 text-sm font-medium leading-relaxed text-slate-500">
                  {task.description || 'No description provided.'}
                </p>

                <div className="mt-auto flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary font-black italic text-brand-accent shadow-md">
                      {task.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-brand-primary">
                        {task.profiles?.name || 'Unassigned'}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-tight text-slate-400">
                        ID: {task.profiles?.employee_id || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </div>
                    {task.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-700">
                        <Clock className="h-3 w-3" />
                        In pipeline
                      </span>
                    )}
                  </div>
                </div>
              </Panel>
            </motion.div>
          ))
        )}
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTasks}
      />
    </Container>
  );
}
