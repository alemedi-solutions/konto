'use client';

import { useState, useEffect } from 'react';
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

  // Aplica el tema al elemento html para que el fondo cubra toda la pantalla (incluido safe area)
  useEffect(() => {
    document.documentElement.className = darkMode ? '' : 'light';
  }, [darkMode]);

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
    <div className={darkMode ? '' : 'light'} style={{ width: '100%', height: '100%', position: 'relative', ['--grad' as string]: gradMap[grad] }}>
      {loading ? <LoadingScreen/> : screens[screen]}
      {!loading && sheet && <AddSheet defaultKind={sheet} existing={editTx} onClose={closeSheet}/>}
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
