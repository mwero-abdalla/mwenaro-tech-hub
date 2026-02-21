import { createClient } from '@mwenaro/database/server'

export interface Course {
    id: string
    title: string
    description: string
    highlight?: string
    color?: string
    price: number
    original_price?: number
    image_url: string
    level?: string
    category?: string
    badge?: string
    created_at: string
}

export async function getFeaturedCourses(): Promise<Course[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

    if (error) {
        console.error('Error fetching courses:', error)
        return []
    }

    return (data as Course[]) || []
}
