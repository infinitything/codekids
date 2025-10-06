import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Parent, Student } from '../types/database.types'
import { demoParentUser, demoStudentUser, demoStudents } from '../lib/mockData'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: Parent | null
  students: Student[]
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInAsDemo: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Parent>) => Promise<any>
  refreshStudents: () => Promise<void>
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
  const [userProfile, setUserProfile] = useState<Parent | null>(null)
  const [students, setStudents] = useState<Student[]>([])
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
      if (DEMO_MODE) {
        setUserProfile(demoParentUser as any)
        setStudents(demoStudents as any)
        return
      }

      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('auth_id', userId)
        .single()

      if (error) throw error
      setUserProfile(data)
      
      if (data?.id) {
        await fetchStudents(data.id)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchStudents = async (parentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', parentId)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    }
  }

  const refreshStudents = async () => {
    if (userProfile?.id) {
      await fetchStudents(userProfile.id)
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

            if (parentData && userData.child_name && userData.child_age) {
              console.log('📝 Creating student profile...');
              
              const age = parseInt(String(userData.child_age).replace(/\D/g, '')) || 10;
              const ageGroup = age <= 8 ? '5-8' : age <= 12 ? '8-12' : '12-16';
              const dob = new Date();
              dob.setFullYear(dob.getFullYear() - age);
              
              const { data: studentData, error: studentError } = await supabase
                .from('students')
                .insert([
                  {
                    parent_id: parentData.id,
                    username: userData.child_name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000),
                    display_name: userData.child_name,
                    age: age,
                    age_group: ageGroup,
                    date_of_birth: dob.toISOString().split('T')[0],
                    avatar_url: '🧑‍💻',
                    experience_points: 0,
                    current_level: 1,
                    streak_days: 0,
                    coppa_consent: true,
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

  const updateProfile = async (updates: Partial<Parent>) => {
    try {
      if (!user || !userProfile) throw new Error('No user logged in')

      if (DEMO_MODE) {
        const updatedProfile = { ...userProfile, ...updates } as Parent
        setUserProfile(updatedProfile)
        return { data: updatedProfile, error: null }
      }

      const { data, error } = await supabase
        .from('parents')
        .update(updates)
        .eq('id', userProfile.id)
        .select()
        .single()

      if (error) throw error
      setUserProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signInAsDemo = async () => {
    setLoading(true)
    
    const mockUser = demoParentUser
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
    setStudents(demoStudents as any)
    setSession({ user: mockSupabaseUser } as Session)
    setLoading(false)
    
    return Promise.resolve()
  }

  const value = {
    user,
    userProfile,
    students,
    session,
    loading,
    signUp,
    signIn,
    signInAsDemo,
    signOut,
    updateProfile,
    refreshStudents,
    isDemoMode: DEMO_MODE,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}