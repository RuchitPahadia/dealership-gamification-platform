import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Trophy, 
  TrendingUp, 
  UserPlus,
  RefreshCw,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { getLeaderboard } from '../../api/client';

export function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([
    { id: 1, text: "Asha (Sales) created booking b100", time: "10 mins ago" },
    { id: 2, text: "Rahul (Finance) approved loan for b100", time: "5 mins ago" },
    { id: 3, text: "Relay Bonus (+50 XP) awarded to Asha & Rahul", time: "5 mins ago" }
  ]);

  const fetchEmployees = () => {
    setLoading(true);
    getLeaderboard('individual')
      .then(res => {
        setEmployees(res.rows || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
    
    // Listen to custom updates to refresh stats
    window.addEventListener('dealerxp_update', fetchEmployees);
    return () => window.removeEventListener('dealerxp_update', fetchEmployees);
  }, []);

  const handleRewardXP = (name) => {
    // Simulate updating points in local storage state
    const stateStr = localStorage.getItem('dealerxp_state');
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        // Find user by name
        let found = false;
        Object.keys(state.score).forEach(userId => {
          if (state.score[userId].name.includes(name) || name.includes(state.score[userId].name)) {
            state.score[userId].points += 50;
            found = true;
          }
        });

        // Update leaderboard
        state.leaderboard.individual = state.leaderboard.individual.map(row => {
          if (row.name.includes(name) || name.includes(row.name)) {
            return { ...row, points: row.points + 50 };
          }
          return row;
        });

        state.leaderboard.individual.sort((a, b) => b.points - a.points);
        state.leaderboard.individual.forEach((row, idx) => {
          row.rank = idx + 1;
        });

        localStorage.setItem('dealerxp_state', JSON.stringify(state));
        
        // Add log entry
        const newLog = {
          id: Date.now(),
          text: `Admin rewarded 50 XP to ${name}`,
          time: "Just now"
        };
        setLog(prev => [newLog, ...prev]);

        // Dispatch update
        window.dispatchEvent(new CustomEvent('dealerxp_update'));
      } catch (e) {
        console.error("Error rewarding XP", e);
      }
    }
  };

  const handleResetCaps = (name) => {
    const stateStr = localStorage.getItem('dealerxp_state');
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        Object.keys(state.score).forEach(userId => {
          if (state.score[userId].name.includes(name) || name.includes(state.score[userId].name)) {
            state.score[userId].capsActive = [];
          }
        });
        localStorage.setItem('dealerxp_state', JSON.stringify(state));
        
        // Add log entry
        const newLog = {
          id: Date.now(),
          text: `Admin reset anti-gaming caps for ${name}`,
          time: "Just now"
        };
        setLog(prev => [newLog, ...prev]);

        window.dispatchEvent(new CustomEvent('dealerxp_update'));
      } catch (e) {
        console.error("Error resetting caps", e);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>Branch Manager Workspace — Vikram</span>
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Mumbai Central Branch Overview • Manage executive performance and view branch activity.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg font-bold">
          Administrator Mode
        </div>
      </div>

      {/* Branch Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Branch Score</span>
          <span className="text-3xl font-extrabold font-numeric text-neutral-900 block mt-2">4,040 XP</span>
          <span className="text-xs text-neutral-400 font-medium">Rank #1 in Region</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Active Duel Rate</span>
          <span className="text-3xl font-extrabold font-numeric text-teal-600 block mt-2">85%</span>
          <span className="text-xs text-neutral-400 font-medium">Counterparts paired</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm text-center">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Relay Bonuses Fired</span>
          <span className="text-3xl font-extrabold font-numeric text-xp-gold block mt-2">18</span>
          <span className="text-xs text-neutral-400 font-medium">Approvals unblocked</span>
        </div>
      </div>

      {/* Roster & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roster Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              <span>Employee Performance Roster</span>
            </h3>
            <button
              onClick={fetchEmployees}
              className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition"
              title="Refresh Roster"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-neutral-400">Loading roster...</div>
          ) : (
            <div className="space-y-4">
              {employees.map(emp => (
                <div 
                  key={emp.name}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50/50 transition"
                >
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">{emp.name}</h4>
                    <span className="text-xs text-neutral-400 block mt-0.5">{emp.branch}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold font-numeric text-neutral-800">
                        {emp.points.toLocaleString()} XP
                      </span>
                      <span className="text-xs text-neutral-400 font-medium block">Rank #{emp.rank}</span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleRewardXP(emp.name)}
                        className="px-2.5 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-lg transition"
                      >
                        +50 XP
                      </button>
                      <button
                        onClick={() => handleResetCaps(emp.name)}
                        className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold rounded-lg transition"
                      >
                        Reset Caps
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm h-fit">
          <h3 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <span>Branch Activity Feed</span>
          </h3>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {log.map(item => (
              <div key={item.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-xs space-y-1">
                <p className="text-neutral-700 font-medium">{item.text}</p>
                <span className="text-[10px] text-neutral-400 block">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
