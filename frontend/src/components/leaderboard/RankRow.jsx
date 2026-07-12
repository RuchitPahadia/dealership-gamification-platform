import React from 'react';
import { Trophy, Medal } from 'lucide-react';

export function RankRow({ row, scope }) {
  const isTop3 = row.rank <= 3;
  const isMe = row.isMe;

  // Border and accent styling for Top 3
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          borderClass: 'border-l-4 border-l-yellow-500',
          bgClass: 'bg-yellow-500/5',
          textClass: 'text-yellow-600',
          icon: <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/10" />
        };
      case 2:
        return {
          borderClass: 'border-l-4 border-l-slate-400',
          bgClass: 'bg-slate-400/5',
          textClass: 'text-slate-500',
          icon: <Medal className="w-5 h-5 text-slate-400 fill-slate-400/10" />
        };
      case 3:
        return {
          borderClass: 'border-l-4 border-l-amber-600',
          bgClass: 'bg-amber-600/5',
          textClass: 'text-amber-700',
          icon: <Medal className="w-5 h-5 text-amber-600 fill-amber-600/10" />
        };
      default:
        return {
          borderClass: 'border-l-4 border-l-transparent',
          bgClass: '',
          textClass: 'text-neutral-500',
          icon: null
        };
    }
  };

  const rankStyle = getRankStyle(row.rank);

  return (
    <tr 
      className={`transition-all duration-150 ${rankStyle.borderClass} ${
        isMe 
          ? 'bg-brand-primary/5 border-l-4 border-l-brand-primary font-semibold' 
          : isTop3 
            ? rankStyle.bgClass 
            : 'hover:bg-neutral-50'
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-numeric">
        <div className="flex items-center gap-2">
          {rankStyle.icon}
          <span className={`font-bold ${isTop3 ? rankStyle.textClass : 'text-neutral-500'}`}>
            #{row.rank}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
        <div className="flex items-center gap-2">
          <span>{row.name}</span>
          {isMe && (
            <span className="text-[10px] px-1.5 py-0.5 bg-brand-primary text-white rounded font-bold uppercase tracking-wider">
              You
            </span>
          )}
        </div>
      </td>
      {scope === 'individual' && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
          {row.branch}
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-numeric text-right text-neutral-900">
        <span className="text-xp-gold">{row.points.toLocaleString()}</span>
        <span className="text-xs text-neutral-400 font-medium ml-1">XP</span>
      </td>
    </tr>
  );
}
