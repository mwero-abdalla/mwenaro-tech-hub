-- Create Cohorts Table
CREATE TABLE IF NOT EXISTS cohorts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) NOT NULL,
    instructor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Cohort ID to Enrollments
-- We check if the column exists first to be safe, though purely adding is fine for a migration
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'cohort_id') THEN
        ALTER TABLE enrollments ADD COLUMN cohort_id UUID REFERENCES cohorts(id);
    END IF;
END $$;

-- Enable RLS (Row Level Security) if not already enabled
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- Policies for Cohorts (Simplified for now)
-- Instructors can view their own cohorts
CREATE POLICY "Instructors can view assigned cohorts" ON cohorts
    FOR SELECT
    USING (auth.uid() = instructor_id);

-- Admins (service role) or everyone for now (to see names) might need access
-- For simplicity in this demo, we'll allow authenticated users to view cohorts (so students can see their cohort name)
CREATE POLICY "Authenticated users can view cohorts" ON cohorts
    FOR SELECT
    USING (auth.role() = 'authenticated');
    
-- Instructors can view enrollments for their cohorts
CREATE POLICY "Instructors can view enrollments in their cohorts" ON enrollments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cohorts 
            WHERE cohorts.id = enrollments.cohort_id 
            AND cohorts.instructor_id = auth.uid()
        )
    );
