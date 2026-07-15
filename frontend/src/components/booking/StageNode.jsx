import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Clock } from 'lucide-react';

const stageLabels = {
  BOOKING_CREATED: "Booking Created",
  DISCOUNT_APPROVED: "Discount Approved",
  FINANCE_APPROVED: "Finance Approved",
  INVOICE_APPROVED: "Invoice Approved",
  RTO_REQUEST: "RTO Request",
  PDI_COMPLETED: "PDI Completed",
  DELIVERED: "Delivered"
};

export function StageNode({ stage, status, index }) {
  // status can be: 'completed', 'active', 'upcoming'
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  
  const getColors = () => {
    if (isCompleted) {
      return {
        bg: 'bg-success-green',
        border: 'border-success-green',
        text: 'text-success-green',
        icon: <Check className="w-5 h-5 text-white stroke-[3px]" />
      };
    }
    if (isActive) {
      return {
        bg: 'bg-xp-gold',
        border: 'border-xp-gold',
        text: 'text-xp-gold',
        icon: <Flame className="w-5 h-5 text-white animate-bounce" />
      };
    }
    return {
      bg: 'bg-neutral-200 dark:bg-slate-800',
      border: 'border-neutral-300 dark:border-slate-700',
      text: 'text-neutral-400 dark:text-slate-500',
      icon: <Clock className="w-4 h-4 text-neutral-400 dark:text-slate-500" />
    };
  };

  const colors = getColors();

  return (
    <div className="flex flex-col items-center relative z-10 w-28 text-center">
      {/* Node Circle */}
      <motion.div 
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${colors.bg} ${colors.border}`}
        initial={isActive ? { scale: 1 } : { scale: 0.9 }}
        animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={isActive ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : { duration: 0.3 }}
      >
        {colors.icon}
      </motion.div>

      {/* Label */}
      <div className="mt-3">
        <h4 className={`text-xs font-bold leading-tight uppercase tracking-wider ${
          isActive 
            ? 'text-xp-gold font-extrabold' 
            : isCompleted 
              ? 'text-success-green' 
              : 'text-neutral-500 dark:text-slate-400'
        }`}>
          {stageLabels[stage.key] || stage.key}
        </h4>
        {stage.at && (
          <span className="text-[10px] text-neutral-400 dark:text-slate-500 block mt-1">
            {new Date(stage.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Connection Indicator for debugging/layout reference */}
      <div className="absolute top-6 -left-12 -right-12 h-0.5 bg-transparent pointer-events-none" />
    </div>
  );
}
