/**
 * Support Tickets - Manage student support requests
 */

import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const SupportTickets = () => {
  const [filter, setFilter] = useState('all');

  const tickets = [
    { id: '1', subject: 'Login issue', user: 'Student #123', priority: 'high', status: 'open', created: '2 hours ago' },
    { id: '2', subject: 'Payment not processed', user: 'Parent #45', priority: 'urgent', status: 'in_progress', created: '5 hours ago' },
    { id: '3', subject: 'Cannot access lesson', user: 'Student #67', priority: 'medium', status: 'open', created: '1 day ago' },
    { id: '4', subject: 'Badge not awarded', user: 'Student #89', priority: 'low', status: 'resolved', created: '2 days ago' },
    { id: '5', subject: 'Course question', user: 'Student #101', priority: 'medium', status: 'open', created: '3 days ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h2>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'open', 'in_progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} priority
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>From: {ticket.user}</span>
                  <span>•</span>
                  <span>{ticket.created}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-yellow-900">3</p>
          <p className="text-sm text-yellow-700">Open</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-900">1</p>
          <p className="text-sm text-blue-700">In Progress</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-900">1</p>
          <p className="text-sm text-green-700">Resolved</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-600" />
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-700">Total</p>
        </div>
      </div>
    </div>
  );
};

