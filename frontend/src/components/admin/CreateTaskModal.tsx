'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, AlertCircle, Loader2 } from 'lucide-react';
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
    assigned_to: ''
  });

  useEffect(() => {
    if (isOpen) {
      getEmployees().then(setEmployees).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask(formData);
      onSuccess();
      onClose();
      setFormData({
        title: '',
        description: '',
        deadline: '',
        priority: 'medium',
        assigned_to: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-slate-100"
          >
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <Plus className="w-6 h-6 text-brand-purple" />
                Assign Mission
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Task Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Critical Infrastructure Update"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all placeholder:text-slate-300 font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Operational Objective
                </label>
                <textarea
                  required
                  placeholder="Detail the mission requirements..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all placeholder:text-slate-300 min-h-[120px] resize-none font-medium"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all block font-bold"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Priority
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all appearance-none font-bold"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  >
                    <option value="low">Standard</option>
                    <option value="medium">Medium</option>
                    <option value="high">High Velocity</option>
                    <option value="urgent">Critical Path</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Resource Assignment
                </label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all appearance-none font-bold"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                >
                  <option value="">Select Personnel</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-purple text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-brand-purple/10 hover:bg-brand-accent hover:shadow-brand-purple/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Deploy Mission
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
