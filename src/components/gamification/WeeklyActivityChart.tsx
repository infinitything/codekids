import { DailyActivity } from '../../types/database.types';

interface WeeklyActivityChartProps {
  activities: DailyActivity[];
}

export const WeeklyActivityChart = ({ activities }: WeeklyActivityChartProps) => {
  // Get last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const activityMap = new Map(activities.map(a => [a.activity_date, a]));
  
  const chartData = last7Days.map(date => ({
    date,
    activity: activityMap.get(date),
  }));

  const maxMinutes = Math.max(...chartData.map(d => d.activity?.minutes_active || 0), 1);
  const maxXP = Math.max(...chartData.map(d => d.activity?.xp_earned || 0), 1);

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  };

  return (
    <div className="space-y-4">
      {/* Minutes Chart */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">Learning Time (minutes)</div>
        <div className="flex items-end justify-between gap-2 h-32">
          {chartData.map(({ date, activity }) => {
            const minutes = activity?.minutes_active || 0;
            const height = (minutes / maxMinutes) * 100;
            
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 relative group"
                    style={{ height: `${height}%`, minHeight: minutes > 0 ? '4px' : '0' }}
                  >
                    {minutes > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {minutes} min
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">{getDayLabel(date)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Chart */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">XP Earned</div>
        <div className="flex items-end justify-between gap-2 h-32">
          {chartData.map(({ date, activity }) => {
            const xp = activity?.xp_earned || 0;
            const height = (xp / maxXP) * 100;
            
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all hover:from-purple-600 hover:to-purple-500 relative group"
                    style={{ height: `${height}%`, minHeight: xp > 0 ? '4px' : '0' }}
                  >
                    {xp > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {xp} XP
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">{getDayLabel(date)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {chartData.reduce((sum, d) => sum + (d.activity?.minutes_active || 0), 0)}
          </div>
          <div className="text-xs text-gray-600">Total Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {chartData.reduce((sum, d) => sum + (d.activity?.lessons_completed || 0), 0)}
          </div>
          <div className="text-xs text-gray-600">Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {chartData.reduce((sum, d) => sum + (d.activity?.xp_earned || 0), 0)}
          </div>
          <div className="text-xs text-gray-600">Total XP</div>
        </div>
      </div>
    </div>
  );
};
