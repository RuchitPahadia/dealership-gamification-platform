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
import RewardsPage from './pages/RewardsPage';
import { 
  LayoutDashboard, 
  Gift, 
  Trophy, 
  User, 
  Award, 
  Target, 
  Milestone, 
  UserCheck, 
  Users2, 
  Command,
  Sun,
  Moon,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getPendingBookings, getUserScore } from './api/client';

import { LoginForm } from './components/dashboard/LoginForm';
import { AICoachPopup } from './components/dashboard/AICoachPopup';

function AppLayout({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('dealerxp_user_id') || '');
  const [theme, setTheme] = useState(localStorage.getItem('dealerxp_theme') || 'light');
  const [pendingCount, setPendingCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem('dealerxp_sidebar_collapsed') || 'false')
  );

  const toggleSidebar = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    localStorage.dispatchEvent(new CustomEvent('dealerxp_update')); // Sync state updates
    localStorage.setItem('dealerxp_sidebar_collapsed', JSON.stringify(nextCollapsed));
  };

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
    if (!userId) {
      setUserProfile(null);
      return;
    }
    const fetchProfile = () => {
      getUserScore(userId)
        .then(profile => {
          setUserProfile(profile);
        })
        .catch(e => console.error("Failed to load user profile", e));
    };

    fetchProfile();

    window.addEventListener('dealerxp_update', fetchProfile);
    return () => {
      window.removeEventListener('dealerxp_update', fetchProfile);
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



 const handleLogin = (userId) => {
    localStorage.setItem("dealerxp_user_id", userId);
    setUserId(userId);
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

  const name = userProfile ? userProfile.name : (userId === 'u1' ? 'Asha' : (userId === 'u2' ? 'Rahul' : (userId === 'u3' ? 'Vikram' : 'Employee')));
  const role = userProfile ? userProfile.role : (userId === 'u1' ? 'Sales DSE' : (userId === 'u2' ? 'Finance Specialist' : (userId === 'u3' ? 'Branch Manager' : 'DealerXP')));
  const initials = name.charAt(0).toUpperCase();
  const bg = role.includes("Finance") ? "bg-teal-500/20" : (role.includes("Manager") ? "bg-indigo-500/20" : "bg-brand-primary/20");
  const text = role.includes("Finance") ? "text-teal-600 dark:text-teal-400" : (role.includes("Manager") ? "text-indigo-600 dark:text-indigo-400" : "text-brand-primary");

  const currentUser = {
    name,
    role,
    initials,
    bg,
    text
  };




  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/booking-timeline', label: 'Race Track', icon: Milestone },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/dse-dashboard', label: 'DSE Workspace', icon: UserCheck },
    { to: '/finance-dashboard', label: 'Finance Workspace', icon: Users2 },
    { to: '/achievements', label: 'Achievements', icon: Award },
    { to: '/quests', label: 'Quests', icon: Target },
    { to: '/rewards', label: 'Rewards', icon: Gift },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/admin', label: 'Admin Console', icon: Command },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isManager = userId === 'u3' || (userProfile && userProfile.role && (userProfile.role.includes("Manager") || userProfile.role.includes("Admin")));
  const isFinanceRole = userId === 'u2' || (userProfile && userProfile.role && userProfile.role.includes("Finance"));

  const filteredNavItems = navItems.filter((item) => {
    if (item.to === '/analytics') {
      return true;
    }
    if (item.to === '/admin') {
      return isManager;
    }
    if (isFinanceRole && item.to === "/dse-dashboard") {
      return false;
    }
    if (!isFinanceRole && item.to === "/finance-dashboard") {
      return false;
    }
    return true;
  });
     
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-surface dark:bg-slate-950 font-body text-neutral-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* Navigation Sidebar */}
      <aside className={`w-full md:w-64 md:h-screen md:sticky md:top-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 transition-all duration-300 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        {/* Brand Header */}
        <div className={`border-b border-slate-800 flex transition-all duration-300 ${isCollapsed ? 'flex-col items-center gap-4 py-6 px-2' : 'flex-row items-center justify-between p-6'}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-3'}`}>
            <div className="bg-brand-primary p-2 rounded-lg text-white">
              <Command className="w-5 h-5 animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="transition-all duration-300">
                <h2 className="font-heading text-lg font-bold tracking-tight text-white leading-none">DealerXP</h2>
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mt-1">
                  Compete. Collaborate. Deliver.
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition hidden md:block cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 relative ${
                    isActive 
                      ? 'bg-slate-850 text-white border-l-2 border-brand-primary' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
                  }`
                }
                title={isCollapsed ? item.label : ""}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.to === '/admin' && pendingCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white animate-pulse">
                    {pendingCount}
                  </span>
                )}
                {isCollapsed && item.to === '/admin' && pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick User Banner */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer min-w-0">
            <div className={`w-9 h-9 rounded-full ${currentUser.bg} flex items-center justify-center ${currentUser.text} text-xs font-bold shrink-0`}>
              {currentUser.initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-all duration-300">
                <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
                <span className="text-[10px] text-slate-500 font-semibold block">{currentUser.role}</span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-[10px] text-slate-400 hover:text-red-400 font-bold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Log Out
            </button>
          )}
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

      {/* Floating AI Coach Assistant Popup */}
      <AICoachPopup />

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
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
