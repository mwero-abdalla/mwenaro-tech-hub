-- Migration: Add status to enrollments for payment gate
-- This will allow us to track if a user has paid for a course before granting access.

ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'active', 'cancelled'));

-- Backfill existing enrollments as 'active' 
-- (Assuming historical enrollments are already paid for or were free)
UPDATE public.enrollments SET status = 'active' WHERE status IS NULL;

-- If you have a course_payments table, we should ensure it's in sync.
-- But for now, the 'status' on enrollment is the source of truth for access.
