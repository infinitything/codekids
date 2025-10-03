/**
 * Forum Management - Manage community forums
 */

import { MessageCircle, Pin, Trash2, Lock, Eye } from 'lucide-react';

export const ForumManagement = () => {
  const posts = [
    { id: '1', title: 'How to debug Python code?', author: 'Student #123', replies: 8, views: 145, status: 'active', pinned: false },
    { id: '2', title: 'Best practices for React', author: 'Student #45', replies: 15, views: 289, status: 'active', pinned: true },
    { id: '3', title: 'Help with loops', author: 'Student #67', replies: 3, views: 67, status: 'active', pinned: false },
    { id: '4', title: 'Inappropriate content', author: 'Student #89', replies: 0, views: 12, status: 'flagged', pinned: false },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Forum Management</h2>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold text-blue-600">247</p>
          <p className="text-sm text-gray-600">Total Posts</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold text-green-600">1,234</p>
          <p className="text-sm text-gray-600">Total Replies</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600">Flagged</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold text-purple-600">89</p>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Posts</h3>
        </div>
        <div className="divide-y">
          {posts.map((post) => (
            <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {post.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    {post.status === 'flagged' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Flagged</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>By: {post.author}</span>
                    <span>•</span>
                    <span>{post.replies} replies</span>
                    <span>•</span>
                    <span><Eye className="w-3 h-3 inline" /> {post.views} views</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Pin className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                    <Lock className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

