import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { 
  LogOut, 
  Sparkles, 
  Trophy, 
  Flame, 
  Target, 
  ArrowRight, 
  Newspaper, 
  BookmarkCheck, 
  TrendingUp, 
  Info, 
  Award,
  Zap,
  MessageSquare,
  Gift,
  Share2,
  Check,
  Plus
} from "lucide-react";

import { useScore } from "../hooks/useScore";
import { useQuests } from "../hooks/useQuests";
import { useBadges } from "../hooks/useBadges";

// Helper to determine rank tier based on points
function getRankTier(points) {
  if (points < 100) {
    return { tier: 'Iron', division: 'IV', emblem: '🪨', color: 'text-neutral-550 dark:text-neutral-400' };
  } else if (points < 200) {
    return { tier: 'Bronze', division: 'III', emblem: '🥉', color: 'text-amber-600 dark:text-amber-500' };
  } else if (points < 300) {
    return { tier: 'Silver', division: 'III', emblem: '🥈', color: 'text-slate-500 dark:text-slate-350' };
  } else if (points < 400) {
    return { tier: 'Gold', division: 'II', emblem: '🟡', color: 'text-yellow-600 dark:text-yellow-500' };
  } else if (points < 500) {
    return { tier: 'Platinum', division: 'II', emblem: '💎', color: 'text-emerald-500 dark:text-emerald-400' };
  } else {
    return { tier: 'Diamond', division: 'I', emblem: '💠', color: 'text-blue-600 dark:text-blue-300' };
  }
}

const defaultFeed = [
  {
    id: 1,
    name: "Asha",
    role: "Sales DSE",
    branch: "Banashankari",
    text: "Just delivered a brand new Creta! Customer left a 5-star review, meaning our delight multiplier is active! 🚀",
    action: "DELIVERED",
    points: 300,
    timestamp: "10m ago",
    claps: 6,
    comments: [
      { id: 101, name: "Rahul", text: "Incredible work Asha! Relay bonus incoming." }
    ]
  },
  {
    id: 2,
    name: "Rahul",
    role: "Finance Specialist",
    branch: "Banashankari",
    text: "Approved finance on booking BLR-381 in record time (1.2 hours). Handoff complete!",
    action: "FINANCE_APPROVED",
    points: 100,
    timestamp: "1h ago",
    claps: 3,
    comments: []
  },
  {
    id: 3,
    name: "Priya",
    role: "Sales DSE",
    branch: "Yelahanka",
    text: "Completed pre-finance documentation upload for Mr. Sharma's booking. Over to finance!",
    action: "DOCUMENT_UPLOADED",
    points: 50,
    timestamp: "3h ago",
    claps: 4,
    comments: [
      { id: 102, name: "Vikram", text: "Nice speed Priya, let's keep it up!" }
    ]
  }
];

export default function DashboardPage() {
    const userId = localStorage.getItem("dealerxp_user_id");

    if (!userId) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem("dealerxp_user_id");
        window.location.href = "/";
    };

    const { data: score, loading: scoreLoading, error: scoreError } = useScore(userId);
    const { data: questsData, loading: questsLoading } = useQuests();
    const { data: badgesData, loading: badgesLoading } = useBadges(userId);

    const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'announcements'
    const [feedItems, setFeedItems] = useState(() => {
      const local = localStorage.getItem('dealerxp_social_feed');
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {
          console.error(e);
        }
      }
      return defaultFeed;
    });

    const [postText, setPostText] = useState('');
    const [postAction, setPostAction] = useState('DELIVERED');
    const [commentText, setCommentText] = useState({});

    const loading = scoreLoading || questsLoading || badgesLoading;
    const error = scoreError;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                <p className="text-sm font-semibold text-neutral-500">Loading lobby dashboard...</p>
            </div>
        );
    }

    if (error || !score) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Failed to load user.
            </div>
        );
    }

    const role = (score.role || "").toLowerCase();
    const isFinance = role.includes("finance");
    const rank = getRankTier(score.points);
    const completedQuests = questsData?.quests?.filter(q => q.progress >= q.target).length || 0;
    const totalQuests = questsData?.quests?.length || 0;

    // Game News Feed (Patch Notes & Announcements)
    const newsFeed = [
      { id: 1, tag: 'Event', title: 'Relay Collaboration Bonus Active!', desc: 'Team up with your department counterpart on active bookings to claim +50 XP relay bonuses.', time: 'Active Now' },
      { id: 2, tag: 'Patch Notes', title: 'Season 1 Ranked Patch v1.0.4', desc: 'Upgraded division rivals ladders, improved dark mode consistency, and aligned backend CSV engine imports.', time: '2h ago' },
      { id: 3, tag: 'Tip', title: 'Avoid Note spam caps', desc: 'Repeatable actions like booking notes are capped at 5 additions daily to focus points on major approvals.', time: '1d ago' }
    ];

    const handlePostWin = (e) => {
      e.preventDefault();
      if (!postText.trim()) return;

      const actionPoints = {
        'DELIVERED': 300,
        'PDI_COMPLETED': 100,
        'FINANCE_APPROVED': 100,
        'DOCUMENT_UPLOADED': 50,
        'RELAY_BONUS': 50,
        'CUSTOM_WIN': 20
      };

      const newPost = {
        id: Date.now(),
        name: score.name || 'Team Member',
        role: score.role || 'Executive',
        branch: score.branch || 'Yelahanka',
        text: postText,
        action: postAction,
        points: actionPoints[postAction] || 0,
        timestamp: "Just now",
        claps: 0,
        comments: []
      };

      const updated = [newPost, ...feedItems];
      setFeedItems(updated);
      localStorage.setItem('dealerxp_social_feed', JSON.stringify(updated));
      setPostText('');

      // Update state points locally to mock immediate feedback!
      try {
        const state = JSON.parse(localStorage.getItem('dealerxp_state') || '{}');
        const activeUserId = localStorage.getItem('dealerxp_user_id') || 'u1';
        if (state.score && state.score[activeUserId]) {
          state.score[activeUserId].points += newPost.points;
          localStorage.setItem('dealerxp_state', JSON.stringify(state));
        }
      } catch (e) {
        console.error("Failed to mock-credit score locally", e);
      }

      window.dispatchEvent(new CustomEvent('dealerxp_update'));
    };

    const handleClap = (postId) => {
      const updated = feedItems.map(item => {
        if (item.id === postId) {
          return { ...item, claps: item.claps + 1 };
        }
        return item;
      });
      setFeedItems(updated);
      localStorage.setItem('dealerxp_social_feed', JSON.stringify(updated));
    };

    const handleAddComment = (postId, e) => {
      e.preventDefault();
      const txt = commentText[postId];
      if (!txt || !txt.trim()) return;

      const updated = feedItems.map(item => {
        if (item.id === postId) {
          return {
            ...item,
            comments: [
              ...item.comments,
              {
                id: Date.now(),
                name: score.name || 'Me',
                text: txt
              }
            ]
          };
        }
        return item;
      });

      setFeedItems(updated);
      localStorage.setItem('dealerxp_social_feed', JSON.stringify(updated));
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    };

    return (
        <div className="space-y-8 animate-fade-in text-neutral-800 dark:text-slate-100 font-body">
            {/* Top Sign Out and Welcome Profile Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-lg">
                  {score.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>Lobby Hub — {score.name}</span>
                    <Sparkles className="w-5 h-5 text-xp-gold fill-xp-gold/20 animate-pulse" />
                  </h1>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {score.department} • Branch: {score.branch}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-650 text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-rose-500/10 cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>

            {/* Profile Overview and Quick Access Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                    Competitive Profile
                  </span>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-4xl">{rank.emblem}</span>
                    <div>
                      <span className={`text-sm font-black uppercase tracking-wider ${rank.color}`}>
                        {rank.tier}
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-none mt-1">
                        {score.points.toLocaleString()} <span className="text-xs text-teal-600 dark:text-teal-400 font-extrabold">XP</span>
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10" />
                    <span className="text-neutral-500 dark:text-slate-400">Combo Streak: <strong className="text-neutral-900 dark:text-white font-numeric">{score.streakDays}d</strong></span>
                  </div>
                  <Link to="/profile" className="text-brand-primary dark:text-teal-400 font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-1">
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quest Checklist widget */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                      Daily Bounties
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded font-bold">
                      {completedQuests}/{totalQuests} Done
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-3 flex items-center gap-2 font-heading">
                    <Target className="w-5 h-5 text-brand-primary" />
                    <span>Active Quests Tracker</span>
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Complete your daily bounties to gain extra Ranked Points and promote your rank tier.
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-450">XP Potential: {questsData?.quests?.reduce((acc, q) => acc + q.points, 0) || 0} XP</span>
                  <Link to="/quests" className="text-brand-primary dark:text-teal-400 font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-1">
                    <span>Open Quests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Workspace Redirect Card */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-slate-500 block">
                    Action Zone
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-3 flex items-center gap-2 font-heading">
                    <Zap className="w-5 h-5 text-teal-500 fill-teal-500/10" />
                    <span>Department Workspace</span>
                  </h3>
                  <p className="text-neutral-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Head to your active workspace to review your clashing duels, completed tickets, and active approvals.
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4 relative z-10">
                  <Link 
                    to={isFinance ? "/finance-dashboard" : "/dse-dashboard"} 
                    className="w-full py-2.5 bg-brand-primary hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition-all duration-150"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Social Wins Feed & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Central Tabs: Social Feed vs Announcements */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-neutral-100 dark:border-slate-850 px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('feed')}
                      className={`text-sm font-extrabold uppercase tracking-wider pb-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'feed'
                          ? 'border-brand-primary text-brand-primary dark:text-white'
                          : 'border-transparent text-neutral-450 hover:text-neutral-600'
                      }`}
                    >
                      Team Wins (Feed)
                    </button>
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className={`text-sm font-extrabold uppercase tracking-wider pb-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'announcements'
                          ? 'border-brand-primary text-brand-primary dark:text-white'
                          : 'border-transparent text-neutral-450 hover:text-neutral-600'
                      }`}
                    >
                      Announcements
                    </button>
                  </div>
                  {activeTab === 'feed' && (
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-neutral-200 dark:border-slate-850">
                      {feedItems.length} achievements shared
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 space-y-6">
                  
                  {activeTab === 'feed' && (
                    <>
                      {/* Post Wins Form */}
                      <form onSubmit={handlePostWin} className="bg-neutral-50 dark:bg-slate-950/40 p-4 border border-neutral-150 dark:border-slate-850 rounded-xl space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            {score.name.charAt(0)}
                          </div>
                          <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="Share an achievement win with the branch..."
                            rows={2}
                            className="flex-1 bg-transparent border-none outline-none resize-none text-xs text-neutral-800 dark:text-slate-100 placeholder-neutral-400 focus:ring-0 leading-relaxed"
                          />
                        </div>

                        <div className="border-t border-neutral-200/50 dark:border-slate-850/80 pt-3 flex flex-wrap justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide">Win Milestone:</span>
                            <select
                              value={postAction}
                              onChange={(e) => setPostAction(e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-[10px] font-bold rounded-lg px-2 py-1 outline-none text-neutral-700 dark:text-slate-350"
                            >
                              <option value="DELIVERED">Vehicle Delivered (+300 XP)</option>
                              <option value="PDI_COMPLETED">PDI Completed (+100 XP)</option>
                              <option value="FINANCE_APPROVED">Finance Approved (+100 XP)</option>
                              <option value="DOCUMENT_UPLOADED">Document Uploaded (+50 XP)</option>
                              <option value="RELAY_BONUS">Relay Bonus (+50 XP)</option>
                              <option value="CUSTOM_WIN">Custom Win (+20 XP)</option>
                            </select>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={!postText.trim()}
                            className="px-4 py-1.5 bg-brand-primary hover:bg-indigo-650 disabled:opacity-40 disabled:hover:bg-brand-primary text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Share2 className="w-3 h-3" /> Share Win
                          </button>
                        </div>
                      </form>

                      {/* Feed items list */}
                      <div className="space-y-4">
                        {feedItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white dark:bg-slate-900/40 p-4 border border-neutral-150 dark:border-slate-850 rounded-xl space-y-3 shadow-sm"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-neutral-200/50 dark:border-slate-700">
                                  {item.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{item.name}</span>
                                    <span className="text-[9px] text-neutral-400 dark:text-slate-500">• {item.role}</span>
                                  </div>
                                  <span className="text-[9px] text-neutral-450 dark:text-slate-500 font-semibold block">{item.branch} Branch • {item.timestamp}</span>
                                </div>
                              </div>

                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-50 dark:bg-green-950/20 text-green-650 dark:text-green-450 border border-green-200 dark:border-green-900/30">
                                +{item.points} XP
                              </span>
                            </div>

                            <p className="text-xs text-neutral-700 dark:text-slate-300 leading-relaxed font-medium pl-1">
                              {item.text}
                            </p>

                            <div className="pt-2 border-t border-neutral-100 dark:border-slate-850/60 flex items-center gap-6">
                              <button
                                onClick={() => handleClap(item.id)}
                                className="flex items-center gap-1 text-[10px] font-bold text-neutral-450 dark:text-slate-550 hover:text-brand-primary dark:hover:text-white transition cursor-pointer"
                              >
                                👏 <span className="font-bold">{item.claps} claps</span>
                              </button>
                              
                              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-450 dark:text-slate-550">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{item.comments.length} comments</span>
                              </div>
                            </div>

                            {/* Comment display & addition */}
                            {item.comments.length > 0 && (
                              <div className="bg-neutral-50 dark:bg-slate-950/30 p-3 rounded-lg space-y-2 mt-2">
                                {item.comments.map(c => (
                                  <div key={c.id} className="text-[10px] leading-relaxed">
                                    <strong className="text-neutral-800 dark:text-slate-300 font-bold">{c.name}:</strong> <span className="text-neutral-600 dark:text-slate-400">{c.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                placeholder="Write a supportive cheer..."
                                value={commentText[item.id] || ''}
                                onChange={(e) => setCommentText({ ...commentText, [item.id]: e.target.value })}
                                className="flex-1 bg-neutral-50 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 text-[10px] rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                              />
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-neutral-700 dark:text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                              >
                                Send
                              </button>
                            </form>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === 'announcements' && (
                    <div className="space-y-4">
                      {newsFeed.map((news) => (
                        <div 
                          key={news.id} 
                          className="p-4 bg-neutral-50 dark:bg-slate-950/40 border border-neutral-100 dark:border-slate-850 rounded-xl space-y-1.5"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded font-bold uppercase tracking-wider">
                              {news.tag}
                            </span>
                            <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                              {news.time}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{news.title}</h4>
                          <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">{news.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Achievements summary list sidebar */}
              <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-xp-gold" />
                    <span>Unlocked Achievements</span>
                  </h3>
                  
                  <div className="space-y-2.5">
                    {badgesData?.earned?.length > 0 ? (
                      badgesData.earned.slice(0, 3).map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-slate-950/20 border border-neutral-100 dark:border-slate-850 rounded-xl">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white block">{badge.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Earned</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-450 dark:text-slate-500 text-center py-6">No achievements unlocked yet. Get to work inside the Timeline!</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-slate-850/80 pt-4">
                  <Link to="/achievements" className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150">
                    <span>Open Achievements Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Quick Demo Help Banner */}
            <div className="bg-teal-500/10 border border-teal-500/25 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                  Did you know?
                </h4>
                <p className="text-[11px] text-teal-650 dark:text-teal-350 leading-relaxed mt-1">
                  You can use the floating **Demo Controller** panel at the bottom of the screen from any page to trigger simulated API actions and see your points, streak multiplier, and duels update instantly!
                </p>
              </div>
            </div>
        </div>
    );
}