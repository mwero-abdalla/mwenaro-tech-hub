-- RLS Policies for Admin Cohort Management

-- Allow admins to insert cohorts
CREATE POLICY "Admins can insert cohorts" ON cohorts
    FOR INSERT
    WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Allow admins to update cohorts
CREATE POLICY "Admins can update cohorts" ON cohorts
    FOR UPDATE
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Allow admins to delete cohorts
CREATE POLICY "Admins can delete cohorts" ON cohorts
    FOR DELETE
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
