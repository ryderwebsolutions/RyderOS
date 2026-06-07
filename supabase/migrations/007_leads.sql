-- ============================================================
-- RyderOS Layer 6 — Lead Pipeline
-- ============================================================

CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id      UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  source          TEXT,
  stage           TEXT NOT NULL DEFAULT 'new',
  value           NUMERIC(10,2),
  notes           TEXT,
  won_at          TIMESTAMPTZ,
  lost_at         TIMESTAMPTZ,
  lost_reason     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_organization_id_idx ON leads(organization_id);
CREATE INDEX leads_stage_idx ON leads(stage);
CREATE INDEX leads_contact_id_idx ON leads(contact_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select" ON leads
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "leads_insert" ON leads
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "leads_update" ON leads
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "leads_delete" ON leads
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
