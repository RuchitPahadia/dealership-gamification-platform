import React from 'react';
import { motion } from 'framer-motion';
import { StageNode } from './StageNode';

export function RaceTrack({ booking }) {
  if (!booking || !booking.stages) return null;

  const stages = booking.stages;
  
  // Find active and completed indices
  const firstIncompleteIdx = stages.findIndex(s => !s.done);
  const activeIdx = firstIncompleteIdx === -1 ? stages.length - 1 : firstIncompleteIdx;
  
  // Calculate percentage for connecting line
  // Total of 9 columns (START + 7 Stages + FINISH), meaning 8 intervals.
  const completedCount = stages.filter(s => s.done).length;
  const progressPercentage = completedCount === 0 
    ? 0 
    : completedCount === stages.length 
      ? 100 
      : (completedCount / 8) * 100;

  return (
    <div className="relative py-14 px-6 bg-neutral-50/50 dark:bg-slate-900/60 rounded-2xl border border-neutral-200 dark:border-slate-800 shadow-md dark:shadow-2xl overflow-x-auto min-w-[950px] overflow-y-hidden">
      
      {/* Top Checkerboard Border */}
      <div className="absolute top-0 left-0 right-0 h-2.5 bg-[repeating-linear-gradient(45deg,#1e293b,#1e293b_10px,#f8fafc_10px,#f8fafc_20px)] dark:bg-[repeating-linear-gradient(45deg,#0f172a,#0f172a_10px,#334155_10px,#334155_20px)] opacity-90 rounded-t-2xl" />
      
      {/* Bottom Checkerboard Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-[repeating-linear-gradient(45deg,#1e293b,#1e293b_10px,#f8fafc_10px,#f8fafc_20px)] dark:bg-[repeating-linear-gradient(45deg,#0f172a,#0f172a_10px,#334155_10px,#334155_20px)] opacity-90 rounded-b-2xl" />
      
      {/* Background Track Lines */}
      {/* Aligned from center of column 1 (left-14) to center of column 9 (right-14) */}
      <div className="absolute left-14 right-14 h-3.5 bg-neutral-200 dark:bg-slate-800 rounded-full" style={{ top: '76px' }}>
        {/* Active Progress Line */}
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Running Sports Car */}
      <motion.div 
        className="absolute z-20 text-3xl select-none filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.25)] scale-x-[-1]"
        style={{ 
          top: '52px', 
          left: `calc(3.5rem + (100% - 7rem) * ${progressPercentage} / 100 - 1.25rem)` 
        }}
        animate={{ 
          y: [0, -2, 0],
          rotate: [0, progressPercentage > 0 ? 1 : 0, 0]
        }}
        transition={{ 
          y: { repeat: Infinity, duration: 0.15, ease: "linear" },
          left: { type: "spring", stiffness: 45, damping: 12 }
        }}
      >
        🏎️
      </motion.div>

      {/* Nodes Container */}
      <div className="relative flex justify-between items-start gap-4">
        
        {/* START Node */}
        <div className="flex flex-col items-center relative z-10 w-28 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-300 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 flex items-center justify-center shadow-lg">
            <span className="text-xl">🏁</span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight uppercase tracking-wider text-neutral-500 dark:text-slate-400">
              START
            </h4>
          </div>
        </div>

        {/* 7 Stage Nodes */}
        {stages.map((stage, idx) => {
          let status = 'upcoming';
          if (stage.done) {
            status = 'completed';
          } else if (idx === activeIdx) {
            status = 'active';
          }
          
          return (
            <StageNode 
              key={stage.key} 
              stage={stage} 
              status={status} 
              index={idx}
            />
          );
        })}

        {/* FINISH Node */}
        <div className="flex flex-col items-center relative z-10 w-28 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-300 dark:border-slate-700 bg-neutral-100 dark:bg-slate-800 flex items-center justify-center shadow-lg">
            <span className="text-xl">🏁</span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight uppercase tracking-wider text-neutral-500 dark:text-slate-400">
              FINISH
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}
