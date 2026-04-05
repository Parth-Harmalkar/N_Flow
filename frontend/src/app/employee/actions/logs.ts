'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitWorkLog(formData: {
  task_id: string;
  start_time: string;
  end_time: string;
  description: string;
  proof_url: string;
  file_hash: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Insert the Log
  const { data: log, error } = await supabase
    .from('logs')
    .insert([{
      user_id: user.id,
      task_id: formData.task_id,
      start_time: formData.start_time,
      end_time: formData.end_time,
      description: formData.description,
      proof_url: formData.proof_url,
      file_hash: formData.file_hash
    }])
    .select()
    .single();

  if (error) throw error;

  // 2. Run Risk Detection (Don't block the UI, but wait for it here in server action)
  await detectRisks(supabase, log.id, user.id, formData);

  revalidatePath('/employee/tasks');
  revalidatePath('/admin/tasks');
  revalidatePath('/admin/risks');
  return { success: true, logId: log.id };
}

async function detectRisks(supabase: any, logId: string, userId: string, data: any) {
  const risks = [];

  // 1. Duplicate Hash Check
  const { data: duplicates } = await supabase
    .from('logs')
    .select('id')
    .eq('file_hash', data.file_hash)
    .neq('id', logId)
    .limit(1);

  if (duplicates && duplicates.length > 0) {
    risks.push({ 
      type: 'duplicate_hash', 
      severity: 'high', 
      metadata: { duplicate_log_id: duplicates[0].id } 
    });
  }

  // 2. Overlap Check
  const { data: overlaps } = await supabase
    .from('logs')
    .select('id, start_time, end_time')
    .eq('user_id', userId)
    .neq('id', logId)
    .lt('start_time', data.end_time)
    .gt('end_time', data.start_time);

  if (overlaps && overlaps.length > 0) {
    risks.push({ 
      type: 'time_overlap', 
      severity: 'medium', 
      metadata: { overlapping_ids: overlaps.map((o: any) => o.id) } 
    });
  }

  // 3. Excessive Hours (>12h)
  const duration = new Date(data.end_time).getTime() - new Date(data.start_time).getTime();
  if (duration > 12 * 60 * 60 * 1000) {
    risks.push({ 
      type: 'excessive_hours', 
      severity: 'low', 
      metadata: { duration_hours: (duration / (1000 * 60 * 60)).toFixed(1) } 
    });
  }

  if (risks.length > 0) {
    await supabase.from('risks').insert(
      risks.map(r => ({ 
        ...r, 
        log_id: logId, 
        user_id: userId 
      }))
    );
  }
}

export async function getAssignedTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user.id)
    .neq('status', 'completed');

  if (error) throw error;
  return data;
}

export async function getMyTasks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      *,
      profiles:assigned_to (
        name,
        employee_id
      )
    `
    )
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getMyTasks', error);
    return [];
  }

  return data ?? [];
}

export async function getWeeklyHours() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('logs')
    .select('start_time, end_time')
    .eq('user_id', user.id)
    .gte('created_at', startOfWeek.toISOString());

  if (error) throw error;

  const totalMilliseconds = data.reduce((acc, log) => {
    const start = new Date(log.start_time).getTime();
    const end = new Date(log.end_time).getTime();
    return acc + (end - start);
  }, 0);

  return (totalMilliseconds / (1000 * 60 * 60)).toFixed(1);
}
