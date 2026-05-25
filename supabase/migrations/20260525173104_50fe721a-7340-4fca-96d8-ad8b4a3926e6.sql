
-- Remove overly-permissive public storage write policies
DROP POLICY IF EXISTS "public write images" ON storage.objects;
DROP POLICY IF EXISTS "public update images" ON storage.objects;
DROP POLICY IF EXISTS "public delete images" ON storage.objects;

-- Lock down page_views reads to admins only
DROP POLICY IF EXISTS "public read page_views" ON public.page_views;
CREATE POLICY "Admins can read page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
