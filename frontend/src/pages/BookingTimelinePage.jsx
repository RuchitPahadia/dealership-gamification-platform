import React, { useEffect, useState, useRef } from 'react';
import { useBookingTimeline } from '../hooks/useBookingTimeline';
import { useScore } from '../hooks/useScore';
import { RaceTrack } from '../components/booking/RaceTrack';
import { RelayBonusFlash } from '../components/booking/RelayBonusFlash';
import { CapFiringIndicator } from '../components/booking/CapFiringIndicator';
import { motion } from 'framer-motion';
import { User, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { triggerRelayBonus, triggerNoteSpam, resetMockState, getBookings, confirmBooking } from '../api/client';

export default function BookingTimelinePage() {
  const [bookingId, setBookingId] = useState('b100');
  const [allBookings, setAllBookings] = useState([]);
  const currentUserId = localStorage.getItem('dealerxp_user_id') || 'u1';

  useEffect(() => {
    const fetchBookings = () => {
      getBookings().then(list => {
        setAllBookings(list);
      });
    };
    fetchBookings();
    window.addEventListener('dealerxp_update', fetchBookings);
    return () => window.removeEventListener('dealerxp_update', fetchBookings);
  }, []);

  const { data: timeline, error: timelineError, loading: timelineLoading } = useBookingTimeline(bookingId);
  
  // Load scores for u1 (Asha) and u2 (Rahul) to show in the dual scoreboards
  const { data: scoreU1, loading: u1Loading } = useScore('u1');
  const { data: scoreU2, loading: u2Loading } = useScore('u2');

  const [showRelay, setShowRelay] = useState(false);
  const [showCap, setShowCap] = useState(false);
  const [activeCapAction, setActiveCapAction] = useState("");
  const [relayGlow, setRelayGlow] = useState(false);
  const [shakeU1, setShakeU1] = useState(false);

  // Track event IDs that have already been animated
  const animatedEventIds = useRef(new Set());

  useEffect(() => {
    if (timeline && timeline.events) {
      timeline.events.forEach(event => {
        if (!animatedEventIds.current.has(event.id)) {
          // New event detected!
          animatedEventIds.current.add(event.id);
          
          const eventTime = new Date(event.timestamp).getTime();
          const now = Date.now();
          const isRecent = (now - eventTime) < 8000; // 8 seconds threshold

          if (event.type === 'RELAY_BONUS' && isRecent) {
            // Trigger Relay Flash Overlay
            setShowRelay(true);
            setRelayGlow(true);
            setTimeout(() => {
              setShowRelay(false);
            }, 4000);
            setTimeout(() => {
              setRelayGlow(false);
            }, 6000); // Glow lasts longer
          } 
          
          if (event.type === 'CAP_FIRED' && isRecent) {
            // Trigger Cap Firing Indicator Toast
            setActiveCapAction(event.action === 'BOOKING_NOTE_ADDED' ? 'Add Booking Notes' : event.action);
            setShowCap(true);
            setShakeU1(true);
            setTimeout(() => {
              setShowCap(false);
            }, 4000);
            setTimeout(() => {
              setShakeU1(false);
            }, 1000); // Shake is brief
          }
        }
      });
    }
  }, [timeline]);

  const handleReset = () => {
    resetMockState();
    animatedEventIds.current.clear();
    setShowRelay(false);
    setShowCap(false);
    setRelayGlow(false);
    setShakeU1(false);
    window.dispatchEvent(new CustomEvent('dealerxp_update'));
  };

  const isLoading = timelineLoading || u1Loading || u2Loading;
  const isError = timelineError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-950 text-neutral-500 dark:text-slate-400 border border-neutral-100 dark:border-slate-800 p-8 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-sm font-semibold mt-4">Loading Booking Race Track...</p>
      </div>
    );
  }

  if (isError || !timeline) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 text-red-700 dark:text-slate-300">
        <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">Error loading booking timeline</h3>
        <p className="text-red-500 text-sm mt-2">Make sure the booking exists.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-bg-canvas text-neutral-800 dark:text-slate-100 p-6 md:p-8 rounded-2xl shadow-md dark:shadow-2xl relative overflow-hidden space-y-8 min-h-[80vh] border border-neutral-100 dark:border-slate-800">
      
      {/* Background grids and glowing blobs for premium aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-neutral-100 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-teal-500 dark:text-teal-400 uppercase tracking-widest">
            Booking Centerpiece
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white tracking-tight mt-1">
            Booking Lifecycle Race Track
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-neutral-500 dark:text-slate-400 text-xs font-semibold">Select Booking:</span>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="bg-neutral-50 dark:bg-slate-800 text-neutral-800 dark:text-slate-200 text-xs font-bold px-2 py-1 rounded border border-neutral-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {allBookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.status || 'CONFIRMED'})
                </option>
              ))}
            </select>
          </div>
          <p className="text-neutral-500 dark:text-slate-400 text-sm mt-2">
            Customer: <span className="text-neutral-800 dark:text-slate-200 font-semibold">{timeline.customerName || `Booking ${timeline.bookingId}`}</span> • ID: <span className="font-mono text-neutral-700 dark:text-slate-300">{timeline.bookingId}</span>
          </p>
        </div>

        {/* Demo trigger controls directly visible on the centerpiece page for judges */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={triggerRelayBonus}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all duration-200"
          >
            ⚡ Simulate Finance Approval (Relay Bonus)
          </button>
          <button
            type="button"
            onClick={triggerNoteSpam}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-700 dark:text-white text-xs font-bold rounded-lg border border-neutral-200 dark:border-slate-700 transition-all duration-200"
          >
            ✍️ Add Note (Cap Test)
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-900/50 transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pending Approval Banner */}
      {timeline.status === 'PENDING' && (
        <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">Booking Confirmation Pending</h4>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
              This booking request must be confirmed by the Branch Manager before the timeline can proceed.
            </p>
          </div>
          {currentUserId === 'u3' && (
            <button
              onClick={() => {
                confirmBooking(bookingId);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-extrabold rounded-lg shadow-lg transition-all duration-200"
            >
              Confirm Booking Request
            </button>
          )}
        </div>
      )}

      {/* Race Track */}
      <div className="relative z-10">
        <RaceTrack booking={timeline} />
      </div>

      {/* Synchronized Scoreboards Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Asha (DSE) Scoreboard */}
        <motion.div 
          className={`bg-neutral-50/50 dark:bg-slate-900/80 border rounded-xl p-5 relative overflow-hidden transition-all duration-500 ${
            relayGlow 
              ? 'border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
              : 'border-neutral-200 dark:border-slate-800'
          }`}
          animate={shakeU1 ? { x: [-10, 10, -10, 10, 0] } : relayGlow ? { scale: [1, 1.08, 1] } : {}}
          transition={shakeU1 ? { duration: 0.5 } : { duration: 0.8 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">Asha</h3>
                <span className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Dealer Sales Executive
                </span>
              </div>
            </div>
            {scoreU1.capsActive?.includes('BOOKING_NOTE_ADDED') && (
              <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                CAPPED
              </span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-numeric text-neutral-900 dark:text-white tracking-tight">
              {scoreU1.points}
            </span>
            <span className="text-xs text-neutral-500 dark:text-slate-400 font-bold">XP</span>
          </div>

          {relayGlow && (
            <div className="text-teal-600 dark:text-teal-400 text-xs mt-2 font-bold animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Relay Bonus Active! +50 XP added
            </div>
          )}
        </motion.div>

        {/* Rahul (Finance) Scoreboard */}
        <motion.div 
          className={`bg-neutral-50/50 dark:bg-slate-900/80 border rounded-xl p-5 relative overflow-hidden transition-all duration-500 ${
            relayGlow 
              ? 'border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
              : 'border-neutral-200 dark:border-slate-800'
          }`}
          animate={relayGlow ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">Rahul</h3>
                <span className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Finance approval specialist
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-numeric text-neutral-900 dark:text-white tracking-tight">
              {scoreU2.points}
            </span>
            <span className="text-xs text-neutral-500 dark:text-slate-400 font-bold">XP</span>
          </div>

          {relayGlow && (
            <div className="text-teal-600 dark:text-teal-400 text-xs mt-2 font-bold animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Relay Bonus Active! +50 XP added
            </div>
          )}
        </motion.div>
      </div>

      {/* Helpful Instructions Overlay */}
      <div className="bg-neutral-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-neutral-200 dark:border-slate-800 relative z-10 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-neutral-500 dark:text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
          <p className="font-semibold text-neutral-800 dark:text-slate-300">How to demonstrate the two key moments:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            <li>Click <span className="text-teal-600 dark:text-teal-400 font-bold">⚡ Simulate Finance Approval</span>: The booking advances on the racetrack, a full-screen Relay Bonus banner appears, and both Asha's and Rahul's scores animate upwards and glow in sync!</li>
            <li>Click <span className="text-neutral-700 dark:text-slate-300 font-bold">✍️ Add Note</span>: Asha adds notes. The 5th note triggers the cap warning, Asha's card shakes briefly, and subsequent notes will not increase points anymore, showcasing the anti-gaming limits.</li>
          </ul>
        </div>
      </div>

      {/* Overlay Animations */}
      <RelayBonusFlash active={showRelay} />
      <CapFiringIndicator active={showCap} actionName={activeCapAction} />
    </div>
  );
}
