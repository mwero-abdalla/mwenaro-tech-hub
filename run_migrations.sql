-- Combined Migration Script
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/byxlbeminhhrkvztmdge/sql

-- ============================================
-- PART 1: Add Project Review Fields
-- ============================================

ALTER TABLE lesson_progress 
ADD COLUMN IF NOT EXISTS project_reviewed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS project_rating integer CHECK (project_rating >= 0 AND project_rating <= 100),
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS project_feedback text;

CREATE INDEX IF NOT EXISTS idx_lesson_progress_reviewed_by ON lesson_progress(reviewed_by);

-- ============================================
-- PART 2: Ensure All Lessons Have Tasks
-- ============================================

-- Enable projects for ALL lessons
UPDATE lessons SET has_project = true WHERE has_project = false OR has_project IS NULL;

-- Add quiz questions for lessons missing them
DO $$
DECLARE
    react_course_id uuid;
    lesson_state_props_id uuid;
    lesson_useeffect_id uuid;
BEGIN
    -- Get the React course ID
    SELECT id INTO react_course_id FROM courses WHERE title = 'Intro to React' LIMIT 1;
    
    IF react_course_id IS NOT NULL THEN
        -- Get lesson IDs
        SELECT id INTO lesson_state_props_id FROM lessons 
        WHERE course_id = react_course_id AND title = 'State and Props' LIMIT 1;
        
        SELECT id INTO lesson_useeffect_id FROM lessons 
        WHERE course_id = react_course_id AND title = 'useEffect Hook' LIMIT 1;

        -- Add questions for "State and Props" (currently has 0)
        IF lesson_state_props_id IS NOT NULL THEN
            INSERT INTO questions (lesson_id, question_text, options, correct_answer) VALUES
            (lesson_state_props_id, 'What is the main difference between state and props?', '["Props are immutable and passed from parent, state is managed within the component", "Props are used for styling, state for data", "There is no difference"]'::jsonb, 0),
            (lesson_state_props_id, 'How do you update state in a functional component?', '["this.setState()", "useState hook", "Directly assigning a value"]'::jsonb, 1),
            (lesson_state_props_id, 'When should you use props vs state?', '["Use props for data passed from parent, state for component-specific data", "Always use state", "Always use props"]'::jsonb, 0)
            ON CONFLICT DO NOTHING;
        END IF;

        -- Add questions for "useEffect Hook" (currently has 0)
        IF lesson_useeffect_id IS NOT NULL THEN
            INSERT INTO questions (lesson_id, question_text, options, correct_answer) VALUES
            (lesson_useeffect_id, 'What is the purpose of useEffect?', '["To perform side effects in functional components", "To create state variables", "To render components"]'::jsonb, 0),
            (lesson_useeffect_id, 'When does useEffect run by default?', '["After every render", "Only on mount", "Only on unmount"]'::jsonb, 0),
            (lesson_useeffect_id, 'How do you run useEffect only once on mount?', '["Pass an empty dependency array []", "Pass no second argument", "Pass null as second argument"]'::jsonb, 0)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
    l.title,
    l.has_project,
    COUNT(q.id) as question_count
FROM lessons l
LEFT JOIN questions q ON l.id = q.lesson_id
GROUP BY l.id, l.title, l.has_project
ORDER BY l.title;
