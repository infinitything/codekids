/**
 * Authentication Service - Multi-role authentication with OAuth support
 */

import { supabase } from '../lib/supabase';
import { Parent, Student, Instructor, Admin, UserRole } from '../types/database.types';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role?: UserRole;
}

export interface OAuthProvider {
  provider: 'google' | 'github' | 'apple';
  redirectTo?: string;
}

export interface StudentProfileData {
  display_name: string;
  username: string;
  age: number;
  date_of_birth: string;
  interests?: string[];
  coppa_consent: boolean;
}

class AuthService {
  /**
   * Sign up a new parent account
   */
  async signUpParent(data: SignUpData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: 'parent',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Parent profile is auto-created by DB trigger (003_auth_signup_trigger.sql)
      // Do not insert here to avoid RLS/permission issues during signup
      return { user: authData.user, parent: null, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, parent: null, error };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Log activity
      await this.logActivity(data.user.id, 'login', 'parent');

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth({ provider, redirectTo }: OAuthProvider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error };
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  }

  /**
   * Get current user profile based on role
   */
  async getCurrentUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { profile: null, role: null, error: null };

      const userRole = user.user_metadata?.role as UserRole;

      let profile = null;

      switch (userRole) {
        case 'parent':
          const { data: parentData } = await supabase
            .from('parents')
            .select('*')
            .eq('auth_id', user.id)
            .single();
          profile = parentData;
          break;

        case 'instructor':
          const { data: instructorData } = await supabase
            .from('instructors')
            .select('*')
            .eq('auth_id', user.id)
            .single();
          profile = instructorData;
          break;

        case 'admin':
          const { data: adminData } = await supabase
            .from('admins')
            .select('*')
            .eq('auth_id', user.id)
            .single();
          profile = adminData;
          break;
      }

      return { profile, role: userRole, error: null };
    } catch (error) {
      console.error('Get profile error:', error);
      return { profile: null, role: null, error };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  }

  /**
   * Enable/Disable 2FA
   */
  async toggle2FA(enable: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('parents')
        .update({ two_factor_enabled: enable })
        .eq('auth_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Toggle 2FA error:', error);
      return { data: null, error };
    }
  }

  /**
   * Verify user age for COPPA compliance
   */
  async verifyAge(dateOfBirth: string): Promise<boolean> {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }

    return age >= 13;
  }

  /**
   * Log user activity
   */
  private async logActivity(
    userId: string,
    action: string,
    userType: UserRole,
    metadata?: Record<string, any>
  ) {
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_type: userType,
        action,
        metadata,
        ip_address: null, // Can be populated server-side
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Log activity error:', error);
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
