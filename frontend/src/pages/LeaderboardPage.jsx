import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { ScopeToggle } from '../components/leaderboard/ScopeToggle';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { Trophy, TrendingUp } from 'lucide-react';

export default function LeaderboardPage() {
  const [scope, setScope] = useState('individual');
  const { data, error, loading } = useLeaderboard(scope);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-xp-gold" />
            <span>Leaderboards</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">See how you rank against other executives and branches.</p>
        </div>
        <ScopeToggle scope={scope} onChange={setScope} />
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          <p className="text-sm font-semibold text-neutral-500">Loading standings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto">
          <h3 className="text-red-800 font-bold text-lg">Error loading leaderboard</h3>
          <p className="text-red-600 text-sm mt-2">Could not retrieve the current standings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Rank Banner */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800">
                {scope === 'individual' 
                  ? "Asha is currently in #1 place! Keep it up!" 
                  : "Mumbai Central Branch is holding the lead!"}
              </p>
            </div>
          </div>

          <LeaderboardTable rows={data.rows} scope={scope} />
        </div>
      )}
    </div>
  );
}
