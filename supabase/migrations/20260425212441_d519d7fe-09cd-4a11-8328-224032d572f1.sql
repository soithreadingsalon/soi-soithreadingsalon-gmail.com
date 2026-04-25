
-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Offers
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount TEXT NOT NULL,
  expires_on DATE,
  terms TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_category TEXT,
  service TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact Inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service_interest TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (single-row config)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  salon_name TEXT NOT NULL DEFAULT 'SOI Threading Salon',
  tagline TEXT NOT NULL DEFAULT 'Style of India',
  phone TEXT NOT NULL DEFAULT '551-301-3894',
  email TEXT NOT NULL DEFAULT 'soithreadingsalon@gmail.com',
  address TEXT NOT NULL DEFAULT '190 Hamburg Tpke, Wayne, NJ 07470',
  website TEXT NOT NULL DEFAULT 'www.soithreadingandsalon.com',
  instagram TEXT NOT NULL DEFAULT '@SOITHREADINGSALON',
  hours_weekday TEXT NOT NULL DEFAULT '10:00 AM – 7:00 PM',
  hours_saturday TEXT NOT NULL DEFAULT '10:00 AM – 6:00 PM',
  hours_sunday TEXT NOT NULL DEFAULT '11:00 AM – 4:00 PM',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=190+Hamburg+Tpke+Wayne+NJ+07470',
  hero_headline TEXT NOT NULL DEFAULT 'Enhance. Refresh. Radiate.',
  hero_subheadline TEXT NOT NULL DEFAULT 'Experience expert threading, advanced skin care, waxing, hair care, henna, and timeless beauty services in Wayne, NJ.',
  about_text TEXT NOT NULL DEFAULT 'SOI Threading Salon brings timeless Indian beauty traditions together with modern salon care.',
  instagram_qr_url TEXT,
  google_qr_url TEXT,
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

INSERT INTO public.site_settings (id) VALUES (1);

-- RLS: public read everywhere; public write allowed (admin-managed UI, test creds gating)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read (services, offers, gallery, settings)
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "public read offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);

-- Public write for admin-managed content (gated in UI by demo creds)
CREATE POLICY "public write services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Appointments and inquiries: anyone can submit (insert), anyone (admin UI) can read/update
CREATE POLICY "public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "public read appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "public update appointments" ON public.appointments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete appointments" ON public.appointments FOR DELETE USING (true);

CREATE POLICY "public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "public read inquiries" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "public update inquiries" ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete inquiries" ON public.inquiries FOR DELETE USING (true);
