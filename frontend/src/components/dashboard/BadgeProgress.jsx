import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, CheckCircle2, Trophy, Lock, X, Info } from 'lucide-react';

const iconMap = {
  Award: Award,
  Flame: Flame,
  CheckCircle2: CheckCircle2,
  Trophy: Trophy
};

const ACHIEVEMENT_DETAILS = {
  "first-sale": { name: "First Sale", desc: "Successfully completed your first booking creation in the lifecycle pipeline.", req: "Create 1 booking." },
  "speed-demon": { name: "Speed Demon", desc: "Completed customer follow-up actions within the strict 15 minutes SLA threshold.", req: "Meet follow-up SLA 5 times." },
  "team-player": { name: "Team Player", desc: "Triggered collaborative Relay Bonuses with your corresponding department counterpart.", req: "Achieve 5 relay syncs." },
  "finance-closer": { name: "Finance Closer", desc: "Successfully closed a complex finance deal with zero rework loops.", req: "Close a finance approval on first pass." },
  "dealership-hero": { name: "Dealership Hero", desc: "Reopened or completed 10 separate lifecycle deliveries.", req: "Deliver 10 cars." },
  "flawless-execution": { name: "Flawless Execution", desc: "Delivered a customer vehicle with zero rework loop triggers throughout its entire workflow.", req: "Complete a zero-rework delivery." },
  "anti-gaming-guardian": { name: "Anti-Gaming Guardian", desc: "Completed a full work shift without triggering any daily scoring caps or rate limit rules.", req: "Submit 50 actions without hitting limits." },
  "master-collaborator": { name: "Master Collaborator", desc: "Achieved double relay bonuses with both DSE and Finance counterparts within one day.", req: "Trigger 2 relay bonuses within 24 hours." }
};

export function BadgeProgress({ badge, isEarned }) {
  const [showModal, setShowModal] = useState(false);
  const IconComponent = iconMap[badge.icon] || Award;
  const progress = isEarned ? 1 : (badge.progress || 0);
  const percentage = Math.round(progress * 100);

  // Retrieve matching detailed config or default
  const key = badge.id || badge.name.toLowerCase().replace(/\s+/g, '-');
  const details = ACHIEVEMENT_DETAILS[key] || {
    name: badge.name,
    desc: "Complete related dealership milestones in the lifecycle racetrack to claim this achievement.",
    req: "Requires completing related workflow actions."
  };

  return (
    <>
      <motion.div 
        onClick={() => setShowModal(true)}
        className={`bg-white dark:bg-slate-900/60 rounded-xl border p-4 flex flex-col items-center justify-between text-center relative overflow-hidden h-40 shadow-sm hover:border-xp-gold/50 cursor-pointer select-none ${
          isEarned ? 'border-xp-gold/30 bg-xp-gold/5 dark:bg-xp-gold/5' : 'border-neutral-200 dark:border-slate-800'
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
              className="dark:stroke-slate-800"
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
              : 'bg-neutral-100 dark:bg-slate-850 text-neutral-400 dark:text-slate-500'
          }`}>
            {isEarned ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <div className="relative">
                <IconComponent className="w-6 h-6 opacity-45 grayscale" />
                <Lock className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-neutral-400 dark:text-slate-500 bg-neutral-100 dark:bg-slate-800 rounded-full p-0.5" />
              </div>
            )}
          </div>
        </div>

        {/* Badge Info */}
        <div className="w-full">
          <h4 className={`text-sm font-semibold truncate ${isEarned ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-500 dark:text-slate-450'}`}>
            {badge.name}
          </h4>
          <span className="text-xs text-neutral-400 dark:text-slate-500 mt-1 block">
            {isEarned ? 'Unlocked' : `${percentage}% Completed`}
          </span>
        </div>
      </motion.div>

      {/* Info details explanation modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-400"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center mt-2 space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md ${
                  isEarned ? 'bg-xp-gold/15 text-xp-gold border border-xp-gold/30' : 'bg-neutral-100 dark:bg-slate-800 text-neutral-400 dark:text-slate-500'
                }`}>
                  {isEarned ? '🏆' : '🔒'}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                    {isEarned ? 'UNLOCKED ACHIEVEMENT' : 'LOCKED ACHIEVEMENT'}
                  </span>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white mt-1">
                    {details.name}
                  </h3>
                </div>

                <div className="bg-neutral-50 dark:bg-slate-950/60 border border-neutral-150 dark:border-slate-850 p-4 rounded-xl text-left w-full space-y-2.5">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide block">Description</span>
                    <p className="text-xs text-neutral-700 dark:text-slate-300 leading-relaxed font-medium">{details.desc}</p>
                  </div>
                  
                  <div className="h-px bg-neutral-200 dark:bg-slate-850" />
                  
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide block">Requirement</span>
                    <p className="text-xs text-neutral-600 dark:text-slate-400 font-semibold">{details.req}</p>
                  </div>
                </div>

                <div className="w-full pt-2 flex items-center justify-between text-xs font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide">
                  <span>Current Progress</span>
                  <span className={isEarned ? 'text-xp-gold' : 'text-neutral-600 dark:text-slate-350'}>
                    {isEarned ? '100% (Claimed)' : `${percentage}%`}
                  </span>
                </div>
                
                {!isEarned && (
                  <div className="w-full bg-neutral-100 dark:bg-slate-950 rounded-full h-2 p-0.5 border border-neutral-200 dark:border-slate-850 shadow-inner">
                    <div 
                      className="bg-xp-gold h-full rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
