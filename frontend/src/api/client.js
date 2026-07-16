// API Client for DealerXP - Developer 3
// Stubbed for mock-first development (Hour 0-10) and ready for live swap (Hour 10+)
// Stores local state in memory/localStorage to allow interactive demo triggers.

const STORAGE_KEY_PREFIX = 'dealerxp_';
const API_BASE = '/api/v1'; // Routed via Vite proxy to backend
function updateQuestProgress(action, count, targetUserId, state) {
  state.quests = state.quests.map(q => {
    let matches = false;
    if (action === "RELAY_BONUS" && q.title.toLowerCase().includes("relay")) {
      matches = true;
    } else if (action === "BOOKING_NOTE_ADDED" && q.title.toLowerCase().includes("comment")) {
      matches = true;
    } else if (action === "FINANCE_APPROVED" && q.title.toLowerCase().includes("finance")) {
      matches = true;
    } else if (action === "RTO_REQUEST" && q.title.toLowerCase().includes("rto")) {
      matches = true;
    } else if (action === "DELIVERED" && q.title.toLowerCase().includes("deliver")) {
      matches = true;
    }

    if (matches && q.progress < q.target) {
      const oldProgress = q.progress;
      const newProgress = Math.min(q.target, q.progress + count);
      const completed = newProgress === q.target && oldProgress < q.target;
      if (completed) {
        if (state.score[targetUserId]) {
          state.score[targetUserId].points += q.points;
          state.leaderboard.individual = state.leaderboard.individual.map(row => {
            if (row.name === state.score[targetUserId].name) {
              return { ...row, points: state.score[targetUserId].points };
            }
            return row;
          });
        }
      }
      return { ...q, progress: newProgress };
    }
    return q;
  });
}

const defaultState = {
  score: {
    u1: { userId: "u1", name: "Asha", points: 520, streakDays: 5, capsActive: [], role: "Sales DSE", branch: "YELAHANKA" },
    u2: { userId: "u2", name: "Rahul (Finance)", points: 340, streakDays: 4, capsActive: [], role: "Finance Specialist", branch: "BANASHANKARI" }
  },
  badges: {
    u1: {
      earned: [
        { id: "first-sale", name: "First Sale", icon: "Award" },
        { id: "speed-demon", name: "Speed Demon", icon: "Flame" }
      ],
      inProgress: [
        { id: "team-player", name: "Team Player", progress: 0.6 },
        { id: "finance-closer", name: "Finance Closer", progress: 0.2 },
        { id: "dealership-hero", name: "Dealership Hero", progress: 0.8 },
        { id: "flawless-execution", name: "Flawless Execution", progress: 0.4 },
        { id: "anti-gaming-guardian", name: "Anti-Gaming Guardian", progress: 0.1 },
        { id: "master-collaborator", name: "Master Collaborator", progress: 0.5 }
      ]
    },
    u2: {
      earned: [
        { id: "finance-closer", name: "First Approval", icon: "CheckCircle2" }
      ],
      inProgress: [
        { id: "team-player", name: "Team Player", progress: 0.8 },
        { id: "speed-demon", name: "Speed Demon", progress: 0.4 }
      ]
    }
  },
  quests: [
    { id: "q1", title: "Clear 3 finance approvals", progress: 1, target: 3, points: 100, department: "Finance" },
    { id: "q2", title: "Upload 2 RTO requests", progress: 0, target: 2, points: 50, department: "DSE" },
    { id: "q3", title: "Add 5 booking comments", progress: 2, target: 5, points: 20, department: "Any" },
    { id: "q4", title: "Deliver a booking today", progress: 0, target: 1, points: 200, department: "DSE" },
    { id: "q5", title: "Achieve 1 Clean Relay Bonus", progress: 0, target: 1, points: 160, department: "Any" }
  ],
  duest: {
    id: "d1",
    title: "DSE vs Finance Sprint",
    dseId: "u1",
    dseName: "Asha (DSE)",
    financeId: "u2",
    financeName: "Rahul (Finance)",
    dsePoints: 150,
    financePoints: 180,
    targetPoints: 300,
    bookingId: "b100"
  },
  timeline: {
    b100: {
      bookingId: "b100",
      customerName: "Sanjay Mehta (Hyundai Creta)",
      stages: [
        { key: "BOOKING_CREATED", done: true, at: "2026-07-13T09:00:00Z" },
        { key: "DISCOUNT_APPROVED", done: true, at: "2026-07-13T09:20:00Z" },
        { key: "FINANCE_APPROVED", done: false },
        { key: "INVOICE_APPROVED", done: false },
        { key: "RTO_REQUEST", done: false },
        { key: "PDI_COMPLETED", done: false },
        { key: "DELIVERED", done: false }
      ],
      events: []
    }
  },
  leaderboard: {
    individual: [
      { rank: 1, name: "Asha", points: 1240, branch: "Mumbai Central", isMe: true },
      { rank: 2, name: "Vikram", points: 1100, branch: "Mumbai Central" },
      { rank: 3, name: "Rahul (Finance)", points: 980, branch: "Mumbai Central" },
      { rank: 4, name: "Priya", points: 850, branch: "Pune West" },
      { rank: 5, name: "Amit", points: 720, branch: "Mumbai Central" }
    ],
    branch: [
      { rank: 1, name: "Mumbai Central Branch", points: 4040, isMe: true },
      { rank: 2, name: "Pune West Branch", points: 2850 },
      { rank: 3, name: "Delhi South Branch", points: 1900 }
    ]
  },
  rouletteQueue: [
    { id: "r1", employeeName: "Asha", action: "ZERO_REWORK_BOOKING_BONUS", points: 140, timestamp: "2026-07-15T09:12:00Z", approved: false },
    { id: "r2", employeeName: "Rahul (Finance)", action: "DELIVERED", points: 220, timestamp: "2026-07-15T11:45:00Z", approved: false }
  ],
  weights: [
    { action: "BOOKING_CREATED", label: "Booking Created", points: 100 },
    { action: "DISCOUNT_APPROVED", label: "Discount Approved", points: 50 },
    { action: "FINANCE_APPROVED", label: "Finance Approved", points: 100 },
    { action: "INVOICE_APPROVED", label: "Invoice Approved", points: 100 },
    { action: "RTO_REQUEST", label: "RTO Request Uploaded", points: 50 },
    { action: "PDI_COMPLETED", label: "PDI Completed", points: 100 },
    { action: "DELIVERED", label: "Booking Delivered", points: 300 },
    { action: "BOOKING_NOTE_ADDED", label: "Booking Note Added (Capped)", points: 20 },
    { action: "RELAY_BONUS", label: "Relay Bonus Points", points: 50 }
  ],
  anomalies: [
    { id: "a1", employeeName: "Amit Kumar", role: "Sales DSE", location: "Mumbai Central", bookingId: "b101", action: "BOOKING_NOTE_ADDED", reason: "Action cap reached 5+ times in 10 mins (Note Spamming)", severity: "High", timestamp: "2026-07-13T01:10:00Z", status: "Open" },
    { id: "a2", employeeName: "Priya Sharma", role: "Sales DSE", location: "Pune West", bookingId: "b104", action: "DISCOUNT_APPROVED", reason: "Discount approved without manager digital signature", severity: "Medium", timestamp: "2026-07-13T00:45:00Z", status: "Open" },
    { id: "a3", employeeName: "Rahul Sen", role: "Finance Specialist", location: "Mumbai Central", bookingId: "b100", action: "FINANCE_APPROVED", reason: "Multiple rapid finance submission attempts", severity: "Low", timestamp: "2026-07-12T23:15:00Z", status: "Resolved" }
  ],
  analytics: {
    cycleTime: [
      { stage: "Booking → Discount", hours: 4.2 },
      { stage: "Discount → Finance", hours: 18.5 },
      { stage: "Finance → Invoice", hours: 2.1 },
      { stage: "Invoice → RTO", hours: 24.0 },
      { stage: "RTO → PDI", hours: 6.8 },
      { stage: "PDI → Delivery", hours: 12.0 }
    ],
    actionMix: [
      { name: "Deliveries", value: 350 },
      { name: "Finance Approvals", value: 250 },
      { name: "Bookings Created", value: 150 },
      { name: "PDI Completed", value: 120 },
      { name: "Notes Added", value: 80 },
      { name: "Others", value: 50 }
    ]
  }
};

function loadState() {
  const data = localStorage.getItem(STORAGE_KEY_PREFIX + 'state');
  let state = JSON.parse(JSON.stringify(defaultState));
  if (data) {
    try {
      const parsed = JSON.parse(data);
      state = {
        ...state,
        ...parsed,
        score: { ...state.score, ...parsed.score },
        quests: parsed.quests || state.quests,
        timeline: { ...state.timeline, ...parsed.timeline }
      };
    } catch (e) {
      console.error("Error loading mock state", e);
    }
  }
  return state;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY_PREFIX + 'state', JSON.stringify(state));
}

// Reset state helper
export function resetMockState() {
  localStorage.removeItem(STORAGE_KEY_PREFIX + 'state');
  return loadState();
}

// Helper to resolve current user matching
function isCurrentUser(rowName, rowUserId) {
  const loggedInId = localStorage.getItem('dealerxp_user_id') || 'u1';
  if (loggedInId === 'u1' && (rowUserId === 'u1' || rowName.toLowerCase().includes('asha'))) {
    return true;
  }
  if (loggedInId === 'u2' && (rowUserId === 'u2' || rowName.toLowerCase().includes('rahul'))) {
    return true;
  }
  if (loggedInId === 'u3' && (rowUserId === 'u3' || rowName.toLowerCase().includes('vikram'))) {
    return true;
  }
  return rowUserId === loggedInId;
}

// Simulated Action Triggers (for Demo presentation)
export function triggerRelayBonus() {
  const state = loadState();
  const timeline = state.timeline.b100;
  
  // Mark FINANCE_APPROVED and INVOICE_APPROVED as done
  timeline.stages = timeline.stages.map(stage => {
    if (stage.key === "FINANCE_APPROVED" || stage.key === "INVOICE_APPROVED") {
      return { ...stage, done: true, at: new Date().toISOString() };
    }
    return stage;
  });

  // Add points to both DSE (u1) and Finance (u2)
  state.score.u1.points += 150; // 100 for stage + 50 relay bonus
  state.score.u2.points += 150; // 100 for stage + 50 relay bonus

  // Update leaderboard points
  state.leaderboard.individual = state.leaderboard.individual.map(row => {
    if (row.name === "Asha") return { ...row, points: state.score.u1.points };
    if (row.name === "Rahul (Finance)") return { ...row, points: state.score.u2.points };
    return row;
  });

  // Update quest progress
  updateQuestProgress("RELAY_BONUS", 1, "u1", state);
  updateQuestProgress("RELAY_BONUS", 1, "u2", state);
  updateQuestProgress("FINANCE_APPROVED", 1, "u2", state);
  
  // Sort individual leaderboard
  state.leaderboard.individual.sort((a, b) => b.points - a.points);
  state.leaderboard.individual.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  // Add the RELAY_BONUS event to timeline
  const eventId = 'relay_' + Date.now();
  timeline.events.push({
    id: eventId,
    type: "RELAY_BONUS",
    users: ["u1", "u2"],
    points: 50,
    timestamp: new Date().toISOString()
  });

  saveState(state);
  // Dispatch a custom event to notify components listening directly (for instant reactivity)
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
}

export function triggerNoteSpam() {
  const state = loadState();
  const user = state.score.u1;

  // Let's assume note count target is 5 (quest q3)
  const q3 = state.quests.find(q => q.id === "q3");
  const currentProgress = q3 ? q3.progress : 2;

  if (currentProgress < q3.target) {
    // Under the cap, points increase
    user.points += 20;
    
    // Update quest progress
    updateQuestProgress("BOOKING_NOTE_ADDED", 1, "u1", state);

    // Update leaderboard points
    state.leaderboard.individual = state.leaderboard.individual.map(row => {
      if (row.name === "Asha") return { ...row, points: user.points };
      return row;
    });

    // Sort individual leaderboard
    state.leaderboard.individual.sort((a, b) => b.points - a.points);
    state.leaderboard.individual.forEach((row, idx) => {
      row.rank = idx + 1;
    });
  } else {
    // Cap is reached! Point count does not increase, and we mark cap as active
    if (!user.capsActive.includes("BOOKING_NOTE_ADDED")) {
      user.capsActive.push("BOOKING_NOTE_ADDED");
    }

    const timeline = state.timeline.b100;
    const eventId = 'cap_' + Date.now();
    
    timeline.events.push({
      id: eventId,
      type: "CAP_FIRED",
      action: "BOOKING_NOTE_ADDED",
      timestamp: new Date().toISOString()
    });
  }

  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
}

// API Methods
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function getTierBadge(points) {
  if (points < 100) return "🪨 Iron";
  if (points < 200) return "🥉 Bronze";
  if (points < 300) return "🥈 Silver";
  if (points < 400) return "🟡 Gold";
  if (points < 500) return "💎 Platinum";
  return "💠 Diamond";
}

function findUserInLeaderboard(leaderboard, targetIdOrName) {
  if (!targetIdOrName) return null;
  const search = targetIdOrName.toLowerCase();
  
  // Try exact match on userId
  let found = leaderboard.find(item => item.userId && item.userId.toLowerCase() === search);
  if (found) return found;
  
  // Try mapping common mock ids
  if (search === 'u1') {
    found = leaderboard.find(item => item.name && item.name.toLowerCase().includes('asha'));
    if (found) return found;
  }
  if (search === 'u2') {
    found = leaderboard.find(item => item.name && item.name.toLowerCase().includes('rahul'));
    if (found) return found;
  }
  if (search === 'u3') {
    found = leaderboard.find(item => item.name && item.name.toLowerCase().includes('vikram'));
    if (found) return found;
  }

  // Try matching name substring
  found = leaderboard.find(item => item.name && item.name.toLowerCase().includes(search));
  return found;
}

export async function getUserScore(userId) {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?scope=individual`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        const found = findUserInLeaderboard(data.leaderboard, userId);
        if (found) {
          const state = loadState();
          const localPoints = state.score[userId]?.points || 0;
          const defaultPoints = defaultState.score[userId]?.points || 0;
          const delta = localPoints - defaultPoints;
          const finalPoints = found.points + delta;

          return {
            userId: found.userId,
            name: found.name,
            points: finalPoints,
            streakDays: 5,
            capsActive: state.score[userId]?.capsActive || [],
            role: found.department.toLowerCase().includes('finance') ? 'Finance Specialist' : 'Sales DSE',
            branch: found.branch || 'YELAHANKA',
            badge: getTierBadge(finalPoints),
            delightMultiplier: state.score[userId]?.delightMultiplier || 1.0
          };
        }
      }
    }
  } catch (e) {
    console.warn("Backend getUserScore failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  const mockNames = {
    'u1': 'Asha',
    'u2': 'Rahul',
    'u3': 'Vikram',
    'USR001': 'Asha',
    'USR002': 'Rahul',
    'USR003': 'Vikram'
  };
  const profile = state.score[userId] || { 
    userId, 
    name: mockNames[userId] || (userId.startsWith('USR') ? 'Employee ' + userId : userId),
    points: 0, 
    streakDays: 5, 
    capsActive: [], 
    role: userId === 'u2' ? 'Finance Specialist' : 'Sales DSE', 
    branch: userId === 'u2' ? 'BANASHANKARI' : 'YELAHANKA', 
    delightMultiplier: 1.0 
  };
  return {
    ...profile,
    badge: getTierBadge(profile.points)
  };
}

function getDynamicRankBadges(points) {
  const earned = [];
  const inProgress = [];
  
  const rankTiers = [
    { threshold: 0, prev: 0, id: "rank-iron", name: "Iron Rank", icon: "Trophy" },
    { threshold: 100, prev: 0, id: "rank-bronze", name: "Bronze Rank", icon: "Award" },
    { threshold: 200, prev: 100, id: "rank-silver", name: "Silver Rank", icon: "Award" },
    { threshold: 300, prev: 200, id: "rank-gold", name: "Gold Rank", icon: "Trophy" },
    { threshold: 400, prev: 300, id: "rank-platinum", name: "Platinum Rank", icon: "Trophy" },
    { threshold: 500, prev: 400, id: "rank-diamond", name: "Diamond Rank", icon: "Trophy" }
  ];

  rankTiers.forEach(tier => {
    if (points >= tier.threshold) {
      earned.push({ id: tier.id, name: tier.name, icon: tier.icon });
    } else {
      const progress = (points - tier.prev) / (tier.threshold - tier.prev);
      inProgress.push({
        id: tier.id,
        name: tier.name,
        icon: tier.icon,
        progress: Math.max(0, Math.min(0.99, progress))
      });
    }
  });

  return { earned, inProgress };
}

export async function getUserBadges(userId) {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?scope=individual`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        const found = findUserInLeaderboard(data.leaderboard, userId);
        if (found) {
          const state = loadState();
          const localPoints = state.score[userId]?.points || 0;
          const defaultPoints = defaultState.score[userId]?.points || 0;
          const delta = localPoints - defaultPoints;
          const finalPoints = found.points + delta;

          const rankBadges = getDynamicRankBadges(finalPoints);
          const earned = [...rankBadges.earned];
          if (found.badge && found.badge !== "Bronze") {
            earned.push({ id: found.badge.toLowerCase().replace(/\s+/g, '-'), name: found.badge, icon: "Award" });
          }
          return {
            earned,
            inProgress: [
              ...rankBadges.inProgress,
              { id: "b2", name: "Team Player", progress: 0.6 }
            ]
          };
        }
      }
    }
  } catch (e) {
    console.warn("Backend getUserBadges failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  const userPoints = state.score[userId]?.points || 0;
  const rankBadges = getDynamicRankBadges(userPoints);
  
  const baseBadges = state.badges[userId] || { earned: [], inProgress: [] };
  const filteredBaseEarned = baseBadges.earned.filter(b => !b.id.startsWith("rank-"));
  const filteredBaseInProgress = baseBadges.inProgress.filter(b => !b.id.startsWith("rank-"));

  return {
    earned: [...rankBadges.earned, ...filteredBaseEarned],
    inProgress: [...rankBadges.inProgress, ...filteredBaseInProgress]
  };
}

export async function getLeaderboard(scope = 'individual') {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?scope=${scope}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        const state = loadState();
        const rows = data.leaderboard.map(item => {
          let extra = 0;
          if (scope === 'individual') {
            const isU1 = item.name.toLowerCase().includes('asha');
            const isU2 = item.name.toLowerCase().includes('rahul');
            const targetUser = isU1 ? 'u1' : (isU2 ? 'u2' : null);
            if (targetUser) {
              const localPoints = state.score[targetUser]?.points || 0;
              const defaultPoints = defaultState.score[targetUser]?.points || 0;
              extra = localPoints - defaultPoints;
            }
          }
          const finalPoints = item.points + extra;
          return {
            rank: item.rank,
            name: item.name || item.scopeId,
            points: finalPoints,
            badge: getTierBadge(finalPoints),
            branch: item.branch || item.scopeId || 'Mumbai Central',
            isMe: scope === 'individual' ? isCurrentUser(item.name, item.userId) : false
          };
        });

        // Re-sort in case local delta shifts rankings
        rows.sort((a, b) => b.points - a.points);
        rows.forEach((row, idx) => {
          row.rank = idx + 1;
        });

        return {
          scope,
          rows
        };
      }
    }
  } catch (e) {
    console.warn("Backend getLeaderboard failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  const rawRows = state.leaderboard[scope] || [];
  
  let scaledRows = [];
  if (rawRows.length > 0) {
    const ptsList = rawRows.map(r => r.points);
    const minPts = Math.min(...ptsList);
    const maxPts = Math.max(...ptsList);
    const ptsRange = maxPts - minPts;
    
    scaledRows = rawRows.map((r, idx) => {
      let scaledPts = 500;
      if (ptsRange > 0) {
        scaledPts = Math.round(80 + (r.points - minPts) / ptsRange * 440);
      }
      return {
        ...r,
        points: scaledPts,
        badge: getTierBadge(scaledPts)
      };
    });
    
    scaledRows.sort((a, b) => b.points - a.points);
    scaledRows.forEach((r, idx) => {
      r.rank = idx + 1;
    });
  }
  
  return {
    scope,
    rows: scaledRows
  };
}

export async function getDailyQuests() {
  try {
    const loggedInId = localStorage.getItem('dealerxp_user_id') || 'u1';
    const queryId = loggedInId === 'u1' ? 'USR001' : (loggedInId === 'u2' ? 'USR002' : loggedInId);
    const res = await fetch(`${API_BASE}/quests/daily?userId=${queryId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.quests)) {
        return {
          quests: data.quests.map(q => ({
            id: q.id,
            title: q.title,
            progress: q.progress,
            target: q.target,
            points: q.rewardXP,
            department: q.id === "Q03" ? "Finance" : "DSE"
          }))
        };
      }
    }
  } catch (e) {
    console.warn("Backend getDailyQuests failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  return { quests: state.quests };
}

export async function getCurrentDuest() {
  try {
    const res = await fetch(`${API_BASE}/duels/current`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.duel) {
        return {
          id: data.duel.id,
          title: "DSE vs Finance Sprint",
          dseId: "u1",
          dseName: "DSE Team",
          financeId: "u2",
          financeName: "Finance Team",
          dsePoints: data.duel.teamAScore,
          financePoints: data.duel.teamBScore,
          targetPoints: 300,
          bookingId: "b100"
        };
      }
    }
  } catch (e) {
    console.warn("Backend getCurrentDuest failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  return state.duest;
}

export async function getBookingTimeline(bookingId) {
  await delay(100);
  const state = loadState();
  return state.timeline[bookingId] || { bookingId, stages: [], events: [] };
}

export async function getActionWeights() {
  try {
    const res = await fetch(`${API_BASE}/admin/actions/weights`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.actions)) {
        return data.actions.map(a => ({
          action: a.action,
          label: a.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
          points: a.weight
        }));
      }
    }
  } catch (e) {
    console.warn("Backend getActionWeights failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  return state.weights || defaultState.weights;
}

export async function updateActionWeights(newWeights) {
  try {
    const payload = {
      updates: newWeights.map(w => ({
        action: w.action,
        weight: w.points
      }))
    };
    const res = await fetch(`${API_BASE}/admin/actions/weights`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('dealerxp_update'));
        return { success: true };
      }
    }
  } catch (e) {
    console.warn("Backend updateActionWeights failed, using fallback:", e);
  }
  await delay(150);
  const state = loadState();
  state.weights = newWeights;
  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function getAnomalies() {
  try {
    const res = await fetch(`${API_BASE}/admin/anomalies`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.anomalies)) {
        return data.anomalies.map((anom, idx) => ({
          id: anom.id || `anom_${idx}`,
          employeeName: anom.employeeName || anom.userId || 'Staff Member',
          role: anom.role || 'Dealership Executive',
          location: anom.location || 'Main Branch',
          bookingId: anom.bookingId || 'N/A',
          action: anom.action || anom.type,
          reason: anom.message || anom.reason,
          severity: anom.severity ? (anom.severity.charAt(0).toUpperCase() + anom.severity.slice(1)) : 'Medium',
          timestamp: anom.timestamp || new Date().toISOString(),
          status: anom.status || 'Open'
        }));
      }
    }
  } catch (e) {
    console.warn("Backend getAnomalies failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  return state.anomalies || defaultState.anomalies;
}

export async function updateAnomalyStatus(anomalyId, newStatus) {
  await delay(100);
  const state = loadState();
  state.anomalies = state.anomalies.map(anom => 
    anom.id === anomalyId ? { ...anom, status: newStatus } : anom
  );
  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function getDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.summary) {
        const sum = data.summary;
        const cycleTimeList = [
          { stage: "Average Hours", hours: sum.cycleTime.averageHours || 0 },
          { stage: "Min Hours", hours: sum.cycleTime.minHours || 0 },
          { stage: "Max Hours", hours: sum.cycleTime.maxHours || 0 }
        ];
        const actionMixList = (sum.actionMix || []).map(item => ({
          name: item.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
          value: item.count
        }));
        return {
          cycleTime: cycleTimeList,
          actionMix: actionMixList
        };
      }
    }
  } catch (e) {
    console.warn("Backend getDashboardSummary failed, using fallback:", e);
  }
  await delay(100);
  const state = loadState();
  return state.analytics || defaultState.analytics;
}

export async function getBookings() {
  await delay(100);
  const state = loadState();
  return Object.values(state.timeline).map(t => ({
    id: t.bookingId,
    enquiry_number: t.enquiryNumber || null,
    requested_by: t.requestedBy || 'u1',
    location_code: t.locationCode || 'Mumbai Central',
    status: t.status || 'CONFIRMED'
  }));
}

export async function getPendingBookings() {
  await delay(100);
  const state = loadState();
  return {
    bookings: Object.values(state.timeline)
      .filter(t => t.status === 'PENDING')
      .map(t => ({
        id: t.bookingId,
        enquiry_number: t.enquiryNumber || null,
        requested_by: t.requestedBy || 'u1',
        location_code: t.locationCode || 'Mumbai Central',
        status: 'PENDING'
      }))
  };
}

export async function requestBooking(bookingId, enquiryNumber, userId) {
  await delay(100);
  const state = loadState();
  if (state.timeline[bookingId]) {
    return { success: false, message: "Booking ID may already exist" };
  }
  state.timeline[bookingId] = {
    bookingId,
    enquiryNumber,
    requestedBy: userId || 'u1',
    locationCode: 'Mumbai Central',
    status: 'PENDING',
    stages: [
      { key: "BOOKING_CREATED", done: false },
      { key: "DISCOUNT_APPROVED", done: false },
      { key: "FINANCE_APPROVED", done: false },
      { key: "INVOICE_APPROVED", done: false },
      { key: "RTO_REQUEST", done: false },
      { key: "PDI_COMPLETED", done: false },
      { key: "DELIVERED", done: false }
    ],
    events: []
  };
  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function confirmBooking(bookingId) {
  await delay(150);
  const state = loadState();
  const booking = state.timeline[bookingId];
  if (!booking) return { success: false };
  if (booking.status === 'CONFIRMED') return { success: true };

  booking.status = 'CONFIRMED';
  booking.stages = booking.stages.map(s => s.key === 'BOOKING_CREATED' ? { ...s, done: true, at: new Date().toISOString() } : s);

  const requester = booking.requestedBy || 'u1';
  if (state.score[requester]) {
    state.score[requester].points += 30;
    
    state.leaderboard.individual = state.leaderboard.individual.map(row => {
      if (row.name === state.score[requester].name) {
        return { ...row, points: state.score[requester].points };
      }
      return row;
    });
    state.leaderboard.individual.sort((a, b) => b.points - a.points);
    state.leaderboard.individual.forEach((row, idx) => {
      row.rank = idx + 1;
    });
  }

  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function progressBookingStage(bookingId, stageKey) {
  await delay(150);
  const state = loadState();
  const booking = state.timeline[bookingId];
  if (!booking) return { success: false };

  booking.stages = booking.stages.map(s => s.key === stageKey ? { ...s, done: true, at: new Date().toISOString() } : s);
  
  const actionWeight = state.weights.find(w => w.action === stageKey);
  let points = actionWeight ? actionWeight.points : 50;

  const isFinance = ["FINANCE_APPROVED", "INVOICE_APPROVED"].includes(stageKey);
  const targetUser = isFinance ? "u2" : (booking.requestedBy || "u1");
  
  if (state.score[targetUser]) {
    // Apply Customer Delight Multiplier on next DELIVERED action
    if (stageKey === "DELIVERED" && state.score[targetUser].delightMultiplier > 1.0) {
      const mult = state.score[targetUser].delightMultiplier;
      const oldPoints = points;
      points = Math.round(points * mult);
      state.score[targetUser].delightMultiplier = 1.0; // Reset
      
      booking.events.push({
        id: "delight_" + Date.now(),
        type: "DELIGHT_APPLIED",
        action: "DELIVERED",
        points: points - oldPoints,
        timestamp: new Date().toISOString(),
        message: `Customer Delight Multiplier applied: ${mult}x (+${points - oldPoints} XP)`
      });
    }

    state.score[targetUser].points += points;

    // Update quest progress
    updateQuestProgress(stageKey, 1, targetUser, state);

    state.leaderboard.individual = state.leaderboard.individual.map(row => {
      if (row.name === state.score[targetUser].name) {
        return { ...row, points: state.score[targetUser].points };
      }
      return row;
    });
    state.leaderboard.individual.sort((a, b) => b.points - a.points);
    state.leaderboard.individual.forEach((row, idx) => {
      row.rank = idx + 1;
    });
  }

  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function login(employeeId, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, password })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend login failed, using fallback:", e);
  }
  // Mock login fallback
  if (employeeId === 'u3' && password === 'admin123') {
    return { success: true, user_id: 'u3', name: 'Vikram', role: 'Branch Manager (Admin)' };
  }
  if (employeeId === 'u1' && password === 'employee123') {
    return { success: true, user_id: 'u1', name: 'Asha', role: 'Sales DSE' };
  }
  if (employeeId === 'u2' && password === 'employee123') {
    return { success: true, user_id: 'u2', name: 'Rahul', role: 'Finance Specialist' };
  }
  throw new Error("Invalid credentials");
}

export async function registerUser(payload) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend register failed, using fallback:", e);
  }
  return {
    success: true,
    employee_id: 'u_' + Date.now(),
    name: payload.name,
    department: payload.department
  };
}

export async function getRouletteQueue() {
  await delay(100);
  const state = loadState();
  if (!state.rouletteQueue) {
    state.rouletteQueue = [
      { id: "r1", employeeName: "Asha", action: "ZERO_REWORK_BOOKING_BONUS", points: 140, timestamp: "2026-07-15T09:12:00Z", approved: false },
      { id: "r2", employeeName: "Rahul (Finance)", action: "DELIVERED", points: 220, timestamp: "2026-07-15T11:45:00Z", approved: false }
    ];
    saveState(state);
  }
  return state.rouletteQueue;
}

export async function approveRouletteItem(id) {
  await delay(100);
  const state = loadState();
  const item = state.rouletteQueue.find(r => r.id === id);
  if (!item || item.approved) return { success: false };

  item.approved = true;

  // Credit the points to the user
  const userId = item.employeeName.toLowerCase().includes('asha') ? 'u1' : 'u2';
  if (state.score[userId]) {
    state.score[userId].points += item.points;

    // Update individual leaderboard
    state.leaderboard.individual = state.leaderboard.individual.map(row => {
      if (row.name.toLowerCase().includes(item.employeeName.toLowerCase().split(' ')[0])) {
        return { ...row, points: state.score[userId].points };
      }
      return row;
    });
    state.leaderboard.individual.sort((a, b) => b.points - a.points);
    state.leaderboard.individual.forEach((row, idx) => {
      row.rank = idx + 1;
    });
  }

  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function triggerCustomerReview() {
  await delay(100);
  const state = loadState();
  const activeUserId = localStorage.getItem('dealerxp_user_id') || 'u1';
  
  if (state.score[activeUserId]) {
    // Set 1.05x Customer Delight multiplier
    state.score[activeUserId].delightMultiplier = 1.05;
    
    // Append customer review event to all active timelines for visibility
    const bookingIds = Object.keys(state.timeline);
    if (bookingIds.length > 0) {
      const booking = state.timeline[bookingIds[0]];
      booking.events.push({
        id: 'review_' + Date.now(),
        type: 'CUSTOMER_REVIEW_SUBMITTED',
        action: 'CUSTOMER_REVIEW_SUBMITTED',
        points: 0,
        timestamp: new Date().toISOString(),
        rating: 5,
        user_id: activeUserId,
        message: 'Customer submitted a 5★ review! 1.05x Delight Multiplier active for next sale.'
      });
    }
  }
  
  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function getUserPerformance(userId) {
  const user = await getUserScore(userId);
  let backendData = null;
  
  try {
    const queryId = userId === 'u1' ? 'USR001' : (userId === 'u2' ? 'USR002' : userId);
    const res = await fetch(`${API_BASE}/users/${queryId}/performance`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.profile && data.profile.name) {
        backendData = data;
      }
    }
  } catch (e) {
    console.warn("Backend getUserPerformance failed, using fallback:", e);
  }

  // Generate deterministic but high-variance mock data using a seed based on the userId
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isAsha = userId === 'u1' || (user.name && user.name.toLowerCase().includes('asha'));
  const isRahul = userId === 'u2' || (user.name && user.name.toLowerCase().includes('rahul'));
  
  // Custom Action Mix with distinct distributions and variance
  let actionMix = [];
  if (isAsha) {
    actionMix = [
      { name: "Deliveries", value: 6 },
      { name: "Bookings Created", value: 12 },
      { name: "Documentation", value: 8 },
      { name: "Discount Approvals", value: 4 },
      { name: "RTO Uploads", value: 5 },
      { name: "Booking Notes", value: 18 }
    ];
  } else if (isRahul) {
    actionMix = [
      { name: "Finance Approved", value: 14 },
      { name: "Invoice Approved", value: 11 },
      { name: "Clean Relay Bonus", value: 7 },
      { name: "Follow-Ups Closed", value: 15 },
      { name: "Booking Notes", value: 9 }
    ];
  } else {
    const hashVal = seed % 3;
    if (hashVal === 0) {
      actionMix = [
        { name: "Deliveries", value: 8 },
        { name: "Bookings Created", value: 10 },
        { name: "Discount Approvals", value: 7 },
        { name: "RTO Uploads", value: 6 }
      ];
    } else if (hashVal === 1) {
      actionMix = [
        { name: "Finance Approved", value: 18 },
        { name: "Invoice Approved", value: 12 },
        { name: "Clean Relay Bonus", value: 5 }
      ];
    } else {
      actionMix = [
        { name: "Deliveries", value: 3 },
        { name: "Bookings Created", value: 15 },
        { name: "Documentation", value: 12 },
        { name: "Booking Notes", value: 20 }
      ];
    }
  }

  // Create high-variance XP history (leaps, plateaus, spikes)
  const points = user.points || 280;
  
  const f1 = (seed % 6) / 100; // e.g. 0.05
  const f2 = ((seed * 2) % 8) / 100; // e.g. 0.04
  
  const xpHistory = [
    { date: "2026-07-09", xp: Math.round(points * (0.12 + f1)) },
    { date: "2026-07-10", xp: Math.round(points * (0.12 + f1)) }, // Plateau
    { date: "2026-07-11", xp: Math.round(points * (0.45 + f2)) }, // Big Spike
    { date: "2026-07-12", xp: Math.round(points * (0.47 + f2)) }, // Tiny Growth
    { date: "2026-07-13", xp: Math.round(points * (0.82 - f1)) }, // Big Leap
    { date: "2026-07-14", xp: Math.round(points * (0.82 - f1)) }, // Plateau
    { date: "2026-07-15", xp: points } // Current
  ];

  // Dynamic cycle time variation
  const avgCycleTimeHours = Math.round((10.4 + ((seed % 12) * 1.3)) * 10) / 10;
  const peerAverageXp = Math.round(320 + ((seed % 15) * 14));
  
  const allPossibleEvents = [
    { booking_id: "BLR-381", action: "DELIVERED", points: 300, timestamp: "2026-07-15T09:12:00Z" },
    { booking_id: "BLR-381", action: "PDI_COMPLETED", points: 100, timestamp: "2026-07-15T08:00:00Z" },
    { booking_id: "MUM-992", action: "RELAY_BONUS", points: 50, timestamp: "2026-07-14T15:32:00Z" },
    { booking_id: "MUM-992", action: "FINANCE_APPROVED", points: 100, timestamp: "2026-07-14T15:30:00Z" },
    { booking_id: "BLR-122", action: "BOOKING_NOTE_ADDED", points: 20, timestamp: "2026-07-14T11:45:00Z" },
    { booking_id: "BLR-122", action: "DISCOUNT_APPROVED", points: 50, timestamp: "2026-07-13T09:20:00Z" },
    { booking_id: "BLR-102", action: "BOOKING_CREATED", points: 100, timestamp: "2026-07-12T10:15:00Z" },
    { booking_id: "PUN-404", action: "RTO_REQUEST", points: 50, timestamp: "2026-07-11T16:40:00Z" },
    { booking_id: "PUN-404", action: "INVOICE_APPROVED", points: 100, timestamp: "2026-07-11T14:10:00Z" },
    { booking_id: "DEL-887", action: "FOLLOW_UP_COMPLETED", points: 15, timestamp: "2026-07-10T11:05:00Z" }
  ];

  let recentEvents = [];
  if (isAsha) {
    recentEvents = allPossibleEvents.filter(e => !["FINANCE_APPROVED", "INVOICE_APPROVED"].includes(e.action));
  } else if (isRahul) {
    recentEvents = allPossibleEvents.filter(e => !["DELIVERED", "RTO_REQUEST", "DISCOUNT_APPROVED"].includes(e.action));
  } else {
    const startIdx = seed % 4;
    recentEvents = allPossibleEvents.slice(startIdx, startIdx + 6);
  }

  if (backendData) {
    return {
      profile: {
        ...user,
        ...backendData.profile,
        name: backendData.profile.name || user.name || 'Employee'
      },
      actionMix: backendData.actionMix && backendData.actionMix.length > 0 ? backendData.actionMix : actionMix,
      xpHistory: backendData.xpHistory && backendData.xpHistory.length > 0 ? backendData.xpHistory : xpHistory,
      avgCycleTimeHours: backendData.avgCycleTimeHours || avgCycleTimeHours,
      peerAverageXp: backendData.peerAverageXp || peerAverageXp,
      eventsCount: backendData.eventsCount || recentEvents.length,
      recentEvents: backendData.recentEvents && backendData.recentEvents.length > 0 ? backendData.recentEvents : recentEvents
    };
  }

  return {
    profile: user,
    actionMix,
    xpHistory,
    avgCycleTimeHours,
    peerAverageXp,
    eventsCount: recentEvents.length,
    recentEvents
  };
}

export async function getUserCoachAdvice(userId, message) {
  try {
    const queryId = userId === 'u1' ? 'USR001' : (userId === 'u2' ? 'USR002' : userId);
    const res = await fetch(`${API_BASE}/users/${queryId}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn("Backend getUserCoachAdvice failed, using fallback:", e);
  }

  // Fallback if backend is offline or fails
  await delay(100);
  const user = await getUserScore(userId);
  const name = user.name || 'Team Member';
  const points = user.points || 0;
  const streak = user.streakDays || 0;
  const badge = user.badge || 'Bronze';
  const role = user.role || 'Dealer Executive';
  
  let advice = `Hey ${name}, I'm analyzing your current telemetry. You have ${points} XP (${badge} Rank). Keep completing active lifecycle milestones to optimize your point gains!`;
  const q = message.toLowerCase();
  
  if (!q.trim()) {
    if (role.includes('Finance')) {
      advice = `Hi ${name}! As a Finance Specialist, you are currently at ${points} XP ({badge} Rank) with a ${streak}-day active streak. Quick tip: collaborate with Sales DSEs on Yelahanka branch bookings to unlock the Clean Relay Collaboration Bonus (+50 XP)!`;
    } else if (role.includes('Manager') || userId === 'u3') {
      advice = `Welcome back, Branch Manager Vikram! Our current branch cycle time is averaging 67.6 hours. You can inspect branch-wide analytics and manage point weights in the Admin Console.`;
    } else {
      advice = `Hi ${name}! You currently have ${points} XP (${badge} Rank) and a ${streak}-day active streak. Make sure to complete a vehicle delivery milestone next to apply your customer delight multiplier!`;
    }
  } else if (q.includes('rank') || q.includes('level') || q.includes('fast') || q.includes('points')) {
    advice = `To boost your XP quickly from your current ${badge} tier: \n1. Complete vehicle deliveries (300 XP)\n2. Log finance approvals (100 XP)\n3. Hand off bookings to other departments to trigger the Relay Collaboration Bonus (+50 XP) which has no daily limits!`;
  } else if (q.includes('cap') || q.includes('limit') || q.includes('zero') || q.includes('warning') || q.includes('note')) {
    advice = `I checked your events. Low-effort actions like notes have a daily cap of 5. To continue scoring points, prioritize higher-value milestones such as RTO requests (+50 XP) or PDI completions (+100 XP).`;
  } else if (q.includes('relay') || q.includes('collaboration') || q.includes('bonus')) {
    advice = `The Relay Collaboration Bonus (+50 XP) rewards fast handoffs. It triggers when a Sales DSE and a Finance Specialist complete successive steps on the same booking lifecycle.`;
  } else if (q.includes('multiplier') || q.includes('delight') || q.includes('review')) {
    advice = `You can earn a Customer Delight Multiplier (up to 1.05x) by securing 5-star customer feedback. The multiplier automatically boosts your next DELIVERED action and then resets.`;
  }

  return {
    success: true,
    user_id: userId,
    advice
  };
}