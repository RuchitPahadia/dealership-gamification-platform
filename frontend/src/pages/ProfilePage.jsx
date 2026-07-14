import React from 'react';
import { useScore } from '../hooks/useScore';
import { useBadges } from '../hooks/useBadges';
import { User, Award, Flame, Mail, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const userId = localStorage.getItem('dealerxp_user_id') || 'u1';
  const { data: score, loading: scoreLoading } = useScore(userId);
  const { data: badges, loading: badgesLoading } = useBadges(userId);

  const isLoading = scoreLoading || badgesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        <p className="text-sm font-semibold text-neutral-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-neutral-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none" />
        
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-brand-primary/10 border-4 border-white shadow flex items-center justify-center text-brand-primary shrink-0 relative">
          <User className="w-12 h-12" />
          <div className="absolute -bottom-1 -right-1 bg-xp-gold text-white p-1 rounded-full text-xs font-bold flex items-center justify-center shadow">
            <Award className="w-4 h-4" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold font-heading text-neutral-900">{score.name}</h2>
          <p className="text-brand-primary text-sm font-semibold">
            {score.role || (userId === 'u3' ? 'Branch Manager (Admin)' : userId === 'u2' ? 'Finance Specialist' : 'Dealer Sales Executive')}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {`${(score.name || 'user').toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')}@carverse.com`}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {score.branch || (userId === 'u3' ? 'Bangalore Branch' : 'Mumbai Central Branch')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined May 2026
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Points</span>
          <span className="text-3xl font-extrabold font-numeric text-neutral-950 block mt-2">{score.points}</span>
          <span className="text-xs text-neutral-400">XP</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Streak Days</span>
          <span className="text-3xl font-extrabold font-numeric text-orange-600 block mt-2 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 fill-orange-500/10 text-orange-500 animate-pulse" />
            {score.streakDays}
          </span>
          <span className="text-xs text-neutral-400">Consecutive days</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Badges Earned</span>
          <span className="text-3xl font-extrabold font-numeric text-xp-gold block mt-2">{badges.earned.length}</span>
          <span className="text-xs text-neutral-400">Achievements unlocked</span>
        </div>
      </div>
    </div>
  );
}
