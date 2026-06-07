import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const name = (body.name ?? '').trim()
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400, headers: CORS })
  }

  const supabase = createAdminClient()

  // Resolve token → organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('form_token', token)
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404, headers: CORS })
  }

  const referer = request.headers.get('referer') ?? null

  const { error } = await supabase.from('form_submissions').insert({
    organization_id: org.id,
    name,
    email: (body.email ?? '').trim() || null,
    phone: (body.phone ?? '').trim() || null,
    message: (body.message ?? '').trim() || null,
    source_url: referer,
  })

  if (error) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500, headers: CORS })
  }

  return NextResponse.json({ success: true }, { status: 201, headers: CORS })
}
