/**
 * User Management - Manage students and parents
 */

import { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { env } from '../../lib/env';

// Mock data for demo mode
const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Chen', email: 'alice@demo.com', grade_level: '8th Grade', joined_at: '2025-01-15', last_active_at: '2 hours ago' },
  { id: '2', name: 'Bob Kumar', email: 'bob@demo.com', grade_level: '7th Grade', joined_at: '2025-01-10', last_active_at: '1 day ago' },
  { id: '3', name: 'Carol Wang', email: 'carol@demo.com', grade_level: '9th Grade', joined_at: '2025-01-05', last_active_at: '3 hours ago' },
  { id: '4', name: 'David Lee', email: 'david@demo.com', grade_level: '8th Grade', joined_at: '2025-01-01', last_active_at: '5 hours ago' },
];

const MOCK_PARENTS = [
  { id: '1', name: 'Jennifer Chen', email: 'jennifer@demo.com', children_count: 1, joined_at: '2025-01-15' },
  { id: '2', name: 'Raj Kumar', email: 'raj@demo.com', children_count: 2, joined_at: '2025-01-10' },
  { id: '3', name: 'Lisa Wang', email: 'lisa@demo.com', children_count: 1, joined_at: '2025-01-05' },
];

export const UserManagement = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'parents'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    
    // Check demo mode
    if (env.demoMode) {
      setTimeout(() => {
        setStudents(MOCK_STUDENTS);
        setParents(MOCK_PARENTS);
        setLoading(false);
      }, 500);
      return;
    }
    
    // Production mode
    try {
      const [studentData, parentData] = await Promise.all([
        adminService.getAllStudents(),
        adminService.getAllParents(),
      ]);
      setStudents(studentData);
      setParents(parentData);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to mock data
      setStudents(MOCK_STUDENTS);
      setParents(MOCK_PARENTS);
    }
    setLoading(false);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    // Demo mode
    if (env.demoMode) {
      setStudents(students.filter(s => s.id !== studentId));
      alert('Student deleted successfully! (Demo mode)');
      return;
    }

    // Production mode
    const result = await adminService.deleteUser(studentId, 'students');
    if (result.success) {
      alert('Student deleted successfully!');
      loadUsers();
    } else {
      alert('Error deleting student: ' + result.error);
    }
  };

  const handleDeleteParent = async (parentId: string) => {
    if (!confirm('Are you sure you want to delete this parent?')) return;

    // Demo mode
    if (env.demoMode) {
      setParents(parents.filter(p => p.id !== parentId));
      alert('Parent deleted successfully! (Demo mode)');
      return;
    }

    // Production mode
    const result = await adminService.deleteUser(parentId, 'parents');
    if (result.success) {
      alert('Parent deleted successfully!');
      loadUsers();
    } else {
      alert('Error deleting parent: ' + result.error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParents = parents.filter(
    (parent) =>
      parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage students and parents on the platform
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'students'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('parents')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'parents'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Parents ({parents.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      ) : activeTab === 'students' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  XP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name || 'Student ' + student.id?.substring(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.age || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {student.xp || 0} XP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Level {student.level || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.last_active_at
                      ? new Date(student.last_active_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-900 ml-3"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Parents Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Children
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {parent.name || 'Parent ' + parent.id?.substring(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parent.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parent.children_count || 0} children
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parent.created_at
                      ? new Date(parent.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteParent(parent.id)}
                      className="text-red-600 hover:text-red-900 ml-3"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        ((activeTab === 'students' && filteredStudents.length === 0) ||
          (activeTab === 'parents' && filteredParents.length === 0)) && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No {activeTab === 'students' ? 'students' : 'parents'} found
            </p>
          </div>
        )}
    </div>
  );
};

