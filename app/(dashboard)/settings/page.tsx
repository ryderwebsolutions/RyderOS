import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user!.id)
    .single()

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, form_token')
    .eq('id', member!.organization_id)
    .single()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ryderos.com'
  const endpointUrl = `${baseUrl}/api/submit/${org?.form_token}`

  const embedSnippet = `<script>
  document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const res = await fetch('${endpointUrl}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) alert('Thanks! We will be in touch.');
  });
</script>`

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Organization</h2>
        <div className="rounded-lg border border-border p-4 space-y-3 text-sm">
          <Row label="Name" value={org?.name} />
          <Row label="Slug" value={org?.slug} />
          <Row label="Form token" value={org?.form_token} mono />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Enquiry Form Integration</h2>
        <p className="text-sm text-muted-foreground">
          Add this JavaScript snippet to any client website to route enquiries directly into your
          RyderOS submissions inbox.
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium">API endpoint</p>
          <code className="block text-xs bg-muted rounded-md px-3 py-2 break-all">
            {endpointUrl}
          </code>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Embed snippet</p>
          <pre className="text-xs bg-muted rounded-md px-3 py-2 overflow-x-auto whitespace-pre-wrap">
            {embedSnippet}
          </pre>
        </div>

        <p className="text-xs text-muted-foreground">
          Your form must include a <code className="bg-muted px-1 rounded">name</code> field.{' '}
          <code className="bg-muted px-1 rounded">email</code>,{' '}
          <code className="bg-muted px-1 rounded">phone</code>, and{' '}
          <code className="bg-muted px-1 rounded">message</code> are optional.
        </p>
      </section>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
}) {
  return (
    <div className="flex gap-4">
      <span className="font-medium text-muted-foreground w-28 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-xs break-all' : ''}>{value ?? '—'}</span>
    </div>
  )
}
