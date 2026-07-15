import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { ScopeToggle } from '../components/leaderboard/ScopeToggle';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { Trophy, TrendingUp } from 'lucide-react';

export default function LeaderboardPage() {
  const [scope, setScope] = useState('individual');
  const { data, error, loading } = useLeaderboard(scope);
  console.log("========== LEADERBOARD PAGE ==========");
  console.log("Scope:", scope);
  console.log("Data:", data);
  console.log("Rows:", data?.rows);

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
        <div className="space-y-6">
          {/* Standalone Personal Rank & Rating Panel */}
          {(() => {
            const loggedInUserId = localStorage.getItem('dealerxp_user_id') || 'u1';
            const myBranchName = loggedInUserId === 'u2' ? 'BANASHANKARI' : 'YELAHANKA';
            const myRow = data?.rows?.find(row => {
              if (scope === 'individual') {
                return row.isMe;
              } else if (scope === 'branch') {
                return row.name.toUpperCase().includes(myBranchName.toUpperCase()) || myBranchName.toUpperCase().includes(row.name.toUpperCase());
              }
              return false;
            });

            if (!myRow) return null;

            return (
              <div className="bg-gradient-to-r from-teal-500/10 to-teal-500/5 dark:from-teal-950/20 dark:to-slate-900 border-2 border-teal-500/30 rounded-2xl p-5 shadow-lg flex items-center justify-between animate-pulse-subtle">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl font-black border border-teal-500/30">
                    #{myRow.rank}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-650 dark:text-teal-400 block">
                      Your Standings
                    </span>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-0.5">
                      {scope === 'individual' ? `${myRow.name} (You)` : `${myRow.name} Branch`}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-slate-550 uppercase tracking-widest block">Rating Score</span>
                  <span className="text-2xl font-black text-neutral-900 dark:text-white font-numeric">
                    {myRow.points.toLocaleString()} <span className="text-xs text-teal-600 dark:text-teal-400 font-extrabold">RP</span>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Top Rank Banner */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-neutral-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-950/25 text-green-600 dark:text-green-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-white">
                {data?.rows?.length ? (
                  scope === "individual" ? (
                    `${data.rows[0].name} is currently #1!`
                  ) : scope === "branch" ? (
                    `${data.rows[0].name} Branch is currently leading!`
                  ) : (
                    `${data.rows[0].name} Department is currently leading!`
                  )
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
          </div>

          <LeaderboardTable rows={data.rows} scope={scope} />
        </div>
      )}
    </div>
  );
}
