const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

async function migrate() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // We can't run raw SQL via the client easily unless there's an RPC.
    // But we can check if it exists by trying to select it.
    console.log('Checking for video_url column...')
    const { data, error } = await supabase.from('lessons').select('video_url').limit(1)
    
    if (error && error.code === '42703') { // Column does not exist
        console.log('Column video_url does not exist. Please run this SQL in your Supabase Dashboard:')
        console.log('ALTER TABLE lessons ADD COLUMN video_url TEXT;')
    } else if (error) {
        console.error('Error checking column:', error)
    } else {
        console.log('Column video_url already exists.')
    }
}
migrate()
