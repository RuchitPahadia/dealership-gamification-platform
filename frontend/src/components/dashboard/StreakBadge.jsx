import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function StreakBadge({ streakDays }) {
  const isActive = streakDays > 0;

  return (
    <motion.div 
      className="bg-white border-neutral-100 rounded-xl shadow-sm border p-6 flex items-center gap-4 relative overflow-hidden transition-all duration-200"
      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-400 dark:text-slate-500'}`}>
        <Flame className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
      </div>

      <div>
        <span className={`text-xs font-semibold uppercase tracking-wider block ${
          isActive 
            ? 'text-orange-600 dark:text-orange-400' 
            : 'text-neutral-400 dark:text-slate-400'
        }`}>
          Active Streak
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className={`text-3xl font-extrabold font-numeric ${
            isActive 
              ? 'text-orange-600 dark:text-orange-400' 
              : 'text-neutral-900 dark:text-slate-500'
          }`}>
            {streakDays}
          </span>
          <span className={`text-xs font-medium ${
            isActive 
              ? 'text-orange-600 dark:text-orange-400' 
              : 'text-neutral-400 dark:text-slate-400'
          }`}>
            {streakDays === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </div>
      )}
    </motion.div>
  );
}
