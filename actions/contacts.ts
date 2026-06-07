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

export async function createContact(formData: FormData) {
  const { organization_id, supabase } = await getOrgAndUser()

  const { error } = await supabase.from('contacts').insert({
    organization_id,
    first_name: formData.get('first_name') as string,
    last_name: (formData.get('last_name') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    company_name: (formData.get('company_name') as string) || null,
    website_url: (formData.get('website_url') as string) || null,
    source: (formData.get('source') as string) || null,
    status: (formData.get('status') as string) || 'lead',
    notes: (formData.get('notes') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  redirect('/crm')
}

export async function updateContact(id: string, formData: FormData) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('contacts')
    .update({
      first_name: formData.get('first_name') as string,
      last_name: (formData.get('last_name') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company_name: (formData.get('company_name') as string) || null,
      website_url: (formData.get('website_url') as string) || null,
      source: (formData.get('source') as string) || null,
      status: (formData.get('status') as string) || 'lead',
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  revalidatePath(`/crm/${id}`)
  redirect(`/crm/${id}`)
}

export async function archiveContact(id: string) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('contacts')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  redirect('/crm')
}

export async function restoreContact(id: string) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('contacts')
    .update({ archived_at: null })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  revalidatePath(`/crm/${id}`)
  redirect(`/crm/${id}`)
}

export async function addContactNote(contactId: string, formData: FormData) {
  const { organization_id, user_id, supabase } = await getOrgAndUser()

  const content = (formData.get('content') as string)?.trim()
  if (!content) return

  const { error } = await supabase.from('contact_notes').insert({
    organization_id,
    contact_id: contactId,
    author_id: user_id,
    content,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/crm/${contactId}`)
}

export async function deleteContactNote(noteId: string, contactId: string) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('contact_notes')
    .delete()
    .eq('id', noteId)

  if (error) throw new Error(error.message)

  revalidatePath(`/crm/${contactId}`)
}
