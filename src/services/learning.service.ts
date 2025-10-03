/**
 * Learning Service - Curriculum and lesson management
 */

import { supabase } from '../lib/supabase';
import {
  LearningTrack,
  Lesson,
  Challenge,
  LessonProgress,
  TrackEnrollment,
  AgeGroup,
} from '../types/database.types';
import { studentService } from './student.service';

export interface EnrollInTrackParams {
  studentId: string;
  trackId: string;
}

export interface StartLessonParams {
  studentId: string;
  lessonId: string;
}

export interface UpdateLessonProgressParams {
  studentId: string;
  lessonId: string;
  progressPercentage?: number;
  timeSpentSeconds?: number;
  studentCode?: string;
}

export interface CompleteLessonParams {
  studentId: string;
  lessonId: string;
  accuracyScore: number;
  completionTimeSeconds: number;
  hintsUsed: number;
  studentCode?: string;
}

export interface SubmitChallengeParams {
  studentId: string;
  challengeId: string;
  submittedAnswer: any;
  timeTakenSeconds: number;
  hintsUsed?: number;
}

class LearningService {
  /**
   * Get all learning tracks
   */
  async getTracks(ageGroup?: AgeGroup) {
    try {
      let query = supabase
        .from('learning_tracks')
        .select('*')
        .eq('active', true)
        .order('sequence_order', { ascending: true });

      if (ageGroup) {
        query = query.eq('age_group', ageGroup);
      }

      const { data: tracks, error } = await query;

      if (error) throw error;
      return { tracks, error: null };
    } catch (error) {
      console.error('Get tracks error:', error);
      return { tracks: null, error };
    }
  }

  /**
   * Get track by ID with lessons
   */
  async getTrackWithLessons(trackId: string, studentId?: string) {
    try {
      // Get track
      const { data: track, error: trackError } = await supabase
        .from('learning_tracks')
        .select('*')
        .eq('id', trackId)
        .single();

      if (trackError) throw trackError;

      // Get lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('track_id', trackId)
        .eq('active', true)
        .order('sequence_order', { ascending: true });

      if (lessonsError) throw lessonsError;

      // If student ID provided, get their progress
      let lessonsWithProgress = lessons;
      if (studentId) {
        const progressMap = new Map();
        
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('student_id', studentId)
          .in('lesson_id', lessons.map(l => l.id));

        progressData?.forEach(p => {
          progressMap.set(p.lesson_id, p);
        });

        lessonsWithProgress = lessons.map(lesson => ({
          ...lesson,
          progress: progressMap.get(lesson.id),
        }));
      }

      return { track, lessons: lessonsWithProgress, error: null };
    } catch (error) {
      console.error('Get track with lessons error:', error);
      return { track: null, lessons: null, error };
    }
  }

  /**
   * Get lesson by ID
   */
  async getLesson(lessonId: string) {
    try {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return { lesson, error: null };
    } catch (error) {
      console.error('Get lesson error:', error);
      return { lesson: null, error };
    }
  }

  /**
   * Get challenges for a lesson
   */
  async getLessonChallenges(lessonId: string) {
    try {
      const { data: challenges, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('active', true)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      return { challenges, error: null };
    } catch (error) {
      console.error('Get lesson challenges error:', error);
      return { challenges: null, error };
    }
  }

  /**
   * Enroll student in a track
   */
  async enrollInTrack({ studentId, trackId }: EnrollInTrackParams) {
    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('track_enrollments')
        .select('*')
        .eq('student_id', studentId)
        .eq('track_id', trackId)
        .single();

      if (existing) {
        return { enrollment: existing, error: null };
      }

      // Get first lesson
      const { data: firstLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('track_id', trackId)
        .eq('active', true)
        .order('sequence_order', { ascending: true })
        .limit(1)
        .single();

      // Create enrollment
      const { data: enrollment, error } = await supabase
        .from('track_enrollments')
        .insert({
          student_id: studentId,
          track_id: trackId,
          current_lesson_id: firstLesson?.id,
        })
        .select()
        .single();

      if (error) throw error;

      return { enrollment, error: null };
    } catch (error) {
      console.error('Enroll in track error:', error);
      return { enrollment: null, error };
    }
  }

  /**
   * Get student's enrolled tracks
   */
  async getStudentEnrollments(studentId: string) {
    try {
      const { data: enrollments, error } = await supabase
        .from('track_enrollments')
        .select('*, track:learning_tracks(*)')
        .eq('student_id', studentId)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return { enrollments, error: null };
    } catch (error) {
      console.error('Get student enrollments error:', error);
      return { enrollments: null, error };
    }
  }

  /**
   * Start a lesson
   */
  async startLesson({ studentId, lessonId }: StartLessonParams) {
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        // Update started_at if not started yet
        if (!existing.started_at) {
          const { data: updated, error } = await supabase
            .from('lesson_progress')
            .update({
              started_at: new Date().toISOString(),
              status: 'in_progress',
              last_accessed: new Date().toISOString(),
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          return { progress: updated, error: null };
        }
        
        return { progress: existing, error: null };
      }

      // Create new progress
      const { data: progress, error } = await supabase
        .from('lesson_progress')
        .insert({
          student_id: studentId,
          lesson_id: lessonId,
          started_at: new Date().toISOString(),
          status: 'in_progress',
        })
        .select()
        .single();

      if (error) throw error;

      return { progress, error: null };
    } catch (error) {
      console.error('Start lesson error:', error);
      return { progress: null, error };
    }
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(params: UpdateLessonProgressParams) {
    try {
      const updates: any = {
        last_accessed: new Date().toISOString(),
      };

      if (params.progressPercentage !== undefined) {
        updates.progress_percentage = params.progressPercentage;
      }

      if (params.timeSpentSeconds !== undefined) {
        // Add to existing time
        const { data: current } = await supabase
          .from('lesson_progress')
          .select('time_spent_seconds')
          .eq('student_id', params.studentId)
          .eq('lesson_id', params.lessonId)
          .single();

        updates.time_spent_seconds = (current?.time_spent_seconds || 0) + params.timeSpentSeconds;
      }

      if (params.studentCode !== undefined) {
        updates.last_code_snapshot = params.studentCode;
      }

      const { data: progress, error } = await supabase
        .from('lesson_progress')
        .update(updates)
        .eq('student_id', params.studentId)
        .eq('lesson_id', params.lessonId)
        .select()
        .single();

      if (error) throw error;

      return { progress, error: null };
    } catch (error) {
      console.error('Update lesson progress error:', error);
      return { progress: null, error };
    }
  }

  /**
   * Complete a lesson
   */
  async completeLesson(params: CompleteLessonParams) {
    try {
      // Get lesson for XP reward
      const { lesson } = await this.getLesson(params.lessonId);
      if (!lesson) throw new Error('Lesson not found');

      // Update progress
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          progress_percentage: 100,
          accuracy_score: params.accuracyScore,
          completion_time_seconds: params.completionTimeSeconds,
          hints_used: params.hintsUsed,
          student_code: params.studentCode,
        })
        .eq('student_id', params.studentId)
        .eq('lesson_id', params.lessonId)
        .select()
        .single();

      if (progressError) throw progressError;

      // Award XP
      const xpToAward = lesson.xp_reward;
      
      // Bonus XP for perfect score
      const bonusXP = params.accuracyScore >= 100 ? Math.floor(xpToAward * 0.5) : 0;
      
      // Speed bonus (if completed in < estimated time)
      const speedBonus = lesson.estimated_minutes && 
        params.completionTimeSeconds < (lesson.estimated_minutes * 60)
        ? Math.floor(xpToAward * 0.2)
        : 0;

      const totalXP = xpToAward + bonusXP + speedBonus;

      await studentService.addExperience(params.studentId, totalXP);

      // Log daily activity
      await studentService.logDailyActivity(
        params.studentId,
        Math.floor(params.completionTimeSeconds / 60),
        1, // 1 lesson completed
        0,
        totalXP
      );

      // Update track enrollment progress
      await this.updateTrackProgress(params.studentId, lesson.track_id);

      // Check for badges
      await studentService.checkAndAwardBadges(params.studentId);

      return { 
        progress, 
        xp_earned: totalXP,
        bonuses: { perfect: bonusXP, speed: speedBonus },
        error: null 
      };
    } catch (error) {
      console.error('Complete lesson error:', error);
      return { progress: null, xp_earned: 0, bonuses: null, error };
    }
  }

  /**
   * Update track enrollment progress
   */
  private async updateTrackProgress(studentId: string, trackId: string) {
    try {
      // Get all lessons in track
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('track_id', trackId)
        .eq('active', true);

      if (!allLessons || allLessons.length === 0) return;

      // Get completed lessons
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .in('lesson_id', allLessons.map(l => l.id));

      const progressPercentage = (completedLessons?.length || 0) / allLessons.length * 100;

      // Check if track is completed
      const isCompleted = progressPercentage >= 100;

      const updates: any = {
        progress_percentage: progressPercentage,
      };

      if (isCompleted) {
        updates.completed_at = new Date().toISOString();
      }

      await supabase
        .from('track_enrollments')
        .update(updates)
        .eq('student_id', studentId)
        .eq('track_id', trackId);

      // Award track completion bonus
      if (isCompleted) {
        await studentService.addExperience(studentId, 1000); // Big bonus for completing a track!
      }
    } catch (error) {
      console.error('Update track progress error:', error);
    }
  }

  /**
   * Submit challenge answer
   */
  async submitChallenge(params: SubmitChallengeParams) {
    try {
      // Get challenge
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', params.challengeId)
        .single();

      if (challengeError) throw challengeError;

      // Check answer
      const { isCorrect, score } = this.checkChallengeAnswer(
        challenge,
        params.submittedAnswer
      );

      // Save attempt
      const { data: attempt, error: attemptError } = await supabase
        .from('challenge_attempts')
        .insert({
          student_id: params.studentId,
          challenge_id: params.challengeId,
          submitted_answer: params.submittedAnswer,
          is_correct: isCorrect,
          score,
          time_taken_seconds: params.timeTakenSeconds,
          hints_used: params.hintsUsed || 0,
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Award XP if correct
      if (isCorrect) {
        await studentService.addExperience(params.studentId, challenge.points);
        
        // Log activity
        await studentService.logDailyActivity(
          params.studentId,
          Math.floor(params.timeTakenSeconds / 60),
          0,
          1, // 1 challenge completed
          challenge.points
        );
      }

      return { 
        attempt, 
        isCorrect, 
        score,
        xp_earned: isCorrect ? challenge.points : 0,
        error: null 
      };
    } catch (error) {
      console.error('Submit challenge error:', error);
      return { attempt: null, isCorrect: false, score: 0, xp_earned: 0, error };
    }
  }

  /**
   * Check if challenge answer is correct
   */
  private checkChallengeAnswer(challenge: Challenge, submittedAnswer: any): {
    isCorrect: boolean;
    score: number;
  } {
    // Simple check - can be enhanced based on challenge type
    switch (challenge.challenge_type) {
      case 'quiz':
        const isCorrect = JSON.stringify(submittedAnswer) === JSON.stringify(challenge.correct_answer);
        return { isCorrect, score: isCorrect ? challenge.points : 0 };

      case 'coding':
        // Would run test cases here
        // For now, simple comparison
        return { isCorrect: false, score: 0 }; // TODO: Implement code execution

      case 'drag_drop':
      case 'fill_blank':
        const correct = JSON.stringify(submittedAnswer) === JSON.stringify(challenge.correct_answer);
        return { isCorrect: correct, score: correct ? challenge.points : 0 };

      default:
        return { isCorrect: false, score: 0 };
    }
  }

  /**
   * Get student's lesson progress
   */
  async getStudentLessonProgress(studentId: string, lessonId: string) {
    try {
      const { data: progress, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

      return { progress, error: null };
    } catch (error) {
      console.error('Get student lesson progress error:', error);
      return { progress: null, error };
    }
  }

  /**
   * Get recommended next lesson for student
   */
  async getNextLesson(studentId: string) {
    try {
      // Get student's current track
      const { data: enrollment } = await supabase
        .from('track_enrollments')
        .select('*, track:learning_tracks(*)')
        .eq('student_id', studentId)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (!enrollment) {
        // No active enrollment, suggest starting a track
        return { lesson: null, track: null, suggestion: 'start_track', error: null };
      }

      // Get next uncompleted lesson in track
      const { data: lessons } = await supabase
        .from('lessons')
        .select(`
          *,
          progress:lesson_progress!inner(status)
        `)
        .eq('track_id', enrollment.track_id)
        .eq('active', true)
        .neq('lesson_progress.status', 'completed')
        .order('sequence_order', { ascending: true })
        .limit(1)
        .single();

      return { 
        lesson: lessons, 
        track: enrollment.track, 
        suggestion: 'continue_track',
        error: null 
      };
    } catch (error) {
      console.error('Get next lesson error:', error);
      return { lesson: null, track: null, suggestion: null, error };
    }
  }

  /**
   * Search lessons
   */
  async searchLessons(query: string, ageGroup?: AgeGroup) {
    try {
      let dbQuery = supabase
        .from('lessons')
        .select('*, track:learning_tracks(*)')
        .eq('active', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);

      if (ageGroup) {
        dbQuery = dbQuery.eq('learning_tracks.age_group', ageGroup);
      }

      const { data: lessons, error } = await dbQuery;

      if (error) throw error;
      return { lessons, error: null };
    } catch (error) {
      console.error('Search lessons error:', error);
      return { lessons: null, error };
    }
  }
}

export const learningService = new LearningService();
