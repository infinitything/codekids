import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ParentNotification } from '../../types/database.types';
import { Bell, Award, AlertCircle, TrendingUp, X } from 'lucide-react';

interface ParentNotificationsProps {
  parentId: string;
  studentId: string;
}

export const ParentNotifications = ({ parentId, studentId }: ParentNotificationsProps) => {
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [parentId, studentId]);

  const loadNotifications = async () => {
    // Check if demo mode
    const isDemoMode = parentId.includes('parent-') || parentId.includes('demo') || 
                       studentId.includes('student-') || studentId.includes('demo');
    
    if (isDemoMode) {
      // Return mock notifications for demo mode
      const mockNotifications: ParentNotification[] = [
        {
          id: '1',
          parent_id: parentId,
          student_id: studentId,
          notification_type: 'achievement',
          title: '🏆 New Badge Earned!',
          message: 'Your child earned the "Python Master" badge!',
          read: false,
          emailed: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          parent_id: parentId,
          student_id: studentId,
          notification_type: 'milestone',
          title: '📈 Level Up!',
          message: 'Your child reached Level 6!',
          read: false,
          emailed: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          parent_id: parentId,
          student_id: studentId,
          notification_type: 'stuck',
          title: '🤔 Needs Help',
          message: 'Your child has been stuck on "Loops" for 2 days',
          read: false,
          emailed: false,
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('parent_notifications')
      .select('*')
      .eq('parent_id', parentId)
      .eq('student_id', studentId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    // Check if demo mode - just remove from state
    const isDemoMode = parentId.includes('parent-') || parentId.includes('demo');
    
    if (isDemoMode) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      return;
    }

    await supabase
      .from('parent_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'stuck':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm p-6">Loading...</div>;
  }

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-gray-50 rounded-lg p-3 relative group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(notification.notification_type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
