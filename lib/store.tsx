'use client';

import {
  createContext, useContext, useMemo, useState, useEffect,
  type ReactNode,
} from 'react';
import type { Category, Transaction, GradientKey, Loan } from './types';
import { DEFAULT_CATS, SEED_TX, SEED_LOANS, GRAD_MAP } from './data';
import { monthKey } from './helpers';

interface StoreValue {
  cats: Category[];
  tx: Transaction[];
  loans: Loan[];
  profile: { name: string; email: string; initials: string };
  darkMode: boolean;
  grad: GradientKey;
  gradMap: Record<string, string>;
  getCat: (id: string) => Category;
  addTx: (t: Omit<Transaction, 'id'>) => void;
  updateTx: (id: string, patch: Partial<Transaction>) => void;
  deleteTx: (id: string) => void;
  addCat: (c: Omit<Category, 'id'>) => void;
  updateCat: (id: string, patch: Partial<Category>) => void;
  deleteCat: (id: string) => void;
  addLoan: (l: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, patch: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  reset: () => void;
  toggleDark: () => void;
  setGrad: (g: GradientKey) => void;
  useMonthTx: (mk?: string) => Transaction[];
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cats, setCats] = useState<Category[]>(DEFAULT_CATS);
  const [tx, setTx] = useState<Transaction[]>(SEED_TX);
  const [loans, setLoans] = useState<Loan[]>(SEED_LOANS);
  const profile = { name: 'Alejandro Mediavilla', email: 'alejandromediavilla@ebroker.es', initials: 'AM' };
  const [darkMode, setDarkMode] = useState(false);
  const [grad, setGradState] = useState<GradientKey>('slate');

  useEffect(() => {
    const currentMk = monthKey(new Date());
    setTx(prev => {
      const toAdd: Transaction[] = [];
      const recurringFromPast = prev.filter(t => t.recurring && monthKey(t.date) !== currentMk);
      for (const t of recurringFromPast) {
        const exists = prev.some(x => x.name === t.name && x.catId === t.catId && x.amt === t.amt && monthKey(x.date) === currentMk);
        if (!exists) {
          const day = Math.min(new Date(t.date).getDate(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());
          const newDate = new Date(new Date().getFullYear(), new Date().getMonth(), day, 12, 0, 0).toISOString();
          toAdd.push({ ...t, id: `rec-${t.id}-${currentMk}`, date: newDate });
        }
      }
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, []);

  const api = useMemo<StoreValue>(() => ({
    cats, tx, loans, profile, darkMode, grad,
    gradMap: GRAD_MAP,
    getCat: (id) => cats.find(c => c.id === id) ?? { id: '', name: 'Sin categoría', color: '#a3a3a3', ico: '❓', kind: 'gasto' },
    addTx:    (t)         => setTx(p => [{ ...t, id: 't' + Date.now() }, ...p]),
    updateTx: (id, patch) => setTx(p => p.map(t => t.id === id ? { ...t, ...patch } : t)),
    deleteTx: (id)        => setTx(p => p.filter(t => t.id !== id)),
    addCat:    (c)         => setCats(p => [...p, { ...c, id: 'c' + Date.now() }]),
    updateCat: (id, patch) => setCats(p => p.map(c => c.id === id ? { ...c, ...patch } : c)),
    deleteCat: (id)        => setCats(p => p.filter(c => c.id !== id)),
    addLoan:    (l)         => setLoans(p => [...p, { ...l, id: 'ln' + Date.now() }]),
    updateLoan: (id, patch) => setLoans(p => p.map(l => l.id === id ? { ...l, ...patch } : l)),
    deleteLoan: (id)        => setLoans(p => p.filter(l => l.id !== id)),
    reset:      () => { setCats(DEFAULT_CATS); setTx(SEED_TX); setLoans(SEED_LOANS); },
    toggleDark: () => setDarkMode(v => !v),
    setGrad:    (g) => setGradState(g),
    useMonthTx: (mk = monthKey(new Date())) =>
      tx.filter(t => monthKey(t.date) === mk).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }), [cats, tx, loans, darkMode, grad]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
