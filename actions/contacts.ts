'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getOrgId() {
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
  return data.organization_id
}

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const organization_id = await getOrgId()

  const { error } = await supabase.from('contacts').insert({
    organization_id,
    first_name: formData.get('first_name') as string,
    last_name: (formData.get('last_name') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    company_name: (formData.get('company_name') as string) || null,
    source: (formData.get('source') as string) || null,
    status: (formData.get('status') as string) || 'lead',
    notes: (formData.get('notes') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  redirect('/crm')
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contacts')
    .update({
      first_name: formData.get('first_name') as string,
      last_name: (formData.get('last_name') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company_name: (formData.get('company_name') as string) || null,
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

export async function deleteContact(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/crm')
  redirect('/crm')
}
