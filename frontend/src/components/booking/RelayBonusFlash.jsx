import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

export function RelayBonusFlash({ active, dseName = "Asha (DSE)", financeName = "Rahul (Finance)" }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-slate-900 border border-teal-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(20,184,166,0.3)] text-center max-w-md w-full mx-4"
            initial={{ scale: 0.8, y: 50, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Animated Lightning Bolt */}
            <div className="flex justify-center mb-4">
              <motion.div 
                className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap className="w-8 h-8 fill-current" />
              </motion.div>
            </div>

            {/* Sparkles / Effects */}
            <div className="relative">
              <Sparkles className="w-5 h-5 text-teal-400 absolute -top-4 left-10 animate-bounce" />
              <Sparkles className="w-5 h-5 text-teal-400 absolute -top-6 right-10 animate-pulse" />
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-white tracking-tight">
              RELAY BONUS UNLOCKED!
            </h3>
            <p className="text-teal-400 font-semibold text-sm mt-1 uppercase tracking-wider">
              Cross-Department Synergy
            </p>

            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              Finance Approval unblocked the DSE booking! Both players' point counters increase together!
            </p>

            {/* Combined player names */}
            <div className="mt-6 flex justify-center items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">DSE Player</p>
                <p className="text-sm font-bold text-white">{dseName}</p>
                <p className="text-xs text-teal-400 font-extrabold">+150 XP</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Finance Player</p>
                <p className="text-sm font-bold text-white">{financeName}</p>
                <p className="text-xs text-teal-400 font-extrabold">+150 XP</p>
              </div>
            </div>
            
            <div className="mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
              Syncing points on-screen...
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
