import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldAlert } from 'lucide-react';

export function ScoreCard({ score, department }) {
  const [prevPoints, setPrevPoints] = useState(score.points);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    if (score.points !== prevPoints) {
      setAnimatePoints(true);
      const timer = setTimeout(() => {
        setAnimatePoints(false);
        setPrevPoints(score.points);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [score.points, prevPoints]);

  const isCapped = score.capsActive && score.capsActive.includes('BOOKING_NOTE_ADDED');

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between relative overflow-hidden"
      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Decorative Background Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />

      <div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {department ? `${department} XP` : 'Total XP'}
            </span>
            <h3 className="text-sm font-medium text-neutral-600 mt-0.5">{score.name}</h3>
          </div>
          <div className="p-2.5 bg-xp-gold/10 text-xp-gold rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={score.points}
              className="text-4xl font-bold font-numeric text-neutral-900 tracking-tight tabular-nums block"
              initial={{ scale: animatePoints ? 1.2 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {score.points.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-neutral-400 font-medium">XP</span>
        </div>
      </div>

      {isCapped && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 text-xs font-semibold"
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Note Limit Capped (No further XP)</span>
        </motion.div>
      )}
    </motion.div>
  );
}
