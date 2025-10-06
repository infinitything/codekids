import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Trophy,
  TrendingUp,
  Play,
  BookMarked,
  Sparkles,
  Code,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { EnhancedAIChat } from './ai-mentor/EnhancedAIChat';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  lessonsCompleted: number;
  totalLessons: number;
  hoursLearned: number;
  currentStreak: number;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [showAIChat, setShowAIChat] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    lessonsCompleted: 12,
    totalLessons: 45,
    hoursLearned: 24,
    currentStreak: 5,
  });

  const features = [
    {
      id: 'videos',
      title: 'Video Lessons',
      description: 'Watch interactive coding tutorials and lectures',
      icon: Video,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/courses'),
      stats: `${stats.lessonsCompleted}/${stats.totalLessons} completed`,
    },
    {
      id: 'notes',
      title: 'Study Notes',
      description: 'Access course materials and documentation',
      icon: FileText,
      color: 'from-green-500 to-emerald-600',
      action: () => navigate('/courses'),
      stats: '15 documents',
    },
    {
      id: 'ai-mentor',
      title: 'AI Mentor',
      description: 'Get instant help with coding questions',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-600',
      action: () => setShowAIChat(true),
      stats: 'Available 24/7',
    },
    {
      id: 'practice',
      title: 'Code Practice',
      description: 'Solve challenges and build projects',
      icon: Code,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/courses'),
      stats: '8 exercises',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'lesson',
      title: 'Introduction to Python',
      progress: 100,
      timestamp: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'lesson',
      title: 'Variables and Data Types',
      progress: 75,
      timestamp: '1 day ago',
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "Python Beginner" badge',
      progress: 100,
      timestamp: '2 days ago',
      icon: Trophy,
      color: 'text-yellow-600',
    },
  ];

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.full_name || 'Student'}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Ready to continue your learning journey?
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Lessons Completed"
            value={stats.lessonsCompleted}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Hours Learned"
            value={`${stats.hoursLearned}h`}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={Zap}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={Trophy}
            label="Achievements"
            value="8"
            color="from-purple-500 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Learning Resources</h2>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={feature.action}
                      className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 text-left transition-all hover:shadow-md group"
                    >
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">{feature.stats}</span>
                        <Play className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue Learning */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">Continue Your Journey</h3>
                  <p className="text-blue-100 text-sm">Pick up where you left off</p>
                </div>
                <BookMarked className="w-6 h-6 text-blue-100" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">Python Fundamentals</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-white/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <p className="text-sm text-blue-100">Next: Loops and Conditions</p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Continue Learning
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      {activity.progress === 100 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{activity.progress}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
                </button>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Mentor
                </button>
                <button
                  onClick={() => navigate('/badges')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  View Badges
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Progress Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Course Progress</span>
                    <span className="font-medium text-gray-900">
                      {Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.lessonsCompleted / stats.totalLessons) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Next Milestone</p>
                  <p className="font-semibold text-gray-900">Complete 15 lessons</p>
                  <p className="text-xs text-gray-500 mt-1">3 more to go!</p>
                </div>
              </div>
            </div>

            {/* Streak Calendar */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="font-bold text-lg">Learning Streak</h3>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.currentStreak} Days 🔥</div>
              <p className="text-orange-100 text-sm">Keep learning every day!</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <EnhancedAIChat
        studentId={userProfile?.id || 'demo-user'}
        studentAge={12}
        isMinimized={!showAIChat}
        onToggleMinimize={() => setShowAIChat(!showAIChat)}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};
