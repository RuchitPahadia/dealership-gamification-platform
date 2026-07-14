import React, { useState, useEffect } from 'react';
import { useScore } from '../hooks/useScore';
import { LoginForm } from '../components/dashboard/LoginForm';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import FinanceDashboardPage from './FinanceDashboardPage';
import DseDashboardPage from './DseDashboardPage';
import { LogOut } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const [userId, setUserId] = useState(localStorage.getItem('dealerxp_user_id') || '');

  // Listen to local changes
  useEffect(() => {
    const handleStorage = () => {
      setUserId(localStorage.getItem('dealerxp_user_id') || '');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('dealerxp_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('dealerxp_update', handleStorage);
    };
  }, []);

  const handleLogin = (id) => {
    localStorage.setItem('dealerxp_user_id', id);
    setUserId(id);
    window.dispatchEvent(new CustomEvent('dealerxp_update'));
  };

  const handleLogout = () => {
    localStorage.removeItem('dealerxp_user_id');
    setUserId('');
    window.dispatchEvent(new CustomEvent('dealerxp_update'));
  };

  // 1. If not logged in, render LoginForm
  if (!userId) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 2. If logged in as Admin (u3 Vikram), redirect to Admin Console
  if (userId === 'u3') {
    return <Navigate to="/admin" replace />;
  }

  // 3. For employees, check their role dynamically from user score
  const scoreHook = useScore(userId);

  if (scoreHook.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        <p className="text-sm font-semibold text-neutral-500">Loading workspace...</p>
      </div>
    );
  }

  if (scoreHook.error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto my-12">
        <h3 className="text-red-800 font-bold text-lg">Error loading workspace</h3>
        <p className="text-red-600 text-sm mt-2">There was an error communicating with the API.</p>
      </div>
    );
  }

  const score = scoreHook.data;
  const isFinance = score.role && score.role.includes('Finance');

  if (isFinance) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
        <FinanceDashboardPage userId={userId} />
      </div>
    );
  }

  // Default: DSE workspace
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-xs font-bold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
      <DseDashboardPage userId={userId} />
    </div>
  );
}
