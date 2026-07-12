import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../api/client';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load analytics data");
        setLoading(false);
      });
  }, []);

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-neutral-500 dark:text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-200 border-t-brand-primary" />
        <p className="text-sm font-semibold">Loading branch analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm max-w-lg mx-auto mt-12">
        <h3 className="font-bold font-heading">Analytics Error</h3>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-primary" />
          Branch Analytics
        </h1>
        <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">
          Branch cycle times, action compositions, and anti-gaming anomalies summaries.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-neutral-400 dark:text-slate-500 uppercase tracking-wider">Avg Cycle Time</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">67.6 hrs</h3>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-brand-primary rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-green-600 dark:text-green-400 mt-2 font-medium">
            ↓ 4.8 hrs compared to last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-neutral-400 dark:text-slate-500 uppercase tracking-wider">Active Bookings</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">18</h3>
            </div>
            <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-success-green rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-2">
            9 in Finance, 4 in Delivery, 5 pre-finance
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-neutral-400 dark:text-slate-500 uppercase tracking-wider">Scoring Employees</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">14</h3>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-2 font-medium">
            Active rate: 93% this week
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-neutral-400 dark:text-slate-500 uppercase tracking-wider">Unresolved Anomalies</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">2</h3>
            </div>
            <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-red-600 mt-2 font-medium">
            High Severity: 1 | Medium Risk: 1
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cycle Time Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
              Workflow Stage Cycle-Time Analysis
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Average duration (in hours) required to move a booking between milestones.
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.cycleTime}
                margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748B', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F8FAFC' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="hours" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {data?.cycleTime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action-Mix Pie/Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
              Scoring Action Distribution (Action-Mix)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Distribution of scoring events completed across the branch (Volume).
            </p>
          </div>
          <div className="h-80 w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="h-full w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.actionMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data?.actionMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F8FAFC' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend List */}
            <div className="w-full md:w-1/2 space-y-2">
              {data?.actionMix.map((item, index) => {
                const total = data.actionMix.reduce((sum, entry) => sum + entry.value, 0);
                const percent = ((item.value / total) * 100).toFixed(0);
                return (
                  <div key={item.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="font-medium text-neutral-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">{item.value} ({percent}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
