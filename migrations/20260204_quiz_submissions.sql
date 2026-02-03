-- Create quiz_submissions table to persist every attempt
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    answers INTEGER[] NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Learners can view their own submissions
CREATE POLICY "Learners can view own quiz submissions"
    ON public.quiz_submissions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins and Instructors can view all submissions
CREATE POLICY "Admins/Instructors can view all quiz submissions"
    ON public.quiz_submissions FOR SELECT
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor')
    );

-- System can insert submissions (via service role/authenticated actions)
CREATE POLICY "Users can insert own quiz submissions"
    ON public.quiz_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
