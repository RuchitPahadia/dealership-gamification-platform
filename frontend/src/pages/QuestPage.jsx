import React from 'react';
import { useQuests } from '../hooks/useQuests';
import { QuestList } from '../components/dashboard/QuestList';
import { Target, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function QuestPage() {
  const { data, error, loading } = useQuests();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black font-heading text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-primary animate-pulse" />
            <span>Daily Quests & Bounties</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Complete your daily milestones to earn extra XP and unlock badge progress.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          <p className="text-sm font-semibold text-neutral-500">Loading daily quests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto">
          <h3 className="text-red-800 font-bold text-lg">Error loading quests</h3>
          <p className="text-red-600 text-sm mt-2">Could not retrieve daily quests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QuestList quests={data.quests} />
          </div>
          
          {/* Side stats card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl h-fit space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Quest Summary</span>
            </h3>
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Quests</span>
                <span className="font-bold text-white">{data.quests.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Completed Quests</span>
                <span className="font-bold text-emerald-400">
                  {data.quests.filter(q => q.progress >= q.target).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">XP Potential</span>
                <span className="font-bold text-teal-400">
                  {data.quests.reduce((acc, q) => acc + q.points, 0)} XP
                </span>
              </div>
            </div>
            
            <div className="h-px bg-slate-800 relative z-10" />
            
            <div className="flex gap-2 text-xs text-slate-500 relative z-10">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Quests reset automatically every 24 hours. Points are credited immediately upon completion.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
