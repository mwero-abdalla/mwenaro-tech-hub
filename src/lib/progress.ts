'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { getCourseLessons, getLessonQuestions } from './lessons'

export interface LessonProgress {
    user_id: string
    lesson_id: string
    is_completed: boolean
    quiz_attempts: number
    highest_quiz_score: number
    project_repo_link: string | null
    completed_at: string | null
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

export async function submitQuiz(lessonId: string, answers: number[]): Promise<{ success: boolean; score: number; passed: boolean; message: string }> {
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
    const { error } = await supabase
        .from('lesson_progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            quiz_attempts: attempts + 1,
            highest_quiz_score: Math.max(score, progress?.highest_quiz_score || 0),
            is_completed: isCompletedNow,
            completed_at: isCompletedNow ? new Date().toISOString() : (progress?.completed_at || null)
        })

    if (error) {
        console.error('Error submitting quiz:', error)
        throw new Error('Failed to save progress')
    }

    revalidatePath(`/courses`)
    return { success: true, score, passed, message: passed ? 'Quiz passed!' : 'Quiz failed. Try again.' }
}

export async function submitProject(lessonId: string, repoLink: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Fetch existing progress and questions
    const progress = await getLessonProgress(lessonId)
    const questions = await getLessonQuestions(lessonId)

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
            completed_at: isCompletedNow ? new Date().toISOString() : (progress?.completed_at || null)
        })

    if (error) {
        console.error('Error submitting project:', error)
        throw new Error('Failed to submit project')
    }

    revalidatePath(`/courses`)
}
