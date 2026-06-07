-- ============================================================
-- RyderOS Layer 5 — Tasks
-- ============================================================

CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'open',
  priority        TEXT NOT NULL DEFAULT 'medium',
  due_date        DATE,
  linked_type     TEXT,
  linked_id       UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tasks_organization_id_idx ON tasks(organization_id);
CREATE INDEX tasks_created_by_idx ON tasks(created_by);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);
CREATE INDEX tasks_linked_idx ON tasks(linked_type, linked_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select" ON tasks
  FOR SELECT USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT WITH CHECK (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE POLICY "tasks_delete" ON tasks
  FOR DELETE USING (organization_id IN (SELECT get_my_organization_ids()));

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
