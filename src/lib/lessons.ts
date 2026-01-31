import { createClient } from './supabase/server'

export interface Lesson {
    id: string
    course_id: string
    title: string
    content: string
    video_url?: string
    order_index: number
    has_project: boolean
    created_at: string
}

export interface Question {
    id: string
    lesson_id: string
    question_text: string
    options: string[]
    correct_answer: number
    explanation?: string
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching lessons:', error)
        return []
    }

    return data as Lesson[]
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (error) {
        console.error('Error fetching lesson:', error)
        return null
    }

    return data as Lesson
}

export async function getLessonQuestions(lessonId: string): Promise<Question[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId)

    if (error) {
        console.error('Error fetching questions:', error)
        return []
    }

    return data as Question[]
}
