'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function sel(val: FormDataEntryValue | null): string | null {
  const s = (val as string) || ''
  return s && s !== 'none' ? s : null
}

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

  const linked_type = sel(formData.get('linked_type'))
  const linked_id = sel(formData.get('linked_id'))

  const { error } = await supabase.from('tasks').insert({
    organization_id,
    created_by: user_id,
    title: formData.get('title') as string,
    description: sel(formData.get('description')),
    status: sel(formData.get('status')) ?? 'open',
    priority: sel(formData.get('priority')) ?? 'medium',
    due_date: sel(formData.get('due_date')),
    linked_type: linked_type && linked_id ? linked_type : null,
    linked_id: linked_type && linked_id ? linked_id : null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function updateTask(id: string, formData: FormData) {
  const { supabase } = await getOrgAndUser()

  const linked_type = sel(formData.get('linked_type'))
  const linked_id = sel(formData.get('linked_id'))

  const { error } = await supabase
    .from('tasks')
    .update({
      title: formData.get('title') as string,
      description: sel(formData.get('description')),
      status: sel(formData.get('status')) ?? 'open',
      priority: sel(formData.get('priority')) ?? 'medium',
      due_date: sel(formData.get('due_date')),
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
