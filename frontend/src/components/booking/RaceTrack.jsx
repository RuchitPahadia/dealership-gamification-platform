import React from 'react';
import { StageNode } from './StageNode';

export function RaceTrack({ booking }) {
  if (!booking || !booking.stages) return null;

  const stages = booking.stages;
  
  // Find active and completed indices
  // The active stage is the first stage that is NOT done.
  // All stages before it are completed.
  // All stages after it are upcoming.
  const firstIncompleteIdx = stages.findIndex(s => !s.done);
  
  // If all are completed
  const activeIdx = firstIncompleteIdx === -1 ? stages.length - 1 : firstIncompleteIdx;
  
  // Calculate percentage for connecting line
  // Total of 9 columns (START + 7 Stages + FINISH), meaning 8 intervals.
  // If 0 stages completed, progress is 0% (at START).
  // If all 7 stages completed, progress is 100% (reaches FINISH).
  // Otherwise, progress connects to the highest completed stage: (completedCount / 8) * 100
  const completedCount = stages.filter(s => s.done).length;
  const progressPercentage = completedCount === 0 
    ? 0 
    : completedCount === stages.length 
      ? 100 
      : (completedCount / 8) * 100;

  return (
    <div className="relative py-12 px-6 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-2xl overflow-x-auto min-w-[950px]">
      
      {/* Background Track Lines */}
      {/* Aligned from center of column 1 (left-14) to center of column 9 (right-14) */}
      <div className="absolute left-14 right-14 h-3 bg-slate-800 rounded-full" style={{ top: '68px' }}>
        {/* Active Progress Line */}
        <div 
          className="h-full bg-gradient-to-r from-success-green to-xp-gold rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Nodes Container */}
      <div className="relative flex justify-between items-start gap-4">
        
        {/* START Node */}
        <div className="flex flex-col items-center relative z-10 w-28 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center shadow-lg">
            <span className="text-xl">🏁</span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight uppercase tracking-wider text-slate-400">
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
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center shadow-lg">
            <span className="text-xl">🏁</span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight uppercase tracking-wider text-slate-400">
              FINISH
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}
