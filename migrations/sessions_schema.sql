-- Create Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cohort_id UUID REFERENCES cohorts(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Instructors can manage sessions for their cohorts
CREATE POLICY "Instructors can manage sessions" ON sessions
    USING (
        EXISTS (
            SELECT 1 FROM cohorts 
            WHERE cohorts.id = sessions.cohort_id 
            AND cohorts.instructor_id = auth.uid()
        )
    );

-- Students can view sessions for their cohort
CREATE POLICY "Students can view assigned sessions" ON sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments
            WHERE enrollments.cohort_id = sessions.cohort_id
            AND enrollments.user_id = auth.uid()
        )
    );
