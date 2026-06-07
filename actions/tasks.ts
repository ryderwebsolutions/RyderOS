'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getOrgAndUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!data) throw new Error('No organization found')
  return { organization_id: data.organization_id, user_id: user.id, supabase }
}

export async function createTask(formData: FormData) {
  const { organization_id, user_id, supabase } = await getOrgAndUser()

  const linked_type = (formData.get('linked_type') as string) || null
  const linked_id = (formData.get('linked_id') as string) || null

  const { error } = await supabase.from('tasks').insert({
    organization_id,
    created_by: user_id,
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    status: (formData.get('status') as string) || 'open',
    priority: (formData.get('priority') as string) || 'medium',
    due_date: (formData.get('due_date') as string) || null,
    linked_type: linked_type && linked_id ? linked_type : null,
    linked_id: linked_type && linked_id ? linked_id : null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function updateTask(id: string, formData: FormData) {
  const { supabase } = await getOrgAndUser()

  const linked_type = (formData.get('linked_type') as string) || null
  const linked_id = (formData.get('linked_id') as string) || null

  const { error } = await supabase
    .from('tasks')
    .update({
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      status: (formData.get('status') as string) || 'open',
      priority: (formData.get('priority') as string) || 'medium',
      due_date: (formData.get('due_date') as string) || null,
      linked_type: linked_type && linked_id ? linked_type : null,
      linked_id: linked_type && linked_id ? linked_id : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function setTaskStatus(id: string, status: string) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
}

export async function deleteTask(id: string) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
  redirect('/tasks')
}
