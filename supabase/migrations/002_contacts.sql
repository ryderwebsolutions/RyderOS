-- ============================================================
-- RyderOS Contacts
-- ============================================================

CREATE TABLE contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT,
  email           TEXT,
  phone           TEXT,
  company_name    TEXT,
  source          TEXT,
  status          TEXT NOT NULL DEFAULT 'lead',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contacts_organization_id_idx ON contacts(organization_id);
CREATE INDEX contacts_status_idx ON contacts(organization_id, status);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_select" ON contacts
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "contacts_update" ON contacts
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "contacts_delete" ON contacts
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
