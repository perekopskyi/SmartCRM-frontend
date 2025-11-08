import { z } from 'zod';

//* Define your environment variables schema here, so you get type safety throughout your app
export const EnvSchema = z.object({
  API_URL: z.string().url(), // API URL
  
  SUPABASE_URL: z.string().url(), // Supabase URL
  SUPABASE_ANON_KEY: z.string(), // Supabase anon key
});
