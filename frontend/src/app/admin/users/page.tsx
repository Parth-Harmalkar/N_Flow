"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Filter, Shield, Briefcase, Mail, Key, MoreVertical, ShieldCheck } from "lucide-react";
import { getPersonnel } from "../actions/users";
import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => { fetchPersonnel(); }, []);

  const filtered = personnel.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: "Total registry", value: personnel.length, icon: Users, color: "text-[var(--brand-secondary)]" },
    { label: "Privileged access", value: personnel.filter((p) => p.role === "admin").length, icon: ShieldCheck, color: "text-[var(--brand-accent)]" },
    { label: "Active employees", value: personnel.filter((p) => p.role === "employee").length, icon: Briefcase, color: "text-[var(--brand-primary)]" },
  ];

  return (
    <Container
      title="Personnel Registry"
      subtitle="Identity management and role-based access orchestration."
      actions={
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" />
          Onboard Personnel
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="dark-card flex items-center gap-4 p-5">
            <div className={cn("rounded-lg bg-[var(--surface-2)] p-3", s.color)}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)]">{s.label}</p>
              <h3 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                {loading ? "—" : s.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="dark-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
          <input
            type="search"
            placeholder="Search by name, email, or ID..."
            className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--surface-border)] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <button type="button" className="btn-ghost text-xs">
            <Filter className="h-4 w-4" /> Access level
          </button>
        </div>
        <p className="text-xs text-[var(--foreground-subtle)]">
          {loading ? "Loading…" : `${filtered.length} record(s)`}
        </p>
      </div>

      {/* Personnel cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-[var(--surface-1)] border border-[var(--surface-border)]" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full dark-card py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-2)]">
              <Users className="h-7 w-7 text-[var(--foreground-subtle)]" />
            </div>
            <p className="font-bold text-[var(--foreground)]">No personnel found</p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">Adjust your search or onboard a new member.</p>
          </div>
        ) : (
          filtered.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.35) }}
            >
              <div className="dark-card flex h-full flex-col p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-lg font-black italic text-[var(--brand-accent)]">
                    {person.name[0]}
                  </div>
                  <div className="flex gap-1">
                    <button type="button" className="rounded-lg p-1.5 text-[var(--foreground-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors" aria-label="Credentials">
                      <Key className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg p-1.5 text-[var(--foreground-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors" aria-label="More">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="truncate font-bold text-[var(--foreground)]">{person.name}</h3>
                <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-sm text-[var(--foreground-muted)]">
                  <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  {person.email}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-muted)]">
                    {person.employee_id}
                  </span>
                  <span className={cn(
                    "badge",
                    person.role === "admin" ? "badge-violet" : "badge-cyan"
                  )}>
                    <Shield className="h-3 w-3" />
                    {person.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPersonnel} />
    </Container>
  );
}