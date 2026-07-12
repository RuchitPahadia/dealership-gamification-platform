import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, CheckCircle2, Trophy, Lock } from 'lucide-react';

const iconMap = {
  Award: Award,
  Flame: Flame,
  CheckCircle2: CheckCircle2,
  Trophy: Trophy
};

export function BadgeProgress({ badge, isEarned }) {
  const IconComponent = iconMap[badge.icon] || Award;
  const progress = isEarned ? 1 : (badge.progress || 0);
  const percentage = Math.round(progress * 100);

  return (
    <motion.div 
      className={`bg-white rounded-xl border p-4 flex flex-col items-center justify-between text-center relative overflow-hidden h-40 shadow-sm ${
        isEarned ? 'border-xp-gold/30 bg-xp-gold/5' : 'border-neutral-100'
      }`}
      whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Badge Icon Area */}
      <div className="relative mt-2">
        {/* Progress Ring / Accent Ring */}
        <svg className="w-16 h-16 transform -rotate-90">
          <circle 
            cx="32" 
            cy="32" 
            r="28" 
            stroke={isEarned ? '#F59E0B' : '#E5E7EB'} 
            strokeWidth="3" 
            fill="transparent" 
          />
          {!isEarned && (
            <motion.circle 
              cx="32" 
              cy="32" 
              r="28" 
              stroke="#F59E0B" 
              strokeWidth="3" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 28}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </svg>

        {/* Icon Center */}
        <div className={`absolute top-2 left-2 w-12 h-12 rounded-full flex items-center justify-center ${
          isEarned 
            ? 'bg-xp-gold text-white' 
            : 'bg-neutral-100 text-neutral-400'
        }`}>
          {isEarned ? (
            <IconComponent className="w-6 h-6" />
          ) : (
            <div className="relative">
              <IconComponent className="w-6 h-6 opacity-40 grayscale" />
              <Lock className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-neutral-400 bg-neutral-100 rounded-full p-0.5" />
            </div>
          )}
        </div>
      </div>

      {/* Badge Info */}
      <div className="w-full">
        <h4 className={`text-sm font-semibold truncate ${isEarned ? 'text-neutral-900 font-bold' : 'text-neutral-500'}`}>
          {badge.name}
        </h4>
        <span className="text-xs text-neutral-400 mt-1 block">
          {isEarned ? 'Unlocked' : `${percentage}% Completed`}
        </span>
      </div>
    </motion.div>
  );
}
