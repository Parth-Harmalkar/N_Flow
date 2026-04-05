'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Mail, Shield, Loader2, Key, Info } from 'lucide-react';
import { createUser } from '@/app/admin/actions/users';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_id: '',
    role: 'employee' as 'admin' | 'employee',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      onSuccess();
      onClose();
      setFormData({
        name: '',
        email: '',
        employee_id: '',
        role: 'employee',
        password: ''
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to provision user.');
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
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-xl bg-white rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-slate-100"
          >
            {/* Header Island */}
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-purple rounded-2xl shadow-lg shadow-brand-purple/20">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Provision Personnel</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Identity Management Suite</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Full Legal Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alexander Pierce"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-bold placeholder:text-slate-300"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Employee ID
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. EMP-2024-001"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-bold placeholder:text-slate-300"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    required
                    type="email"
                    placeholder="a.pierce@company.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-bold placeholder:text-slate-300"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    System Position
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all appearance-none font-bold"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Initial Access Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-black placeholder:text-slate-300"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Notice Island */}
              <div className="bg-slate-50/50 p-6 rounded-3xl flex gap-4 text-slate-500 border border-slate-100/50">
                <Info className="w-6 h-6 text-brand-purple shrink-0 mt-1" />
                <p className="text-xs font-medium leading-relaxed">
                  The user will be able to log in immediately with this access code. They will be required to update their credentials for improved security.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-purple text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl shadow-brand-purple/10 hover:bg-brand-accent hover:shadow-brand-purple/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      Commit to Registry
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
