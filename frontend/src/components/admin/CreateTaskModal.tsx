'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Loader2 } from 'lucide-react';
import { createTask, getEmployees, TaskPriority } from '@/app/admin/actions/tasks';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as TaskPriority,
    assigned_to: '',
  });

  useEffect(() => {
    if (isOpen) getEmployees().then(setEmployees).catch(console.error);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask(formData);
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', deadline: '', priority: 'medium', assigned_to: '' });
    } catch {
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)] mb-1.5';
  const fieldClass = 'dark-input w-full py-2.5 px-4 text-sm';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-4">
              <h2 className="flex items-center gap-2.5 font-bold text-[var(--foreground)]">
                <Plus className="h-5 w-5 text-[var(--brand-primary)]" />
                Assign Mission
              </h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--foreground-subtle)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className={labelClass}>Task Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Critical Infrastructure Update"
                  className={fieldClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Operational Objective</label>
                <textarea
                  required
                  placeholder="Detail the mission requirements..."
                  className={fieldClass + ' min-h-[100px] resize-none'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Deadline</label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
                    <input
                      required
                      type="date"
                      className={fieldClass + ' pl-10'}
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    className={fieldClass + ' appearance-none'}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Assign to</label>
                <select
                  required
                  className={fieldClass + ' appearance-none'}
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                >
                  <option value="">Select Personnel</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Deploy Mission</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}