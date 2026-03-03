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

    console.log('Applying Limited-Time Access migration...');

    const { error } = await supabase.rpc('exec_sql', {
        sql_string: `
      ALTER TABLE public.enrollments 
      ADD COLUMN IF NOT EXISTS access_until TIMESTAMP WITH TIME ZONE;
      
      COMMENT ON COLUMN public.enrollments.access_until IS 'The timestamp until which the user has temporary access, regardless of payment status.';
    `
    });

    if (error) {
        console.error('Migration failed:', error);
        console.log('Please run the SQL manually if exec_sql RPC is missing.');
    } else {
        console.log('Migration applied successfully');
    }
}

runMigration();
