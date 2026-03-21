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
    SUPABASE_URL: 'https://khvjxwkxoybgaqcwgpil.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtodmp4d2t4b3liZ2FxY3dncGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzAyNTQsImV4cCI6MjA4OTU0NjI1NH0.SBq-N5WgEbifYnvcwqdIKhcQeat3PpEDhc4wtkEObe4',

    // App settings
    APP_NAME: 'Digital Income Blueprint',
    SESSION_DURATION_DAYS: 7,
};
