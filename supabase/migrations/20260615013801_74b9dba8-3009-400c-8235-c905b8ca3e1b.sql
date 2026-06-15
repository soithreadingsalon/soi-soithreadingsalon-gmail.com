
CREATE TABLE public.appointments_deleted (
  backup_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_category text,
  service text,
  preferred_date date,
  preferred_time text,
  notes text,
  status text,
  internal_notes text,
  google_event_id text,
  calendar_synced_at timestamptz,
  original_created_at timestamptz,
  deleted_at timestamptz NOT NULL DEFAULT now(),
  deleted_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments_deleted TO authenticated;
GRANT ALL ON public.appointments_deleted TO service_role;

ALTER TABLE public.appointments_deleted ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view deleted appointments"
ON public.appointments_deleted FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert deleted appointments"
ON public.appointments_deleted FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can restore (delete backup)"
ON public.appointments_deleted FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
