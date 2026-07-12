import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Trophy } from 'lucide-react';

export function DuelStatus({ duel }) {
  if (!duel) return null;

  const totalPoints = duel.dsePoints + duel.financePoints;
  const dsePercentage = (duel.dsePoints / duel.targetPoints) * 100;
  const financePercentage = (duel.financePoints / duel.targetPoints) * 100;
  
  // Who is leading?
  const dseLeading = duel.dsePoints > duel.financePoints;
  const tie = duel.dsePoints === duel.financePoints;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-primary to-orange-500" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-500" />
            <span>Counterpart Duel</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">{duel.title} • Booking {duel.bookingId}</p>
        </div>
        <div className="text-xs px-2.5 py-1 bg-red-50 text-red-600 rounded-full font-bold uppercase tracking-wider animate-pulse">
          Active Duel
        </div>
      </div>

      <div className="grid grid-cols-7 items-center gap-4 relative">
        {/* DSE Stats */}
        <div className="col-span-3 text-left">
          <div className="flex items-center gap-1.5">
            {dseLeading && !tie && <Trophy className="w-4 h-4 text-xp-gold shrink-0" />}
            <span className="text-sm font-semibold truncate text-neutral-800">{duel.dseName}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-numeric text-brand-primary">{duel.dsePoints}</span>
            <span className="text-xs text-neutral-400">XP</span>
          </div>
        </div>

        {/* VS Badge */}
        <div className="col-span-1 flex justify-center">
          <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-heading text-xs font-bold text-neutral-500 italic shadow-inner">
            VS
          </div>
        </div>

        {/* Finance Stats */}
        <div className="col-span-3 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {!dseLeading && !tie && <Trophy className="w-4 h-4 text-xp-gold shrink-0" />}
            <span className="text-sm font-semibold truncate text-neutral-800">{duel.financeName}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-end gap-1">
            <span className="text-2xl font-bold font-numeric text-orange-500">{duel.financePoints}</span>
            <span className="text-xs text-neutral-400">XP</span>
          </div>
        </div>
      </div>

      {/* Progress Tracks */}
      <div className="mt-6 space-y-3">
        {/* DSE progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">DSE Target Progress</span>
            <span className="font-semibold text-neutral-700">{Math.round(dsePercentage)}%</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-brand-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, dsePercentage)}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>

        {/* Finance progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">Finance Target Progress</span>
            <span className="font-semibold text-neutral-700">{Math.round(financePercentage)}%</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, financePercentage)}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
