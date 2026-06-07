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
  return { organization_id: data.organization_id, supabase }
}

export async function createLead(formData: FormData) {
  const { organization_id, supabase } = await getOrgId()

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      organization_id,
      contact_id: (formData.get('contact_id') as string) || null,
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      source: (formData.get('source') as string) || null,
      stage: 'new',
      value: formData.get('value') ? Number(formData.get('value')) : null,
      notes: (formData.get('notes') as string) || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  redirect(`/leads/${lead.id}`)
}

export async function updateLead(id: string, formData: FormData) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('leads')
    .update({
      contact_id: (formData.get('contact_id') as string) || null,
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      source: (formData.get('source') as string) || null,
      value: formData.get('value') ? Number(formData.get('value')) : null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  redirect(`/leads/${id}`)
}

export async function moveLeadStage(id: string, stage: string) {
  const { supabase } = await getOrgId()

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('leads')
    .update(
      stage === 'won'
        ? { stage, won_at: now, lost_at: null, lost_reason: null }
        : stage === 'lost'
        ? { stage, lost_at: now, won_at: null }
        : { stage, won_at: null, lost_at: null, lost_reason: null }
    )
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
}

export async function markLeadLost(id: string, reason: string) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('leads')
    .update({
      stage: 'lost',
      lost_at: new Date().toISOString(),
      lost_reason: reason || null,
      won_at: null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
}

export async function deleteLead(id: string) {
  const { supabase } = await getOrgId()

  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  redirect('/leads')
}
