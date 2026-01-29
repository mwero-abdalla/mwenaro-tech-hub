import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Fetch all lessons
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, has_project, course_id')

    if (lessonsError) return NextResponse.json({ error: lessonsError })

    // Fetch question counts
    const { data: questions, error: qError } = await supabase
        .from('questions')
        .select('lesson_id')

    const stats = lessons.map(l => ({
        id: l.id,
        title: l.title,
        has_project: l.has_project,
        question_count: questions?.filter(q => q.lesson_id === l.id).length || 0
    }))

    return NextResponse.json(stats)
}
