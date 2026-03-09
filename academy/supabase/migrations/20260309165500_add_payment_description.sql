-- Add description column to course_payments table
ALTER TABLE IF EXISTS course_payments
ADD COLUMN IF NOT EXISTS description text;
