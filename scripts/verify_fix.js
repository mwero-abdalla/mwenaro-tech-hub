const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySchema() {
    const { data, error } = await supabase.rpc('check_columns_exist', {
        tbl_name: 'profiles',
        cols: ['role', 'email']
    })

    // Since we might not have the RPC, let's try a direct query
    if (error) {
        const { data: profiles, error: queryError } = await supabase
            .from('profiles')
            .select('role, email')
            .limit(1)

        if (queryError) {
            console.error('Error querying profiles:', queryError.message)
            if (queryError.message.includes('column "role" does not exist')) {
                console.log('Verification FAILED: role column missing')
            }
            if (queryError.message.includes('column "email" does not exist')) {
                console.log('Verification FAILED: email column missing')
            }
        } else {
            console.log('Verification SUCCESS: role and email columns exist')
            console.log('Sample data:', profiles)
        }
    } else {
        console.log('Verification result:', data)
    }
}

verifySchema()
