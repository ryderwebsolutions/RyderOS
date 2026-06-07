-- ============================================================
-- RyderOS Contacts v2
-- Adds: website_url, soft delete (archived_at), contact_notes
-- ============================================================

-- Add missing fields to contacts
ALTER TABLE contacts ADD COLUMN website_url TEXT;
ALTER TABLE contacts ADD COLUMN archived_at TIMESTAMPTZ;

CREATE INDEX contacts_archived_idx ON contacts(organization_id, archived_at);

-- ============================================================
-- CONTACT NOTES (timestamped activity log)
-- ============================================================
CREATE TABLE contact_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id      UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES auth.users(id),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_notes_contact_id_idx ON contact_notes(contact_id);

ALTER TABLE contact_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_notes_select" ON contact_notes
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "contact_notes_insert" ON contact_notes
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "contact_notes_delete" ON contact_notes
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()) AND author_id = auth.uid());
