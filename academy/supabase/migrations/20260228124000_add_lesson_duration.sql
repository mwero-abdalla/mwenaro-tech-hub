-- Add duration_minutes to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30;

-- Update existing lessons to have a default value if needed (optional since we set DEFAULT)
-- COMMENTED OUT: UPDATE public.lessons SET duration_minutes = 30 WHERE duration_minutes IS NULL;
