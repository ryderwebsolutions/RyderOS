'use server'

import { revalidatePath } from 'next/cache'
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

export async function markReviewed(id: string) {
  const { supabase } = await getOrgId()

  await supabase.from('form_submissions').update({ status: 'reviewed' }).eq('id', id)

  revalidatePath('/submissions')
  revalidatePath(`/submissions/${id}`)
}

export async function convertToLead(id: string) {
  const { organization_id, supabase } = await getOrgId()

  const { data: sub } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (!sub) throw new Error('Submission not found')

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      organization_id,
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      notes: sub.message,
      source: 'website',
      stage: 'new',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase
    .from('form_submissions')
    .update({ status: 'converted', converted_to_lead_id: lead.id })
    .eq('id', id)

  revalidatePath('/submissions')
  revalidatePath(`/submissions/${id}`)
  revalidatePath('/leads')
}

export async function deleteSubmission(id: string) {
  const { supabase } = await getOrgId()
  await supabase.from('form_submissions').delete().eq('id', id)
  revalidatePath('/submissions')
}
