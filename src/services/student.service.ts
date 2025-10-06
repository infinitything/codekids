/**
 * Student Service - Manage child profiles and progress
 */

import { supabase } from '../lib/supabase';
import { Student, AgeGroup, StudentDashboardData } from '../types/database.types';

export interface CreateStudentData {
  parent_id: string;
  username: string;
  display_name: string;
  age: number;
  date_of_birth: string;
  interests?: string[];
  coppa_consent: boolean;
  preferred_learning_style?: string;
}

export interface UpdateStudentData {
  display_name?: string;
  avatar_url?: string;
  theme_preference?: string;
  interests?: string[];
  preferred_learning_style?: string;
}

class StudentService {
  /**
   * Get age group from age
   */
  private getAgeGroup(age: number): AgeGroup {
    if (age >= 5 && age <= 8) return '5-8';
    if (age >= 8 && age <= 12) return '8-12';
    if (age >= 12 && age <= 16) return '12-16';
    return '8-12'; // default
  }

  /**
   * Create a new student profile
   */
  async createStudent(data: CreateStudentData) {
    try {
      const { data: student, error } = await supabase.rpc('create_student_for_current_parent', {
        p_username: data.username,
        p_display_name: data.display_name,
        p_age: data.age,
        p_date_of_birth: data.date_of_birth,
        p_interests: data.interests || null,
        p_preferred_learning_style: data.preferred_learning_style || null,
        p_coppa_consent: data.coppa_consent,
      });

      if (error) throw error;

      // Log activity
      await this.logStudentActivity(student.id, 'profile_created');

      return { student, error: null };
    } catch (error) {
      console.error('Create student error:', error);
      return { student: null, error };
    }
  }

  /**
   * Get student by ID
   */
  async getStudent(studentId: string) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) throw error;
      return { student, error: null };
    } catch (error) {
      console.error('Get student error:', error);
      return { student: null, error };
    }
  }

  /**
   * Get all students for a parent
   */
  async getStudentsByParent(parentId: string) {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', parentId)
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { students, error: null };
    } catch (error) {
      console.error('Get students by parent error:', error);
      return { students: null, error };
    }
  }

  /**
   * Update student profile
   */
  async updateStudent(studentId: string, updates: UpdateStudentData) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .select()
        .single();

      if (error) throw error;

      await this.logStudentActivity(studentId, 'profile_updated', updates);

      return { student, error: null };
    } catch (error) {
      console.error('Update student error:', error);
      return { student: null, error };
    }
  }

  /**
   * Deactivate student profile
   */
  async deactivateStudent(studentId: string) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .update({ active: false })
        .eq('id', studentId)
        .select()
        .single();

      if (error) throw error;
      return { student, error: null };
    } catch (error) {
      console.error('Deactivate student error:', error);
      return { student: null, error };
    }
  }

  /**
   * Add XP to student
   */
  async addExperience(studentId: string, xpAmount: number) {
    try {
      const { error } = await supabase.rpc('add_student_xp', {
        p_student_id: studentId,
        p_xp_amount: xpAmount,
      });

      if (error) throw error;

      const { student } = await this.getStudent(studentId);

      await this.logStudentActivity(studentId, 'xp_earned', { xp_amount: xpAmount });

      return { student, error: null };
    } catch (error) {
      console.error('Add experience error:', error);
      return { student: null, error };
    }
  }

  /**
   * Update daily activity streak
   */
  async updateStreak(studentId: string) {
    try {
      const { error } = await supabase.rpc('update_student_streak', {
        p_student_id: studentId,
      });

      if (error) throw error;

      const { student } = await this.getStudent(studentId);
      const newStreak = student?.streak_days || 0;

      if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
        await this.checkAndAwardBadges(studentId);
      }

      return { streak: newStreak, error: null };
    } catch (error) {
      console.error('Update streak error:', error);
      return { streak: null, error };
    }
  }

  /**
   * Log daily activity
   */
  async logDailyActivity(
    studentId: string,
    minutesActive: number,
    lessonsCompleted: number,
    challengesCompleted: number,
    xpEarned: number
  ) {
    try {
      const activityDate = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_activities')
        .upsert(
          {
            student_id: studentId,
            activity_date: activityDate,
            minutes_active: minutesActive,
            lessons_completed: lessonsCompleted,
            challenges_completed: challengesCompleted,
            xp_earned: xpEarned,
          },
          {
            onConflict: 'student_id,activity_date',
          }
        )
        .select()
        .single();

      if (error) throw error;

      // Update streak
      await this.updateStreak(studentId);

      return { activity: data, error: null };
    } catch (error) {
      console.error('Log daily activity error:', error);
      return { activity: null, error };
    }
  }

  /**
   * Get comprehensive dashboard data for a student
   */
  async getStudentDashboard(studentId: string): Promise<{ data: StudentDashboardData | null; error: any }> {
    try {
      // Get student
      const { student } = await this.getStudent(studentId);
      if (!student) throw new Error('Student not found');

      // Get current track enrollment
      const { data: currentTrack } = await supabase
        .from('track_enrollments')
        .select('*, track:learning_tracks(*)')
        .eq('student_id', studentId)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      // Get recent lessons
      const { data: recentLessons } = await supabase
        .from('lesson_progress')
        .select('*, lesson:lessons(*)')
        .eq('student_id', studentId)
        .order('last_accessed', { ascending: false })
        .limit(5);

      // Get recent badges
      const { data: recentBadges } = await supabase
        .from('student_badges')
        .select('*, badge:badges(*)')
        .eq('student_id', studentId)
        .order('awarded_at', { ascending: false })
        .limit(3);

      // Get leaderboard position
      const { data: leaderboardPosition } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('student_id', studentId)
        .eq('leaderboard_type', 'weekly_xp')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get weekly activity
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weeklyActivity } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('student_id', studentId)
        .gte('activity_date', weekAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      // Calculate next milestone
      const nextMilestone = this.calculateNextMilestone(student);

      const dashboardData: StudentDashboardData = {
        student,
        current_track: currentTrack,
        recent_lessons: recentLessons || [],
        recent_badges: recentBadges || [],
        leaderboard_position: leaderboardPosition,
        weekly_activity: weeklyActivity || [],
        next_milestone: nextMilestone,
      };

      return { data: dashboardData, error: null };
    } catch (error) {
      console.error('Get student dashboard error:', error);
      return { data: null, error };
    }
  }

  /**
   * Calculate next milestone for student
   */
  private calculateNextMilestone(student: Student) {
    const currentLevel = student.current_level;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const currentXP = student.experience_points;
    const xpNeeded = xpForNextLevel - currentXP;

    return {
      type: 'level_up',
      progress: currentXP,
      target: xpForNextLevel,
      reward: `Level ${currentLevel + 1}`,
    };
  }

  /**
   * Check and award badges based on student achievements
   */
  async checkAndAwardBadges(studentId: string) {
    try {
      const { student } = await this.getStudent(studentId);
      if (!student) return;

      // Get all available badges
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .eq('active', true);

      if (!badges) return;

      // Get student's existing badges
      const { data: existingBadges } = await supabase
        .from('student_badges')
        .select('badge_id')
        .eq('student_id', studentId);

      const existingBadgeIds = existingBadges?.map((b) => b.badge_id) || [];

      // Check each badge criteria
      for (const badge of badges) {
        if (existingBadgeIds.includes(badge.id)) continue;

        const earned = await this.checkBadgeCriteria(student, badge.criteria);

        if (earned) {
          await supabase.from('student_badges').insert({
            student_id: studentId,
            badge_id: badge.id,
          });

          // Award badge points
          await this.addExperience(studentId, badge.points_value);
        }
      }
    } catch (error) {
      console.error('Check and award badges error:', error);
    }
  }

  /**
   * Check if student meets badge criteria
   */
  private async checkBadgeCriteria(student: Student, criteria: any): Promise<boolean> {
    switch (criteria.type) {
      case 'lessons_completed':
        // Would need to count completed lessons
        return false; // Implement based on lesson_progress table

      case 'streak_days':
        return student.streak_days >= criteria.count;

      case 'projects_published':
        return student.projects_completed >= criteria.count;

      default:
        return false;
    }
  }

  /**
   * Log student activity
   */
  private async logStudentActivity(
    studentId: string,
    action: string,
    metadata?: Record<string, any>
  ) {
    try {
      await supabase.from('activity_logs').insert({
        user_id: studentId,
        user_type: 'student',
        action,
        metadata,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Log student activity error:', error);
    }
  }

  /**
   * Check username availability
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_username_available', {
        p_username: username,
      });

      if (error) return true;
      return Boolean(data);
    } catch (error) {
      return true;
    }
  }
}

export const studentService = new StudentService();
