import { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import { mockStudentService } from '../../services/mock-student.service';
import { Student, StudentDashboardData } from '../../types/database.types';
import { TrendingUp, BookOpen, Target } from 'lucide-react';

interface StudentProgressCardProps {
  student: Student;
}

export const StudentProgressCard = ({ student }: StudentProgressCardProps) => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [student.id]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      // Check if we're in demo mode
      const isDemoMode = student.id.toString().includes('student-') || student.id.toString().includes('demo');
      const service = isDemoMode ? mockStudentService : studentService;
      const { data } = await service.getStudentDashboard(student.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Load student dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm p-6">Loading progress...</div>;
  }

  if (!dashboardData) {
    return null;
  }

  const { current_track, recent_lessons, next_milestone } = dashboardData;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          View Full Report →
        </button>
      </div>

      {/* Current Track */}
      {current_track && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Currently Learning</h3>
              <p className="text-lg font-bold text-blue-600">{current_track.track.title}</p>
              <p className="text-sm text-gray-600 mt-1">{current_track.track.description}</p>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {current_track.progress_percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${current_track.progress_percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">
                    {Math.floor(current_track.total_time_spent / 3600)}h {Math.floor((current_track.total_time_spent % 3600) / 60)}m
                  </span> spent
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recent_lessons && recent_lessons.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Recent Lessons</h3>
          <div className="space-y-2">
            {recent_lessons.slice(0, 5).map((lessonProgress) => (
              <div
                key={lessonProgress.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {lessonProgress.lesson.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lessonProgress.status === 'completed' ? 'Completed' : 'In Progress'} • 
                    {lessonProgress.accuracy_score && ` ${lessonProgress.accuracy_score}% accuracy`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lessonProgress.status === 'completed' ? (
                    <span className="text-green-600 font-semibold">✓</span>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {lessonProgress.progress_percentage.toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-yellow-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Next Milestone</h3>
            <p className="text-sm text-gray-600">{next_milestone.reward}</p>
            <div className="mt-2 w-full bg-yellow-100 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(next_milestone.progress / next_milestone.target) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {next_milestone.target - next_milestone.progress} XP to go
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
