import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldAlert, Swords, Zap, Activity, Flame, ChevronRight, Award, X, Info } from 'lucide-react';

// Helper to determine rank tier based on points
function getRankTier(points) {
  if (points < 300) {
    const progress = (points / 300) * 100;
    return {
      tier: 'Bronze',
      division: 'IV',
      color: 'from-amber-700 via-amber-800 to-amber-950',
      textColor: 'text-amber-600 dark:text-amber-500',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-500',
      glow: 'shadow-amber-500/10',
      nextTier: 'Silver IV',
      pointsToNext: 300 - points,
      progress,
      emblem: '🥉',
    };
  } else if (points < 600) {
    const tierPoints = points - 300;
    const progress = (tierPoints / 300) * 100;
    return {
      tier: 'Silver',
      division: 'III',
      color: 'from-slate-400 via-slate-500 to-slate-700',
      textColor: 'text-slate-500 dark:text-slate-350',
      badgeBg: 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-300',
      glow: 'shadow-slate-400/10',
      nextTier: 'Gold IV',
      pointsToNext: 600 - points,
      progress,
      emblem: '🥈',
    };
  } else if (points < 1000) {
    const tierPoints = points - 600;
    const progress = (tierPoints / 400) * 100;
    return {
      tier: 'Gold',
      division: 'II',
      color: 'from-yellow-500 via-amber-500 to-yellow-600',
      textColor: 'text-yellow-600 dark:text-yellow-500',
      badgeBg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-500',
      glow: 'shadow-yellow-500/20',
      nextTier: 'Platinum IV',
      pointsToNext: 1000 - points,
      progress,
      emblem: '🥇',
    };
  } else if (points < 1500) {
    const tierPoints = points - 1000;
    const progress = (tierPoints / 500) * 100;
    return {
      tier: 'Platinum',
      division: 'II',
      color: 'from-emerald-400 via-teal-500 to-cyan-600',
      textColor: 'text-emerald-600 dark:text-emerald-300',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      glow: 'shadow-emerald-500/20',
      nextTier: 'Diamond IV',
      pointsToNext: 1500 - points,
      progress,
      emblem: '💎',
    };
  } else if (points < 2500) {
    const tierPoints = points - 1500;
    const progress = (tierPoints / 1000) * 100;
    return {
      tier: 'Diamond',
      division: 'I',
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      textColor: 'text-blue-600 dark:text-blue-300',
      badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
      glow: 'shadow-indigo-500/20',
      nextTier: 'Legendary',
      pointsToNext: 2500 - points,
      progress,
      emblem: '💠',
    };
  } else {
    return {
      tier: 'Legendary',
      division: 'Apex',
      color: 'from-purple-600 via-pink-500 to-red-500',
      textColor: 'text-pink-600 dark:text-pink-400',
      badgeBg: 'bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-400',
      glow: 'shadow-pink-500/30',
      nextTier: 'Apex Challenger',
      pointsToNext: 0,
      progress: 100,
      emblem: '👑',
    };
  }
}

export function ScoreCard({ score, department }) {
  const [prevPoints, setPrevPoints] = useState(score.points);
  const [animatePoints, setAnimatePoints] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // stats | rivals | history
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

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
  const rank = getRankTier(score.points);

  // Generate dynamic division rivals based on player points
  const rivals = [
    { rank: 1, name: 'SAMPATH B', points: Math.max(score.points + 120, 1360), tier: 'Platinum I', isMe: false },
    { rank: 2, name: score.name, points: score.points, tier: `${rank.tier} ${rank.division}`, isMe: true },
    { rank: 3, name: 'RANJITH KUMAR S', points: Math.max(score.points - 60, 1180), tier: `${rank.tier} ${rank.division}`, isMe: false },
    { rank: 4, name: 'VINAY PRASAD', points: Math.max(score.points - 250, 990), tier: 'Gold I', isMe: false }
  ].sort((a, b) => b.points - a.points);

  // Styled mock match log history
  const matchHistory = [
    { id: 1, type: 'VICTORY', name: 'Finance Relay Bonus', xp: 150, date: '10m ago', badge: 'Collab Assist', color: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-450' },
    { id: 2, type: 'VICTORY', name: 'Document Set Completed', xp: 95, date: '1h ago', badge: 'SLA Speedrun', color: 'text-blue-600 bg-blue-500/10 dark:text-blue-400' },
    { id: 3, type: 'DEFEAT', name: 'Rework Loop Triggered', xp: -90, date: '4h ago', badge: 'Critical Error', color: 'text-rose-600 bg-rose-500/10 dark:text-rose-400' },
    { id: 4, type: 'VICTORY', name: 'Booking Note Added', xp: 20, date: '1d ago', badge: 'Base XP', color: 'text-neutral-600 bg-neutral-500/10 dark:text-neutral-450' }
  ];

  // Specific scorecard events score breakdown details for coaching audit
  const LOG_BREAKDOWNS = {
    1: { name: 'Finance Relay Bonus', base: 100, streak: 50, anomaly: 0, final: 150, note: "Awarded for seamless document transition between sales and finance counterparts within the 60m SLA." },
    2: { name: 'Document Set Completed', base: 80, streak: 15, anomaly: 0, final: 95, note: "DSE completed package verification first-pass with speedrun multiplier." },
    3: { name: 'Rework Loop Triggered', base: -90, streak: 0, anomaly: 0, final: -90, note: "System penalty applied due to document review rejection. Review checklist notes to fix errors." },
    4: { name: 'Booking Note Added', base: 20, streak: 0, anomaly: 0, final: 20, note: "Routine comment addition. Standard base XP action." }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-neutral-800 dark:text-slate-100 rounded-2xl shadow-sm dark:shadow-2xl relative overflow-hidden flex flex-col"
      whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative Neon Top Border */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${rank.color}`} />
      
      {/* Glow Ambient Overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Header / Rank Emblem */}
      <div className="p-6 border-b border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Pulsing Rank Emblem */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-b ${rank.color} flex items-center justify-center text-4xl shadow-md dark:shadow-lg dark:shadow-black/40 ring-2 ring-white/10 select-none relative group`}>
              <span className="group-hover:scale-110 transition duration-250 transform inline-block">
                {rank.emblem}
              </span>
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500">
                  Competitive Division
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${rank.badgeBg} font-bold`}>
                  {rank.tier} {rank.division}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white mt-1">
                {score.name}
              </h2>
              <span className="text-xs text-neutral-500 dark:text-slate-400 font-semibold">
                {department ? department : 'Unified Agent'} Workspace
              </span>
            </div>
          </div>

          {/* RP / XP Display */}
          <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-2 border-t border-neutral-100 dark:border-slate-800/60 sm:border-t-0 pt-3 sm:pt-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500">
              Ranked Points
            </span>
            <div className="flex items-baseline gap-1.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={score.points}
                  className="text-3xl font-black font-numeric text-neutral-900 dark:text-white tracking-tight tabular-nums"
                  initial={{ scale: animatePoints ? 1.2 : 1, y: animatePoints ? -5 : 0 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {score.points.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-teal-650 dark:text-teal-400 font-bold">RP</span>
            </div>
          </div>
        </div>

        {/* Ranked Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-bold text-neutral-500 dark:text-slate-400 mb-2">
            <span>Progress to Next Rank</span>
            <span className="text-teal-600 dark:text-teal-400 font-numeric">{Math.round(rank.progress)}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-slate-950 rounded-full h-3.5 p-0.5 border border-neutral-200 dark:border-slate-800/80 shadow-inner">
            <motion.div 
              className={`h-full rounded-full bg-gradient-to-r ${rank.color} relative overflow-hidden`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, rank.progress)}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
            </motion.div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-neutral-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-wide">
            <span>{rank.tier} {rank.division}</span>
            <span className="text-neutral-500 dark:text-slate-400">
              {rank.pointsToNext > 0 ? `${rank.pointsToNext} RP to ${rank.nextTier}` : 'Max Tier Achieved'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 dark:border-slate-800 bg-neutral-50 dark:bg-slate-950/40 p-1">
        {['stats', 'rivals', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-800 text-neutral-900 dark:text-white shadow-sm' 
                : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
            }`}
          >
            {tab === 'stats' && 'Performance Stats'}
            {tab === 'rivals' && 'Division Rivals'}
            {tab === 'history' && 'Combat Log'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-6 min-h-[180px] bg-white dark:bg-slate-900/30">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'AP (Action Points)', value: `${score.points} RP`, icon: <Zap className="w-4 h-4 text-yellow-500" /> },
                { label: 'SLA Haste Rate', value: '94% (S)', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
                { label: 'Relay Sync Rate', value: '88% (A+)', icon: <Swords className="w-4 h-4 text-blue-500" /> },
                { label: 'Zero Rework Combo', value: '5-Win Combo', icon: <Flame className="w-4 h-4 text-orange-650" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-neutral-50 dark:bg-slate-950/60 rounded-xl p-3.5 border border-neutral-100 dark:border-slate-800/60 flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-850 shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide block">{stat.label}</span>
                    <span className="text-sm font-black text-neutral-800 dark:text-white tracking-wide">{stat.value}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'rivals' && (
            <motion.div
              key="rivals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {rivals.map((rival, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center px-4 py-2.5 rounded-xl border text-xs ${
                    rival.isMe 
                      ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300' 
                      : 'bg-neutral-50/50 dark:bg-slate-950/40 border-neutral-150 dark:border-slate-800/50 text-neutral-600 dark:text-slate-350'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-black w-4 text-center ${rival.isMe ? 'text-teal-600 dark:text-teal-450' : 'text-neutral-400 dark:text-slate-500'}`}>
                      #{rival.rank}
                    </span>
                    <span className={`font-bold ${rival.isMe ? 'text-teal-850 dark:text-white' : 'text-neutral-700 dark:text-slate-300'}`}>
                      {rival.name} {rival.isMe && '(YOU)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-semibold">{rival.tier}</span>
                    <span className="font-extrabold font-numeric text-neutral-800 dark:text-white">{rival.points} RP</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {matchHistory.map((match) => (
                <div 
                  key={match.id} 
                  onClick={() => {
                    const breakdown = LOG_BREAKDOWNS[match.id] || { name: match.name, base: match.xp, streak: 0, anomaly: 0, final: match.xp, note: "System logged event." };
                    setSelectedBreakdown(breakdown);
                  }}
                  className="flex justify-between items-center px-4 py-2 bg-neutral-50/50 dark:bg-slate-950/40 border border-neutral-150 dark:border-slate-800/40 rounded-xl text-xs cursor-pointer hover:border-teal-500/45 hover:bg-neutral-100 dark:hover:bg-slate-900 transition-all duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${match.color}`}>
                      {match.xp > 0 ? 'XP GAIN' : 'PENALTY'}
                    </span>
                    <div>
                      <span className="font-bold text-neutral-800 dark:text-white block">{match.name}</span>
                      <span className="text-[10px] text-neutral-450 dark:text-slate-500 font-semibold">{match.date} • {match.badge}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold font-numeric text-sm ${match.xp > 0 ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-600 dark:text-rose-450'}`}>
                      {match.xp > 0 ? `+${match.xp}` : match.xp} RP
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-slate-500" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning/Cap Footers */}
      {isCapped && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-6 mt-0 flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-semibold"
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Note Spam Cap Active — AP gains locked. Review active tasks to uncap.</span>
        </motion.div>
      )}

      {/* Score Breakdown Drawer/Modal */}
      <AnimatePresence>
        {selectedBreakdown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedBreakdown(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-400"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-slate-850">
                <Info className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                  Score Breakdown audit
                </h3>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest block">Action Name</span>
                  <span className="text-base font-bold text-neutral-850 dark:text-white">{selectedBreakdown.name}</span>
                </div>

                {/* Arithmetic Flow */}
                <div className="bg-neutral-50 dark:bg-slate-950/60 border border-neutral-150 dark:border-slate-850 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 dark:text-slate-400 font-semibold">Base Weight</span>
                    <span className="font-bold text-neutral-800 dark:text-white font-numeric">
                      {selectedBreakdown.base > 0 ? `+${selectedBreakdown.base}` : selectedBreakdown.base} XP
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 dark:text-slate-400 font-semibold">Streak Combo Multiplier</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-450 font-numeric">
                      {selectedBreakdown.streak > 0 ? `+${selectedBreakdown.streak}` : '0'} XP
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 dark:text-slate-400 font-semibold">Anomaly/Cap Penalty</span>
                    <span className="font-bold text-rose-600 dark:text-rose-450 font-numeric">
                      {selectedBreakdown.anomaly !== 0 ? `${selectedBreakdown.anomaly}` : '0'} XP
                    </span>
                  </div>

                  <div className="h-px bg-neutral-200 dark:bg-slate-850" />

                  <div className="flex justify-between items-center text-sm font-black">
                    <span className="text-neutral-800 dark:text-white">Final Total</span>
                    <span className={`font-numeric ${selectedBreakdown.final > 0 ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-600 dark:text-rose-450'}`}>
                      {selectedBreakdown.final > 0 ? `+${selectedBreakdown.final}` : selectedBreakdown.final} RP
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest block">Coaching Audit Note</span>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed mt-1 font-medium">
                    {selectedBreakdown.note}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedBreakdown(null)}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-neutral-800 dark:text-white text-xs font-bold rounded-xl transition"
                >
                  Close Audit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
