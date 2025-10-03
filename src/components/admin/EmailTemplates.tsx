/**
 * Email Templates - Manage automated email templates
 */

import { useState } from 'react';
import { Mail, Edit2, Eye } from 'lucide-react';

export const EmailTemplates = () => {
  const templates = [
    { id: '1', name: 'Welcome Email', subject: 'Welcome to CodeKid!', type: 'user_registration' },
    { id: '2', name: 'Course Completion', subject: 'Congratulations on completing {{course_name}}!', type: 'course_complete' },
    { id: '3', name: 'Password Reset', subject: 'Reset your password', type: 'password_reset' },
    { id: '4', name: 'Payment Success', subject: 'Payment confirmation - {{amount}}', type: 'payment_success' },
    { id: '5', name: 'Badge Earned', subject: 'You earned a new badge!', type: 'badge_earned' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Templates</h2>

      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Mail className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                  <span className="text-xs text-blue-600 font-mono">{template.type}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variables Reference */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Available Variables</h3>
        <div className="grid grid-cols-3 gap-2 text-sm text-blue-800">
          <code>{'{{user_name}}'}</code>
          <code>{'{{course_name}}'}</code>
          <code>{'{{amount}}'}</code>
          <code>{'{{badge_name}}'}</code>
          <code>{'{{site_name}}'}</code>
          <code>{'{{support_email}}'}</code>
        </div>
      </div>
    </div>
  );
};

