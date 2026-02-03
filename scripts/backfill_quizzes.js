const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function backfill() {
    console.log('Fetching lesson_progress data...')
    const { data: progress, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('user_id, lesson_id, highest_quiz_score, completed_at')
        .gt('quiz_attempts', 0)

    if (fetchError) {
        console.error('Error fetching progress:', fetchError)
        return
    }

    console.log(`Found ${progress.length} records to backfill.`)

    const submissions = progress.map(p => ({
        user_id: p.user_id,
        lesson_id: p.lesson_id,
        answers: [],
        score: p.highest_quiz_score,
        passed: p.highest_quiz_score >= 70,
        created_at: p.completed_at || new Date().toISOString()
    }))

    const { error: insertError } = await supabase
        .from('quiz_submissions')
        .insert(submissions)

    if (insertError) {
        console.error('Error inserting submissions:', insertError)
    } else {
        console.log('Successfully backfilled quiz_submissions.')
    }
}

backfill()
