import { createClient } from './supabase/server'

export interface Lesson {
    id: string
    title: string
    content: string
    video_url?: string
    has_project: boolean
    created_at: string
    // Added by join queries:
    course_id?: string
    order_index?: number
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

    // We join through course_lessons to fetch the actual lesson data
    const { data, error } = await supabase
        .from('course_lessons')
        .select(`
            order_index,
            course_id,
            lessons (*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching lessons:', error)
        return []
    }

    // Flatten the result so the frontend still gets a simple array of Lessons
    const formattedLessons = data.map((item: any) => ({
        ...item.lessons,
        course_id: item.course_id,
        order_index: item.order_index
    })) as Lesson[]

    return formattedLessons
}

export async function getAllLessons(): Promise<Lesson[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all lessons:', error)
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
