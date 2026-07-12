import React from 'react';
import { RankRow } from './RankRow';

export function LeaderboardTable({ rows, scope }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider w-24"
              >
                Rank
              </th>
              <th 
                scope="col" 
                className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider"
              >
                {scope === 'individual' ? 'Player Name' : 'Branch Name'}
              </th>
              {scope === 'individual' && (
                <th 
                  scope="col" 
                  className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider"
                >
                  Branch
                </th>
              )}
              <th 
                scope="col" 
                className="px-6 py-3.5 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider w-32"
              >
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {rows.map((row) => (
              <RankRow key={row.name} row={row} scope={scope} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
