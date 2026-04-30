'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StoreProvider, useStore } from '@/lib/store';
import type { Screen } from '@/lib/types';
import type { Transaction } from '@/lib/types';
import { Dashboard } from './Dashboard';
import { Transactions } from './Transactions';
import { Analytics } from './Analytics';
import { Budgets } from './Budgets';
import { Categories } from './Categories';
import { Profile } from './Profile';
import { Loans } from './Loans';
import { AddSheet } from './AddSheet';
import { TabBar } from './TabBar';

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setDesktop(mq.matches);
    const fn = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return desktop;
}

const SIDEBAR_NAV: { id: Screen; label: string; fill?: boolean; path: React.ReactNode }[] = [
  { id: 'home',   label: 'Inicio',       fill: true,  path: <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-9.5z"/> },
  { id: 'tx',     label: 'Movimientos',               path: <><path d="M7 4v16M4 7l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 20V4M14 17l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/></> },
  { id: 'stats',  label: 'Estadísticas', fill: true,  path: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" strokeLinecap="round"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></> },
  { id: 'budget', label: 'Presupuestos',              path: <><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3" strokeLinecap="round"/></> },
  { id: 'cats',   label: 'Categorías',                path: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" strokeWidth="3"/></> },
  { id: 'loans',  label: 'Préstamos',                 path: <><path d="M3 21h18M3 10h18M3 10l9-7 9 7M6 10v11M10 10v11M14 10v11M18 10v11" strokeLinecap="round" strokeLinejoin="round"/></> },
];

function DesktopSidebar({ current, onGo, onAdd }: {
  current: string;
  onGo: (id: string) => void;
  onAdd: (k: string) => void;
}) {
  return (
    <aside className="desktop-sidebar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 28px' }}>
        <img src="/konto.png" alt="Konto" style={{ width: 34, height: 34, borderRadius: 9 }} />
        <span className="dn" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>Konto</span>
      </div>

      {/* Primary action */}
      <button onClick={() => onAdd('gasto')} className="desktop-add-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
          <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
        </svg>
        Añadir gasto
      </button>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
        {SIDEBAR_NAV.map(item => {
          const on = current === item.id;
          return (
            <button key={item.id} onClick={() => onGo(item.id)} className={`desktop-nav-item${on ? ' active' : ''}`}>
              <svg width="17" height="17" viewBox="0 0 24 24"
                fill={on && item.fill ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth={2}>
                {item.path}
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Profile at bottom */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <button onClick={() => onGo('me')} className={`desktop-nav-item${current === 'me' ? ' active' : ''}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Perfil
        </button>
      </div>
    </aside>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, background: 'var(--bg)',
    }}>
      <img src="/konto.png" alt="Konto" style={{ width: 52, borderRadius: 14, opacity: 0.85 }}/>
      <div style={{ fontSize: 13, color: 'var(--text-m)', letterSpacing: 0.3 }}>Cargando...</div>
    </div>
  );
}

function AppInner() {
  const { darkMode, reset, gradMap, grad, loading } = useStore();
  const [screen, setScreen] = useState<Screen>('home');
  const [sheet, setSheet] = useState<'gasto' | 'ingreso' | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [mounted, setMounted] = useState(false);
  const desktop = useIsDesktop();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.documentElement.className = darkMode ? '' : 'light';
    document.documentElement.style.setProperty('--grad', gradMap[grad]);
  }, [darkMode, grad, gradMap]);

  const openAdd = (kind: string) => { setEditTx(null); setSheet(kind as 'gasto' | 'ingreso'); };
  const openEdit = (tx: Transaction) => { setEditTx(tx); setSheet(tx.amt > 0 ? 'ingreso' : 'gasto'); };
  const closeSheet = () => { setSheet(null); setEditTx(null); };
  const goTo = (id: string) => { if (id !== 'add') setScreen(id as Screen); };

  const screens: Record<Screen, React.ReactNode> = {
    home:   <Dashboard   onGo={goTo} onAdd={openAdd} onOpenTx={openEdit}/>,
    tx:     <Transactions onGo={goTo} onAdd={openAdd} onOpenTx={openEdit}/>,
    stats:  <Analytics   onGo={goTo}/>,
    budget: <Budgets     onGo={goTo}/>,
    cats:   <Categories  onGo={goTo}/>,
    me:     <Profile     onGo={goTo} onReset={reset}/>,
    loans:  <Loans       onGo={goTo}/>,
  };

  if (mounted && desktop) {
    return (
      <div className="desktop-shell">
        <DesktopSidebar current={screen} onGo={goTo} onAdd={openAdd}/>
        <div className="desktop-content">
          {loading ? <LoadingScreen/> : screens[screen]}
          {sheet && <AddSheet defaultKind={sheet} existing={editTx} onClose={closeSheet}/>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {loading ? <LoadingScreen/> : screens[screen]}
      {!loading && sheet && <AddSheet defaultKind={sheet} existing={editTx} onClose={closeSheet}/>}
      {mounted && createPortal(<TabBar current={screen} onGo={goTo}/>, document.body)}
    </div>
  );
}

export function GastosApp() {
  return (
    <StoreProvider>
      <AppInner/>
    </StoreProvider>
  );
}
