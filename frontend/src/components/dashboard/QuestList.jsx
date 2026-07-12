import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';

export function QuestList({ quests, department }) {
  // If department is provided, filter quests that are for this department or "Any"
  const filteredQuests = department 
    ? quests.filter(q => q.department === department || q.department === 'Any')
    : quests;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-primary" />
          <span>Active Quests</span>
        </h3>
        {department && (
          <span className="text-xs px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-semibold">
            {department} Mode
          </span>
        )}
      </div>

      {filteredQuests.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 text-sm">
          No active quests for this department.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuests.map((quest) => {
            const isCompleted = quest.progress >= quest.target;
            const percentage = Math.min(100, (quest.progress / quest.target) * 100);

            return (
              <div 
                key={quest.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-neutral-50/50 border-neutral-100 opacity-75' 
                    : 'bg-white border-neutral-100 hover:border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-800'}`}>
                      {quest.title}
                    </h4>
                    <span className="text-xs text-neutral-400 mt-1 block">
                      Reward: <span className="text-xp-gold font-bold">+{quest.points} XP</span>
                    </span>
                  </div>

                  {isCompleted ? (
                    <div className="text-success-green">
                      <CheckCircle2 className="w-5 h-5 fill-success-green/10" />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold font-numeric text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {quest.progress}/{quest.target}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`h-2 rounded-full ${isCompleted ? 'bg-success-green' : 'bg-brand-primary'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
