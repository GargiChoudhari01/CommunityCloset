import React from 'react';
import { Sparkles, Leaf, Award, HeartHandshake } from 'lucide-react';
import type { UserBadge, BadgeType } from '../types';

interface BadgeDisplayProps {
  badges: UserBadge[];
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  const getBadgeIcon = (type: BadgeType) => {
    switch (type) {
      case 'first_share':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'reuse_hero':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'community_helper':
        return <HeartHandshake className="w-5 h-5 text-pink-600" />;
      case 'resource_champion':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Award className="w-5 h-5 text-indigo-600" />;
    }
  };

  if (badges.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">
        No community badges earned yet. Share tools or complete borrows to unlock!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((b) => (
        <div
          key={b.id}
          className="bg-white p-3 rounded-2xl border border-[#FFC0CB]/70 shadow-sm flex items-center space-x-2.5"
        >
          <div className="p-2 rounded-xl bg-[#FFF0F5] border border-[#FFC0CB]/50 flex-shrink-0">
            {getBadgeIcon(b.badgeType)}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{b.title}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-1">{b.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
