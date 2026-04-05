"use client";

import React, { useState } from "react";
import { Trash2, Key, AlertTriangle, Loader2, UserCog } from "lucide-react";
import { deleteUser, resetUserPassword } from "@/app/admin/actions/users";
import { useRouter } from "next/navigation";
import { EditPersonnelModal } from "./EditPersonnelModal";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
  userEmployeeId: string;
  userRole: "admin" | "employee";
}

export function PersonnelActions({ userId, userName, userEmail, userEmployeeId, userRole }: Props) {
  const [loading, setLoading] = useState<"delete" | "password" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassInput, setShowPassInput] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading("delete");
    try {
      await deleteUser(userId);
      router.push("/admin/users");
    } catch (err) {
      alert("Failed to delete user: " + (err as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return alert("Please enter a new password");
    setLoading("password");
    try {
      await resetUserPassword(userId, newPassword);
      alert("Password updated successfully");
      setShowPassInput(false);
      setNewPassword("");
    } catch (err) {
      alert("Failed to update password: " + (err as Error).message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="mt-8 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--brand-primary-dim)] p-2.5 text-[var(--brand-primary)]">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
               <h4 className="text-sm font-black text-[var(--foreground)] tracking-tight">Administrative Control</h4>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Mission-Critical Personnel Actions</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="btn-primary py-2 px-4 text-xs"
          >
            Update Profile Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--surface-border)]">
          {/* Password Reset */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Credential Override</h5>
            {showPassInput ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New secure password..."
                  className="dark-input flex-1 py-1.5 text-xs"
                />
                <button 
                  onClick={handleResetPassword}
                  disabled={!!loading}
                  className="btn-primary py-1.5 px-4 text-xs"
                >
                  {loading === "password" ? <Loader2 className="h-3 w-3 animate-spin" /> : "Commit"}
                </button>
                <button onClick={() => setShowPassInput(false)} className="btn-ghost text-xs">Cancel</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowPassInput(true)}
                className="btn-ghost border border-[var(--surface-border)] text-xs flex items-center gap-2 hover:bg-[var(--surface-2)] w-full justify-center"
              >
                <Key className="h-3.5 w-3.5" /> Force Password Update
              </button>
            )}
          </div>

          {/* Account Deletion */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-red-500/70">Danger Zone</h5>
            {showConfirm ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-500/5 p-2 pr-4 border border-red-500/20">
                 <span className="text-[10px] font-black uppercase text-red-500 ml-2">Confirm?</span>
                 <button 
                   onClick={handleDelete}
                   disabled={loading === "delete"}
                   className="btn-primary bg-red-600 hover:bg-red-700 text-[10px] py-1 px-3"
                 >
                   {loading === "delete" ? "Processing..." : "Decommission Personnel"}
                 </button>
                 <button onClick={() => setShowConfirm(false)} className="text-[10px] font-bold text-[var(--foreground-subtle)]">Abort</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-transparent w-full justify-center py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Decommission Personnel
              </button>
            )}
          </div>
        </div>
      </div>

      <EditPersonnelModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        user={{
          id: userId,
          name: userName,
          email: userEmail,
          employee_id: userEmployeeId,
          role: userRole
        }}
      />
    </>
  );
}
