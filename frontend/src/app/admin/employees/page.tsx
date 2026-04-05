"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
import { Users, Search, Filter, Mail, UserCheck, ShieldCheck, Briefcase } from "lucide-react";
import { getPersonnel } from "../actions/users";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getPersonnel().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
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

  const employeesOnly = employees.filter((e) => e.role === "employee").length;

  return (
    <Container
      title="Employee Directory"
      subtitle="Roster of personnel, credentials, and verification status."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total staff</p>
            <h3 className="text-2xl font-black text-brand-primary">
              {loading ? "—" : employees.length}
            </h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Employees</p>
            <h3 className="text-2xl font-black text-brand-primary">
              {loading ? "—" : employeesOnly}
            </h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-50 p-3 text-brand-highlight">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Admins</p>
            <h3 className="text-2xl font-black text-brand-primary">
              {loading ? "—" : employees.filter((e) => e.role === "admin").length}
            </h3>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-brand-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Verified access</p>
            <h3 className="text-2xl font-black text-brand-primary">
              {loading ? "—" : employees.length}
            </h3>
          </div>
        </Panel>
      </div>

      <Panel noPadding className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-surface-border bg-slate-50/50 p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <div className="relative min-w-0 w-full max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, ID or email..."
              className="w-full min-w-0 rounded-lg border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Advanced filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50 text-xs font-medium uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">ID reference</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Security</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="h-16 bg-slate-50/30 px-6" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                    <Users className="mx-auto mb-3 h-10 w-10 opacity-20" />
                    <p className="font-medium text-slate-600">No matches</p>
                    <p className="text-sm">Clear search to see the full directory.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{emp.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {emp.employee_id || "N-FLOW-001"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          emp.role === "admin"
                            ? "border-purple-100 bg-purple-50 text-purple-700"
                            : "border-blue-100 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {emp.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Verified
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-sm font-semibold text-brand-accent hover:underline"
                      >
                        View profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </Container>
  );
}
