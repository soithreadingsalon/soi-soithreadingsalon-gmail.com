DROP FUNCTION IF EXISTS public.grant_first_user_admin() CASCADE;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role
        OR (role = 'superadmin'::public.app_role AND _role = 'admin'::public.app_role)
      )
  )
$function$;

UPDATE public.user_roles
SET role = 'superadmin'::public.app_role
WHERE user_id = '97ff7bec-3dde-4c5e-8bf3-55d3221d1ac6';