ALTER TABLE public.site_settings ALTER COLUMN hours_sunday SET DEFAULT 'Closed';
UPDATE public.site_settings SET hours_sunday = 'Closed' WHERE id = 1;