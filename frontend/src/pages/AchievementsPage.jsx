import React from 'react';
import { useBadges } from '../hooks/useBadges';
import { BadgeProgress } from '../components/dashboard/BadgeProgress';
import { Award, Lock, Sparkles } from 'lucide-react';

export default function AchievementsPage() {
  const userId = localStorage.getItem('dealerxp_user_id') || 'u1';
  const { data, error, loading } = useBadges(userId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-xp-gold" />
          <span>My Achievements & Badges</span>
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Unlock badges by performing scoring actions and collaborating with team members.</p>
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
          <div>
            <h3 className="font-heading text-md font-bold text-neutral-700 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-xp-gold fill-xp-gold/10" />
              <span>Earned Badges ({data.earned.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {data.earned.map(badge => (
                <BadgeProgress key={badge.id} badge={badge} isEarned={true} />
              ))}
            </div>
          </div>

          {/* Section: In-Progress Badges */}
          <div>
            <h3 className="font-heading text-md font-bold text-neutral-700 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-neutral-400" />
              <span>Locked & In Progress ({data.inProgress.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
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
