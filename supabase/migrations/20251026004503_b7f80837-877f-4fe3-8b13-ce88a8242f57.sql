-- Remove super_admin role from the system
-- First, remove any existing super_admin role assignments
DELETE FROM public.user_roles WHERE role = 'super_admin';

-- Drop dependent policies
DROP POLICY IF EXISTS "Only super admins can modify roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;

-- Drop the has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Update the app_role enum to remove super_admin
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('agency', 'subaccount');

-- Update user_roles table to use new enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Drop old enum
DROP TYPE public.app_role_old CASCADE;

-- Recreate has_role function with new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

-- Recreate RLS policy - only users can read their own roles
CREATE POLICY "Users can read their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);