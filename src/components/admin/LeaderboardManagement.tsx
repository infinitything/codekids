/**
 * Leaderboard Management - Manage gamification leaderboards
 */

import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

export const LeaderboardManagement = () => {
  const topStudents = [
    { rank: 1, name: 'Alice Chen', points: 1850, badges: 12, streak: 45 },
    { rank: 2, name: 'Bob Kumar', points: 1720, badges: 11, streak: 32 },
    { rank: 3, name: 'Carol Wang', points: 1680, badges: 10, streak: 28 },
    { rank: 4, name: 'David Lee', points: 1590, badges: 9, streak: 25 },
    { rank: 5, name: 'Emma Davis', points: 1520, badges: 9, streak: 22 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard Management</h2>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
          <Trophy className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{topStudents[0].name.split(' ')[0]}</p>
          <p className="text-sm opacity-90">Top Student</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white">
          <Star className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">1,850</p>
          <p className="text-sm opacity-90">Highest Points</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white">
          <TrendingUp className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm opacity-90">Best Streak</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white">
          <Medal className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm opacity-90">Most Badges</p>
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Top Students</h3>
        </div>
        <div className="divide-y">
          {topStudents.map((student) => (
            <div key={student.rank} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 flex justify-center">
                    {getRankIcon(student.rank)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {student.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Medal className="w-4 h-4 text-blue-500" />
                        {student.badges} badges
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        {student.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Settings */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Leaderboard Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Enable public leaderboard</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Show student names</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm">Reset leaderboard monthly</span>
          </label>
        </div>
      </div>
    </div>
  );
};

