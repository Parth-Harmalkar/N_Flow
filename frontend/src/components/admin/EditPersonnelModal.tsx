"use client";

import React, { useState } from "react";
import { User, Mail, Shield, Briefcase, Loader2, X } from "lucide-react";
import { updateUser } from "@/app/admin/actions/users";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    employee_id: string;
    role: "admin" | "employee";
  };
}

export function EditPersonnelModal({ isOpen, onClose, user }: Props) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    employee_id: user.employee_id,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(user.id, formData);
      onClose();
      router.refresh();
    } catch (err) {
      alert("Failed to update personnel: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-1)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-2)] px-8 py-6">
          <div>
            <h3 className="text-xl font-black text-[var(--foreground)]">Edit Personnel File</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission-Critical Identity Update</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-[var(--surface-3)] p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-primary)]" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="dark-input w-full py-3 pl-12 pr-4 text-sm"
                  placeholder="Personnel name..."
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Operational Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-secondary)]" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="dark-input w-full py-3 pl-12 pr-4 text-sm"
                  placeholder="email@organization.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Employee ID */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Personnel ID</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-accent)]" />
                  <input
                    required
                    type="text"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="dark-input w-full py-3 pl-12 pr-4 text-sm"
                    placeholder="E-XXX"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Security Level</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--status-warning)]" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="dark-input w-full py-3 pl-12 pr-4 text-sm appearance-none"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 justify-center py-3"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-[2] justify-center py-3 text-sm"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Commit Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
