/**
 * Digital Income Blueprint — Configuration
 *
 * HOW TO SET UP SUPABASE:
 * 1. Go to https://supabase.com and create a free account
 * 2. Create a new project (pick any name and password)
 * 3. Go to Project Settings > API
 * 4. Copy your "Project URL" and paste it in SUPABASE_URL below
 * 5. Copy your "anon public" key and paste it in SUPABASE_ANON_KEY below
 * 6. Go to SQL Editor and run the SQL from setup-database.sql
 * 7. Deploy and you're ready!
 */

const CONFIG = {
    // ⚠️ PASTE YOUR SUPABASE CREDENTIALS HERE
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',

    // App settings
    APP_NAME: 'Digital Income Blueprint',
    SESSION_DURATION_DAYS: 7,
};
