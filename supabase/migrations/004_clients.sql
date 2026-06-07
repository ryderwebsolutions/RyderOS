-- ============================================================
-- RyderOS Layer 3 — Client Management
-- ============================================================

CREATE TABLE clients (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id               UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                          TEXT NOT NULL,
  status                        TEXT NOT NULL DEFAULT 'active',
  service_type                  TEXT,
  domain                        TEXT,
  website_url                   TEXT,
  google_business_profile_status TEXT NOT NULL DEFAULT 'not_started',
  payment_status                TEXT NOT NULL DEFAULT 'current',
  retainer_status               TEXT NOT NULL DEFAULT 'active',
  retainer_amount               NUMERIC(10,2),
  notes                         TEXT,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX clients_organization_id_idx ON clients(organization_id);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select" ON clients
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "clients_insert" ON clients
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "clients_update" ON clients
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "clients_delete" ON clients
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- CLIENT CONTACTS (link contacts to clients, many-to-one)
-- ============================================================
ALTER TABLE contacts ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
CREATE INDEX contacts_client_id_idx ON contacts(client_id);

-- ============================================================
-- CLIENT ONBOARDING CHECKLIST
-- ============================================================
CREATE TABLE client_checklist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX client_checklist_client_id_idx ON client_checklist_items(client_id);

ALTER TABLE client_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checklist_select" ON client_checklist_items
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "checklist_insert" ON client_checklist_items
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "checklist_update" ON client_checklist_items
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "checklist_delete" ON client_checklist_items
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));
