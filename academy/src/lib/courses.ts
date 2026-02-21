import { createClient } from './supabase/server'

export interface Course {
    id: string
    title: string
    description: string
    price: number
    original_price?: number
    image_url: string
    instructor_id?: string
    is_published?: boolean
    level?: string
    category?: string
    created_at: string
}

export interface InstructorWorkload {
    id: string; // Could be course ID or cohort ID
    course_id: string;
    title: string; // Course Title
    cohort_name?: string;
    description: string;
    image_url: string;
    is_published: boolean;
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

export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching instructor courses:', error)
        return []
    }

    return data as Course[]
}

export async function getInstructorWorkload(instructorId: string): Promise<InstructorWorkload[]> {
    const supabase = await createClient()

    // 1. Get cohorts assigned to this instructor
    const { data: cohorts, error: cohortError } = await supabase
        .from('cohorts')
        .select(`
            id,
            name,
            course_id,
            courses (
                title,
                description,
                image_url,
                is_published
            )
        `)
        .eq('instructor_id', instructorId)

    if (cohortError) {
        console.error('Error fetching instructor cohorts:', cohortError)
    }

    // 2. Get courses owned by this instructor (where they might not be assigned to a cohort yet)
    const { data: ownedCourses, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)

    if (courseError) {
        console.error('Error fetching owned courses:', courseError)
    }

    const workload: InstructorWorkload[] = []

    // Add cohorts first
    cohorts?.forEach((cohort: any) => {
        workload.push({
            id: cohort.id,
            course_id: cohort.course_id,
            title: cohort.courses?.title || 'Unknown Course',
            cohort_name: cohort.name,
            description: cohort.courses?.description || '',
            image_url: cohort.courses?.image_url || '',
            is_published: cohort.courses?.is_published || false,
        })
    })

    // Add owned courses if not already covered by a cohort
    ownedCourses?.forEach((course: any) => {
        const alreadyIn = workload.some(w => w.course_id === course.id)
        if (!alreadyIn) {
            workload.push({
                id: course.id,
                course_id: course.id,
                title: course.title,
                description: course.description,
                image_url: course.image_url,
                is_published: course.is_published,
            })
        }
    })

    return workload
}
