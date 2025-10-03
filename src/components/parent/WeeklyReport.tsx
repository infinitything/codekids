import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DailyActivity } from '../../types/database.types';
import { Calendar, TrendingUp } from 'lucide-react';

interface WeeklyReportProps {
  studentId: string;
}

export const WeeklyReport = ({ studentId }: WeeklyReportProps) => {
  const [activities, setActivities] = useState<DailyActivity[]>([]);

  useEffect(() => {
    loadActivities();
  }, [studentId]);

  const loadActivities = async () => {
    // Check if demo mode
    const isDemoMode = studentId.includes('student-') || studentId.includes('demo');
    
    if (isDemoMode) {
      // Return mock data for demo mode
      const mockActivities: DailyActivity[] = [
        { id: '1', student_id: studentId, activity_date: '2025-09-25', minutes_active: 45, lessons_completed: 2, xp_earned: 250, created_at: new Date().toISOString() },
        { id: '2', student_id: studentId, activity_date: '2025-09-26', minutes_active: 60, lessons_completed: 3, xp_earned: 350, created_at: new Date().toISOString() },
        { id: '3', student_id: studentId, activity_date: '2025-09-27', minutes_active: 30, lessons_completed: 1, xp_earned: 150, created_at: new Date().toISOString() },
        { id: '4', student_id: studentId, activity_date: '2025-09-28', minutes_active: 75, lessons_completed: 4, xp_earned: 450, created_at: new Date().toISOString() },
        { id: '5', student_id: studentId, activity_date: '2025-09-29', minutes_active: 90, lessons_completed: 5, xp_earned: 550, created_at: new Date().toISOString() },
        { id: '6', student_id: studentId, activity_date: '2025-09-30', minutes_active: 50, lessons_completed: 2, xp_earned: 300, created_at: new Date().toISOString() },
        { id: '7', student_id: studentId, activity_date: '2025-10-01', minutes_active: 65, lessons_completed: 3, xp_earned: 400, created_at: new Date().toISOString() },
      ];
      setActivities(mockActivities);
      return;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('student_id', studentId)
      .gte('activity_date', weekAgo.toISOString().split('T')[0])
      .order('activity_date', { ascending: true });

    if (data) {
      setActivities(data);
    }
  };

  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes_active, 0);
  const totalLessons = activities.reduce((sum, a) => sum + a.lessons_completed, 0);
  const totalXP = activities.reduce((sum, a) => sum + a.xp_earned, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Weekly Summary
        </h2>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          View Full History →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{totalMinutes}</div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{totalLessons}</div>
          <div className="text-sm text-gray-600">Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{totalXP}</div>
          <div className="text-sm text-gray-600">XP Earned</div>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="text-sm text-gray-600">
                {new Date(activity.activity_date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-700">{activity.minutes_active} min</span>
                <span className="text-gray-700">{activity.lessons_completed} lessons</span>
                <span className="text-purple-600 font-semibold">{activity.xp_earned} XP</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No activity this week yet
        </div>
      )}
    </div>
  );
};
