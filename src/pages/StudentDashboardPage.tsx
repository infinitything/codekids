import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StudentDashboard } from '../components/student/StudentDashboard';
import { supabase } from '../lib/supabase';

export const StudentDashboardPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) {
        navigate('/auth?mode=login');
        return;
      }

      try {
        // Check if user is a student
        const { data: studentData, error } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching student:', error);
          // User might be a parent, redirect to parent dashboard
          navigate('/parent-dashboard');
          return;
        }

        setStudentId(studentData.id);
      } catch (err) {
        console.error('Error loading student data:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!studentId) {
    return null;
  }

  return <StudentDashboard studentId={studentId} />;
};

