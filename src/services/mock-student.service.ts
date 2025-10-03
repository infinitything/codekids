// Mock student service for demo mode
import { demoStudents, demoBadges, demoWeeklyActivity, demoLessons } from '../lib/mockData';
import { StudentDashboardData } from '../types/database.types';

export const mockStudentService = {
  async getStudentDashboard(studentId: string) {
    const demoStudent = demoStudents[0];
    
    // Format lessons with proper structure
    const formattedLessons = demoLessons.slice(0, 3).map((lesson, index) => ({
      id: `progress-${index}`,
      student_id: studentId,
      lesson_id: lesson.id,
      lesson: lesson,
      progress_percentage: [85, 60, 30][index],
      status: index === 0 ? 'completed' : 'in_progress',
      started_at: new Date(Date.now() - (3 - index) * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: index === 0 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : null
    }));
    
    return {
      data: {
        student: demoStudent,
        current_track: null,
        recent_lessons: formattedLessons,
        recent_badges: demoBadges.slice(0, 4).map(badge => ({
          id: `student-badge-${badge.id}`,
          student_id: studentId,
          badge_id: badge.id,
          earned_at: badge.earned_at,
          badge: {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon_url: badge.icon,
            rarity: 'rare',
            points_value: 50,
            criteria: {},
            created_at: new Date().toISOString()
          }
        })),
        weekly_activity: demoWeeklyActivity,
        next_milestone: {
          name: 'Python Master',
          reward: 'Epic Python Badge',
          progress: 2450,
          target: 3000,
          type: 'level_up'
        }
      } as any,
      error: null
    };
  },

  async getStudentsByParent(parentId: string) {
    return {
      students: demoStudents,
      error: null
    };
  }
};
