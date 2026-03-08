/**
 * Authentication module
 *
 * Handles Supabase auth using user's BOLTR credentials.
 * Stores refresh token locally for session persistence.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, getConfig } from './config.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const SESSION_DIR = join(homedir(), '.boltr-mcp');
const SESSION_FILE = join(SESSION_DIR, 'session.json');

interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

function loadStoredSession(): StoredSession | null {
  try {
    if (existsSync(SESSION_FILE)) {
      const data = readFileSync(SESSION_FILE, 'utf-8');
      return JSON.parse(data) as StoredSession;
    }
  } catch {
    // Corrupted session file, ignore
  }
  return null;
}

function saveSession(session: StoredSession): void {
  try {
    if (!existsSync(SESSION_DIR)) {
      mkdirSync(SESSION_DIR, { recursive: true });
    }
    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

/**
 * Initialize authenticated Supabase client.
 * 1. Try to restore session from stored refresh token
 * 2. If that fails, sign in with email/password
 * 3. Store new session for future use
 */
export async function initAuthenticatedClient(): Promise<SupabaseClient> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
  });

  // Try stored session first
  const stored = loadStoredSession();
  if (stored) {
    const { data, error } = await supabase.auth.setSession({
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
    });

    if (!error && data.session) {
      // Save refreshed tokens
      saveSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      });
      console.error('Authenticated via stored session');
      return supabase;
    }
    console.error('Stored session expired, signing in with credentials...');
  }

  // Sign in with credentials
  const config = getConfig();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: config.email,
    password: config.password,
  });

  if (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }

  if (!data.session) {
    throw new Error('Authentication succeeded but no session returned');
  }

  // Save session
  saveSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });

  console.error(`Authenticated as ${data.user?.email}`);
  return supabase;
}
