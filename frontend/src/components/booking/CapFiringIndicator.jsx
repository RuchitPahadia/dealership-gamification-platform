import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, XCircle } from 'lucide-react';

export function CapFiringIndicator({ active, actionName = "Add Booking Notes" }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-red-500/20 rounded-xl p-4 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex gap-3">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest">
                  Game Limit Reached
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                "{actionName}" XP Capped!
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Anti-gaming logic triggered. You have hit the maximum allowed XP for this action today. Points will no longer climb.
              </p>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 text-slate-500">
            <XCircle className="w-4 h-4 cursor-pointer hover:text-slate-300" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
