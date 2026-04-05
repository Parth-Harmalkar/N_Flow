"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Filter, Shield, Briefcase, Mail, Key, MoreVertical, Globe, ShieldCheck } from 'lucide-react';
import { getPersonnel } from '../actions/users';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { Container } from '@/components/ui/Container';
import { Panel } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPersonnel = async () => {
    try {
      const data = await getPersonnel();
      setPersonnel(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const filteredPersonnel = personnel.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container
      title="Personnel Registry"
      subtitle="Identity management and role-based access orchestration."
      actions={
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-brand-accent px-6 py-3 text-sm font-black text-brand-primary shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all hover:opacity-90"
        >
          <UserPlus className="h-5 w-5 shrink-0" />
          Onboard Personnel
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {[
          {
            label: 'Total registry',
            value: personnel.length,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50/80',
          },
          {
            label: 'Privileged access',
            value: personnel.filter((p) => p.role === 'admin').length,
            icon: ShieldCheck,
            color: 'text-brand-highlight',
            bg: 'bg-purple-50/80',
          },
          {
            label: 'Active employees',
            value: personnel.filter((p) => p.role === 'employee').length,
            icon: Briefcase,
            color: 'text-brand-accent',
            bg: 'bg-amber-50/80',
          },
        ].map((stat, i) => (
          <Panel key={i} className="flex items-center gap-4">
            <div className={cn('rounded-xl p-4 shadow-inner', stat.bg, stat.color)}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tight text-brand-primary">
                {loading ? '…' : stat.value}
              </h3>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start md:gap-5">
        <Panel noPadding gridClassName="lg:col-span-8" className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="relative min-w-0 w-full flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search by identity, email or identifier..."
                className="w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium shadow-inner transition-all placeholder:text-slate-400 focus:border-brand-accent/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/15"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4 border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-brand-primary"
              >
                <Filter className="h-5 w-5" />
                Access level
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-brand-primary"
              >
                <Globe className="h-5 w-5" />
                Regional
              </button>
            </div>
          </div>
          <p className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 md:px-6">
            {loading ? 'Loading roster…' : `${filteredPersonnel.length} record(s) match`}
          </p>
        </Panel>

        <Panel gridClassName="lg:col-span-4" className="bg-slate-50/50">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry health</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
            Use search and filters to narrow identities. Cards below update live as you type.
          </p>
          <ul className="mt-4 space-y-2 text-xs font-medium text-slate-500">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Session encryption active
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Role changes audited
            </li>
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-[var(--radius-premium)] bg-white shadow-[var(--shadow-soft-xl)]"
            />
          ))
        ) : filteredPersonnel.length === 0 ? (
          <Panel gridClassName="col-span-full" className="py-14 text-center md:py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner">
              <Users className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-black text-brand-primary">No personnel found</p>
            <p className="mt-1 text-sm text-slate-500">Adjust your search or onboard a new member.</p>
          </Panel>
        ) : (
          filteredPersonnel.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.35) }}
              className="min-w-0"
            >
              <Panel className="flex h-full flex-col border border-slate-100">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-xl font-black italic text-brand-accent shadow-md">
                    {person.name[0]}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-300 hover:bg-slate-50 hover:text-brand-primary"
                      aria-label="Credentials"
                    >
                      <Key className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-300 hover:bg-slate-50 hover:text-brand-primary"
                      aria-label="More"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h3 className="truncate text-lg font-black text-brand-primary">{person.name}</h3>
                <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-sm text-slate-500">
                  <Mail className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  {person.email}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 font-mono text-xs font-bold text-brand-primary">
                    {person.employee_id}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide',
                      person.role === 'admin'
                        ? 'border-purple-100 bg-purple-50 text-brand-highlight'
                        : 'border-blue-100 bg-blue-50 text-blue-600'
                    )}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {person.role}
                  </span>
                </div>
              </Panel>
            </motion.div>
          ))
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPersonnel}
      />
    </Container>
  );
}
