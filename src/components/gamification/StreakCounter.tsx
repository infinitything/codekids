interface StreakCounterProps {
  days: number;
}

export const StreakCounter = ({ days }: StreakCounterProps) => {
  const getStreakEmoji = (days: number) => {
    if (days >= 100) return '🏆';
    if (days >= 30) return '💎';
    if (days >= 14) return '🔥🔥🔥';
    if (days >= 7) return '🔥🔥';
    if (days >= 3) return '🔥';
    return '⭐';
  };

  const getEncouragementMessage = (days: number) => {
    if (days >= 100) return 'LEGENDARY STREAK!';
    if (days >= 30) return 'Unstoppable!';
    if (days >= 14) return 'On fire!';
    if (days >= 7) return 'Week warrior!';
    if (days >= 3) return 'Great start!';
    if (days >= 1) return 'Keep going!';
    return 'Start your streak!';
  };

  return (
    <div className="text-center">
      <div className="text-6xl mb-2">{getStreakEmoji(days)}</div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{days}</div>
      <div className="text-sm text-gray-600 mb-4">{getEncouragementMessage(days)}</div>

      {/* Week Calendar */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(7)].map((_, i) => {
          const isActive = i < (days % 7 || 7);
          return (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
            </div>
          );
        })}
      </div>

      {/* Next Milestone */}
      <div className="mt-4 text-sm text-gray-600">
        {days < 7 && `${7 - days} days to Week Warrior badge!`}
        {days >= 7 && days < 30 && `${30 - days} days to Month Master badge!`}
        {days >= 30 && days < 100 && `${100 - days} days to Century badge!`}
        {days >= 100 && 'You are a LEGEND! 🎉'}
      </div>
    </div>
  );
};
