-- Backfill quiz_submissions from lesson_progress
-- This takes the highest score for each student/lesson pair and creates an entry in quiz_submissions
-- so the instructor dashboard isn't empty.

INSERT INTO public.quiz_submissions (user_id, lesson_id, answers, score, passed, created_at)
SELECT 
    user_id, 
    lesson_id, 
    '{}'::integer[], -- We don't have the actual answers, but we need the entry
    highest_quiz_score, 
    highest_quiz_score >= 70,
    COALESCE(completed_at, NOW())
FROM public.lesson_progress
WHERE quiz_attempts > 0
ON CONFLICT DO NOTHING;
