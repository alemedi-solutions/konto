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
