const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncRoles() {
    console.log('Fetching profiles...')
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')

    if (profileError) {
        console.error('Error fetching profiles:', profileError)
        return
    }

    console.log(`Syncing roles for ${profiles.length} users...`)

    for (const profile of profiles) {
        console.log(`Updating user ${profile.id} with role ${profile.role}...`)
        const { error: authError } = await supabase.auth.admin.updateUserById(
            profile.id,
            { user_metadata: { role: profile.role } }
        )

        if (authError) {
            console.error(`Error updating user ${profile.id}:`, authError.message)
        }
    }

    console.log('Role sync complete.')
}

syncRoles()
