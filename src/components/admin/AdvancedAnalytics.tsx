/**
 * Advanced Analytics - Charts and data visualization
 */

import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, Award } from 'lucide-react';

export const AdvancedAnalytics = () => {
  const metrics = [
    { label: 'Total Revenue', value: '$12,458', change: '+12.3%', icon: DollarSign, color: 'green' },
    { label: 'Active Students', value: '1,247', change: '+8.5%', icon: Users, color: 'blue' },
    { label: 'Course Completions', value: '89', change: '+15.2%', icon: Award, color: 'purple' },
    { label: 'Avg. Engagement', value: '78%', change: '+5.1%', icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <Icon className={`w-5 h-5 text-${metric.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-green-600">{metric.change} vs last month</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 55, 80, 70, 90, 85, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[50, 70, 65, 85, 75, 95, 90, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-600 rounded-t-lg transition-all hover:bg-green-700"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Popularity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
          <div className="space-y-3">
            {[
              { name: 'Python Basics', enrolled: 456, color: 'blue' },
              { name: 'Web Development', enrolled: 389, color: 'green' },
              { name: 'Game Design', enrolled: 312, color: 'purple' },
              { name: 'Data Science', enrolled: 278, color: 'orange' },
            ].map((course, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{course.name}</span>
                  <span className="text-gray-600">{course.enrolled} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${course.color}-600 h-2 rounded-full`}
                    style={{ width: `${(course.enrolled / 456) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Daily Active Users', value: 67, color: 'blue' },
              { label: 'Weekly Active Users', value: 85, color: 'green' },
              { label: 'Lesson Completion Rate', value: 73, color: 'purple' },
              { label: 'Quiz Pass Rate', value: 81, color: 'orange' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{stat.label}</span>
                  <span className="text-gray-600">{stat.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${stat.color}-600 h-2 rounded-full`}
                    style={{ width: `${stat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Export analytics data</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

