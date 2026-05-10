
-- 1. Roles system
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Auto-grant admin role to the first user who signs up
CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

-- 3. Lock down APPOINTMENTS
DROP POLICY IF EXISTS "public delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "public insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "public read appointments" ON public.appointments;
DROP POLICY IF EXISTS "public update appointments" ON public.appointments;

CREATE POLICY "Anyone can submit an appointment"
  ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read appointments"
  ON public.appointments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Lock down INQUIRIES
DROP POLICY IF EXISTS "public delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "public insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "public read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "public update inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read inquiries"
  ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Lock down SITE_SETTINGS (public read, admin write)
DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
DROP POLICY IF EXISTS "public write settings" ON public.site_settings;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Lock down SERVICES
DROP POLICY IF EXISTS "public read services" ON public.services;
DROP POLICY IF EXISTS "public write services" ON public.services;

CREATE POLICY "Anyone can read services"
  ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Lock down OFFERS
DROP POLICY IF EXISTS "public read offers" ON public.offers;
DROP POLICY IF EXISTS "public write offers" ON public.offers;

CREATE POLICY "Anyone can read offers"
  ON public.offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert offers"
  ON public.offers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update offers"
  ON public.offers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete offers"
  ON public.offers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Lock down GALLERY
DROP POLICY IF EXISTS "public read gallery" ON public.gallery;
DROP POLICY IF EXISTS "public write gallery" ON public.gallery;

CREATE POLICY "Anyone can read gallery"
  ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert gallery"
  ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery"
  ON public.gallery FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery"
  ON public.gallery FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Lock down STORAGE buckets (offer-images, gallery-images, site-assets)
-- Public read remains; only admins can write/delete.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname IN (
        'public read offer-images','public write offer-images','public update offer-images','public delete offer-images',
        'public read gallery-images','public write gallery-images','public update gallery-images','public delete gallery-images',
        'public read site-assets','public write site-assets','public update site-assets','public delete site-assets',
        'Public read offer-images','Public write offer-images',
        'Public read gallery-images','Public write gallery-images',
        'Public read site-assets','Public write site-assets'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public read salon buckets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('offer-images','gallery-images','site-assets'));

CREATE POLICY "Admins upload salon buckets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('offer-images','gallery-images','site-assets')
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins update salon buckets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('offer-images','gallery-images','site-assets')
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id IN ('offer-images','gallery-images','site-assets')
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins delete salon buckets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('offer-images','gallery-images','site-assets')
    AND public.has_role(auth.uid(), 'admin')
  );
