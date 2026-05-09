
-- Add Google Calendar sync columns to appointments
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS google_event_id text,
  ADD COLUMN IF NOT EXISTS calendar_synced_at timestamptz;

-- Add calendar sync toggle to site settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS calendar_sync_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS google_calendar_id text NOT NULL DEFAULT 'primary';

-- Page views tracking table (lightweight analytics)
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert page_views" ON public.page_views;
CREATE POLICY "public insert page_views" ON public.page_views FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "public read page_views" ON public.page_views;
CREATE POLICY "public read page_views" ON public.page_views FOR SELECT TO public USING (true);

-- Storage buckets (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

-- Public storage policies for these admin-managed buckets
DROP POLICY IF EXISTS "public read images" ON storage.objects;
CREATE POLICY "public read images" ON storage.objects FOR SELECT TO public
  USING (bucket_id IN ('offer-images', 'gallery-images', 'site-assets'));

DROP POLICY IF EXISTS "public write images" ON storage.objects;
CREATE POLICY "public write images" ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id IN ('offer-images', 'gallery-images', 'site-assets'));

DROP POLICY IF EXISTS "public update images" ON storage.objects;
CREATE POLICY "public update images" ON storage.objects FOR UPDATE TO public
  USING (bucket_id IN ('offer-images', 'gallery-images', 'site-assets'));

DROP POLICY IF EXISTS "public delete images" ON storage.objects;
CREATE POLICY "public delete images" ON storage.objects FOR DELETE TO public
  USING (bucket_id IN ('offer-images', 'gallery-images', 'site-assets'));

-- Realtime for live admin updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
