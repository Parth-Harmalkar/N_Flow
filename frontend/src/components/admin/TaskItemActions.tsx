"use client";

import React, { useState } from "react";
import { CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { updateTaskStatus, deleteTask } from "@/app/admin/actions/tasks";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  taskId: string;
  status: string;
}

export function TaskItemActions({ taskId, status }: Props) {
  const [loading, setLoading] = useState<"status" | "delete" | null>(null);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading("status");
    try {
      await updateTaskStatus(taskId, "completed");
      router.refresh();
    } catch (err) {
      alert("Failed to mark task as completed");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to decommission this initiative?")) return;
    setLoading("delete");
    try {
      await deleteTask(taskId);
      router.refresh();
    } catch (err) {
      alert("Failed to decommission task");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {status !== "completed" && (
        <button 
          onClick={(e) => { e.preventDefault(); handleComplete(); }}
          disabled={!!loading}
          className="rounded-lg p-1.5 text-green-500/50 hover:bg-green-500/10 hover:text-green-500 transition-all"
          title="Mark Completed"
        >
          {loading === "status" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>
      )}
      <button 
        onClick={(e) => { e.preventDefault(); handleDelete(); }}
        disabled={!!loading}
        className="rounded-lg p-1.5 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all"
        title="Decommission Task"
      >
        {loading === "delete" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
