-- Drop the existing specific policies that were too restrictive
DROP POLICY IF EXISTS "Instructors can insert course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Instructors can update course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Instructors can delete course_lessons" ON public.course_lessons;

-- Create more inclusive policies that allow both Admins and the specific Course Instructor
CREATE POLICY "Admins or instructors can insert course_lessons"
    ON public.course_lessons
    FOR INSERT
    WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
        auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id)
    );

CREATE POLICY "Admins or instructors can update course_lessons"
    ON public.course_lessons
    FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
        auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id)
    );

CREATE POLICY "Admins or instructors can delete course_lessons"
    ON public.course_lessons
    FOR DELETE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
        auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_id)
    );
