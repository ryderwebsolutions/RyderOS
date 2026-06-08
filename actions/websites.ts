'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_LAUNCH_CHECKLIST, DEFAULT_ASSET_CHECKLIST } from '@/types/database'

function sel(val: FormDataEntryValue | null): string | null {
  const s = (val as string) || ''
  return s && s !== 'none' ? s : null
}

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

export async function createWebsite(formData: FormData) {
  const { organization_id, supabase } = await getOrgId()

  const { data: website, error } = await supabase
    .from('websites')
    .insert({
      organization_id,
      client_id: sel(formData.get('client_id')),
      name: formData.get('name') as string,
      domain: sel(formData.get('domain')),
      hosting_provider: sel(formData.get('hosting_provider')),
      email_provider: sel(formData.get('email_provider')),
      status: sel(formData.get('status')) ?? 'not_started',
      launch_date: sel(formData.get('launch_date')),
      notes: sel(formData.get('notes')),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Seed launch checklist
  const launchItems = DEFAULT_LAUNCH_CHECKLIST.map((label, i) => ({
    organization_id,
    website_id: website.id,
    category: 'launch',
    label,
    sort_order: i,
  }))

  // Seed asset checklist
  const assetItems = DEFAULT_ASSET_CHECKLIST.map((label, i) => ({
    organization_id,
    website_id: website.id,
    category: 'assets',
    label,
    sort_order: i,
  }))

  await supabase.from('website_checklist_items').insert([...launchItems, ...assetItems])

  revalidatePath('/websites')
  redirect(`/websites/${website.id}`)
}

export async function updateWebsite(id: string, formData: FormData) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('websites')
    .update({
      client_id: sel(formData.get('client_id')),
      name: formData.get('name') as string,
      domain: sel(formData.get('domain')),
      hosting_provider: sel(formData.get('hosting_provider')),
      email_provider: sel(formData.get('email_provider')),
      status: sel(formData.get('status')) ?? 'not_started',
      launch_date: sel(formData.get('launch_date')),
      notes: sel(formData.get('notes')),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/websites')
  revalidatePath(`/websites/${id}`)
  redirect(`/websites/${id}`)
}

export async function toggleWebsiteChecklistItem(itemId: string, websiteId: string, completed: boolean) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('website_checklist_items')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', itemId)

  if (error) throw new Error(error.message)

  revalidatePath(`/websites/${websiteId}`)
}

export async function addRevision(websiteId: string, formData: FormData) {
  const { organization_id, supabase } = await getOrgId()

  const { error } = await supabase.from('website_revisions').insert({
    organization_id,
    website_id: websiteId,
    description: formData.get('description') as string,
    priority: (formData.get('priority') as string) || 'medium',
    status: 'requested',
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/websites/${websiteId}`)
}

export async function updateRevisionStatus(revisionId: string, websiteId: string, status: string) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('website_revisions')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', revisionId)

  if (error) throw new Error(error.message)

  revalidatePath(`/websites/${websiteId}`)
}

export async function deleteRevision(revisionId: string, websiteId: string) {
  const { supabase } = await getOrgId()

  const { error } = await supabase
    .from('website_revisions')
    .delete()
    .eq('id', revisionId)

  if (error) throw new Error(error.message)

  revalidatePath(`/websites/${websiteId}`)
}
