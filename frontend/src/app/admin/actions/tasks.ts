"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(data: {
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: string;
  assigned_to?: string;
}) {
  const supabase = await createClient();

  const { title, description, priority, deadline, assigned_to } = data;

  const { error } = await supabase.from("tasks").insert({
    title,
    description,
    priority,
    deadline: new Date(deadline).toISOString(),
    assigned_to: assigned_to || null,
    status: "pending",
  });

  if (error) {
    console.error("Error creating task:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) {
    console.error("Error updating task status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function getEmployees() {
  const supabase = await createClient();

  const { data: employees, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "employee");

  if (error) {
    console.error("Error fetching employees:", error);
    return [];
  }

  return employees;
}

export async function getTasks() {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      *,
      profiles:assigned_to (
        id,
        name,
        employee_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return tasks;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
