import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  DollarSign,
  TrendingUp,
  LogOut,
  Home,
  Edit,
  Trash2,
  Plus,
  Eye,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { env } from '../../lib/env';
import toast from 'react-hot-toast';
import { LessonEditorModal } from './LessonEditorModal';

interface Stats {
  totalParents: number;
  totalStudents: number;
  activeToday: number;
  totalLessons: number;
  totalBadges: number;
  revenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription_tier?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  xp_reward: number;
  active: boolean;
}

export const SimpleAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'lessons'>('stats');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<Stats>({
    totalParents: 0,
    totalStudents: 0,
    activeToday: 0,
    totalLessons: 0,
    totalBadges: 0,
    revenue: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await loadStats();
      if (activeTab === 'users') await loadUsers();
      if (activeTab === 'lessons') await loadLessons();
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const { data, error } = await supabase.rpc('admin_get_platform_stats');
    if (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load stats');
      return;
    }
    setStats({
      totalParents: data.parents || 0,
      totalStudents: data.students || 0,
      activeToday: 0,
      totalLessons: data.lessons || 0,
      totalBadges: data.badges || 0,
      revenue: 0,
    });
  };

  const loadUsers = async () => {
    const { data, error } = await supabase.rpc('admin_list_parents', { p_limit: 50 });
    if (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
      setUsers([]);
      return;
    }
    setUsers((data as any[]) || []);
  };

  const loadLessons = async () => {
    const { data, error } = await supabase.rpc('admin_list_lessons', { p_limit: 50 });
    if (error) {
      console.error('Error loading lessons:', error);
      toast.error('Failed to load lessons (admin)');
      setLessons([]);
      return;
    }
    setLessons((data as any[]) || []);
  };

  const openCreateLesson = () => { setEditingLesson(null); setLessonModalOpen(true); };
  const openEditLesson = (lesson: any) => { setEditingLesson(lesson); setLessonModalOpen(true); };
  const onLessonSaved = async () => { await loadLessons(); };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.rpc('admin_delete_parent', { p_parent_id: userId });
      if (error) throw error;
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleLesson = async (lessonId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ active: !currentStatus })
        .eq('id', lessonId);

      if (error) throw error;
      toast.success('Lesson updated');
      loadLessons();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className={`inline-flex p-3 rounded-lg bg-${color}-100 mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your platform</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Home size={18} />
                Home
              </button>
              <button
                onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={20} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'lessons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={20} />
                Lessons
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    icon={Users}
                    label="Total Parents"
                    value={stats.totalParents}
                    color="blue"
                  />
                  <StatCard
                    icon={Users}
                    label="Total Students"
                    value={stats.totalStudents}
                    color="green"
                  />
                  <StatCard
                    icon={Activity}
                    label="Active Today"
                    value={stats.activeToday}
                    color="orange"
                  />
                  <StatCard
                    icon={BookOpen}
                    label="Total Lessons"
                    value={stats.totalLessons}
                    color="purple"
                  />
                  <StatCard
                    icon={Trophy}
                    label="Badges Earned"
                    value={stats.totalBadges}
                    color="yellow"
                  />
                  <StatCard
                    icon={DollarSign}
                    label="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    color="green"
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button type="button" onClick={openCreateLesson} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                      <Plus className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="font-semibold text-gray-900">Add New Lesson</div>
                      <div className="text-sm text-gray-600">Create course content</div>
                    </button>
                    <button type="button" onClick={() => setActiveTab('users')} className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                      <Users className="w-5 h-5 text-green-600 mb-2" />
                      <div className="font-semibold text-gray-900">View All Users</div>
                      <div className="text-sm text-gray-600">Manage user accounts</div>
                    </button>
                    <button type="button" onClick={() => navigate('/badges')} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                      <Trophy className="w-5 h-5 text-purple-600 mb-2" />
                      <div className="font-semibold text-gray-900">Manage Badges</div>
                      <div className="text-sm text-gray-600">Create achievements</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <button type="button" onClick={() => toast('Add User coming soon')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                      <Plus size={18} />
                      Add User
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.full_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.subscription_tier === 'premium'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.subscription_tier || 'free'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button type="button" onClick={() => toast('View user coming soon')} className="text-blue-600 hover:text-blue-900 mr-3">
                              <Eye size={18} />
                            </button>
                            <button type="button" onClick={() => toast('Edit user coming soon')} className="text-gray-600 hover:text-gray-900 mr-3">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lessons Table */}
            {activeTab === 'lessons' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Lesson Management</h2>
                    <button onClick={openCreateLesson} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                      <Plus size={18} />
                      Add Lesson
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          XP Reward
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lessons.map((lesson) => (
                        <tr key={lesson.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{lesson.title}</div>
                            <div className="text-sm text-gray-600">{lesson.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              lesson.difficulty_level === 'beginner'
                                ? 'bg-green-100 text-green-800'
                                : lesson.difficulty_level === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {lesson.difficulty_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lesson.xp_reward} XP
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleLesson(lesson.id, lesson.active)}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                lesson.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {lesson.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button type="button" onClick={() => toast('Preview lesson coming soon')} className="text-blue-600 hover:text-blue-900 mr-3">
                              <Eye size={18} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" onClick={() => openEditLesson(lesson)}>
                              <Edit size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <LessonEditorModal open={lessonModalOpen} onClose={() => setLessonModalOpen(false)} onSaved={onLessonSaved} lesson={editingLesson} />
    </div>
  );
};

