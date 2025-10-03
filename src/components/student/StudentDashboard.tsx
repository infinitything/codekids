import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { mockStudentService } from '../../services/mock-student.service';
import { StudentDashboardData } from '../../types/database.types';
import { XPProgressBar } from '../gamification/XPProgressBar';
import { BadgeDisplay } from '../gamification/BadgeDisplay';
import { StreakCounter } from '../gamification/StreakCounter';
import { WeeklyActivityChart } from '../gamification/WeeklyActivityChart';
import { EnhancedAIChat } from '../ai-mentor/EnhancedAIChat';
import { Trophy, Book, Zap, TrendingUp, Play, BookOpen } from 'lucide-react';
import { env } from '../../lib/env';

const DEMO_MODE = env.demoMode;

interface StudentDashboardProps {
  studentId: string;
}

export const StudentDashboard = ({ studentId }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [studentId]);

  const loadDashboard = async () => {
    setLoading(true);
    const service = DEMO_MODE ? mockStudentService : studentService;
    const { data } = await service.getStudentDashboard(studentId);
    setDashboardData(data);
    // Persist active student id for other pages (e.g., lesson viewer)
    try { localStorage.setItem('activeStudentId', studentId); } catch {}
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load dashboard</p>
      </div>
    );
  }

  const { student, current_track, recent_lessons, recent_badges, weekly_activity, next_milestone } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {student.display_name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Ready to learn something awesome today?</p>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <BookOpen className="w-5 h-5" />
          Browse Courses
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8" />
            <span className="text-sm opacity-90">Level</span>
          </div>
          <div className="text-3xl font-bold">{student.current_level}</div>
          <div className="text-sm opacity-90 mt-1">{student.experience_points} XP</div>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8" />
            <span className="text-sm opacity-90">Streak</span>
          </div>
          <div className="text-3xl font-bold">{student.streak_days} Days</div>
          <div className="text-sm opacity-90 mt-1">🔥 Keep it going!</div>
        </div>

        {/* Projects Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Book className="w-8 h-8" />
            <span className="text-sm opacity-90">Projects</span>
          </div>
          <div className="text-3xl font-bold">{student.projects_completed}</div>
          <div className="text-sm opacity-90 mt-1">Completed</div>
        </div>

        {/* Badges Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm opacity-90">Badges</span>
          </div>
          <div className="text-3xl font-bold">{student.badges_earned}</div>
          <div className="text-sm opacity-90 mt-1">Earned</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* XP Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h2>
            <XPProgressBar
              currentXP={student.experience_points}
              currentLevel={student.current_level}
              nextMilestone={next_milestone}
            />
          </div>

          {/* Current Track */}
          {current_track && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                <span className="text-sm text-gray-500">
                  {current_track.progress_percentage.toFixed(0)}% Complete
                </span>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{current_track.track.title}</h3>
                <p className="text-sm text-gray-600">{current_track.track.description}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${current_track.progress_percentage}%` }}
                />
              </div>
              <button 
                onClick={() => navigate(`/courses/${current_track.track.id}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Continue Learning
              </button>
            </div>
          )}

          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h2>
            <WeeklyActivityChart activities={weekly_activity} />
          </div>

          {/* Recent Lessons */}
          {recent_lessons && recent_lessons.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Lessons</h2>
              <div className="space-y-3">
                {recent_lessons.filter(lp => lp?.lesson?.title).map((lessonProgress) => (
                  <div
                    key={lessonProgress.id}
                    onClick={() => lessonProgress.status !== 'completed' && navigate(`/lesson/${lessonProgress.lesson.lesson_slug || lessonProgress.lesson_id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{lessonProgress.lesson.title}</h3>
                      <p className="text-sm text-gray-500">
                        {lessonProgress.progress_percentage?.toFixed(0) || 0}% complete
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lessonProgress.status === 'completed' ? (
                        <span className="text-green-600 font-semibold">✓ Done</span>
                      ) : (
                        <button className="text-blue-600 font-semibold hover:text-blue-700">
                          Continue →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Streak Display */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Streak</h3>
            <StreakCounter days={student.streak_days} />
          </div>

          {/* Recent Badges */}
          {recent_badges && recent_badges.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h3>
              <div className="space-y-3">
                {recent_badges.map((studentBadge) => (
                  <BadgeDisplay key={studentBadge.id} badge={studentBadge.badge} size="sm" />
                ))}
              </div>
              <button onClick={() => navigate('/badges')} className="w-full mt-4 text-blue-600 font-semibold hover:text-blue-700">
                View All Badges →
              </button>
            </div>
          )}

          {/* Next Milestone */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Next Milestone</h3>
            <p className="text-2xl font-bold mb-1">{next_milestone.reward}</p>
            <div className="bg-white bg-opacity-30 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(next_milestone.progress / next_milestone.target) * 100}%` }}
              />
            </div>
            <p className="text-sm opacity-90">
              {next_milestone.target - next_milestone.progress} XP to go!
            </p>
          </div>

          {/* Hours Coded */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Coding Time</h3>
            <div className="text-3xl font-bold text-blue-600">
              {student.total_hours_coded.toFixed(1)} hrs
            </div>
            <p className="text-sm text-gray-500 mt-1">Keep practicing!</p>
          </div>
        </div>
      </div>
      
      {/* AI Chat Widget */}
      <EnhancedAIChat
        studentId={studentId}
        studentAge={10}
        isMinimized={!showAIChat}
        onToggleMinimize={() => setShowAIChat(!showAIChat)}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};
