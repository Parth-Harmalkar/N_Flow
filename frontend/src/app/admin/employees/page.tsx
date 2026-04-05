"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Users, Search, Filter, Mail, UserCheck, ShieldCheck, Briefcase } from "lucide-react";
import { getPersonnel } from "../actions/users";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getPersonnel().then((data) => { setEmployees(data); setLoading(false); });
  }, []);

  const filtered = employees.filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      (e.email || "").toLowerCase().includes(q) ||
      (e.employee_id || "").toLowerCase().includes(q)
    );
  });

  const statCards = [
    { label: "Total staff", value: employees.length, icon: Users, color: "text-[var(--brand-secondary)]" },
    { label: "Employees", value: employees.filter((e) => e.role === "employee").length, icon: UserCheck, color: "text-[var(--status-success)]" },
    { label: "Admins", value: employees.filter((e) => e.role === "admin").length, icon: Briefcase, color: "text-[var(--brand-accent)]" },
    { label: "Verified access", value: employees.length, icon: ShieldCheck, color: "text-[var(--brand-primary)]" },
  ];

  return (
    <Container title="Employee Directory" subtitle="Roster of personnel, credentials, and verification status.">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="dark-card flex items-center gap-4 p-5">
            <div className={cn("rounded-lg bg-[var(--surface-2)] p-3", s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground-muted)]">{s.label}</p>
              <h3 className="text-2xl font-black text-[var(--foreground)]">{loading ? "—" : s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="dark-card overflow-hidden">
        {/* Search */}
        <div className="flex flex-col gap-4 border-b border-[var(--surface-border)] p-4 md:flex-row md:items-center md:p-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-subtle)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, ID or email..."
              className="dark-input w-full py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
          <button type="button" className="btn-ghost text-xs">
            <Filter className="h-4 w-4" /> Advanced filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="dark-table w-full min-w-[640px] text-left">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID reference</th>
                <th>Role</th>
                <th>Security</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-2)]" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[var(--foreground-muted)]">
                    <Users className="mx-auto mb-3 h-10 w-10 opacity-20" />
                    <p className="font-semibold text-[var(--foreground)]">No matches</p>
                    <p className="text-sm">Clear search to see the full directory.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-primary-dim)] border border-[rgba(99,102,241,0.2)] text-sm font-bold text-[var(--brand-accent)]">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--foreground)]">{emp.name}</p>
                          <p className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{emp.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-[var(--foreground-muted)]">{emp.employee_id || "N-FLOW-001"}</span>
                    </td>
                    <td>
                      <span className={cn("badge", emp.role === "admin" ? "badge-violet" : "badge-cyan")}>
                        {emp.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm text-[var(--status-success)]">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs text-[var(--foreground-muted)]">Verified</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button type="button" className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-accent)] transition-colors">
                        View profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}