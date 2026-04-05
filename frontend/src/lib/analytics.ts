import { createClient } from '@/utils/supabase/server'

export interface PerformanceMetric {
  userId: string
  employeeId: string
  name: string
  hours: number
  tasks: number
  completionRate: number
  lateLogs: number
}

export async function getGlobalPerformanceMetrics() {
  const supabase = await createClient()

  // 1. Fetch all profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, employee_id')
    .eq('role', 'employee')

  if (profileError) throw profileError

  // 2. Fetch all logs for the current period (e.g., last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: logs, error: logError } = await supabase
    .from('logs')
    .select('user_id, start_time, end_time, created_at')
    .order('created_at', { ascending: false })

  if (logError) throw logError

  // 3. Fetch all tasks for completion rate
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('assigned_to, status')

  if (taskError) throw taskError

  // 4. Aggregate findings
  const metrics: PerformanceMetric[] = profiles.map((p) => {
    const userLogs = logs?.filter((l) => l.user_id === p.id) || []
    const userTasks = tasks?.filter((t) => t.assigned_to === p.id) || []

    const totalHours = userLogs.reduce((acc, log) => {
      const start = new Date(log.start_time).getTime()
      const end = new Date(log.end_time).getTime()
      return acc + (end - start) / (1000 * 60 * 60)
    }, 0)

    const completedTasks = userTasks.filter((t) => t.status === 'completed').length
    const completionRate = userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0
    
    // Simple late log logic: log created > 24h after end_time
    const lateLogs = userLogs.filter((l) => {
      const end = new Date(l.end_time).getTime()
      const created = new Date(l.created_at).getTime()
      return (created - end) > (24 * 60 * 60 * 1000)
    }).length

    return {
      userId: p.id,
      employeeId: p.employee_id || 'N/A',
      name: p.name,
      hours: Math.round(totalHours * 10) / 10,
      tasks: userTasks.length,
      completionRate: Math.round(completionRate),
      lateLogs
    }
  })

  return metrics
}

export async function getEmployeeDetailMetrics(userId: string) {
  const supabase = await createClient()

  // Fetch specific employee logs and tasks
  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)

  return { logs: logs || [], tasks: tasks || [] }
}
