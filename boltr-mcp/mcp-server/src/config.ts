/**
 * MCP Server Configuration
 *
 * Supabase URL and anon key are hardcoded (they're public, already in the frontend).
 * User only needs to provide their BOLTR email and password.
 */

// BOLTR Supabase configuration (public values)
export const SUPABASE_URL = 'https://hgkzszxzxedanegdbuvu.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna3pzenh6eGVkYW5lZ2RidXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NzAxODUsImV4cCI6MjA3MzA0NjE4NX0.6MOTIwYq-WO3onqAztGnWn8i1W1IqvB_Xlwkvs-2qiw';

export interface Config {
  email: string;
  password: string;
}

export function getConfig(): Config {
  const email = process.env.BOLTR_EMAIL;
  const password = process.env.BOLTR_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing BOLTR credentials. Set BOLTR_EMAIL and BOLTR_PASSWORD environment variables.\n' +
      'These are the same email and password you use to log into BOLTR.'
    );
  }

  return { email, password };
}
