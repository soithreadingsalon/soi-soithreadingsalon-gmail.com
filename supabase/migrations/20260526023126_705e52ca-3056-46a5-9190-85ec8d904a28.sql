
-- 1) Inquiries: idempotency column for notification fn
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- 2) site_settings: lock down public reads
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

CREATE POLICY "Admins can read site settings"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Public helper to fetch only business hours (used by the booking time picker)
CREATE OR REPLACE FUNCTION public.get_public_hours()
RETURNS TABLE(hours_weekday text, hours_saturday text, hours_sunday text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hours_weekday, hours_saturday, hours_sunday
  FROM public.site_settings
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_hours() TO anon, authenticated;

-- 3) Realtime: restrict channel subscriptions to admins
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read realtime messages" ON realtime.messages;
CREATE POLICY "Admins can read realtime messages"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can write realtime messages" ON realtime.messages;
CREATE POLICY "Admins can write realtime messages"
  ON realtime.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
