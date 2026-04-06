'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAttendance(attendanceId: string, status: 'present' | 'absent' | 'leave' | 'holiday') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attendance')
    .update({ 
      status, 
      verified_by_admin: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', attendanceId)

  if (error) {
    console.error('Error updating attendance:', error)
    return { error: 'Failed to update attendance status.' }
  }

  revalidatePath('/admin/attendance')
  return { success: true }
}

export async function createManualAttendance(userId: string, date: string, status: 'present' | 'absent' | 'leave' | 'holiday') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attendance')
    .upsert({ 
      user_id: userId,
      date,
      status,
      verified_by_admin: true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,date' })

  if (error) {
    console.error('Error creating manual attendance:', error)
    return { error: 'Failed to create manual attendance record.' }
  }

  revalidatePath('/admin/attendance')
  return { success: true }
}

export async function updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()

  const { data: leave, error: fetchError } = await supabase
    .from('leaves')
    .select('*')
    .eq('id', leaveId)
    .single()

  if (fetchError || !leave) {
    return { error: 'Leave request not found.' }
  }

  const { error } = await supabase
    .from('leaves')
    .update({ status })
    .eq('id', leaveId)

  if (error) {
    return { error: 'Failed to update leave status.' }
  }

  // If approved, update attendance for those days
  if (status === 'approved') {
    const start = new Date(leave.start_date)
    const end = new Date(leave.end_date)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      await supabase.from('attendance').upsert({
        user_id: leave.user_id,
        date: dateStr,
        status: 'leave',
        verified_by_admin: true
      }, { onConflict: 'user_id,date' })
    }
  }

  revalidatePath('/admin/leaves')
  revalidatePath('/admin/attendance')
  return { success: true }
}

export async function requestLeave(data: { type: string, start_date: string, end_date: string, reason: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('leaves')
    .insert({
      user_id: user.id,
      ...data,
      status: 'pending'
    })

  if (error) {
    return { error: 'Failed to submit leave request.' }
  }

  revalidatePath('/employee/leaves')
  return { success: true }
}

export async function createMeeting(data: { 
  title: string, 
  description: string, 
  start_time: string, 
  end_time: string, 
  meet_link: string, 
  attendees: string[] 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Insert Meeting
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert({
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      meet_link: data.meet_link,
      created_by: user.id
    })
    .select()
    .single()

  if (meetingError || !meeting) {
    console.error('Meeting Error:', meetingError)
    return { error: 'Failed to create meeting record.' }
  }

  // 2. Add Attendees
  if (data.attendees.length > 0) {
    const attendeeRecords = data.attendees.map(userId => ({
      meeting_id: meeting.id,
      user_id: userId
    }))

    const { error: attendeeError } = await supabase
      .from('meeting_attendees')
      .insert(attendeeRecords)

    if (attendeeError) {
      console.error('Attendee Error:', attendeeError)
      // This is a soft failure for notifications, but we should log it
    }

    // 3. Create Notifications
    const notificationRecords = data.attendees.map(userId => ({
      user_id: userId,
      message: `Strategic Briefing: "${data.title}" scheduled for ${format(new Date(data.start_time), 'MMM dd, hh:mm a')}`,
      type: 'meeting'
    }))

    await supabase.from('notifications').insert(notificationRecords)
  }

  revalidatePath('/admin/meetings')
  return { success: true }
}

export async function syncDailyAttendance(dateStr: string) {
  const supabase = await createClient()
  
  // 1. Fetch all profiles (excluding admins)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name')
    .neq('role', 'admin')

  if (profileError || !profiles) return { error: 'Failed to fetch personnel.' }

  // 2. Define the date range (Local Time for the day)
  const startOfDay = `${dateStr}T00:00:00.000`
  const endOfDay = `${dateStr}T23:59:59.999`

  // 3. Iterate and sync
  const results = await Promise.all(profiles.map(async (profile) => {
    // Check for logs within the day
    // Note: We use a broader range check or consider the 'date' column if 'logs' has one.
    // Assuming 'created_at' is the primary marker.
    const { data: logs } = await supabase
      .from('logs')
      .select('id')
      .eq('user_id', profile.id)
      .gte('start_time', startOfDay) // Assuming start_time/end_time are in ISO
      .lte('start_time', endOfDay)
      .limit(1)

    // Check for approved leaves on this date
    const { data: leave } = await supabase
      .from('leaves')
      .select('id')
      .eq('user_id', profile.id)
      .eq('status', 'approved')
      .lte('start_date', dateStr)
      .gte('end_date', dateStr)
      .maybeSingle()

    let status: 'present' | 'absent' | 'leave' | 'holiday' = 'absent'
    
    if (logs && logs.length > 0) {
      status = 'present'
    } else if (leave) {
      status = 'leave'
    } else {
      status = 'absent'
    }

    // Upsert record: Don't overwrite if manually verified by admin
    const { data: existing } = await supabase
      .from('attendance')
      .select('verified_by_admin')
      .eq('user_id', profile.id)
      .eq('date', dateStr)
      .maybeSingle()

    if (existing?.verified_by_admin) {
      return { success: true, skipped: true }
    }

    return supabase.from('attendance').upsert({
      user_id: profile.id,
      date: dateStr,
      status,
      verified_by_admin: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,date' })
  }))

  revalidatePath('/admin/attendance')
  revalidatePath('/employee/dashboard')
  return { success: true, count: profiles.length }
}

import { format } from 'date-fns'
