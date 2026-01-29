import { createClient } from './supabase/server'

export interface Course {
    id: string
    title: string
    description: string
    price: number
    image_url: string
    created_at: string
}

export async function getCourses(): Promise<Course[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching courses:', error)
        return []
    }

    return data as Course[]
}

export async function getCourse(id: string): Promise<Course | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(`Error fetching course ${id}:`, error)
        return null
    }

    return data as Course
}
