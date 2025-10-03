/**
 * Admin Service - Complete admin operations
 */

import { supabase } from '../lib/supabase';
import { storageService } from './storage.service';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'python' | 'javascript' | 'scratch';
  thumbnail_url?: string;
  video_url?: string;
  duration_hours: number;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  video_url?: string;
  pdf_url?: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  points: number;
  created_at: string;
}

class AdminService {
  // ==================== COURSE MANAGEMENT ====================

  /**
   * Get all courses
   */
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data as Course[];
  }

  /**
   * Create new course
   */
  async createCourse(courseData: Partial<Course>): Promise<{ success: boolean; course?: Course; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, course: data as Course };
    } catch (error: any) {
      console.error('Error creating course:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update course
   */
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating course:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting course:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== LESSON MANAGEMENT ====================

  /**
   * Get lessons for a course
   */
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }

    return data as Lesson[];
  }

  /**
   * Create new lesson
   */
  async createLesson(lessonData: Partial<Lesson>): Promise<{ success: boolean; lesson?: Lesson; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          ...lessonData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, lesson: data as Lesson };
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update lesson
   */
  async updateLesson(lessonId: string, updates: Partial<Lesson>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lessonId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating lesson:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all students
   */
  async getAllStudents(): Promise<any[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get all parents
   */
  async getAllParents(): Promise<any[]> {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching parents:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update user
   */
  async updateUser(userId: string, table: 'students' | 'parents', updates: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string, table: 'students' | 'parents'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== BADGE MANAGEMENT ====================

  /**
   * Get all badges
   */
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }

    return data as Badge[];
  }

  /**
   * Create badge
   */
  async createBadge(badgeData: Partial<Badge>): Promise<{ success: boolean; badge?: Badge; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .insert({
          ...badgeData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, badge: data as Badge };
    } catch (error: any) {
      console.error('Error creating badge:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update badge
   */
  async updateBadge(badgeId: string, updates: Partial<Badge>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('badges')
        .update(updates)
        .eq('id', badgeId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating badge:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete badge
   */
  async deleteBadge(badgeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('badges')
        .delete()
        .eq('id', badgeId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting badge:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<any> {
    try {
      const [
        { count: studentCount },
        { count: parentCount },
        { count: courseCount },
        { count: lessonCount },
        { count: badgeCount },
        { count: completedLessons },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('parents').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('badges').select('*', { count: 'exact', head: true }),
        supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      ]);

      return {
        students: studentCount || 0,
        parents: parentCount || 0,
        courses: courseCount || 0,
        lessons: lessonCount || 0,
        badges: badgeCount || 0,
        completedLessons: completedLessons || 0,
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return null;
    }
  }
}

export const adminService = new AdminService();

