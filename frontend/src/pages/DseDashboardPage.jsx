import React from 'react';
import { useScore } from '../hooks/useScore';
import { useBadges } from '../hooks/useBadges';
import { useQuests } from '../hooks/useQuests';
import { useDuel } from '../hooks/useDuel';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { StreakBadge } from '../components/dashboard/StreakBadge';
import { QuestList } from '../components/dashboard/QuestList';
import { BadgeProgress } from '../components/dashboard/BadgeProgress';
import { DuelStatus } from '../components/dashboard/DuelStatus';
import { Sparkles, Trophy, Award } from 'lucide-react';

export default function DseDashboardPage({ userId: propUserId }) {
  const userId = propUserId || localStorage.getItem('dealerxp_user_id') || 'u1';
  
  const scoreHook = useScore(userId);
  const badgesHook = useBadges(userId);
  const questsHook = useQuests();
  const duelHook = useDuel();

  const isLoading = scoreHook.loading || badgesHook.loading || questsHook.loading || duelHook.loading;
  const isError = scoreHook.error || badgesHook.error || questsHook.error || duelHook.error;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        <p className="text-sm font-semibold text-neutral-500">Loading DSE Dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto my-12">
        <h3 className="text-red-800 font-bold text-lg">Error loading DSE dashboard</h3>
        <p className="text-red-600 text-sm mt-2">There was an error communicating with the API.</p>
      </div>
    );
  }

  const score = scoreHook.data;
  const badges = badgesHook.data;
  const quests = questsHook.data.quests;
  const duel = duelHook.data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900 flex items-center gap-2">
            <span>DSE Workspace — {score.name}</span>
            <Sparkles className="w-5 h-5 text-xp-gold fill-xp-gold/20" />
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Focus: Closing sales bookings, pushing finance files, and unblocking CCM.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg font-bold">
          Sales Department (DSE)
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard score={score} department="Sales (DSE)" />
        <StreakBadge streakDays={score.streakDays} />
      </div>

      {/* Duel & Quests Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DuelStatus duel={duel} />
        <QuestList quests={quests} department="DSE" />
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-xp-gold" />
            <span>Sales Badges</span>
          </h3>
          <span className="text-xs text-neutral-400 font-medium">
            {badges.earned.length} Unlocked Badges
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.earned.map(badge => (
            <BadgeProgress key={badge.id} badge={badge} isEarned={true} />
          ))}
          {badges.inProgress.map(badge => (
            <BadgeProgress key={badge.id} badge={badge} isEarned={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
