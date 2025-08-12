# Supabase Setup Instructions

## Environment Variables Required

Your project needs these environment variables in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get These Values

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Setup Steps

1. Copy `.env.example` to `.env` if it doesn't exist
2. Replace the placeholder values with your actual Supabase credentials
3. Restart your development server

## Error Resolution

If you see "Missing Supabase environment variables" error:
- Check that `.env` file exists in the project root
- Verify the variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Ensure there are no extra spaces or quotes around the values
