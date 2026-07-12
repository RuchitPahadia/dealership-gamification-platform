// API Client for DealerXP - Developer 3
// Stubbed for mock-first development (Hour 0-10) and ready for live swap (Hour 10+)
// Stores local state in memory/localStorage to allow interactive demo triggers.

const STORAGE_KEY_PREFIX = 'dealerxp_';

const defaultState = {
  score: {
    u1: { userId: "u1", name: "Asha", points: 1240, streakDays: 5, capsActive: [] },
    u2: { userId: "u2", name: "Rahul (Finance)", points: 980, streakDays: 4, capsActive: [] }
  },
  badges: {
    u1: {
      earned: [
        { id: "b1", name: "First Sale", icon: "Award" },
        { id: "b3", name: "Speed Demon", icon: "Flame" }
      ],
      inProgress: [
        { id: "b2", name: "Team Player", progress: 0.6 },
        { id: "b4", name: "Finance Closer", progress: 0.2 }
      ]
    },
    u2: {
      earned: [
        { id: "b1", name: "First Approval", icon: "CheckCircle2" }
      ],
      inProgress: [
        { id: "b2", name: "Team Player", progress: 0.8 }
      ]
    }
  },
  quests: [
    { id: "q1", title: "Clear 3 finance approvals", progress: 1, target: 3, points: 100, department: "Finance" },
    { id: "q2", title: "Upload 2 RTO requests", progress: 0, target: 2, points: 50, department: "DSE" },
    { id: "q3", title: "Add 5 booking comments", progress: 2, target: 5, points: 20, department: "Any" },
    { id: "q4", title: "Deliver a booking today", progress: 0, target: 1, points: 200, department: "DSE" }
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
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error loading mock state", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY_PREFIX + 'state', JSON.stringify(state));
}

// Reset state helper
export function resetMockState() {
  localStorage.removeItem(STORAGE_KEY_PREFIX + 'state');
  return loadState();
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
  
  // Sort individual leaderboard
  state.leaderboard.individual.sort((a, b) => b.points - a.points);
  state.leaderboard.individual.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  // Update quest progress
  state.quests = state.quests.map(q => {
    if (q.id === "q1") {
      return { ...q, progress: Math.min(q.target, q.progress + 1) };
    }
    return q;
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
    state.quests = state.quests.map(q => {
      if (q.id === "q3") {
        return { ...q, progress: q.progress + 1 };
      }
      return q;
    });

    // Update leaderboard points
    state.leaderboard.individual = state.leaderboard.individual.map(row => {
      if (row.name === "Asha") return { ...row, points: user.points };
      return row;
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

export async function getUserScore(userId) {
  await delay(100);
  const state = loadState();
  return state.score[userId] || { userId, points: 0, streakDays: 0, capsActive: [] };
}

export async function getUserBadges(userId) {
  await delay(100);
  const state = loadState();
  return state.badges[userId] || { earned: [], inProgress: [] };
}

export async function getLeaderboard(scope = 'individual') {
  await delay(100);
  const state = loadState();
  return {
    scope,
    rows: state.leaderboard[scope] || []
  };
}

export async function getDailyQuests() {
  await delay(100);
  const state = loadState();
  return { quests: state.quests };
}

export async function getCurrentDuest() {
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
  await delay(100);
  const state = loadState();
  return state.weights || defaultState.weights;
}

export async function updateActionWeights(newWeights) {
  await delay(150);
  const state = loadState();
  state.weights = newWeights;
  saveState(state);
  window.dispatchEvent(new CustomEvent('dealerxp_update'));
  return { success: true };
}

export async function getAnomalies() {
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
  await delay(100);
  const state = loadState();
  return state.analytics || defaultState.analytics;
}
