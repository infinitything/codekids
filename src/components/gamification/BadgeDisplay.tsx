import { Badge } from '../../types/database.types';
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

export const BadgeDisplay = ({ badge, size = 'md', showDescription = true }: BadgeDisplayProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${
          RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common
        } flex items-center justify-center shadow-lg relative group`}
      >
        {badge.icon_url ? (
          <img src={badge.icon_url} alt={badge.name} className={iconSizes[size]} />
        ) : (
          <Award className={`${iconSizes[size]} text-white`} />
        )}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
      </div>

      {showDescription && (
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{badge.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                badge.rarity === 'legendary'
                  ? 'bg-yellow-100 text-yellow-800'
                  : badge.rarity === 'epic'
                  ? 'bg-purple-100 text-purple-800'
                  : badge.rarity === 'rare'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {badge.rarity}
            </span>
          </div>
          {badge.description && (
            <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">+{badge.points_value} XP</p>
        </div>
      )}
    </div>
  );
};
