import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runMigration() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Applying migration...');

    // Note: We are using a direct SQL execution if possible, 
    // but since supabase-js doesn't have it, we hope there's an 'exec_sql' RPC.
    // If not, we'll have to ask the user.
    const { error } = await supabase.rpc('exec_sql', {
        sql_string: `
      ALTER TABLE public.enrollments 
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
      CHECK (status IN ('pending', 'active', 'cancelled'));

      UPDATE public.enrollments SET status = 'active' WHERE status IS NULL;
    `
    });

    if (error) {
        if (error.message.includes('function public.exec_sql(text) does not exist')) {
            console.error('The "exec_sql" RPC function is not defined in your Supabase project.');
            console.error('Please run the migration manually in the Supabase SQL Editor:');
            console.log(`
          ALTER TABLE public.enrollments 
          ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
          CHECK (status IN ('pending', 'active', 'cancelled'));

          UPDATE public.enrollments SET status = 'active' WHERE status IS NULL;
        `);
        } else {
            console.error('Migration failed:', error);
        }
    } else {
        console.log('Migration applied successfully');
    }
}

runMigration();
