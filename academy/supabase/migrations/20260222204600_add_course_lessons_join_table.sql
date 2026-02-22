-- Create the course_lessons join table
CREATE TABLE public.course_lessons (
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
    order_index integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (course_id, lesson_id)
);

-- Enable RLS on the new table
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for course_lessons
CREATE POLICY "Public read access for course_lessons"
    ON public.course_lessons
    FOR SELECT
    USING (true);

CREATE POLICY "Instructors can insert course_lessons"
    ON public.course_lessons
    FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id));

CREATE POLICY "Instructors can update course_lessons"
    ON public.course_lessons
    FOR UPDATE
    USING (auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id));

CREATE POLICY "Instructors can delete course_lessons"
    ON public.course_lessons
    FOR DELETE
    USING (auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id));


-- Migrate existing data from lessons table
-- If there are no rows, this will safely do nothing
INSERT INTO public.course_lessons (course_id, lesson_id, order_index)
SELECT course_id, id, COALESCE(order_index, 0)
FROM public.lessons
WHERE course_id IS NOT NULL;


-- Optional: Remove the old columns from the lessons table.
-- Doing this now makes sure the application correctly fails and forces us to use the new join table logic.
-- Note: You can comment this out if you're worried about breaking changes, 
-- but since we're adapting the frontend in this PR, it's safer to enforce it.
ALTER TABLE public.lessons 
DROP COLUMN IF EXISTS course_id,
DROP COLUMN IF EXISTS order_index;
