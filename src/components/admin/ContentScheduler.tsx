/**
 * Content Scheduler - Schedule content releases
 */

import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export const ContentScheduler = () => {
  const scheduled = [
    { id: '1', title: 'Python Advanced Module', type: 'Course', scheduledFor: '2025-10-15 09:00', status: 'scheduled' },
    { id: '2', title: 'Web Dev Quiz 5', type: 'Quiz', scheduledFor: '2025-10-10 14:00', status: 'scheduled' },
    { id: '3', title: 'Game Design Workshop', type: 'Lesson', scheduledFor: '2025-10-05 10:00', status: 'published' },
    { id: '4', title: 'Holiday Sale Email', type: 'Notification', scheduledFor: '2025-10-01 08:00', status: 'cancelled' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Scheduler</h2>
          <p className="text-sm text-gray-600">Schedule content releases</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Calendar className="w-5 h-5" />
          New Schedule
        </button>
      </div>

      <div className="space-y-3">
        {scheduled.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{item.scheduledFor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'scheduled' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    <Clock className="w-3 h-3" />
                    Scheduled
                  </span>
                )}
                {item.status === 'published' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    <CheckCircle className="w-3 h-3" />
                    Published
                  </span>
                )}
                {item.status === 'cancelled' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    <XCircle className="w-3 h-3" />
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

