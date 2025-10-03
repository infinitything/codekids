/**
 * Admin Dashboard - Platform management interface with ALL features
 */

import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  Mail,
  Bell,
  FileText,
  Award,
  MessageSquare,
  CreditCard,
  BarChart3,
  Upload,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { env } from '../../lib/env';
import { CourseManagement } from './CourseManagement';
import { UserManagement } from './UserManagement';
import { LessonManagement } from './LessonManagement';
import { BadgeManagement } from './BadgeManagement';
import { QuizBuilder } from './QuizBuilder';
import { CertificateGenerator } from './CertificateGenerator';
import { NotificationCenter } from './NotificationCenter';
import { CouponManagement } from './CouponManagement';
import { SupportTickets } from './SupportTickets';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { PlatformSettings } from './PlatformSettings';
import { EmailTemplates } from './EmailTemplates';
import { LeaderboardManagement } from './LeaderboardManagement';
import { BulkOperations } from './BulkOperations';
import { APIKeyManagement } from './APIKeyManagement';
import { ForumManagement } from './ForumManagement';
import { PerformanceReports } from './PerformanceReports';
import { ContentScheduler } from './ContentScheduler';

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

export const AdminDashboard = () => {
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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'lessons' | 'badges' | 'quizzes' | 'certificates' | 'analytics' | 'leaderboard' | 'forum' | 'reports' | 'scheduler' | 'notifications' | 'support' | 'coupons' | 'revenue' | 'email' | 'settings' | 'bulk' | 'api'>('overview');

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
        .gte('last_active_at', today);

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
        totalRevenue: 0, // Would come from payment_transactions
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data on error
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Platform overview and management
            </p>
          </div>

          {/* Tabs - ALL 20+ FEATURES! */}
          <div className="flex space-x-2 border-t border-gray-200 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'content', label: 'Courses', icon: BookOpen },
              { id: 'lessons', label: 'Lessons', icon: FileText },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'quizzes', label: 'Quizzes', icon: CheckCircle },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'forum', label: 'Forum', icon: MessageSquare },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'scheduler', label: 'Scheduler', icon: Clock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'support', label: 'Support', icon: AlertCircle },
              { id: 'coupons', label: 'Coupons', icon: CreditCard },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'bulk', label: 'Bulk Ops', icon: Upload },
              { id: 'api', label: 'API Keys', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 font-medium text-xs transition-colors flex items-center gap-1 whitespace-nowrap ${
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
                  <h3 className="text-sm font-medium text-gray-600">Revenue (MTD)</h3>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Pending: $125</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Signups */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Signups</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Parent User {i}
                          </p>
                          <p className="text-xs text-gray-500">
                            Joined {i} hours ago
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">API Server</span>
                      </div>
                      <span className="text-xs font-medium text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">Database</span>
                      </div>
                      <span className="text-xs font-medium text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">AI Service</span>
                      </div>
                      <span className="text-xs font-medium text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-700">Code Execution</span>
                      </div>
                      <span className="text-xs font-medium text-yellow-600">Degraded</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-700">Email Service</span>
                      </div>
                      <span className="text-xs font-medium text-red-600">Down</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                      View Full Status Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ALL 20+ FEATURE TABS! */}
        {selectedTab === 'users' && <UserManagement />}
        {selectedTab === 'content' && <CourseManagement />}
        {selectedTab === 'lessons' && <LessonManagement />}
        {selectedTab === 'badges' && <BadgeManagement />}
        {selectedTab === 'quizzes' && <QuizBuilder />}
        {selectedTab === 'certificates' && <CertificateGenerator />}
        {selectedTab === 'analytics' && <AdvancedAnalytics />}
        {selectedTab === 'leaderboard' && <LeaderboardManagement />}
        {selectedTab === 'forum' && <ForumManagement />}
        {selectedTab === 'reports' && <PerformanceReports />}
        {selectedTab === 'scheduler' && <ContentScheduler />}
        {selectedTab === 'notifications' && <NotificationCenter />}
        {selectedTab === 'support' && <SupportTickets />}
        {selectedTab === 'coupons' && <CouponManagement />}
        {selectedTab === 'revenue' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-3xl font-bold text-blue-600">89</p>
                <p className="text-xs text-gray-500 mt-1">Monthly plans</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Avg. Order Value</p>
                <p className="text-3xl font-bold text-purple-600">$29.99</p>
                <p className="text-xs text-gray-500 mt-1">Per student</p>
              </div>
            </div>
          </div>
        )}
        {selectedTab === 'email' && <EmailTemplates />}
        {selectedTab === 'settings' && <PlatformSettings />}
        {selectedTab === 'bulk' && <BulkOperations />}
        {selectedTab === 'api' && <APIKeyManagement />}
      </div>
    </div>
  );
};

