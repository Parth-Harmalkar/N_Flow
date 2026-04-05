'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUnresolvedRiskCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('risks')
    .select('*', { count: 'exact', head: true })
    .eq('is_resolved', false);

  if (error) return 0;
  return count || 0;
}

export async function getRisks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('risks')
    .select(`
      *,
      logs (
        id,
        description,
        start_time,
        end_time,
        proof_url,
        profiles (
          id,
          name,
          employee_id
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function resolveRisk(riskId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('risks')
    .update({ is_resolved: true })
    .eq('id', riskId);

  if (error) throw error;

  revalidatePath('/admin/risks');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
