'use client';

import type { Screen } from '@/lib/types';

const TABS: { id: Screen | 'add'; special?: boolean; path: React.ReactNode }[] = [
  { id: 'home',  path: <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-9.5z"/> },
  { id: 'tx',    path: <><path d="M7 4v16M4 7l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 20V4M14 17l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/></> },
  { id: 'add', special: true, path: <path d="M12 5v14M5 12h14" strokeLinecap="round"/> },
  { id: 'stats', path: <><path d="M3 17l5-5 4 3 7-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 20h18" strokeLinecap="round"/></> },
  { id: 'cats',  path: <><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/><path d="M4 11h16"/><path d="M10 7v12"/></> },
  { id: 'me',    path: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></> },
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
              stroke="currentColor" strokeWidth="2">
              {t.path}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
