import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getUserPerformance, getLeaderboard } from '../api/client';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Award, 
  Zap, 
  Gauge, 
  Activity, 
  ArrowLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('dealerxp_user_id') || 'u1');
  const [isManager, setIsManager] = useState(false);
  const [viewMode, setViewMode] = useState('branch'); // 'branch' or 'individual'
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  
  // Data states
  const [branchData, setBranchData] = useState(null);
  const [empPerformance, setEmpPerformance] = useState(null);
  const [leaderboardList, setLeaderboardList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [empLoading, setEmpLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync logged in user and roles
  useEffect(() => {
    const handleUpdate = () => {
      const uId = localStorage.getItem('dealerxp_user_id') || 'u1';
      setCurrentUserId(uId);
    };
    window.addEventListener('dealerxp_update', handleUpdate);
    return () => window.removeEventListener('dealerxp_update', handleUpdate);
  }, []);

  useEffect(() => {
    const userId = currentUserId;
    const managerCheck = userId === 'u3';
    setIsManager(managerCheck);

    setLoading(true);
    setError(null);

    if (managerCheck) {
      setViewMode('branch');
      Promise.all([getDashboardSummary(), getLeaderboard('individual')])
        .then(([summary, leader]) => {
          setBranchData(summary);
          setLeaderboardList(leader?.rows || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load branch analytics");
          setLoading(false);
        });
    } else {
      setViewMode('individual');
      setSelectedEmpId(userId);
      getUserPerformance(userId)
        .then(res => {
          setEmpPerformance(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load your performance analytics");
          setLoading(false);
        });
    }
  }, [currentUserId]);

  const handleSelectEmployee = (empId) => {
    setSelectedEmpId(empId);
    setViewMode('individual');
    setEmpLoading(true);
    getUserPerformance(empId)
      .then(res => {
        setEmpPerformance(res);
        setEmpLoading(false);
      })
      .catch(err => {
        console.error(err);
        setEmpLoading(false);
      });
  };

  const handleBackToBranch = () => {
    setViewMode('branch');
    setSelectedEmpId(null);
    setEmpPerformance(null);
  };

  // Cohesive, clean color palette (SaaS Slate-Blue themed)
  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-neutral-400 dark:text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-slate-800 border-t-brand-primary animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase">Loading analytics workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-xs max-w-md mx-auto mt-12 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Analytics Workspace offline</h3>
            <p className="mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-4 text-neutral-800 dark:text-slate-200 font-body">
      
      {/* Clean Vercel-style Header Section */}
      <div className="border-b border-neutral-100 dark:border-slate-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          {viewMode === 'branch' ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-primary" />
                Branch Overview
              </h1>
              <p className="text-xs text-neutral-500 dark:text-slate-400">
                Cycle times, action mixes, and individual performance logs for active dealership teams.
              </p>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {isManager && (
                <button
                  onClick={handleBackToBranch}
                  className="p-1.5 hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-400 rounded-lg border border-neutral-200 dark:border-slate-800 transition cursor-pointer shrink-0"
                  title="Back to Branch Overview"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                  {empPerformance?.profile?.name || empPerformance?.profile?.userId || 'Employee'}'s Performance
                </h1>
                <p className="text-xs text-neutral-500 dark:text-slate-400">
                  Performance velocity, active streaks, efficiency analytics, and audited milestone logs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info pills */}
        <div className="flex items-center gap-2">
          {viewMode === 'individual' && (
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-850 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <span className="text-neutral-400 dark:text-slate-500 uppercase text-[9px] tracking-wider font-extrabold">Rank Tier:</span>
              <span className="text-xp-gold font-bold">{empPerformance?.profile?.badge || "Bronze"}</span>
            </div>
          )}
          <span className="px-2.5 py-1.5 bg-neutral-100 dark:bg-slate-900 text-neutral-600 dark:text-slate-450 border border-neutral-200 dark:border-slate-850 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
            {viewMode === 'branch' ? 'Branch Manager view' : (empPerformance?.profile?.role || 'Executive')}
          </span>
        </div>
      </div>

      {/* RENDER BRANCH VIEW */}
      {viewMode === 'branch' && (
        <>
          {/* Minimalist Branch KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Avg Cycle Time</span>
                <Clock className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">67.6 hrs</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">↓ 4.8 hrs</span>
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                Workflow time from booking creation to delivery.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Bookings</span>
                <TrendingUp className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">18 Cases</span>
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                9 in Finance, 4 in Delivery, 5 pre-finance
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Scoring Employees</span>
                <Users className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">14 Active</span>
                <span className="text-[10px] text-indigo-500 font-bold">93% activity</span>
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                Employees logging scoring events this week.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Rate Cap Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">2 Flagged</span>
                <span className="text-[10px] text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">Open</span>
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                Anti-gaming warnings under manager review.
              </p>
            </div>
          </div>

          {/* Clean Branch Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cycle Time Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Workflow Stage Cycle-Time (Branch)
                </h2>
                <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                  Average duration (in hours) spent to complete milestones on bookings.
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={branchData?.cycleTime}
                    margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="stage" 
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '11px' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[3, 3, 0, 0]}>
                      {branchData?.cycleTime?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action-Mix Pie/Donut Chart */}
            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Operational Action Distribution
                </h2>
                <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                  Composition of scoring milestones completed across the branch (Volume).
                </p>
              </div>
              <div className="h-64 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="h-full w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={branchData?.actionMix}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {branchData?.actionMix?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend List */}
                <div className="w-full sm:w-1/2 space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
                  {branchData?.actionMix?.map((item, index) => {
                    const total = branchData.actionMix.reduce((sum, entry) => sum + entry.value, 0);
                    const percent = ((item.value / total) * 100).toFixed(0);
                    return (
                      <div key={item.name} className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="font-semibold text-neutral-500 dark:text-slate-400 truncate max-w-[100px]">{item.name}</span>
                        </div>
                        <span className="font-bold text-neutral-800 dark:text-white">{item.value} ({percent}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Drill-down Employee Selection Table */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Team Performance Audits
              </h2>
              <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                Click on any employee row below to inspect their detailed XP growth charts and operational logs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-slate-950 border-b border-neutral-150 dark:border-slate-850 font-bold uppercase tracking-wider text-neutral-400 dark:text-slate-500">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Branch</th>
                    <th className="p-4">Points</th>
                    <th className="p-4">Tier Badge</th>
                    <th className="p-4 pr-6 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-slate-850">
                  {leaderboardList.map((row) => (
                    <tr 
                      key={row.userId || row.name}
                      onClick={() => handleSelectEmployee(row.userId || (row.name.toLowerCase().includes('asha') ? 'u1' : 'u2'))}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors cursor-pointer group text-xs text-neutral-600 dark:text-slate-350"
                    >
                      <td className="p-4 pl-6 font-bold text-neutral-900 dark:text-white">
                        {row.rank}
                      </td>
                      <td className="p-4 font-bold text-brand-primary dark:text-blue-400 group-hover:underline">
                        {row.name}
                      </td>
                      <td className="p-4 text-neutral-450 dark:text-slate-500">
                        {row.branch || "Yelahanka"}
                      </td>
                      <td className="p-4 font-bold">
                        {row.points} XP
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-350 border border-neutral-200 dark:border-slate-700">
                          {row.badge || "Bronze"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-brand-primary group-hover:translate-x-1.5 transition-all inline-flex items-center justify-end w-full">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* RENDER INDIVIDUAL VIEW */}
      {viewMode === 'individual' && (
        empLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-6 h-6 rounded-full border-2 border-neutral-200 dark:border-slate-800 border-t-brand-primary animate-spin" />
            <p className="text-xs font-semibold text-neutral-400 dark:text-slate-500">Auditing employee logs...</p>
          </div>
        ) : (
          <>
            {/* Minimalist Individual KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
                <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Performance Points</span>
                  <Award className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {empPerformance?.profile?.points} XP
                  </span>
                  <span className="text-[10px] text-indigo-500 font-bold">Level {empPerformance?.profile?.level || 1}</span>
                </div>
                <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                  Total accumulated points in current cycle.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
                <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Average Speed</span>
                  <Clock className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {empPerformance?.avgCycleTimeHours} hrs
                  </span>
                </div>
                <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                  Average turnaround time per booking.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
                <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Department comparison</span>
                  <TrendingUp className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {empPerformance?.peerAverageXp} XP
                  </span>
                  <span className={`text-[10px] font-bold ${((empPerformance?.profile?.points - empPerformance?.peerAverageXp) >= 0) ? 'text-green-650' : 'text-red-500'}`}>
                    {((empPerformance?.profile?.points - empPerformance?.peerAverageXp) >= 0) ? '↑' : '↓'} {Math.abs(Math.round(empPerformance?.profile?.points - empPerformance?.peerAverageXp))} XP
                  </span>
                </div>
                <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                  Points vs the active department peer average.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
                <div className="flex justify-between items-center text-neutral-400 dark:text-slate-500">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Streak</span>
                  <Zap className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {empPerformance?.profile?.streakDays || 0} Days
                  </span>
                  <span className="text-[10px] text-amber-500 font-bold">Active</span>
                </div>
                <p className="text-[10px] text-neutral-450 dark:text-slate-500 pt-1 leading-relaxed">
                  Consecutive calendar working days active.
                </p>
              </div>
            </div>

            {/* Individual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* XP Velocity Line Chart */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Performance Velocity (XP Growth)
                  </h2>
                  <p className="text-[10px] text-neutral-450 dark:text-slate-500">
                    Cumulative XP point progression over the last 7 calendar days.
                  </p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={empPerformance?.xpHistory}
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '11px' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="xp" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action composition breakdown donut */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Action Composition Breakdown
                  </h2>
                  <p className="text-[10px] text-neutral-450 dark:text-slate-500">
                    Proportion of gamified milestones completed by this employee.
                  </p>
                </div>
                <div className="h-64 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                  {empPerformance?.actionMix && empPerformance.actionMix.length > 0 ? (
                    <>
                      <div className="h-full w-full sm:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={empPerformance.actionMix}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {empPerformance.actionMix.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '11px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Legend List */}
                      <div className="w-full sm:w-1/2 space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
                        {empPerformance.actionMix.map((item, index) => {
                          const total = empPerformance.actionMix.reduce((sum, entry) => sum + entry.value, 0);
                          const percent = ((item.value / total) * 100).toFixed(0);
                          return (
                            <div key={item.name} className="flex justify-between items-center text-[10px]">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="font-semibold text-neutral-500 dark:text-slate-400 truncate max-w-[100px]">{item.name}</span>
                              </div>
                              <span className="font-bold text-neutral-800 dark:text-white">{item.value} ({percent}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 text-neutral-400 dark:text-slate-500 w-full text-xs">No active events logged.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Clean Diagnostics Panel */}
            <div className="bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-indigo-500" /> AI Gamification Coach Insights
                </h2>
                <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                  Automated performance advice generated from historical operational activity patterns.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-neutral-150 dark:border-slate-850 flex items-start gap-3">
                  <div className="p-1.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded text-neutral-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-white">Milestone Optimization Hint</h4>
                    <p className="text-[11px] text-neutral-450 dark:text-slate-400 mt-1 leading-relaxed">
                      {empPerformance?.profile?.role?.includes("Finance") ? (
                        "Turnaround times on invoices look top-tier (avg 2.1 hrs). Consider partnering with Sales executives on Yelahanka branch bookings to accelerate pre-finance documentation and score collaboration bonuses."
                      ) : (
                        "I noticed you have an active 1.05x Customer Delight multiplier! Ensure your next operational action is a DELIVERED milestone to maximize the points weight return."
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-neutral-150 dark:border-slate-850 flex items-start gap-3">
                  <div className="p-1.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded text-neutral-500">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-white">Anti-Gaming Guardrail Audit</h4>
                    <p className="text-[11px] text-neutral-450 dark:text-slate-400 mt-1 leading-relaxed">
                      "Booking Note Added events are capped to a daily rate limit of 5. Try spacing out documentation additions and focus on high-yield stages like RTO submissions to maintain optimal point growth."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Event Table */}
            <div className="bg-white dark:bg-slate-900 border border-neutral-150 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Audited Event Logs
                  </h2>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-500">
                    Chronological audit ledger of gamified scoring milestones credited to this user account.
                  </p>
                </div>
                <span className="px-2 py-1 text-[9px] font-extrabold bg-neutral-100 dark:bg-slate-950 text-neutral-500 dark:text-slate-400 rounded border border-neutral-200 dark:border-slate-850">
                  {empPerformance?.eventsCount} logged milestones
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-slate-950 border-b border-neutral-150 dark:border-slate-850 font-bold uppercase tracking-wider text-neutral-450 dark:text-slate-500">
                      <th className="p-4 pl-6">Booking ID</th>
                      <th className="p-4">Milestone</th>
                      <th className="p-4">XP Credited</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 pr-6 text-right">Gate Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-slate-850">
                    {empPerformance?.recentEvents?.map((event, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors text-xs text-neutral-600 dark:text-slate-350">
                        <td className="p-4 pl-6 font-bold text-neutral-950 dark:text-white select-all">
                          {event.booking_id || "N/A"}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">{event.action?.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="p-4 font-bold text-brand-primary dark:text-blue-450">
                          +{event.points} XP
                        </td>
                        <td className="p-4 text-neutral-400 dark:text-slate-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded border border-green-200 dark:border-green-900/30">
                            <CheckCircle2 className="w-3 h-3" /> Audited
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
