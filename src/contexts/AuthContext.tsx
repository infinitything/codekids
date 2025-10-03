import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User } from '../lib/supabase'
import { demoParentUser, demoStudentUser } from '../lib/mockData'

// Check if we're in demo mode
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInAsDemo: (role: 'parent' | 'student') => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<any>
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchUserProfile(session.user.id)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting session:', error)
        setLoading(false)
      })

    // Listen for auth changes with error handling
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('🔐 Starting signup process...', { email, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }

      console.log('✅ Auth user created:', data.user?.id);

      if (data.user) {
        // Wait a bit for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: sessionData } = await supabase.auth.getSession()
        const hasSession = !!sessionData.session
        
        console.log('📋 Session status:', { hasSession, userId: data.user.id });

        if (hasSession) {
          try {
            console.log('📝 Creating parent profile...');
            
            // Create parent profile using ACTUAL Supabase column names
            const { data: parentData, error: parentError } = await supabase
              .from('parents')
              .insert([
                {
                  auth_id: data.user.id,
                  full_name: userData.parent_name || userData.name || email.split('@')[0],
                  email: data.user.email,
                  phone_number: userData.phone || null,
                },
              ])
              .select()
              .single()

            if (parentError) {
              console.error('❌ Parent creation error:', parentError);
              throw parentError;
            }

            console.log('✅ Parent created:', parentData);

            // Create student profile if child data is provided
            if (parentData && userData.child_name && userData.child_age) {
              console.log('📝 Creating student profile...');
              
              const { data: studentData, error: studentError } = await supabase
                .from('students')
                .insert([
                  {
                    parent_id: parentData.id,
                    name: userData.child_name,
                    age: parseInt(String(userData.child_age).replace(/\D/g, '')) || 10,
                    email: null,
                    avatar_url: null,
                    xp: 0,
                    level: 1,
                    streak_days: 0,
                  },
                ])
                .select()
                .single()

              if (studentError) {
                console.error('❌ Student creation error:', studentError);
                throw studentError;
              }

              console.log('✅ Student created:', studentData);
            }
          } catch (e: any) {
            console.error('❌ Database insert failed:', e);
            // Don't throw - let user login even if profile creation fails
            console.warn('⚠️ Profile creation failed but auth user exists. User can still login.');
          }
        } else {
          console.warn('⚠️ No session available - likely email confirmation required');
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Signup process failed:', error);
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Ensure local state is cleared immediately after sign out
    setSession(null)
    setUser(null)
    setUserProfile(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in')

      if (DEMO_MODE) {
        // In demo mode, just update local state
        const updatedProfile = { ...userProfile, ...updates } as User
        setUserProfile(updatedProfile)
        return { data: updatedProfile, error: null }
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setUserProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signInAsDemo = async (role: 'parent' | 'student') => {
    setLoading(true)
    
    // Create mock user data
    const mockUser = role === 'parent' ? demoParentUser : demoStudentUser
    const mockSupabaseUser = {
      id: mockUser.id,
      email: mockUser.email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: mockUser.created_at,
    } as SupabaseUser

    setUser(mockSupabaseUser)
    setUserProfile(mockUser as any)
    setSession({ user: mockSupabaseUser } as Session)
    setLoading(false)
    
    // Return a promise that resolves after state is set
    // The navigation will be handled by the component
    return Promise.resolve()
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signInAsDemo,
    signOut,
    updateProfile,
    isDemoMode: DEMO_MODE,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}