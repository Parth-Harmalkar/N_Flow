"use client";

import React, { useState } from 'react';
import { Shield, Key, Mail, Loader2, ArrowRight } from 'lucide-react';
import { login } from '../auth/actions/login';
import { Panel } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bento-canvas)] p-4 md:p-6">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(30,27,75,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="rounded-[1.75rem] border-[10px] border-[var(--bento-frame)] bg-[var(--bento-tray)] p-4 shadow-inner md:rounded-[2rem] md:border-[12px] md:p-5 [background-image:radial-gradient(rgba(30,27,75,0.06)_1px,transparent_1px)] [background-size:20px_20px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <Panel animate={false} className="min-h-[280px] justify-between bg-brand-primary text-white md:min-h-[420px]">
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-inner">
                  <span className="text-3xl font-black italic text-brand-accent">N</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-4xl">N-FLOW</h1>
                <p className="mt-3 text-[11px] font-black uppercase tracking-[0.35em] text-white/50">
                  Strategic Resource Interface
                </p>
              </div>
              <p className="max-w-sm text-sm font-medium leading-relaxed text-white/60">
                Modular workspace for operations, risk, and personnel — structured like clear tiles, not a single floating card.
              </p>
            </Panel>

            <Panel animate={false} className="justify-center">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="border-b border-slate-100 pb-6 text-center">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                    Secure Authentication
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Corporate ID
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-brand-accent" />
                    <input
                      required
                      type="email"
                      placeholder="name@organization.com"
                      className="w-full rounded-xl border border-surface-border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-brand-accent/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Gateway Key
                  </label>
                  <div className="group relative">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-brand-accent" />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-surface-border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-brand-accent/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600"
                  >
                    <Shield className="h-4 w-4 shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
                  </motion.div>
                )}

                <button
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-brand-primary py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-primary/95 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Establish Connection
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </Panel>
          </div>
        </div>

        <div className="mt-8 flex justify-between px-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Encrypted Session
          </p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            v2.0.4-Stable
          </p>
        </div>
      </motion.div>
    </div>
  );
}
