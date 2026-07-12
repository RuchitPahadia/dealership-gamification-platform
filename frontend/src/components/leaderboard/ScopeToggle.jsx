import React from 'react';
import { Users, User } from 'lucide-react';

export function ScopeToggle({ scope, onChange }) {
  return (
    <div className="flex bg-neutral-100 p-1 rounded-xl w-fit">
      <button
        type="button"
        onClick={() => onChange('individual')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          scope === 'individual'
            ? 'bg-white text-brand-primary shadow-sm'
            : 'text-neutral-500 hover:text-neutral-800'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Individual Standing</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('branch')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          scope === 'branch'
            ? 'bg-white text-brand-primary shadow-sm'
            : 'text-neutral-500 hover:text-neutral-800'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Branch Standing</span>
      </button>
    </div>
  );
}
