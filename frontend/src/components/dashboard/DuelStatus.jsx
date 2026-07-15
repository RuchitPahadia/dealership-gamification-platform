import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Trophy, Sparkles, TrendingUp, AlertCircle, Zap } from 'lucide-react';

export function DuelStatus({ duel }) {
  if (!duel) return null;

  const dsePercentage = (duel.dsePoints / duel.targetPoints) * 100;
  const financePercentage = (duel.financePoints / duel.targetPoints) * 100;
  
  // Who is leading?
  const dseLeading = duel.dsePoints > duel.financePoints;
  const tie = duel.dsePoints === duel.financePoints;

  return (
    <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-neutral-800 dark:text-slate-100 rounded-2xl shadow-sm dark:shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
      {/* Background neon slash */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-teal-500 via-rose-500 to-orange-500" />
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
            Counterpart Duel Arena
          </span>
          <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 mt-1">
            <Swords className="w-5 h-5 text-rose-500 animate-bounce" />
            <span>{duel.title}</span>
          </h3>
          <span className="text-[10px] text-neutral-450 dark:text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
            Target Goal: {duel.targetPoints} XP
          </span>
        </div>
        
        <div className="text-[10px] px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full font-bold uppercase tracking-widest animate-pulse flex items-center gap-1.5 shadow-md dark:shadow-lg dark:shadow-rose-500/10">
          <Zap className="w-3 h-3 text-rose-500 dark:text-rose-400 fill-rose-500/20" />
          <span>Active Match</span>
        </div>
      </div>

      {/* Duel Grid */}
      <div className="grid grid-cols-7 items-center gap-4 py-4 px-3 bg-neutral-50/50 dark:bg-slate-950/40 rounded-xl border border-neutral-150 dark:border-slate-850 relative">
        
        {/* DSE Champion */}
        <div className="col-span-3 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-black text-xs text-teal-650 dark:text-teal-405">
              SL
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-xs font-bold text-neutral-450 dark:text-slate-500 uppercase tracking-wider block">Sales DSE</span>
              <span className="text-sm font-black text-neutral-900 dark:text-white truncate block">{duel.dseName}</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-numeric text-teal-650 dark:text-teal-405 tracking-tight">{duel.dsePoints}</span>
            <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-bold">RP</span>
          </div>
        </div>

        {/* VS Swords */}
        <div className="col-span-1 flex justify-center">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 flex items-center justify-center font-heading text-xs font-black text-rose-500 italic shadow-sm dark:shadow-lg dark:shadow-black/45"
          >
            VS
          </motion.div>
        </div>

        {/* Finance Challenger */}
        <div className="col-span-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-xs font-bold text-neutral-450 dark:text-slate-500 uppercase tracking-wider block">Finance</span>
              <span className="text-sm font-black text-neutral-900 dark:text-white truncate block">{duel.financeName}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-xs text-orange-650 dark:text-orange-405">
              FN
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black font-numeric text-orange-600 dark:text-orange-400 tracking-tight">{duel.financePoints}</span>
            <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-bold">RP</span>
          </div>
        </div>

      </div>

      {/* Progress Tracks styled as Combat Health/Mana Bars */}
      <div className="mt-6 space-y-4">
        
        {/* DSE Health/Energy Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-neutral-450 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>DSE Power Level</span>
            </span>
            <span className="text-teal-600 dark:text-teal-400 font-numeric">{Math.round(dsePercentage)}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-slate-950 rounded-lg h-2.5 overflow-hidden border border-neutral-200 dark:border-slate-850 p-0.5 shadow-inner">
            <motion.div 
              className="bg-teal-500 dark:bg-teal-450 h-full rounded-md"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, dsePercentage)}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>

        {/* Finance Health/Energy Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-neutral-450 dark:text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Finance Power Level</span>
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-numeric">{Math.round(financePercentage)}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-slate-950 rounded-lg h-2.5 overflow-hidden border border-neutral-200 dark:border-slate-855 p-0.5 shadow-inner">
            <motion.div 
              className="bg-orange-500 h-full rounded-md"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, financePercentage)}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>

      </div>

      {/* Footer Arena Status */}
      <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2">
          {tie ? (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-neutral-550 dark:text-slate-350">Match is deadlocked in a draw!</span>
            </>
          ) : dseLeading ? (
            <>
              <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500 animate-pulse" />
              <span className="text-neutral-550 dark:text-slate-350">
                <strong className="text-neutral-800 dark:text-white">{duel.dseName}</strong> is leading the arena!
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-orange-650 dark:text-orange-400 animate-bounce" />
              <span className="text-neutral-550 dark:text-slate-350">
                <strong className="text-neutral-800 dark:text-white">{duel.financeName}</strong> is capturing the lead!
              </span>
            </>
          )}
        </div>
        
        <div className="text-[10px] text-neutral-400 dark:text-slate-500 uppercase tracking-wide">
          Booking ID: {duel.bookingId}
        </div>
      </div>

    </div>
  );
}
