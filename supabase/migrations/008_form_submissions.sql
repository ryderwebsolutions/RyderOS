-- ============================================================
-- RyderOS Layer 7 — Enquiry Forms & Form Submissions
-- ============================================================

-- Public form token on each organization (safe to expose, only allows form submissions)
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS form_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid();

-- Form submissions inbox
CREATE TABLE form_submissions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  website_id           UUID REFERENCES public.websites(id) ON DELETE SET NULL,
  name                 TEXT NOT NULL,
  email                TEXT,
  phone                TEXT,
  message              TEXT,
  source_url           TEXT,
  status               TEXT NOT NULL DEFAULT 'new',
  converted_to_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX form_submissions_organization_id_idx ON form_submissions(organization_id);
CREATE INDEX form_submissions_status_idx ON form_submissions(status);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions_select" ON form_submissions
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "submissions_update" ON form_submissions
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "submissions_delete" ON form_submissions
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

-- INSERT is handled by the service role key via the public API (no RLS needed)
CREATE POLICY "submissions_insert_service" ON form_submissions
  FOR INSERT WITH CHECK (true);
