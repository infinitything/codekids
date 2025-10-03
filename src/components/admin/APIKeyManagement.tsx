/**
 * API Key Management - Manage integration API keys
 */

import { useState } from 'react';
import { Key, Plus, Trash2, Copy, Eye, EyeOff } from 'lucide-react';

export const APIKeyManagement = () => {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'sk_live_4eC39HqLyjWDarjtT1zdp7dc', created: '2025-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development API', key: 'sk_test_26PHem2AJKTWe9Y5pB1ZqYVN', created: '2025-01-10', lastUsed: '1 day ago' },
    { id: '3', name: 'Mobile App API', key: 'sk_live_1qaz2wsx3edc4rfv5tgb6yhn', created: '2025-01-05', lastUsed: 'Never' },
  ]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys({ ...showKeys, [id]: !showKeys[id] });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('API key copied to clipboard!');
  };

  const deleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
          <p className="text-sm text-gray-600">Manage integration API keys</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Generate New Key
        </button>
      </div>

      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                  <p className="text-xs text-gray-500">Created: {apiKey.created}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Last used: {apiKey.lastUsed}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg mb-3">
              <code className="flex-1 text-sm font-mono">
                {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(40)}
              </code>
              <button
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyKey(apiKey.key)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                View Usage
              </button>
              <button
                onClick={() => deleteKey(apiKey.id)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Warning */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800 font-medium">⚠️ Security Warning</p>
        <p className="text-sm text-red-700 mt-1">Never share your API keys publicly. Treat them like passwords.</p>
      </div>
    </div>
  );
};

