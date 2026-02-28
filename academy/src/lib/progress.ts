'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { getCourseLessons, getLessonQuestions } from './lessons'
import { createNotification } from './notifications'
import { sendNotificationEmail } from './email'
import { analyzeProject } from './ai'
import { updateLearningStreak } from './streaks'

export interface LessonProgress {
    user_id: string
    lesson_id: string
    is_completed: boolean
    quiz_attempts: number
    highest_quiz_score: number
    project_repo_link: string | null
    completed_at: string | null
    project_reviewed: boolean
    project_rating: number | null
    reviewed_by: string | null
    reviewed_at: string | null
    project_feedback: string | null
}

export interface QuizSubmission {
    id: string
    user_id: string
    lesson_id: string
    answers: number[]
    score: number
    passed: boolean
    created_at: string
    // Joined data
    profiles?: { full_name: string | null; email: string | null }
    lessons?: {
        title: string;
        phase_lessons?: any[];
    }
}

export async function getUserProgress(): Promise<LessonProgress[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching user progress:', error)
        return []
    }

    return data as LessonProgress[]
}

export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

    return data as LessonProgress
}

export async function getCourseProgress(courseId: string): Promise<LessonProgress[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const lessons = await getCourseLessons(courseId)
    const lessonIds = lessons.map(l => l.id)

    const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds)

    if (error) {
        console.error('Error fetching course progress:', error)
        return []
    }

    return data as LessonProgress[]
}

export async function isLessonLocked(courseId: string, lessonId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return true // Locked if no user
    if (user.user_metadata?.role === 'admin') return false

    const lessons = await getCourseLessons(courseId)
    const currentLessonIndex = lessons.findIndex(l => l.id === lessonId)

    if (currentLessonIndex <= 0) return false // First lesson is always unlocked

    const previousLesson = lessons[currentLessonIndex - 1]

    // Check if previous lesson is completed
    const { data } = await supabase
        .from('lesson_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('lesson_id', previousLesson.id)
        .single()

    return !data?.is_completed
}

export async function submitQuiz(lessonId: string, answers: number[]): Promise<{
    success: boolean;
    score: number;
    passed: boolean;
    message: string;
    correctAnswers?: number[];
    streakData?: { current_streak: number; is_milestone: boolean; milestone_value: number }
}> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Fetch lesson and existing progress
    const { data: lesson } = await supabase
        .from('lessons')
        .select('has_project')
        .eq('id', lessonId)
        .single()

    const progress = await getLessonProgress(lessonId)
    const attempts = progress?.quiz_attempts || 0

    if (attempts >= 2) {
        return { success: false, score: 0, passed: false, message: 'Max attempts reached' }
    }

    // Calculate score
    const questions = await getLessonQuestions(lessonId)
    if (questions.length === 0) return { success: true, score: 0, passed: true, message: 'No questions' }

    const correctAnswers = questions.map(q => q.correct_answer)
    let correctCount = 0
    questions.forEach((q, index) => {
        if (answers[index] === q.correct_answer) {
            correctCount++
        }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= 70 // 70% passing grade

    // Determine completion: 
    // Completed ONLY IF (passed AND (no project required OR project already submitted))
    const hasProjectRequirement = lesson?.has_project || false
    const projectDone = !!progress?.project_repo_link
    const isCompletedNow = passed && (!hasProjectRequirement || projectDone)

    // Update progress
    const { error: progressError } = await supabase
        .from('lesson_progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            quiz_attempts: attempts + 1,
            highest_quiz_score: Math.max(score, progress?.highest_quiz_score || 0),
            is_completed: isCompletedNow,
            completed_at: isCompletedNow ? new Date().toISOString() : (progress?.completed_at || null)
        })

    if (progressError) {
        console.error('Error submitting quiz progress:', progressError)
        throw new Error('Failed to save progress')
    }

    // Persist the individual submission attempt
    const { error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
            user_id: user.id,
            lesson_id: lessonId,
            answers: answers,
            score: score,
            passed: passed
        })

    if (submissionError) {
        console.error('Error persisting quiz submission:', submissionError)
        // We don't throw here to avoid failing the whole process if just the history fails, 
        // but in a production app we might want stricter consistency.
    }

    // Update learning streak if lesson is completed
    let streakData
    if (isCompletedNow && !progress?.is_completed) {
        const result = await updateLearningStreak(user.id)
        if (result) {
            streakData = result
        }
    }

    revalidatePath(`/courses`)
    return { success: true, score, passed, message: passed ? 'Quiz passed!' : 'Quiz failed. Try again.', correctAnswers, streakData }
}

export async function submitProject(lessonId: string, repoLink: string): Promise<{ streakData?: { current_streak: number; is_milestone: boolean; milestone_value: number } }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Fetch existing progress and questions
    const progress = await getLessonProgress(lessonId)
    const questions = await getLessonQuestions(lessonId)

    // Check if project has been reviewed (locked)
    if (progress?.project_reviewed) {
        throw new Error('Project has been reviewed and cannot be updated')
    }

    // Determine completion:
    // Completed ONLY IF (submitting project AND (no questions OR quiz already passed))
    const hasQuizRequirement = questions.length > 0
    const quizPassed = (progress?.highest_quiz_score || 0) >= 70
    const isCompletedNow = !hasQuizRequirement || quizPassed

    const { error } = await supabase
        .from('lesson_progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            project_repo_link: repoLink,
            is_completed: isCompletedNow,
            completed_at: isCompletedNow ? new Date().toISOString() : (progress?.completed_at || null),
            // Reset review status when updating submission
            project_reviewed: false,
            project_rating: null,
            reviewed_by: null,
            reviewed_at: null,
            project_feedback: null
        })

    if (error) {
        console.error('Error submitting project:', error)
        throw new Error('Failed to submit project')
    }

    // Update learning streak if lesson is completed
    let streakData
    if (isCompletedNow && !progress?.is_completed) {
        const result = await updateLearningStreak(user.id)
        if (result) {
            streakData = result
        }
    }

    // Trigger AI Analysis asynchronously
    analyzeProject(lessonId, repoLink, user.id).catch(err => {
        console.error('Triggering AI analysis failed:', err)
    })

    revalidatePath(`/courses`)
    return { streakData }
}

export async function reviewProject(
    lessonId: string,
    studentUserId: string,
    rating: number,
    feedback?: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Check if user is an instructor
    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') {
        throw new Error('Unauthorized: Only instructors can review projects')
    }

    if (rating < 0 || rating > 100) {
        throw new Error('Rating must be between 0 and 100')
    }

    const { error } = await supabase
        .from('lesson_progress')
        .update({
            project_reviewed: true,
            project_rating: rating,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            project_feedback: feedback || null
        })
        .eq('user_id', studentUserId)
        .eq('lesson_id', lessonId)

    if (error) {
        console.error('Error reviewing project:', error)
        throw new Error('Failed to review project')
    }

    // Notify student
    try {
        await createNotification({
            user_id: studentUserId,
            type: 'review',
            title: 'Project Reviewed',
            content: `Your project submission for "${lessonId}" has been reviewed by the instructor. Grade: ${rating}%`,
            link: `/courses` // Or specific lesson link
        })

        const { data: sUser } = await supabase.auth.admin.getUserById(studentUserId)
        if (sUser.user?.email) {
            await sendNotificationEmail(sUser.user.email, 'Project Reviewed', `Your project submission has been reviewed. Grade: ${rating}%.`, '/courses')
        }
    } catch (e) {
        console.error('Failed to send review notification:', e)
    }

    revalidatePath(`/courses`)
    revalidatePath(`/instructor`)
}

export async function getUserQuizzes(): Promise<QuizSubmission[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
            *,
            lessons (
                title,
                phase_lessons (
                    phases (
                        courses (
                            id,
                            title
                        )
                    )
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user quizzes:', error)
        return []
    }

    return data as QuizSubmission[]
}

export async function getAllQuizzes(): Promise<QuizSubmission[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []
    const role = user.user_metadata?.role || 'student'
    if (role !== 'admin' && role !== 'instructor') return []

    const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
            *,
            profiles (full_name, email),
            lessons (
                title,
                phase_lessons (
                    phases (
                        courses (
                            id,
                            title
                        )
                    )
                )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all quizzes:', error)
        return []
    }

    return data as QuizSubmission[]
}

export async function getQuizSubmission(id: string): Promise<QuizSubmission | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
            *,
            profiles (full_name, email),
            lessons (
                title,
                phase_lessons (
                    phases (
                        courses (
                            id,
                            title
                        )
                    )
                )
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching quiz submission:', error)
        return null
    }

    return data as QuizSubmission
}

export async function getLatestQuizSubmission(lessonId: string): Promise<QuizSubmission | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest quiz submission:', error)
        return null
    }

    return data as QuizSubmission | null
}

export interface QuizReviewData {
    id: string
    score: number
    passed: boolean
    created_at: string
    questions: {
        id: string
        question_text: string
        options: string[]
        correct_answer: number
        explanation: string | null
    }[]
    user_answers: number[]
}

export async function getQuizReview(submissionId: string): Promise<QuizReviewData | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch submission
    const { data: submission, error: subError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('id', submissionId)
        .single()

    if (subError || !submission) {
        console.error('Error fetching quiz submission for review:', subError)
        return null
    }

    // Authorization check: only the owner, instructor, or admin can view
    const role = user.user_metadata?.role || 'student'
    if (submission.user_id !== user.id && role !== 'admin' && role !== 'instructor') {
        return null
    }

    // Fetch questions for the lesson
    const { data: questions, error: qError } = await supabase
        .from('questions')
        .select('id, question_text, options, correct_answer, explanation')
        .eq('lesson_id', submission.lesson_id)
        // Maintain the same ordering as when they took the quiz. 
        // We're assuming created_at is standard. Order index would be better if it existed.
        .order('created_at', { ascending: true })

    if (qError || !questions) {
        console.error('Error fetching questions for review:', qError)
        return null
    }

    return {
        id: submission.id,
        score: submission.score,
        passed: submission.passed,
        created_at: submission.created_at,
        questions: questions as any[], // Casting options directly to any[] because supabase jsonb is returned as object/array directly
        user_answers: submission.answers
    }
}
