/**
 * Badge Award Service - Automatic badge awarding system
 */

import { supabase } from '../lib/supabase';

export interface BadgeCondition {
  type: 'lessons_completed' | 'streak_days' | 'xp_earned' | 'projects_created' | 'challenges_solved' | 'perfect_score' | 'help_given';
  threshold: number;
  metadata?: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditions: BadgeCondition[];
  xp_reward: number;
}

class BadgeAwardService {
  /**
   * Check and award badges for a student based on their activity
   */
  async checkAndAwardBadges(studentId: string, activityType: string, activityData: any) {
    try {
      // Get student stats
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (!student) return;

      // Get all available badges
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true);

      if (!allBadges) return;

      // Get student's existing badges
      const { data: studentBadges } = await supabase
        .from('student_badges')
        .select('badge_id')
        .eq('student_id', studentId);

      const earnedBadgeIds = new Set(studentBadges?.map(b => b.badge_id) || []);

      // Check each badge
      for (const badge of allBadges) {
        // Skip if already earned
        if (earnedBadgeIds.has(badge.id)) continue;

        // Check if conditions are met
        const meetsConditions = await this.checkBadgeConditions(
          badge,
          student,
          activityType,
          activityData
        );

        if (meetsConditions) {
          await this.awardBadge(studentId, badge);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  /**
   * Check if badge conditions are met
   */
  private async checkBadgeConditions(
    badge: any,
    student: any,
    activityType: string,
    activityData: any
  ): Promise<boolean> {
    if (!badge.conditions || !Array.isArray(badge.conditions)) return false;

    // All conditions must be met
    for (const condition of badge.conditions) {
      const met = await this.checkSingleCondition(condition, student, activityType, activityData);
      if (!met) return false;
    }

    return true;
  }

  /**
   * Check single badge condition
   */
  private async checkSingleCondition(
    condition: BadgeCondition,
    student: any,
    activityType: string,
    activityData: any
  ): Promise<boolean> {
    switch (condition.type) {
      case 'lessons_completed':
        return (student.lessons_completed || 0) >= condition.threshold;

      case 'streak_days':
        return (student.current_streak_days || 0) >= condition.threshold;

      case 'xp_earned':
        return (student.total_xp || 0) >= condition.threshold;

      case 'projects_created':
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', student.id)
          .eq('status', 'completed');
        return (projectCount || 0) >= condition.threshold;

      case 'challenges_solved':
        const { count: challengeCount } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', student.id)
          .eq('status', 'completed')
          .gte('score', 90); // 90% or higher
        return (challengeCount || 0) >= condition.threshold;

      case 'perfect_score':
        // Check if student got perfect score on a challenge
        return activityType === 'challenge_complete' && activityData?.score === 100;

      case 'help_given':
        // Check forum/community help given (if implemented)
        return false; // Placeholder for future community features

      default:
        return false;
    }
  }

  /**
   * Award badge to student
   */
  private async awardBadge(studentId: string, badge: any) {
    try {
      // Insert badge award
      const { error: insertError } = await supabase
        .from('student_badges')
        .insert({
          student_id: studentId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // Award XP bonus
      if (badge.xp_reward > 0) {
        await this.addXPBonus(studentId, badge.xp_reward, `Badge earned: ${badge.name}`);
      }

      // Create notification
      await this.createBadgeNotification(studentId, badge);

      console.log(`🏆 Badge awarded: ${badge.name} to student ${studentId}`);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }

  /**
   * Add XP bonus for badge
   */
  private async addXPBonus(studentId: string, xp: number, reason: string) {
    try {
      await supabase.rpc('add_student_xp', {
        p_student_id: studentId,
        p_xp_amount: xp,
        p_source: reason,
      });
    } catch (error) {
      console.error('Error adding XP bonus:', error);
    }
  }

  /**
   * Create notification for badge award
   */
  private async createBadgeNotification(studentId: string, badge: any) {
    try {
      // Get student's parent
      const { data: student } = await supabase
        .from('students')
        .select('parent_id, display_name')
        .eq('id', studentId)
        .single();

      if (!student) return;

      // Notify parent
      await supabase.from('parent_notifications').insert({
        parent_id: student.parent_id,
        student_id: studentId,
        notification_type: 'badge_earned',
        title: `${student.display_name} earned a badge!`,
        message: `🏆 ${badge.name} - ${badge.description}`,
        metadata: {
          badge_id: badge.id,
          badge_name: badge.name,
          badge_rarity: badge.rarity,
        },
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Get predefined badges
   */
  getPredefinedBadges(): Badge[] {
    return [
      {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        rarity: 'common',
        conditions: [{ type: 'lessons_completed', threshold: 1 }],
        xp_reward: 50,
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        rarity: 'rare',
        conditions: [{ type: 'streak_days', threshold: 7 }],
        xp_reward: 200,
      },
      {
        id: 'xp-master-1000',
        name: 'XP Master',
        description: 'Earn 1000 total XP',
        icon: '⭐',
        rarity: 'epic',
        conditions: [{ type: 'xp_earned', threshold: 1000 }],
        xp_reward: 500,
      },
      {
        id: 'perfect-coder',
        name: 'Perfect Coder',
        description: 'Get a perfect score on a challenge',
        icon: '💯',
        rarity: 'rare',
        conditions: [{ type: 'perfect_score', threshold: 1 }],
        xp_reward: 150,
      },
      {
        id: 'month-master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        rarity: 'legendary',
        conditions: [{ type: 'streak_days', threshold: 30 }],
        xp_reward: 1000,
      },
      {
        id: 'project-creator',
        name: 'Project Creator',
        description: 'Create 5 projects',
        icon: '🚀',
        rarity: 'epic',
        conditions: [{ type: 'projects_created', threshold: 5 }],
        xp_reward: 300,
      },
      {
        id: 'challenge-champion',
        name: 'Challenge Champion',
        description: 'Complete 20 challenges with 90%+ score',
        icon: '👑',
        rarity: 'legendary',
        conditions: [{ type: 'challenges_solved', threshold: 20 }],
        xp_reward: 800,
      },
    ];
  }
}

export const badgeAwardService = new BadgeAwardService();

