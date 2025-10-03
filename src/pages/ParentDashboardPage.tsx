import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ParentDashboard } from '../components/parent/ParentDashboard';
import { supabase } from '../lib/supabase';

export const ParentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParentData = async () => {
      if (!user) {
        navigate('/auth?mode=login');
        return;
      }

      try {
        // Check if user is a parent
        const { data: parentData, error } = await supabase
          .from('parents')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching parent:', error);
          // User might be a student, redirect to student dashboard
          navigate('/student-dashboard');
          return;
        }

        setParentId(parentData.id);
      } catch (err) {
        console.error('Error loading parent data:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadParentData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!parentId) {
    return null;
  }

  return <ParentDashboard parentId={parentId} />;
};

