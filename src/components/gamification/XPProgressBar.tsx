import { Star } from 'lucide-react';

interface XPProgressBarProps {
  currentXP: number;
  currentLevel: number;
  nextMilestone: {
    type: string;
    progress: number;
    target: number;
    reward: string;
  };
}

export const XPProgressBar = ({ currentXP, currentLevel, nextMilestone }: XPProgressBarProps) => {
  const percentage = (nextMilestone.progress / nextMilestone.target) * 100;
  const xpNeeded = nextMilestone.target - nextMilestone.progress;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">Level {currentLevel}</div>
            <div className="text-sm text-gray-500">{currentXP.toLocaleString()} XP</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Next Level</div>
          <div className="text-lg font-semibold text-gray-900">
            {xpNeeded.toLocaleString()} XP
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
          </div>
        </div>
        <div className="absolute -top-1 right-0 transform translate-x-1/2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-xs font-bold">{currentLevel + 1}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        {percentage.toFixed(1)}% to {nextMilestone.reward}
      </div>
    </div>
  );
};
