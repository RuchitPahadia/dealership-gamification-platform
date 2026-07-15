import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export function StreakBadge({ streakDays }) {
  const isActive = streakDays > 0;
  
  // Calculate streak level names and colors in game style
  const getStreakMetadata = (days) => {
    if (days === 0) return { name: 'Unranked', multiplier: 'x1.0', color: 'from-slate-700 to-slate-900', textColor: 'text-neutral-400 dark:text-slate-550', glow: 'shadow-slate-900/10' };
    if (days < 3) return { name: 'Warmup', multiplier: 'x1.1', color: 'from-amber-600 to-orange-700', textColor: 'text-orange-600 dark:text-orange-450', glow: 'shadow-orange-500/20' };
    if (days < 5) return { name: 'On Fire', multiplier: 'x1.15', color: 'from-orange-500 to-red-600', textColor: 'text-rose-600 dark:text-rose-450', glow: 'shadow-red-500/30' };
    if (days < 7) return { name: 'Super Charged', multiplier: 'x1.25', color: 'from-red-500 via-pink-500 to-purple-600', textColor: 'text-pink-600 dark:text-pink-400', glow: 'shadow-pink-500/30' };
    return { name: 'Untouchable Challenger', multiplier: 'x1.5', color: 'from-purple-600 via-violet-600 to-cyan-500', textColor: 'text-purple-600 dark:text-purple-400', glow: 'shadow-purple-500/40' };
  };

  const streak = getStreakMetadata(streakDays);

  return (
    <motion.div 
      className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-fit"
      whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow Overlay */}
      {isActive && (
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
            Streak Combo Multiplier
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs font-black uppercase tracking-wider ${streak.textColor}`}>
              {streak.name}
            </span>
            {isActive && <Sparkles className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />}
          </div>
        </div>

        {/* Pulsing Flame Emblem */}
        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-slate-950 border border-neutral-100 dark:border-slate-850 relative group">
          <motion.div
            animate={isActive ? { scale: [1, 1.12, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Flame className={`w-8 h-8 ${isActive ? 'text-orange-500 fill-orange-500/20' : 'text-neutral-400 dark:text-slate-650'}`} />
          </motion.div>
          {isActive && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* Main Multiplier & Day Count */}
      <div className="my-4 flex items-center justify-between border-t border-b border-neutral-150 dark:border-slate-850 py-4 bg-neutral-50/50 dark:bg-slate-950/20 px-3 rounded-xl">
        <div className="flex items-baseline gap-1.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={streakDays}
              className="text-5xl font-black font-numeric text-neutral-900 dark:text-white tracking-tighter"
              initial={{ scale: isActive ? 1.2 : 1, rotate: isActive ? 5 : 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 12 }}
            >
              {streakDays}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-neutral-400 dark:text-slate-400 font-bold uppercase tracking-wider">
            {streakDays === 1 ? 'Day Streak' : 'Day Combo'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest block">XP Multiplier</span>
          <span className="text-2xl font-black font-numeric text-teal-650 dark:text-teal-405 tracking-tight">
            {streak.multiplier}
          </span>
        </div>
      </div>

      {/* Combo Multiplier Progress Tracker or Status */}
      <div className="flex items-center gap-2 text-xs font-bold mt-2">
        {isActive ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-650 dark:text-emerald-450">
              Active multiplier unblocks bonus reward points. Keep it going!
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-neutral-450 dark:text-slate-550 shrink-0" />
            <span className="text-neutral-500 dark:text-slate-500">
              Streak has cooled down. Complete any action today to reboot.
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
