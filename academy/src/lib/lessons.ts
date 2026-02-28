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
    phase_id?: string
    phase_title?: string
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

    // Join through phases -> phase_lessons -> lessons to fetch the actual lesson data
    const { data, error } = await supabase
        .from('phases')
        .select(`
            id,
            course_id,
            order_index,
            title,
            phase_lessons (
                order_index,
                lessons (*)
            )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching lessons:', error)
        return []
    }

    // Flatten the result so the frontend still gets a simple array of Lessons (ordered by phase then by lesson)
    const formattedLessons: Lesson[] = []

    // Ensure phases are sorted
    const sortedPhases = [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

    for (const phase of sortedPhases) {
        if (phase.phase_lessons) {
            const sortedPhaseLessons = [...phase.phase_lessons].sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            for (const pl of sortedPhaseLessons) {
                const lesson = Array.isArray(pl.lessons) ? pl.lessons[0] : pl.lessons
                if (lesson) {
                    formattedLessons.push({
                        ...lesson,
                        course_id: phase.course_id,
                        order_index: pl.order_index,
                        phase_id: phase.id,
                        phase_title: phase.title
                    } as Lesson)
                }
            }
        }
    }

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
