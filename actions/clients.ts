'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_ONBOARDING_CHECKLIST } from '@/types/database'

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

export async function createClientAction(formData: FormData) {
  const { organization_id, supabase } = await getOrgAndUser()

  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      organization_id,
      name: formData.get('name') as string,
      status: (formData.get('status') as string) || 'active',
      service_type: (formData.get('service_type') as string) || null,
      domain: (formData.get('domain') as string) || null,
      website_url: (formData.get('website_url') as string) || null,
      google_business_profile_status: (formData.get('google_business_profile_status') as string) || 'not_started',
      payment_status: (formData.get('payment_status') as string) || 'current',
      retainer_status: (formData.get('retainer_status') as string) || 'active',
      retainer_amount: parseFloat(formData.get('retainer_amount') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Seed default onboarding checklist
  await supabase.from('client_checklist_items').insert(
    DEFAULT_ONBOARDING_CHECKLIST.map((label, i) => ({
      organization_id,
      client_id: client.id,
      label,
      sort_order: i,
    }))
  )

  revalidatePath('/clients')
  redirect(`/clients/${client.id}`)
}

export async function updateClientAction(id: string, formData: FormData) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('clients')
    .update({
      name: formData.get('name') as string,
      status: (formData.get('status') as string) || 'active',
      service_type: (formData.get('service_type') as string) || null,
      domain: (formData.get('domain') as string) || null,
      website_url: (formData.get('website_url') as string) || null,
      google_business_profile_status: (formData.get('google_business_profile_status') as string) || 'not_started',
      payment_status: (formData.get('payment_status') as string) || 'current',
      retainer_status: (formData.get('retainer_status') as string) || 'active',
      retainer_amount: parseFloat(formData.get('retainer_amount') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}

export async function toggleChecklistItem(itemId: string, clientId: string, completed: boolean) {
  const { supabase } = await getOrgAndUser()

  const { error } = await supabase
    .from('client_checklist_items')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', itemId)

  if (error) throw new Error(error.message)

  revalidatePath(`/clients/${clientId}`)
}
