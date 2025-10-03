/**
 * Certificate Generator - Create and manage completion certificates
 */

import { useState } from 'react';
import { Award, Download, Send, Eye } from 'lucide-react';

export const CertificateGenerator = () => {
  const [templateName, setTemplateName] = useState('Modern Blue');
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { id: '1', name: 'Modern Blue', color: 'bg-blue-50' },
    { id: '2', name: 'Elegant Gold', color: 'bg-yellow-50' },
    { id: '3', name: 'Classic Green', color: 'bg-green-50' },
    { id: '4', name: 'Royal Purple', color: 'bg-purple-50' },
  ];

  const generateCertificate = () => {
    alert('Certificate generated! (Demo mode)\nIn production, this would:\n- Generate PDF\n- Store in database\n- Email to student\n- Add verification code');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificate Generator</h2>
          <p className="text-sm text-gray-600">Create completion certificates</p>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Eye className="w-5 h-5" />
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Certificate Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
              <input
                type="text"
                defaultValue="Python for Beginners"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
              <input
                type="text"
                defaultValue="CodeKid Instructor"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={generateCertificate}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download className="w-5 h-5" />
                Generate & Download
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Send className="w-5 h-5" />
                Generate & Email
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="border-4 border-blue-600 rounded-lg p-8 bg-blue-50 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600 mb-6">This certifies that</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">John Doe</p>
            <p className="text-gray-600 mb-2">has successfully completed</p>
            <p className="text-xl font-semibold text-gray-900 mb-6">Python for Beginners</p>
            <p className="text-sm text-gray-500 mb-6">Date: {new Date().toLocaleDateString()}</p>
            <div className="border-t-2 border-gray-300 pt-4">
              <p className="text-sm text-gray-600">Signed by: CodeKid Instructor</p>
              <p className="text-xs text-gray-400 mt-2">Verification Code: CK-2025-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recently Generated</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Student #{i} - Python Course</p>
                  <p className="text-sm text-gray-500">{i} days ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

