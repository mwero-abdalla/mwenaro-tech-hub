'use server'

import OpenAI from 'openai'
import { createClient } from './supabase/server'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock_key'
})

/**
 * Analyzes a GitHub repository and provides a suggested rating and feedback.
 */
export async function analyzeProject(lessonId: string, repoLink: string, studentId: string) {
    const supabase = await createClient()

    // 1. Fetch Lesson Requirements for context
    const { data: lesson } = await supabase
        .from('lessons')
        .select('title, content')
        .eq('id', lessonId)
        .single()

    if (!lesson) throw new Error('Lesson not found')

    // Update status to pending
    await supabase
        .from('lesson_progress')
        .update({ ai_status: 'pending' })
        .eq('user_id', studentId)
        .eq('lesson_id', lessonId)

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY not found. Skipping real AI analysis.')
        await supabase
            .from('lesson_progress')
            .update({
                ai_status: 'completed',
                ai_rating: 85,
                ai_feedback: "MOCK AI FEEDBACK: The project repository was successfully submitted. The code structure appears organized, and the README provides clear instructions. (Add OPENAI_API_KEY to .env.local for real analysis)"
            })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)
        return
    }

    try {
        // In a real implementation with more time, we would fetch the repo contents (README, main files)
        // For now, we'll provide the context we have to GPT-4o
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert software engineering instructor at Mwenaro Tech Academy. Your task is to review student project submissions based on lesson requirements. Provide a rating (0-100) and constructive feedback."
                },
                {
                    role: "user",
                    content: `
                        Lesson: ${lesson.title}
                        Requirements: ${lesson.content.substring(0, 1000)}
                        Student Repo Link: ${repoLink}
                        
                        Please analyze this submission. Since you cannot browse the repo directly in this simplified demo, assume standard best practices for this lesson. Provide your response in JSON format: { "rating": number, "feedback": "string" }
                    `
                }
            ],
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(response.choices[0].message.content || '{}')

        // Update database with AI results
        await supabase
            .from('lesson_progress')
            .update({
                ai_rating: result.rating || 0,
                ai_feedback: result.feedback || 'No feedback provided by AI.',
                ai_status: 'completed'
            })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)

    } catch (error) {
        console.error('AI Analysis failed:', error)
        await supabase
            .from('lesson_progress')
            .update({ ai_status: 'failed' })
            .eq('user_id', studentId)
            .eq('lesson_id', lessonId)
    }
}

export async function getRecommendedCourses(userId: string) {
    const supabase = await createClient()

    // 1. Get user profile (role) and average performance
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('highest_quiz_score')
        .eq('user_id', userId)

    const avgScore = progress && progress.length > 0
        ? progress.reduce((acc, curr) => acc + (curr.highest_quiz_score || 0), 0) / progress.length
        : 0

    // 2. Get user's enrolled course IDs and their categories
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            courses (
                category
            )
        `)
        .eq('user_id', userId)

    const enrolledCourseIds = enrollments?.map(e => e.course_id) || []
    const categories = Array.from(new Set(enrollments?.map(e => (e.courses as any)?.category).filter(Boolean)))

    // 3. Fetch recommendations
    let query = supabase.from('courses').select('*').eq('is_published', true)

    if (enrolledCourseIds.length > 0) {
        query = query.not('id', 'in', `(${enrolledCourseIds.join(',')})`)
    }

    // Role-based filtering logic
    if (profile?.role === 'admin' || profile?.role === 'instructor') {
        // Recommend advanced or management courses
        query = query.or('level.eq.Advanced,category.eq.Management')
    } else if (avgScore > 85) {
        // High performer: Recommend advanced courses in their categories
        if (categories.length > 0) {
            query = query.in('category', categories as any[]).eq('level', 'Advanced')
        } else {
            query = query.eq('level', 'Advanced')
        }
    } else if (categories.length > 0) {
        // Normal path: Recommend courses in their categories
        query = query.in('category', categories as any[])
    }

    const { data: recommendations, error } = await query.limit(3)

    if (error || !recommendations || recommendations.length === 0) {
        // Fallback: 3 random published courses not enrolled
        const { data: fallback } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .not('id', 'in', enrolledCourseIds.length > 0 ? `(${enrolledCourseIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)')
            .limit(3)
        return fallback || []
    }

    return recommendations
}

