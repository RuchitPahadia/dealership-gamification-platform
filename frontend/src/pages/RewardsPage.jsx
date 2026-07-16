import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Award, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { getUserScore } from '../api/client';

export default function RewardsPage() {
  const [userId, setUserId] = useState(localStorage.getItem('dealerxp_user_id') || 'u1');
  const [userProfile, setUserProfile] = useState(null);
  const [claimedRewards, setClaimedRewards] = useState(
    JSON.parse(localStorage.getItem('dealerxp_claimed_rewards') || '[]')
  );
  
  // Claim modal feedback
  const [modalReward, setModalReward] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null); // 'success' or 'failed'
  
  useEffect(() => {
    const fetchProfile = () => {
      const uId = localStorage.getItem('dealerxp_user_id') || 'u1';
      setUserId(uId);
      getUserScore(uId)
        .then(profile => {
          setUserProfile(profile);
        })
        .catch(e => console.error("Failed to load user profile in rewards", e));
    };

    fetchProfile();

    const handleUpdate = () => {
      fetchProfile();
    };
    window.addEventListener('dealerxp_update', handleUpdate);
    return () => window.removeEventListener('dealerxp_update', handleUpdate);
  }, [userId]);

  // Load user details for milestone checks
  const currentXP = userProfile?.points || 0;
  const currentStreak = userProfile?.streakDays || 0;
  const isAsha = userId === 'u1' || (userProfile?.name && userProfile.name.toLowerCase().includes('asha'));
  
  // Mock completions based on DSE/Finance role to check lock criteria
  const totalDeliveries = isAsha ? 3 : 0;
  const totalFinanceApprovals = isAsha ? 0 : 5;
  const collusionWarnings = 0; // Guardrail check

  // Prizes catalog
  const rewardsList = [
    {
      id: "r1",
      name: "DealerXP Starter Kit",
      description: "Official team mug, aluminum water bottle, and holographic brand stickers.",
      xpRequired: 100,
      streakRequired: 1,
      deliveriesRequired: 0,
      financeRequired: 0,
      image: "☕",
      difficulty: "Easy"
    },
    {
      id: "r2",
      name: "Premium Leather Key Organiser",
      description: "Handcrafted top-grain leather key sleeve with engraved milestone badge.",
      xpRequired: 500,
      streakRequired: 5,
      deliveriesRequired: 2,
      financeRequired: 0,
      image: "🔑",
      difficulty: "Medium"
    },
    {
      id: "r3",
      name: "Smart Performance Tracker",
      description: "Active smartwatch with integrated heart rate monitor and streak alerts.",
      xpRequired: 1500,
      streakRequired: 10,
      deliveriesRequired: 5,
      financeRequired: 2,
      image: "⌚",
      difficulty: "Hard"
    },
    {
      id: "r4",
      name: "Noise-Cancelling Headphones",
      description: "Premium over-ear ANC wireless headphones for focused operational productivity.",
      xpRequired: 3500,
      streakRequired: 15,
      deliveriesRequired: 15,
      financeRequired: 8,
      image: "🎧",
      difficulty: "Expert"
    },
    {
      id: "r5",
      name: "Executive Retreat Weekend",
      description: "All-inclusive weekend getaway at the Carverse Hilltop Country Club.",
      xpRequired: 7500,
      streakRequired: 20,
      deliveriesRequired: 30,
      financeRequired: 15,
      image: "🏨",
      difficulty: "Insane"
    },
    {
      id: "r6",
      name: "High-Performance Electric Scooter",
      description: "Commute in style with a custom-engraved, 25km/h foldable smart e-scooter.",
      xpRequired: 15000,
      streakRequired: 30,
      deliveriesRequired: 60,
      financeRequired: 40,
      image: "🛴",
      difficulty: "Legendary"
    }
  ];

  // Helper to check if a reward is unlocked
  const checkRequirements = (reward) => {
    const xpMet = currentXP >= reward.xpRequired;
    const streakMet = currentStreak >= reward.streakRequired;
    
    // Check specific milestone logs
    const deliveriesMet = totalDeliveries >= reward.deliveriesRequired;
    const financeMet = totalFinanceApprovals >= reward.financeRequired;
    const warningMet = collusionWarnings === 0;

    return {
      xpMet,
      streakMet,
      deliveriesMet,
      financeMet,
      warningMet,
      allMet: xpMet && streakMet && deliveriesMet && financeMet && warningMet
    };
  };

  const handleClaimReward = (reward) => {
    const checks = checkRequirements(reward);
    setModalReward(reward);
    
    if (checks.allMet) {
      // Success
      setClaimStatus('success');
      const updatedClaims = [...claimedRewards, reward.id];
      setClaimedRewards(updatedClaims);
      localStorage.setItem('dealerxp_claimed_rewards', JSON.stringify(updatedClaims));
    } else {
      // Failed
      setClaimStatus('failed');
    }
  };

  const closeModal = () => {
    setModalReward(null);
    setClaimStatus(null);
  };

  // Determine progression metrics for track UI
  const maxTrackXP = 15000;
  const progressPercent = Math.min(100, (currentXP / maxTrackXP) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-800 dark:text-slate-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl border border-rose-800/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold font-heading tracking-tight">Rewards & Milestones</h1>
                <p className="text-sm text-slate-300 font-medium mt-0.5">
                  Unlock premium corporate prizes by achieving high gamification thresholds and streaks.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl shadow-inner flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Available Balance</span>
              <span className="text-base font-black text-rose-450">{currentXP} XP</span>
            </div>
            <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progression Roadmap */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" /> Milestone Progression Track
          </h2>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
            Visual roadmap of your points journey. Hit XP markers to satisfy primary unlocks.
          </p>
        </div>

        {/* Milestone Road track */}
        <div className="relative pt-8 pb-4 px-2">
          {/* Progress Bar background */}
          <div className="absolute top-10 left-0 right-0 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
          
          {/* Filled Progress Bar */}
          <div 
            className="absolute top-10 left-0 h-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Node markers */}
          <div className="relative flex justify-between">
            {rewardsList.map((reward, index) => {
              const checks = checkRequirements(reward);
              const isClaimed = claimedRewards.includes(reward.id);
              return (
                <div key={reward.id} className="flex flex-col items-center select-none shrink-0" style={{ width: '12%' }}>
                  <div 
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black relative z-10 transition-all duration-300 ${
                      isClaimed 
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30' 
                        : checks.allMet
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-white dark:bg-slate-900 border-slate-350 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {isClaimed ? '✓' : reward.xpRequired >= 1000 ? `${reward.xpRequired/1000}k` : reward.xpRequired}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-600 dark:text-slate-400 mt-2 truncate w-full text-center">
                    {reward.image} {reward.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-500" /> Milestone Prizes Catalog
          </h2>
          <p className="text-xs text-neutral-500 dark:text-slate-400">
            Audit locked prizes and criteria below. These rewards require high effort, streak active states, and real delivery outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {rewardsList.map((reward) => {
            const checks = checkRequirements(reward);
            const isClaimed = claimedRewards.includes(reward.id);
            
            // Difficulty Badge colors
            const diffColor = 
              reward.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
              reward.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
              reward.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
              'bg-red-500/10 text-red-650 border-red-500/20';

            return (
              <div 
                key={reward.id}
                className={`relative flex flex-col justify-between bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isClaimed 
                    ? 'border-neutral-200 dark:border-slate-800 opacity-80' 
                    : checks.allMet 
                      ? 'border-rose-350 dark:border-rose-900/60 ring-1 ring-rose-500/10'
                      : 'border-slate-200 dark:border-slate-850'
                }`}
              >
                {/* Ribbon Tag */}
                <div className="flex justify-between items-start gap-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 border border-neutral-100 dark:border-slate-850 rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none shrink-0">
                    {reward.image}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${diffColor}`}>
                      {reward.difficulty}
                    </span>
                    {isClaimed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/30">
                        Claimed
                      </span>
                    ) : checks.allMet ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/30">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-1.5 flex-1">
                  <h3 className="font-extrabold text-neutral-900 dark:text-white group-hover:text-brand-primary text-base">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                {/* Locking Checklist (Hard requirements validation) */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-slate-850 space-y-2 text-[11px]">
                  <span className="font-extrabold text-neutral-450 dark:text-slate-500 uppercase tracking-widest block mb-2">Required Milestones</span>
                  
                  {/* XP Check */}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-slate-400 font-medium">Accumulate Scaled XP</span>
                    <span className={`font-bold flex items-center gap-1 ${checks.xpMet ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {checks.xpMet ? '✓' : '✗'} {reward.xpRequired} XP ({currentXP} current)
                    </span>
                  </div>

                  {/* Streak Check */}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-slate-400 font-medium">Active Engagement Streak</span>
                    <span className={`font-bold flex items-center gap-1 ${checks.streakMet ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {checks.streakMet ? '✓' : '✗'} {reward.streakRequired} Days ({currentStreak} current)
                    </span>
                  </div>

                  {/* Deliveries Check (Only if required) */}
                  {reward.deliveriesRequired > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 dark:text-slate-400 font-medium">Completed Bookings Delivered</span>
                      <span className={`font-bold flex items-center gap-1 ${checks.deliveriesMet ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {checks.deliveriesMet ? '✓' : '✗'} {reward.deliveriesRequired} ({totalDeliveries} current)
                      </span>
                    </div>
                  )}

                  {/* Finance Check (Only if required) */}
                  {reward.financeRequired > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 dark:text-slate-400 font-medium">Approved Finance Stages</span>
                      <span className={`font-bold flex items-center gap-1 ${checks.financeMet ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {checks.financeMet ? '✓' : '✗'} {reward.financeRequired} ({totalFinanceApprovals} current)
                      </span>
                    </div>
                  )}

                  {/* Collusion Check */}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-slate-400 font-medium">Anti-Gaming / Compliance Gate</span>
                    <span className={`font-bold flex items-center gap-1 ${checks.warningMet ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {checks.warningMet ? '✓' : '✗'} 0 warnings
                    </span>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaimReward(reward)}
                  disabled={isClaimed}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isClaimed
                      ? 'bg-slate-100 dark:bg-slate-850 border-neutral-200 dark:border-slate-800 text-neutral-400 dark:text-slate-500 cursor-not-allowed'
                      : checks.allMet
                        ? 'bg-rose-600 border-rose-500 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 dark:hover:border-slate-750 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isClaimed ? 'Prize Claimed' : checks.allMet ? 'Claim Prize Now' : 'Check Eligibility'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claim Verdict Popup Modal */}
      <AnimatePresence>
        {modalReward && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 relative"
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-neutral-400 hover:text-neutral-600 rounded-lg cursor-pointer transition"
              >
                <XCircle className="w-5 h-5" />
              </button>

              {claimStatus === 'success' ? (
                <div className="text-center space-y-4 pt-4">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 text-green-500 border border-green-150 dark:border-green-900/40 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                    🎉
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white">Milestone Unlocked!</h3>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
                      Congratulations! You have met all operational checks and successfully claimed the **{modalReward.name}**.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-neutral-100 dark:border-slate-850 p-4 rounded-xl text-left text-xs text-neutral-500 dark:text-slate-400">
                    Our Branch HR / Operations Coordinator will contact you shortly to dispatch your reward.
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Awesome, Thanks!
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 pt-4">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-150 dark:border-red-900/40 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white">Prize is Locked</h3>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
                      You do not satisfy all operational gates for the **{modalReward.name}** yet.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-neutral-100 dark:border-slate-850 p-4 rounded-xl text-left text-xs space-y-2.5">
                    <span className="font-extrabold text-[10px] text-neutral-450 dark:text-slate-500 uppercase tracking-widest block">Missing Requirements</span>
                    
                    {currentXP < modalReward.xpRequired && (
                      <div className="flex items-center gap-2 text-red-500 font-bold">
                        <AlertCircle className="w-4 h-4" /> Need {modalReward.xpRequired - currentXP} more XP
                      </div>
                    )}
                    
                    {currentStreak < modalReward.streakRequired && (
                      <div className="flex items-center gap-2 text-red-500 font-bold">
                        <AlertCircle className="w-4 h-4" /> Need {modalReward.streakRequired - currentStreak} more Streak Days
                      </div>
                    )}

                    {totalDeliveries < modalReward.deliveriesRequired && (
                      <div className="flex items-center gap-2 text-red-500 font-bold">
                        <AlertCircle className="w-4 h-4" /> Need {modalReward.deliveriesRequired - totalDeliveries} more Deliveries
                      </div>
                    )}

                    {totalFinanceApprovals < modalReward.financeRequired && (
                      <div className="flex items-center gap-2 text-red-500 font-bold">
                        <AlertCircle className="w-4 h-4" /> Need {modalReward.financeRequired - totalFinanceApprovals} more Finance Approvals
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={closeModal}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Close & Keep Grinding
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
