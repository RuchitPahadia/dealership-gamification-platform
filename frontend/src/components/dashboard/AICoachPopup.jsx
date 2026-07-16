import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, Zap, Trophy, MessageSquare } from 'lucide-react';
import { getUserScore } from '../../api/client';

export function AICoachPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('dealerxp_user_id') || 'u1');
  const [userProfile, setUserProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Sync user profile
  useEffect(() => {
    const fetchProfile = () => {
      const uId = localStorage.getItem('dealerxp_user_id') || 'u1';
      setUserId(uId);
      getUserScore(uId)
        .then(profile => {
          setUserProfile(profile);
          const name = profile?.name || 'Partner';
          const points = profile?.points || 0;
          const badge = profile?.badge || 'Bronze';
          const streak = profile?.streakDays || 5;

          const welcomeMsg = `Hi ${name}! I'm your AI Coach. I've analyzed your performance telemetry logs. You currently have ${points} XP (${badge} Rank) with a ${streak}-day active streak!`;
          const capMsg = "⚠️ Note Cap Advisory: Your 'Booking Note Added' actions are restricted to a daily rate limit of 5. Focus on higher-weight milestones like PDI completions (+100 XP) or RTO uploads (+50 XP) to maximize point gains.";
          const multiplierMsg = "🌟 Customer Delight Multiplier: Congratulations on securing a 5-star customer review! A 1.05x multiplier is currently active on your profile. This boost will automatically apply to increase the XP weight of your next DELIVERED action.";
          const relayMsg = "🤝 Collaboration Hint: Want to earn extra XP? Coordinate with your department counterpart on Yelahanka branch bookings. Completing successive approval milestones triggers the Clean Relay Collaboration Bonus (+50 XP) for both of you!";

          setMessages([
            { id: 1, text: welcomeMsg, isBot: true, timestamp: new Date() },
            { id: 2, text: capMsg, isBot: true, timestamp: new Date() },
            { id: 3, text: multiplierMsg, isBot: true, timestamp: new Date() },
            { id: 4, text: relayMsg, isBot: true, timestamp: new Date() }
          ]);
        })
        .catch(e => console.error("Failed to load coach user profile", e));
    };

    fetchProfile();

    const handleUpdate = () => {
      fetchProfile();
    };
    window.addEventListener('dealerxp_update', handleUpdate);
    return () => window.removeEventListener('dealerxp_update', handleUpdate);
  }, [userId]);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botText = "That's an interesting question. Let's focus on high-impact milestone achievements to optimize your point gain today!";
      const q = text.toLowerCase();
      
      if (q.includes('rank') || q.includes('level') || q.includes('fast')) {
        botText = "To rank up fast, prioritize DELIVERED milestones (300 XP) and FINANCE_APPROVED (100 XP). Collaborate across departments to trigger Relay Bonuses (+50 XP) which have no daily caps!";
      } else if (q.includes('zero') || q.includes('point') || q.includes('cap') || q.includes('warning')) {
        botText = "You get 0 points when actions exceed the daily cap (e.g. 5 booking notes daily cap) or trigger anti-collusion guardrails. Space out low-yielding actions and focus on real lifecycle achievements.";
      } else if (q.includes('relay') || q.includes('collaboration') || q.includes('bonus')) {
        botText = "The Relay Collaboration Bonus triggers when a Sales DSE and a Finance Specialist complete successive approval milestones on the same booking. It awards +50 XP to both parties!";
      } else if (q.includes('multiplier') || q.includes('delight')) {
        botText = "Customer Delight Multipliers (up to 1.05x) are earned from 5-star customer feedback. The bonus is automatically applied to boost your next DELIVERED action and resets afterwards.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 600);
  };

  const suggestions = [
    "How can I rank up fast?",
    "Why did I get 0 points?",
    "How to get Relay Bonus?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-4 w-80 md:w-96 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-650 via-purple-600 to-pink-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    DealerXP AI Coach <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-white/70 font-semibold block">Ask for points & rank advice</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    msg.isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  {msg.isBot ? (
                    <div className="w-7 h-7 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-pink-500/20 border border-pink-500/30 rounded-lg flex items-center justify-center text-pink-400 shrink-0 uppercase font-black text-[10px]">
                      {(userProfile?.name || 'Me').charAt(0)}
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-xl leading-relaxed ${
                      msg.isBot
                        ? 'bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-tl-none'
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-650/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
                  <div className="w-7 h-7 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-885/80 border border-slate-700/30 p-3 rounded-xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-850 flex flex-wrap gap-1.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-slate-650 text-[10px] font-bold rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask coach how to rank up..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-pink-650 hover:from-indigo-500 hover:to-pink-555 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer relative z-50 border border-indigo-500/20 group focus:outline-none"
        title="Open AI Coach"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-650 to-pink-650 opacity-40 group-hover:scale-120 transition-all duration-350 animate-ping -z-10" />
        {isOpen ? <X className="w-5.5 h-5.5" /> : <Sparkles className="w-5.5 h-5.5 text-amber-200" />}
      </motion.button>
    </div>
  );
}
