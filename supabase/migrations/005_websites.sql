-- ============================================================
-- RyderOS Layer 4 — Website Management
-- ============================================================

CREATE TABLE websites (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id        UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  domain           TEXT,
  hosting_provider TEXT,
  email_provider   TEXT,
  status           TEXT NOT NULL DEFAULT 'not_started',
  launch_date      DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX websites_organization_id_idx ON websites(organization_id);
CREATE INDEX websites_client_id_idx ON websites(client_id);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "websites_select" ON websites
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "websites_insert" ON websites
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "websites_update" ON websites
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "websites_delete" ON websites
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE TRIGGER websites_updated_at
  BEFORE UPDATE ON websites
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- WEBSITE CHECKLIST (launch + assets + maintenance categories)
-- ============================================================
CREATE TABLE website_checklist_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  website_id      UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  category        TEXT NOT NULL DEFAULT 'launch',
  label           TEXT NOT NULL,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX website_checklist_website_id_idx ON website_checklist_items(website_id);

ALTER TABLE website_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_checklist_select" ON website_checklist_items
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_checklist_insert" ON website_checklist_items
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_checklist_update" ON website_checklist_items
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_checklist_delete" ON website_checklist_items
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

-- ============================================================
-- WEBSITE REVISIONS
-- ============================================================
CREATE TABLE website_revisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  website_id      UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  description     TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'requested',
  priority        TEXT NOT NULL DEFAULT 'medium',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX website_revisions_website_id_idx ON website_revisions(website_id);

ALTER TABLE website_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_revisions_select" ON website_revisions
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_revisions_insert" ON website_revisions
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_revisions_update" ON website_revisions
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "website_revisions_delete" ON website_revisions
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));
