import { createClient } from './supabase/server'

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
            )
        `)
        .not('project_repo_link', 'is', null)
        .in('user_id', studentIds) // Filter by my students
        .order('completed_at', { ascending: false })

    if (error) {
        console.error('Error fetching submissions:', error)
        throw new Error('Failed to fetch submissions')
    }

    // Fetch user details for each submission
    const userIds = [...new Set(data.map(s => s.user_id))]
    const { data: users } = await supabase.auth.admin.listUsers()

    const userMap = new Map(
        users?.users.map(u => [u.id, { email: u.email, name: u.user_metadata?.name }]) || []
    )

    return data.map(submission => ({
        user_id: submission.user_id,
        lesson_id: submission.lesson_id,
        project_repo_link: submission.project_repo_link!,
        project_reviewed: submission.project_reviewed,
        project_rating: submission.project_rating,
        project_feedback: submission.project_feedback,
        reviewed_at: submission.reviewed_at,
        submitted_at: submission.completed_at,
        student_email: userMap.get(submission.user_id)?.email || 'Unknown',
        student_name: userMap.get(submission.user_id)?.name || null,
        lesson_title: (submission.lessons as any).title,
        course_title: (submission.lessons as any).courses.title,
        course_id: (submission.lessons as any).courses.id,
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
            )
        `)
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .not('project_repo_link', 'is', null)
        .single()

    if (error || !data) {
        return null
    }

    // Fetch user details
    const { data: { user } } = await supabase.auth.admin.getUserById(userId)

    return {
        user_id: data.user_id,
        lesson_id: data.lesson_id,
        project_repo_link: data.project_repo_link!,
        project_reviewed: data.project_reviewed,
        project_rating: data.project_rating,
        project_feedback: data.project_feedback,
        reviewed_at: data.reviewed_at,
        submitted_at: data.completed_at,
        student_email: user?.email || 'Unknown',
        student_name: user?.user_metadata?.name || null,
        lesson_title: (data.lessons as any).title,
        course_title: (data.lessons as any).courses.title,
        course_id: (data.lessons as any).courses.id,
    }
}
