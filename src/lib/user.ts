'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export interface Profile {
    id: string
    full_name: string | null
    phone_number: string | null
    gender: string | null
    bio: string | null
    location: string | null
    website_url: string | null
    linkedin_url: string | null
    avatar_url: string | null
    updated_at: string
}

export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Profile doesn't exist yet, try to create it from auth metadata
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    full_name: user.user_metadata?.full_name || null
                })
                .select()
                .single()

            if (createError) {
                console.error('Error creating profile:', createError)
                return null
            }
            return newProfile as Profile
        }
        console.error('Error fetching profile:', error)
        return null
    }

    return data as Profile
}

export async function updateProfile(updates: Partial<Profile>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
    }

    // Also update auth metadata for full_name to keep in sync
    if (updates.full_name) {
        await supabase.auth.updateUser({
            data: { full_name: updates.full_name }
        })
    }

    revalidatePath('/settings')
}

export async function updatePassword(newPassword: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error('Error updating password:', error)
        throw new Error(error.message)
    }
}
