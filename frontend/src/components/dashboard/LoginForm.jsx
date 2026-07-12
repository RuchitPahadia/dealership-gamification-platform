import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, ShieldAlert, KeyRound, LogIn, UserPlus } from 'lucide-react';

export function LoginForm({ onLogin }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [selectedUser, setSelectedUser] = useState('u1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('dse'); // 'dse' or 'finance'

  const users = [
    { 
      id: 'u1', 
      name: 'Asha', 
      role: 'Employee (Sales DSE)', 
      icon: <User className="w-5 h-5 text-brand-primary" />,
      bg: 'bg-brand-primary/10'
    },
    { 
      id: 'u2', 
      name: 'Rahul', 
      role: 'Employee (Finance Specialist)', 
      icon: <Users className="w-5 h-5 text-orange-500" />,
      bg: 'bg-orange-500/10'
    },
    { 
      id: 'u3', 
      name: 'Vikram', 
      role: 'Branch Manager (Admin)', 
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-500/10'
    }
  ];

  const handleProfileClick = (userId) => {
    // Instantly log in on profile selection to bypass typing password
    onLogin(userId);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (selectedUser === 'u3' && password !== 'admin123') {
      setError('Invalid credentials. Use password: admin123 (or click on profile card to login instantly)');
      return;
    }
    if ((selectedUser === 'u1' || selectedUser === 'u2') && password !== 'employee123') {
      setError('Invalid credentials. Use password: employee123 (or click on profile card to login instantly)');
      return;
    }
    setError('');
    onLogin(selectedUser);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail) {
      setError('Please fill in all fields.');
      return;
    }

    const newUserId = 'u_' + Date.now();
    const stateStr = localStorage.getItem('dealerxp_state');
    
    let state = {};
    if (stateStr) {
      try {
        state = JSON.parse(stateStr);
      } catch (err) {
        console.error(err);
      }
    }

    // Initialize mock structure if empty
    if (!state.score) state.score = {};
    if (!state.badges) state.badges = {};
    if (!state.leaderboard) state.leaderboard = {};
    if (!state.leaderboard.individual) state.leaderboard.individual = [];

    // Add new user stats
    state.score[newUserId] = {
      userId: newUserId,
      name: signupName,
      role: signupRole === 'dse' ? 'Sales DSE' : 'Finance Specialist',
      points: 0,
      streakDays: 1,
      capsActive: []
    };

    // Add starter badges
    state.badges[newUserId] = {
      earned: [],
      inProgress: [
        { id: "b2", name: "Team Player", progress: 0.1 }
      ]
    };

    // Add to region roster
    state.leaderboard.individual.push({
      rank: state.leaderboard.individual.length + 1,
      name: signupName,
      points: 0,
      branch: 'Mumbai Central'
    });

    localStorage.setItem('dealerxp_state', JSON.stringify(state));
    setError('');
    onLogin(newUserId);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-neutral-100 shadow-xl p-8 relative overflow-hidden mt-12">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-primary to-xp-gold" />
      
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-neutral-900">DealerXP Portal</h2>
        <p className="text-neutral-500 text-sm mt-1">Gamified Dealership Performance</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('signin'); setError(''); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
            activeTab === 'signin'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('signup'); setError(''); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
            activeTab === 'signup'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Sign Up (Register)
        </button>
      </div>

      {activeTab === 'signin' ? (
        <form onSubmit={handleSignInSubmit} className="space-y-6">
          {/* Profile Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Click Profile to Sign In Instantly
            </label>
            <div className="grid grid-cols-1 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleProfileClick(u.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                    selectedUser === u.id
                      ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20 font-semibold'
                      : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${u.bg}`}>
                    {u.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-neutral-900">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{u.role}</p>
                  </div>
                  <span className="text-[10px] bg-neutral-100 text-neutral-500 font-bold px-2 py-1 rounded-md shrink-0">
                    Quick Log In
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Password option */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <span>Or sign in with credentials</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={selectedUser === 'u3' ? 'admin123' : 'employee123'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-brand-primary text-sm bg-neutral-50/30"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Password</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Full Name
            </label>
            <input
              type="text"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-brand-primary text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="john@carverse.com"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-brand-primary text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Workspace Role
            </label>
            <select
              value={signupRole}
              onChange={(e) => setSignupRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-brand-primary text-sm bg-white"
            >
              <option value="dse">Sales DSE (Dealer Sales Executive)</option>
              <option value="finance">Finance Specialist</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-brand-primary to-blue-500 hover:from-brand-primary-dark hover:to-blue-600 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Profile & Sign In</span>
          </button>
        </form>
      )}
    </div>
  );
}
