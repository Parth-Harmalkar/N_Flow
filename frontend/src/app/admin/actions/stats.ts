'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();

  // Fetch counts in parallel for performance
  const [
    { count: employeeCount },
    { count: taskCount },
    { count: riskCount },
    { count: logCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('risks').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase.from('logs').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  ]);

  return {
    employees: employeeCount || 0,
    activeTasks: taskCount || 0,
    unresolvedRisks: riskCount || 0,
    recentLogs: logCount || 0,
    lastUpdate: new Date().toLocaleTimeString()
  };
}
