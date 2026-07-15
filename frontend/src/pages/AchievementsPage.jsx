import React from 'react';
import { useBadges } from '../hooks/useBadges';
import { BadgeProgress } from '../components/dashboard/BadgeProgress';
import { Award, Lock, Sparkles } from 'lucide-react';

export default function AchievementsPage() {
  const userId = localStorage.getItem('dealerxp_user_id') || 'u1';
  const { data, error, loading } = useBadges(userId);

  return (
    <div className="space-y-8 animate-fade-in text-neutral-800 dark:text-slate-100">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-xp-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-xp-gold animate-bounce" />
            <span>My Achievements & Unlocked Badges</span>
          </h1>
          <p className="text-neutral-550 dark:text-slate-400 text-sm mt-1">Unlock badges by performing scoring actions and collaborating with team members.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          <p className="text-sm font-semibold text-neutral-500">Loading achievements...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto">
          <h3 className="text-red-800 font-bold text-lg">Error loading achievements</h3>
          <p className="text-red-600 text-sm mt-2">Could not retrieve your badges.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section: Earned Badges */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-xp-gold/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5 text-xp-gold fill-xp-gold/10" />
              <span>Earned Badges ({data.earned.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              {data.earned.map(badge => (
                <BadgeProgress key={badge.id} badge={badge} isEarned={true} />
              ))}
            </div>
          </div>

          {/* Section: In-Progress Badges */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
              <Lock className="w-5 h-5 text-neutral-450 dark:text-slate-400" />
              <span>Locked & In Progress ({data.inProgress.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              {data.inProgress.map(badge => (
                <BadgeProgress key={badge.id} badge={badge} isEarned={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
