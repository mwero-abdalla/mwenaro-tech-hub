-- Migration: Add access_until to enrollments
-- Allows admins to grant temporary access to courses.

ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS access_until TIMESTAMP WITH TIME ZONE;

-- (Optional) Add a comment for clarity
COMMENT ON COLUMN public.enrollments.access_until IS 'The timestamp until which the user has temporary access, regardless of payment status.';
