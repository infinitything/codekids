/**
 * Notification Center - Send notifications to users
 */

import { useState } from 'react';
import { Bell, Send, Users, User, Filter } from 'lucide-react';

export const NotificationCenter = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [type, setType] = useState('info');

  const sendNotification = () => {
    console.log('Sending notification:', { title, message, target, type });
    alert(`Notification sent to ${target}! (Demo mode)`);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Center</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., New Course Available!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                placeholder="Write your message..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">All Users</option>
                <option value="students">All Students</option>
                <option value="parents">All Parents</option>
                <option value="active">Active Users Only</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="error">Error (Red)</option>
              </select>
            </div>
            <button
              onClick={sendNotification}
              disabled={!title || !message}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              Send Notification
            </button>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {[
              { title: 'New Python Course', message: 'Check out our new Python course!', sent: '2 hours ago', target: 'All Students' },
              { title: 'System Maintenance', message: 'Scheduled maintenance tonight', sent: '1 day ago', target: 'All Users' },
              { title: 'Badge Unlocked', message: 'New badge available!', sent: '2 days ago', target: 'Active Users' },
            ].map((notif, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-gray-900">{notif.title}</p>
                  <span className="text-xs text-gray-500">{notif.sent}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                <span className="text-xs text-blue-600">→ {notif.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

