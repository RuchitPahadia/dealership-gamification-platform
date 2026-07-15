import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { 
  LogOut, 
  Sparkles, 
  Trophy, 
  Flame, 
  Target, 
  ArrowRight, 
  Newspaper, 
  BookmarkCheck, 
  TrendingUp, 
  Info, 
  Award,
  Zap
} from "lucide-react";

import { useScore } from "../hooks/useScore";
import { useQuests } from "../hooks/useQuests";
import { useBadges } from "../hooks/useBadges";

// Helper to determine rank tier based on points (same logic as ScoreCard)
function getRankTier(points) {
  if (points < 300) {
    return { tier: 'Bronze', division: 'IV', emblem: '🥉', color: 'text-amber-600 dark:text-amber-500' };
  } else if (points < 600) {
    return { tier: 'Silver', division: 'III', emblem: '🥈', color: 'text-slate-500 dark:text-slate-350' };
  } else if (points < 1000) {
    return { tier: 'Gold', division: 'II', emblem: '🥇', color: 'text-yellow-600 dark:text-yellow-500' };
  } else if (points < 1500) {
    return { tier: 'Platinum', division: 'II', emblem: '💎', color: 'text-emerald-650 dark:text-teal-400' };
  } else if (points < 2500) {
    return { tier: 'Diamond', division: 'I', emblem: '💠', color: 'text-blue-600 dark:text-blue-300' };
  } else {
    return { tier: 'Legendary', division: 'Apex', emblem: '👑', color: 'text-pink-650 dark:text-pink-400' };
  }
}

export default function DashboardPage() {
    const userId = localStorage.getItem("dealerxp_user_id");

    if (!userId) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem("dealerxp_user_id");
        window.location.href = "/";
    };

    const { data: score, loading: scoreLoading, error: scoreError } = useScore(userId);
    const { data: questsData, loading: questsLoading } = useQuests();
    const { data: badgesData, loading: badgesLoading } = useBadges(userId);

    const loading = scoreLoading || questsLoading || badgesLoading;
    const error = scoreError;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                <p className="text-sm font-semibold text-neutral-500">Loading lobby dashboard...</p>
            </div>
        );
    }

    if (error || !score) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Failed to load user.
            </div>
        );
    }

    const role = (score.role || "").toLowerCase();
    const isFinance = role.includes("finance");
    const rank = getRankTier(score.points);
    const completedQuests = questsData?.quests?.filter(q => q.progress >= q.target).length || 0;
    const totalQuests = questsData?.quests?.length || 0;

    // Game News Feed (Patch Notes & Announcements)
    const newsFeed = [
      { id: 1, tag: 'Event', title: 'Relay Collaboration Bonus Active!', desc: 'Team up with your department counterpart on active bookings to claim +50 RP relay bonuses.', time: 'Active Now' },
      { id: 2, tag: 'Patch Notes', title: 'Season 1 Ranked Patch v1.0.4', desc: 'Upgraded division rivals ladders, improved dark mode consistency, and aligned backend CSV engine imports.', time: '2h ago' },
      { id: 3, tag: 'Tip', title: 'Avoid Note spam caps', desc: 'Repeatable actions like booking notes are capped at 5 additions daily to focus points on major approvals.', time: '1d ago' }
    ];

    return (
        <div className="space-y-8 animate-fade-in text-neutral-800 dark:text-slate-100">
            {/* Top Sign Out and Welcome Profile Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-lg">
                  {score.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>Lobby Hub — {score.name}</span>
                    <Sparkles className="w-5 h-5 text-xp-gold fill-xp-gold/20" />
                  </h1>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {score.department} • Branch: {score.branch}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-rose-500/10"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>

            {/* Profile Overview and Quick Access Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                    Competitive Profile
                  </span>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-4xl">{rank.emblem}</span>
                    <div>
                      <span className={`text-sm font-black uppercase tracking-wider ${rank.color}`}>
                        {rank.tier} {rank.division}
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-none mt-1">
                        {score.points.toLocaleString()} <span className="text-xs text-teal-600 dark:text-teal-400 font-extrabold">RP</span>
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10" />
                    <span className="text-neutral-500 dark:text-slate-400">Combo Streak: <strong className="text-neutral-900 dark:text-white font-numeric">{score.streakDays}d</strong></span>
                  </div>
                  <Link to="/profile" className="text-brand-primary dark:text-teal-400 font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-1">
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quest Checklist widget */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                      Daily Bounties
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded font-bold">
                      {completedQuests}/{totalQuests} Done
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-primary" />
                    <span>Active Quests Tracker</span>
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-xs mt-1.5">
                    Complete your daily bounties to gain extra Ranked Points and promote your rank tier.
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">XP Potential: {questsData?.quests?.reduce((acc, q) => acc + q.points, 0) || 0} XP</span>
                  <Link to="/quests" className="text-brand-primary dark:text-teal-400 font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-1">
                    <span>Open Quests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Workspace Redirect Card */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                    Action Zone
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-teal-500 fill-teal-500/10" />
                    <span>Department Workspace</span>
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-xs mt-1.5">
                    Head to your active workspace to review your clashing duels, completed tickets, and active approvals.
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 relative z-10">
                  <Link 
                    to={isFinance ? "/finance-dashboard" : "/dse-dashboard"} 
                    className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-all duration-150"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Game Lobby News Board & Achievement Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Lobby Announcements Feed (Patch Notes) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl space-y-4">
                <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-indigo-500" />
                  <span>Announcements & Patch Notes</span>
                </h3>
                
                <div className="space-y-4">
                  {newsFeed.map((news) => (
                    <div 
                      key={news.id} 
                      className="p-4 bg-neutral-50 dark:bg-slate-950/40 border border-neutral-100 dark:border-slate-850 rounded-xl space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded font-bold uppercase tracking-wider">
                          {news.tag}
                        </span>
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                          {news.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{news.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">{news.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements summary list */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-xp-gold" />
                    <span>Unlocked Achievements</span>
                  </h3>
                  
                  <div className="space-y-2.5">
                    {badgesData?.earned?.length > 0 ? (
                      badgesData.earned.slice(0, 3).map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-slate-950/20 border border-neutral-100 dark:border-slate-850 rounded-xl">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white block">{badge.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Earned</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-450 dark:text-slate-500 text-center py-6">No achievements unlocked yet. Get to work inside the Timeline!</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4">
                  <Link to="/achievements" className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150">
                    <span>Open Achievements Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Quick Demo Help Banner */}
            <div className="bg-teal-500/10 border border-teal-500/25 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                  Did you know?
                </h4>
                <p className="text-[11px] text-teal-650 dark:text-teal-350 leading-relaxed mt-1">
                  You can use the floating **Demo Controller** panel at the bottom of the screen from any page to trigger simulated API actions and see your points, streak multiplier, and duels update instantly!
                </p>
              </div>
            </div>
        </div>
    );
}