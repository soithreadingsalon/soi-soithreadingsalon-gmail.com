CREATE OR REPLACE FUNCTION public.get_taken_slots(_date date)
RETURNS TABLE(preferred_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT preferred_time
  FROM public.appointments
  WHERE preferred_date = _date
    AND preferred_time IS NOT NULL
    AND status NOT IN ('cancelled','no_show');
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(date) TO anon, authenticated;