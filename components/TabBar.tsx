'use client';

import type { Screen } from '@/lib/types';

const TABS: { id: Screen | 'add'; special?: boolean; path: React.ReactNode }[] = [
  { id: 'home',  path: <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-9.5z"/> },
  { id: 'tx',    path: <><path d="M7 4v16M4 7l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 20V4M14 17l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/></> },
  { id: 'add', special: true, path: <path d="M12 5v14M5 12h14" strokeLinecap="round"/> },
  { id: 'stats', path: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" strokeLinecap="round"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></> },
  { id: 'cats',  path: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" strokeWidth="3"/></> },
];

export function TabBar({ current, onGo }: { current: string; onGo: (id: string) => void }) {
  return (
    <div className="tabbar">
      {TABS.map(t => {
        const on = current === t.id;
        return (
          <button
            key={t.id}
            className={`tab-btn${on ? ' active' : ''}${t.special ? ' tab-special' : ''}`}
            onClick={() => onGo(t.id)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24"
              fill={on && !t.special ? 'currentColor' : 'none'}
              stroke={t.special ? '#10B981' : 'currentColor'} strokeWidth={t.special ? 2.8 : 2}>
              {t.path}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
