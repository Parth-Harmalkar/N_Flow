'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: {
  name: string;
  email: string;
  employee_id: string;
  role: 'admin' | 'employee';
  password: string;
}) {
  const supabase = await createClient()
  
  // 1. Verify Requesting User is an Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can manage personnel.')
  }

  // 2. Create User via Admin Client (Service Role)
  const adminClient = createAdminClient()
  
  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.name,
      role: formData.role
    }
  })

  if (authError) throw authError
  if (!authUser.user) throw new Error('Failed to create user account.')

  // 3. Create Public Profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      id: authUser.user.id,
      name: formData.name,
      role: formData.role,
      employee_id: formData.employee_id
    })

  if (profileError) {
    // Cleanup auth user if profile creation fails
    await adminClient.auth.admin.deleteUser(authUser.user.id)
    throw profileError
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function getPersonnel() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
