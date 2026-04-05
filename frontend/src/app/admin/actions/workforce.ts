'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAttendance(attendanceId: string, status: 'present' | 'absent' | 'lop' | 'leave' | 'holiday') {
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

export async function createManualAttendance(userId: string, date: string, status: 'present' | 'absent' | 'lop' | 'leave' | 'holiday') {
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
  
  // 1. Fetch all profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .neq('role', 'admin')

  if (profileError || !profiles) return { error: 'Failed to fetch personnel.' }

  // 2. Iterate and sync
  const results = await Promise.all(profiles.map(async (profile) => {
    // Check for logs
    const { data: logs } = await supabase
      .from('logs')
      .select('id')
      .eq('user_id', profile.id)
      .gte('created_at', `${dateStr}T00:00:00Z`)
      .lte('created_at', `${dateStr}T23:59:59Z`)
      .limit(1)

    // Check for leaves
    const { data: leave } = await supabase
      .from('leaves')
      .select('id')
      .eq('user_id', profile.id)
      .eq('status', 'approved')
      .lte('start_date', dateStr)
      .gte('end_date', dateStr)
      .single()

    let status: 'present' | 'absent' | 'lop' | 'leave' = 'absent'
    
    if (logs && logs.length > 0) {
      status = 'present'
    } else if (leave) {
      status = 'leave'
    } else {
      status = 'lop'
    }

    // Upsert record (only if not manually verified by admin already, or just overwrite if specified)
    return supabase.from('attendance').upsert({
      user_id: profile.id,
      date: dateStr,
      status,
      verified_by_admin: false
    }, { onConflict: 'user_id,date' })
  }))

  revalidatePath('/admin/attendance')
  return { success: true }
}

import { format } from 'date-fns'
