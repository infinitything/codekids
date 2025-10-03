import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/student.service';
import { mockStudentService } from '../services/mock-student.service';
import { BadgeDisplay } from '../components/gamification/BadgeDisplay';
import { StudentBadge, Badge } from '../types/database.types';
import { env } from '../lib/env';
import { supabase } from '../lib/supabase';

interface StudentBadgeWithBadge extends StudentBadge { badge: Badge }

export const BadgesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<StudentBadgeWithBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const loadStudentId = async () => {
      if (!user) {
        navigate('/auth?mode=login');
        return;
      }

      try {
        // Get student ID from database
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (studentData) {
          setStudentId(studentData.id);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading student:', err);
        navigate('/');
      }
    };

    loadStudentId();
  }, [user, navigate]);

  useEffect(() => {
    if (!studentId) return;

    const load = async () => {
      setLoading(true);
      const service = env.demoMode ? mockStudentService : studentService;
      try {
        // Fetch all badges for the student
        const { data: allBadges } = await supabase
          .from('student_badges')
          .select('*, badge:badges(*)')
          .eq('student_id', studentId)
          .order('awarded_at', { ascending: false });
        setBadges((allBadges || []) as unknown as StudentBadgeWithBadge[]);
      } catch (e) {
        console.error('Failed to load badges:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Your Badges</h1>
          <button onClick={() => navigate(-1)} className="text-blue-600 font-semibold hover:text-blue-700">← Back</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {badges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No badges yet</h2>
            <p className="text-gray-600">Complete lessons and challenges to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((sb) => (
              <div key={sb.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
                <BadgeDisplay badge={sb.badge} size="md" />
                <div className="mt-4 text-center">
                  <div className="font-semibold text-gray-900">{sb.badge.name}</div>
                  <div className="text-sm text-gray-500">{new Date(sb.awarded_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
