import { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import { mockStudentService } from '../../services/mock-student.service';
import { Student } from '../../types/database.types';
import { StudentProgressCard } from './StudentProgressCard';
import { ParentNotifications } from './ParentNotifications';
import { WeeklyReport } from './WeeklyReport';
import { ScreenTimeSettings } from './ScreenTimeSettings';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

interface ParentDashboardProps {
  parentId: string;
}

export const ParentDashboard = ({ parentId }: ParentDashboardProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [parentId]);

  const loadStudents = async () => {
    setLoading(true);
    const service = DEMO_MODE ? mockStudentService : studentService;
    const { students } = await service.getStudentsByParent(parentId);
    if (students) {
      setStudents(students as any);
      setSelectedStudent(students[0] || null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your children's learning progress</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Children Yet</h2>
            <p className="text-gray-600 mb-6">
              Get started by creating a profile for your child!
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Add Child Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Child Selector */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Your Children</h2>
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {(student.display_name || student.name || 'S').charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{student.display_name || student.name}</div>
                          <div className="text-sm text-gray-500">Age {student.age}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-gray-600">Level {student.current_level}</span>
                        <span className="text-blue-600 font-semibold">{student.streak_days}🔥</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-semibold border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400">
                  + Add Another Child
                </button>
              </div>

              {/* Notifications */}
              {selectedStudent && (
                <ParentNotifications parentId={parentId} studentId={selectedStudent.id} />
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {selectedStudent && (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <span className="text-sm text-gray-500">This Week</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStudent.experience_points}
                      </div>
                      <div className="text-sm text-gray-600">XP Earned</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-green-600" />
                        <span className="text-sm text-gray-500">Total</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStudent.total_hours_coded.toFixed(1)}h
                      </div>
                      <div className="text-sm text-gray-600">Coding Time</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-8 h-8 text-purple-600" />
                        <span className="text-sm text-gray-500">Earned</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStudent.badges_earned}
                      </div>
                      <div className="text-sm text-gray-600">Badges</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-sm text-gray-500">Current</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedStudent.streak_days}
                      </div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>

                  {/* Detailed Progress */}
                  <StudentProgressCard student={selectedStudent} />

                  {/* Weekly Report */}
                  <WeeklyReport studentId={selectedStudent.id} />

                  {/* Screen Time Settings */}
                  <ScreenTimeSettings studentId={selectedStudent.id} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
