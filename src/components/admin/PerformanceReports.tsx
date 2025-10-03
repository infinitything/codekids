/**
 * Performance Reports - Student performance analytics
 */

import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';

export const PerformanceReports = () => {
  const students = [
    { id: '1', name: 'Alice Chen', courses: 3, completed: 2, avgScore: 92, trend: 'up' },
    { id: '2', name: 'Bob Kumar', courses: 4, completed: 3, avgScore: 88, trend: 'up' },
    { id: '3', name: 'Carol Wang', courses: 2, completed: 1, avgScore: 76, trend: 'down' },
    { id: '4', name: 'David Lee', courses: 5, completed: 4, avgScore: 94, trend: 'up' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Reports</h2>
          <p className="text-sm text-gray-600">Student performance analytics</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Download className="w-5 h-5" />
          Export All Reports
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{student.name}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.courses}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.completed}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    student.avgScore >= 90 ? 'bg-green-100 text-green-800' :
                    student.avgScore >= 80 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.avgScore}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                    <FileText className="w-4 h-4" />
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

