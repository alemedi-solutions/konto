'use client';

import { useState } from 'react';
import { StoreProvider, useStore } from '@/lib/store';
import type { Screen } from '@/lib/types';
import type { Transaction } from '@/lib/types';
import { Dashboard } from './Dashboard';
import { Transactions } from './Transactions';
import { Analytics } from './Analytics';
import { Budgets } from './Budgets';
import { Categories } from './Categories';
import { Profile } from './Profile';
import { AddSheet } from './AddSheet';

function AppInner() {
  const { darkMode, reset } = useStore();
  const [screen, setScreen] = useState<Screen>('home');
  const [sheet, setSheet] = useState<'gasto' | 'ingreso' | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

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
  };

  return (
    <div className={darkMode ? '' : 'light'} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {screens[screen]}
      {sheet && <AddSheet defaultKind={sheet} existing={editTx} onClose={closeSheet}/>}
    </div>
  );
}

export function GastosApp() {
  return (
    <div className="phone-outer">
      <div className="phone-frame">
        <div className="phone-notch"/>
        <StoreProvider>
          <AppInner/>
        </StoreProvider>
      </div>
    </div>
  );
}
