import { createClient } from './supabase/server'
import { createAdminClient } from './supabase/admin'
import { User } from '@supabase/supabase-js'

export interface SubmissionWithDetails {
    user_id: string
    lesson_id: string
    project_repo_link: string
    project_reviewed: boolean
    project_rating: number | null
    project_feedback: string | null
    reviewed_at: string | null
    student_email: string
    student_name: string | null
    lesson_title: string
    course_title: string
    course_id: string
    submitted_at: string | null
    ai_rating: number | null
    ai_feedback: string | null
    ai_status: string | null
}

/**
 * Check if the current user is an instructor
 */
export async function isInstructor(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    // Check role in user metadata
    const role = user.user_metadata?.role || 'student'
    return role === 'instructor'
}

/**
 * Get all project submissions (instructor only)
 */
export async function getAllSubmissions(): Promise<SubmissionWithDetails[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Check if user is instructor
    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        throw new Error('Unauthorized: Instructor access required')
    }

    // 1. Get Cohorts assigned to this instructor
    const { data: myCohorts, error: cohortError } = await supabase
        .from('cohorts')
        .select('id')
        .eq('instructor_id', user.id)

    if (cohortError) {
        console.error('Error fetching cohorts:', cohortError)
        throw new Error('Failed to fetch instructor cohorts')
    }

    const cohortIds = myCohorts.map(c => c.id)

    // If no cohorts assigned, return empty (or decided if they should see unassigned students? Strict mode: NO)
    if (cohortIds.length === 0) {
        return []
    }

    // 2. data fetch - Join with enrollments to filter by cohort
    // Supabase JS doesn't support complex joins in one go easily for this specific filtering without views or RPC.
    // However, we can fetch submissions and filter, OR fetch enrollments first.
    // Best approach given the foreign keys: 
    // Fetch users in my cohorts first.

    const { data: enrolledStudents, error: enrollError } = await supabase
        .from('enrollments')
        .select('user_id')
        .in('cohort_id', cohortIds)

    if (enrollError) throw new Error('Failed to fetch enrolled students')

    const studentIds = enrolledStudents.map(e => e.user_id)

    if (studentIds.length === 0) return []

    const { data, error } = await supabase
        .from('lesson_progress')
        .select(`
            user_id,
            lesson_id,
            project_repo_link,
            project_reviewed,
            project_rating,
            project_feedback,
            reviewed_at,
            completed_at,
            lessons!inner(
                id,
                title,
                courses!inner(
                    id,
                    title
                )
            ),
            ai_rating,
            ai_feedback,
            ai_status
        `)
        .not('project_repo_link', 'is', null)
        .in('user_id', studentIds) // Filter by my students
        .order('completed_at', { ascending: false })

    if (error) {
        console.error('Error fetching submissions:', error)
        throw new Error('Failed to fetch submissions')
    }

    // Fetch user details for each submission from the profiles table
    const submissionUserIds = [...new Set(data.map(s => s.user_id))]

    // We'll use the profiles table for names and fallback to auth for emails if needed
    // Using admin client for broader visibility if RLS is strict
    const adminSupabase = createAdminClient()
    const { data: profiles } = await adminSupabase
        .from('profiles')
        .select('id, full_name')
        .in('id', submissionUserIds)

    const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])

    // For emails, we still need to hit auth.admin.listUsers() or have emails in profiles.
    // Since emails are sensitive, instructors fetching all emails might be limited unless using admin client.
    const { data: authData } = await adminSupabase.auth.admin.listUsers()
    const emailMap = new Map(authData?.users.map(u => [u.id, u.email]) || [])

    return data.map(submission => ({
        user_id: submission.user_id,
        lesson_id: submission.lesson_id,
        project_repo_link: submission.project_repo_link!,
        project_reviewed: submission.project_reviewed,
        project_rating: submission.project_rating,
        project_feedback: submission.project_feedback,
        reviewed_at: submission.reviewed_at,
        submitted_at: submission.completed_at,
        student_email: emailMap.get(submission.user_id) || 'Unknown',
        student_name: profileMap.get(submission.user_id) || null,
        lesson_title: (submission.lessons as any).title,
        course_title: (submission.lessons as any).courses.title,
        course_id: (submission.lessons as any).courses.id,
        ai_rating: (submission as any).ai_rating,
        ai_feedback: (submission as any).ai_feedback,
        ai_status: (submission as any).ai_status,
    }))
}

/**
 * Get pending submissions (not yet reviewed)
 */
export async function getPendingSubmissions(): Promise<SubmissionWithDetails[]> {
    const allSubmissions = await getAllSubmissions()
    return allSubmissions.filter(s => !s.project_reviewed)
}

/**
 * Get submissions for a specific course
 */
export async function getSubmissionsByCourse(courseId: string): Promise<SubmissionWithDetails[]> {
    const allSubmissions = await getAllSubmissions()
    return allSubmissions.filter(s => s.course_id === courseId)
}

/**
 * Get submissions for a specific lesson
 */
export async function getSubmissionsByLesson(lessonId: string): Promise<SubmissionWithDetails[]> {
    const allSubmissions = await getAllSubmissions()
    return allSubmissions.filter(s => s.lesson_id === lessonId)
}

/**
 * Get a specific student's submission for a lesson
 */
export async function getStudentSubmission(
    userId: string,
    lessonId: string
): Promise<SubmissionWithDetails | null> {
    const supabase = await createClient()

    if (!await isInstructor()) {
        throw new Error('Unauthorized: Instructor access required')
    }

    const { data, error } = await supabase
        .from('lesson_progress')
        .select(`
            user_id,
            lesson_id,
            project_repo_link,
            project_reviewed,
            project_rating,
            project_feedback,
            reviewed_at,
            completed_at,
            lessons!inner(
                id,
                title,
                content,
                courses!inner(
                    id,
                    title
                )
            ),
            ai_rating,
            ai_feedback,
            ai_status
        `)
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .not('project_repo_link', 'is', null)
        .single()

    if (error || !data) {
        return null
    }

    // Fetch student details from profiles and auth
    const adminSupabase = createAdminClient()
    const [{ data: profile }, { data: { user: authUser } }] = await Promise.all([
        adminSupabase.from('profiles').select('full_name').eq('id', userId).single(),
        adminSupabase.auth.admin.getUserById(userId)
    ])

    return {
        user_id: data.user_id,
        lesson_id: data.lesson_id,
        project_repo_link: data.project_repo_link!,
        project_reviewed: data.project_reviewed,
        project_rating: data.project_rating,
        project_feedback: data.project_feedback,
        reviewed_at: data.reviewed_at,
        submitted_at: data.completed_at,
        student_email: authUser?.email || 'Unknown',
        student_name: profile?.full_name || null,
        lesson_title: (data.lessons as any).title,
        course_title: (data.lessons as any).courses.title,
        course_id: (data.lessons as any).courses.id,
        ai_rating: (data as any).ai_rating,
        ai_feedback: (data as any).ai_feedback,
        ai_status: (data as any).ai_status,
    }
}

/**
 * Get instructor-specific stats
 */
export async function getInstructorStats(instructorId: string) {
    const supabase = await createClient()

    // 1. Get cohorts assigned to this instructor (and their course IDs)
    const { data: cohorts } = await supabase
        .from('cohorts')
        .select('id, course_id')
        .eq('instructor_id', instructorId)

    const cohortIds = cohorts?.map(c => c.id) || []
    const cohortCourseIds = cohorts?.map(c => c.course_id) || []

    // 2. Total unique courses this instructor is involved in
    // Either as course owner OR as an instructor of a cohort in that course
    const { data: ownedCourses } = await supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', instructorId)

    const ownedCourseIds = ownedCourses?.map(c => c.id) || []
    const allUniqueCourseIds = new Set([...ownedCourseIds, ...cohortCourseIds])

    // 3. Total Students in cohorts assigned to this instructor
    let studentsCount = 0
    if (cohortIds.length > 0) {
        const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .in('cohort_id', cohortIds)
        studentsCount = count || 0
    }

    return {
        totalCourses: allUniqueCourseIds.size,
        totalStudents: studentsCount,
        totalCohorts: cohortIds.length
    }
}

export interface EnrolledStudent {
    id: string
    user_id: string
    email: string
    full_name: string | null
    course_title: string
    cohort_name: string
    enrolled_at: string
    is_completed: boolean
}

/**
 * Get all students enrolled in an instructor's cohorts
 */
export async function getInstructorStudents(instructorId: string): Promise<EnrolledStudent[]> {
    const supabase = await createClient()

    // 1. Get cohorts led by this instructor
    const { data: cohorts } = await supabase
        .from('cohorts')
        .select(`
            id,
            name,
            course_id,
            courses (title)
        `)
        .eq('instructor_id', instructorId)

    if (!cohorts || cohorts.length === 0) return []

    const cohortIds = cohorts.map(c => c.id)

    // 2. Get enrollments for these cohorts
    // We'll join with auth via a hypothetical profiles table or just use emails if available
    // For now, we'll try to get enrollment and nested user info
    const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
            user_id,
            cohort_id,
            enrolled_at,
            course_id
        `)
        .in('cohort_id', cohortIds)

    if (error || !enrollments) {
        console.error('Error fetching enrollments:', error)
        return []
    }

    // 3. Get user details (using profiles table for names, auth for emails)
    const adminSupabase = createAdminClient()
    const [{ data: authUsers }, { data: profiles }] = await Promise.all([
        adminSupabase.auth.admin.listUsers(),
        adminSupabase.from('profiles').select('id, full_name')
    ])

    // Create maps for fast lookup
    const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || [])
    const emailMap = new Map(authUsers?.users.map(u => [u.id, u.email]) || [])

    const cohortMap = new Map(cohorts.map(c => [c.id, {
        name: c.name,
        course_title: (c.courses as any)?.title || 'Unknown Course'
    }]))

    // 4. Transform to EnrolledStudent format
    const students: EnrolledStudent[] = enrollments.map(e => {
        const email = emailMap.get(e.user_id) || 'unknown'
        const fullName = profileMap.get(e.user_id) || email.split('@')[0] || 'Student'
        const cohort = cohortMap.get(e.cohort_id)

        return {
            id: `${e.user_id}-${e.cohort_id}`,
            user_id: e.user_id,
            email: email,
            full_name: fullName,
            course_title: cohort?.course_title || 'Unknown',
            cohort_name: cohort?.name || 'Unknown',
            enrolled_at: e.enrolled_at,
            is_completed: false
        }
    })

    return students
}
