-- Create Instructor Payments Table
CREATE TABLE IF NOT EXISTS instructor_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    period_start DATE,
    period_end DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE instructor_payments ENABLE ROW LEVEL SECURITY;

-- Instructors can view their own payments
CREATE POLICY "Instructors can view own payments" ON instructor_payments
    FOR SELECT
    USING (auth.uid() = instructor_id);
