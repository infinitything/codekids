import { createClient } from '@supabase/supabase-js'
import { env, validateEnv } from './env'

// Validate environment on initialization
if (!env.demoMode) {
  validateEnv();
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce', // Recommended for OAuth
  },
  global: {
    headers: {
      'x-app-name': env.appName,
    },
  },
})

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  child_name: string
  child_age: number
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  level: number
  age_range: string
  duration_weeks: number
  price: number
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress: number
  started_at: string
  completed_at?: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  content: string
  order: number
  video_url?: string
  created_at: string
}