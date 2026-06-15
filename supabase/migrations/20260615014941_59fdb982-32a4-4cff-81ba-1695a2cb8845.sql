INSERT INTO public.appointments_deleted (original_id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, internal_notes, google_event_id, calendar_synced_at, original_created_at, deleted_at, deleted_by)
SELECT id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, internal_notes, google_event_id, calendar_synced_at, created_at, now(), NULL
FROM public.appointments
WHERE id IN ('b79211d3-3338-442d-9418-f15e69defd54','c0074d04-5c59-485c-8b50-788cf58d2355');

DELETE FROM public.appointments WHERE id IN ('b79211d3-3338-442d-9418-f15e69defd54','c0074d04-5c59-485c-8b50-788cf58d2355');