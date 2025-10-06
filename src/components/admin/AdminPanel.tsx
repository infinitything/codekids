/**
 * Admin Panel - Content Management System
 * Manage videos, notes, questions, students, and all platform content
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  TrendingUp,
  FileText,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  Video,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { env } from '../../lib/env';
import { CourseManagement } from './CourseManagement';
import { UserManagement } from './UserManagement';
import { LessonManagement } from './LessonManagement';
import { BadgeManagement } from './BadgeManagement';
import { QuizBuilder } from './QuizBuilder';

interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  activeToday: number;
  totalLessons: number;
  completedLessons: number;
  totalBadgesEarned: number;
  avgCompletionRate: number;
  totalRevenue: number;
}

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalStudents: 0,
    activeToday: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalBadgesEarned: 0,
    avgCompletionRate: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'courses' | 'lessons' | 'badges' | 'quizzes'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Check if demo mode
      if (env.demoMode) {
        // Use mock data for demo
        setStats({
          totalUsers: 156,
          totalStudents: 342,
          activeToday: 89,
          totalLessons: 145,
          completedLessons: 1234,
          totalBadgesEarned: 567,
          avgCompletionRate: 78.5,
          totalRevenue: 12450,
        });
        setLoading(false);
        return;
      }

      // Production mode - fetch from Supabase
      const { count: parentCount } = await supabase
        .from('parents')
        .select('*', { count: 'exact', head: true });

      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: activeCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity_date', today);

      const { count: lessonCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      const { count: completedCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      const { count: badgeCount } = await supabase
        .from('student_badges')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: parentCount || 0,
        totalStudents: studentCount || 0,
        activeToday: activeCount || 0,
        totalLessons: lessonCount || 0,
        completedLessons: completedCount || 0,
        totalBadgesEarned: badgeCount || 0,
        avgCompletionRate: lessonCount ? ((completedCount || 0) / lessonCount) * 100 : 0,
        totalRevenue: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        activeToday: 0,
        totalLessons: 0,
        completedLessons: 0,
        totalBadgesEarned: 0,
        avgCompletionRate: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-blue-600">&lt;Admin&gt;</div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Manage content, users, and platform settings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-t border-gray-200 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'lessons', label: 'Lessons & Videos', icon: Video },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'quizzes', label: 'Quizzes', icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                change="+12%"
                color="bg-blue-500"
              />
              <StatCard
                icon={BookOpen}
                label="Total Students"
                value={stats.totalStudents}
                change="+8%"
                color="bg-green-500"
              />
              <StatCard
                icon={Activity}
                label="Active Today"
                value={stats.activeToday}
                change="+23%"
                color="bg-purple-500"
              />
              <StatCard
                icon={Trophy}
                label="Badges Earned"
                value={stats.totalBadgesEarned}
                change="+15%"
                color="bg-yellow-500"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Lessons</h3>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLessons}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.completedLessons} completed
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.avgCompletionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Platform average</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Content Items</h3>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalLessons + stats.totalBadgesEarned}
                </p>
                <p className="text-sm text-gray-500 mt-1">Videos, notes & quizzes</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedTab('courses')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Add Course</h4>
                  <p className="text-sm text-gray-600">Create new course</p>
                </button>
                <button
                  onClick={() => setSelectedTab('lessons')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <Video className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Upload Video</h4>
                  <p className="text-sm text-gray-600">Add lesson content</p>
                </button>
                <button
                  onClick={() => setSelectedTab('quizzes')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                >
                  <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Create Quiz</h4>
                  <p className="text-sm text-gray-600">Add questions</p>
                </button>
                <button
                  onClick={() => setSelectedTab('users')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                >
                  <Users className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Manage Users</h4>
                  <p className="text-sm text-gray-600">View all students</p>
                </button>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'users' && <UserManagement />}
        {selectedTab === 'courses' && <CourseManagement />}
        {selectedTab === 'lessons' && <LessonManagement />}
        {selectedTab === 'badges' && <BadgeManagement />}
        {selectedTab === 'quizzes' && <QuizBuilder />}
      </div>
    </div>
  );
};

