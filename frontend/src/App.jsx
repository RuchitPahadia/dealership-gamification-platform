import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AchievementsPage from './pages/AchievementsPage';
import QuestPage from './pages/QuestPage';
import BookingTimelinePage from './pages/BookingTimelinePage';
import DseDashboardPage from './pages/DseDashboardPage';
import FinanceDashboardPage from './pages/FinanceDashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { 
  LayoutDashboard, 
  Trophy, 
  User, 
  Award, 
  Target, 
  Milestone, 
  UserCheck, 
  Users2, 
  Command,
  Zap,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  BarChart3
} from 'lucide-react';
import { triggerRelayBonus, triggerNoteSpam, resetMockState, getPendingBookings } from './api/client';

import { LoginForm } from './components/dashboard/LoginForm';

function AppLayout({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('dealerxp_user_id') || '');
  const [theme, setTheme] = useState(localStorage.getItem('dealerxp_theme') || 'light');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setUserId(localStorage.getItem('dealerxp_user_id') || '');
    };
    window.addEventListener('dealerxp_update', handleUpdate);
    return () => window.removeEventListener('dealerxp_update', handleUpdate);
  }, []);

  useEffect(() => {
    const fetchPendingCount = () => {
      if (userId === 'u3') {
        getPendingBookings()
          .then(res => {
            if (res && res.bookings) {
              setPendingCount(res.bookings.filter(b => b.status === 'PENDING').length);
            }
          })
          .catch(e => console.error("Failed to fetch pending count", e));
      } else {
        setPendingCount(0);
      }
    };

    fetchPendingCount();

    const handleUpdate = () => {
      fetchPendingCount();
    };

    window.addEventListener('dealerxp_update', handleUpdate);
    return () => {
      window.removeEventListener('dealerxp_update', handleUpdate);
    };
  }, [userId]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dealerxp_theme', nextTheme);
  };

  const handleReset = () => {
    resetMockState();
    window.dispatchEvent(new CustomEvent('dealerxp_update'));
  };

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

  if (!userId) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  const stateStr = localStorage.getItem('dealerxp_state');
  let name = 'Asha';
  let role = 'Sales DSE';
  let initials = 'A';
  let bg = 'bg-brand-primary/20';
  let text = 'text-brand-primary';

  if (userId === 'u3') {
    name = 'Vikram';
    role = 'Branch Manager (Admin)';
    initials = 'V';
    bg = 'bg-red-500/20';
    text = 'text-red-500';
  } else if (userId === 'u2') {
    name = 'Rahul';
    role = 'Finance Specialist';
    initials = 'R';
    bg = 'bg-orange-500/20';
    text = 'text-orange-500';
  } else if (userId === 'u1') {
    name = 'Asha';
    role = 'Sales DSE';
    initials = 'A';
    bg = 'bg-brand-primary/20';
    text = 'text-brand-primary';
  } else if (stateStr) {
    try {
      const state = JSON.parse(stateStr);
      const userScoreObj = state.score[userId];
      if (userScoreObj) {
        name = userScoreObj.name;
        role = userScoreObj.role || 'Sales DSE';
        initials = name.charAt(0).toUpperCase();
        const isFinance = role.toLowerCase().includes('finance');
        bg = isFinance ? 'bg-orange-500/20' : 'bg-brand-primary/20';
        text = isFinance ? 'text-orange-500' : 'text-brand-primary';
      }
    } catch (e) {
      console.error(e);
    }
  }

  const currentUser = { name, role, initials, bg, text };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/booking-timeline', label: 'Race Track (Timeline)', icon: <Milestone className="w-5 h-5 text-teal-400" /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5 text-xp-gold" /> },
    { to: '/dse-dashboard', label: 'DSE Workspace', icon: <UserCheck className="w-5 h-5" /> },
    { to: '/finance-dashboard', label: 'Finance Workspace', icon: <Users2 className="w-5 h-5" /> },
    { to: '/achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { to: '/quests', label: 'Quests', icon: <Target className="w-5 h-5" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { to: '/admin', label: 'Admin Console', icon: <Command className="w-5 h-5 text-indigo-400" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5 text-amber-400" /> },
  ];

  const filteredNavItems = navItems.filter(item => {
    const isAdmin = userId === 'u3' || role.toLowerCase().includes('admin');
    
    if (isAdmin) {
      // Admin should ONLY see Admin Console and Analytics
      return ['/admin', '/analytics'].includes(item.to);
    } else {
      // Employees should NEVER see Admin Console or Analytics
      if (['/admin', '/analytics'].includes(item.to)) {
        return false;
      }
      
      // Filter out workspaces that don't match the employee's role
      const isFinance = role.toLowerCase().includes('finance');
      if (isFinance && item.to === '/dse-dashboard') {
        return false;
      }
      if (!isFinance && item.to === '/finance-dashboard') {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-surface dark:bg-slate-950 font-body text-neutral-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* Navigation Sidebar */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-brand-primary p-2 rounded-lg text-white">
            <Command className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight text-white">DealerXP</h2>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">
              Compete. Collaborate. Deliver.
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {filteredNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.to === '/admin' && pendingCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick User Banner */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer min-w-0">
            <div className={`w-9 h-9 rounded-full ${currentUser.bg} flex items-center justify-center ${currentUser.text} text-xs font-bold shrink-0`}>
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
              <span className="text-[10px] text-slate-500 font-semibold block">{currentUser.role}</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[10px] text-slate-400 hover:text-red-400 font-bold uppercase tracking-wider shrink-0"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-32">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-neutral-100 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 shrink-0 relative z-20 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full font-bold uppercase tracking-wider animate-pulse">
              Demo Active
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-400 transition"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-bold uppercase tracking-widest block">Active User Role</span>
                <span className="text-xs font-bold text-neutral-700 dark:text-slate-300">{currentUser.role}</span>
              </div>
              <div className={`w-8 h-8 rounded-full ${currentUser.bg} flex items-center justify-center ${currentUser.text} text-xs font-bold shrink-0`}>
                {currentUser.initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Page Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Persistent Floating Demo Control Center */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-slate-950/90 border-t border-slate-800 p-4 backdrop-blur shadow-2xl z-40 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-400" />
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              DealerXP Demo Controller
            </h4>
            <p className="text-[10px] text-slate-500">
              Triggers simulated API updates to demonstrate key moments from any page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={triggerRelayBonus}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-teal-500/20 transition-all duration-150 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Finance Approval (Relay Bonus)
          </button>
          
          <button
            type="button"
            onClick={triggerNoteSpam}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition-all duration-150"
          >
            ✍️ Add Note (Cap Firing)
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-all duration-150"
            title="Reset Demo State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/booking-timeline" element={<BookingTimelinePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dse-dashboard" element={<DseDashboardPage />} />
          <Route path="/finance-dashboard" element={<FinanceDashboardPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/quests" element={<QuestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
