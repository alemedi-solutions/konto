'use client';

import {
  createContext, useContext, useMemo, useState, useEffect,
  type ReactNode,
} from 'react';
import type { Category, Transaction, GradientKey, Loan } from './types';
import { DEFAULT_CATS, SEED_TX, SEED_LOANS, GRAD_MAP } from './data';
import { monthKey } from './helpers';
import { supabase } from './supabase';

// ── DB row types ────────────────────────────────────────────
type TxRow = {
  id: string; name: string; cat_id: string;
  amt: number; date: string; recurring: boolean | null;
};
type LoanRow = {
  id: string; name: string; ico: string; color: string;
  total_amount: number; monthly_payment: number;
  start_date: string; total_months: number;
};

// ── Mappers ─────────────────────────────────────────────────
const rowToTx = (r: TxRow): Transaction => ({
  id: r.id, name: r.name, catId: r.cat_id,
  amt: r.amt, date: r.date, recurring: r.recurring ?? undefined,
});
const txToRow = (t: Transaction) => ({
  id: t.id, name: t.name, cat_id: t.catId,
  amt: t.amt, date: t.date, recurring: t.recurring ?? false,
});
const txPatch = (p: Partial<Transaction>): Record<string, unknown> => {
  const row: Record<string, unknown> = {};
  if ('name'      in p) row.name      = p.name;
  if ('catId'     in p) row.cat_id    = p.catId;
  if ('amt'       in p) row.amt       = p.amt;
  if ('date'      in p) row.date      = p.date;
  if ('recurring' in p) row.recurring = p.recurring ?? false;
  return row;
};

const rowToLoan = (r: LoanRow): Loan => ({
  id: r.id, name: r.name, ico: r.ico, color: r.color,
  totalAmount: r.total_amount, monthlyPayment: r.monthly_payment,
  startDate: r.start_date, totalMonths: r.total_months,
});
const loanToRow = (l: Loan) => ({
  id: l.id, name: l.name, ico: l.ico, color: l.color,
  total_amount: l.totalAmount, monthly_payment: l.monthlyPayment,
  start_date: l.startDate, total_months: l.totalMonths,
});
const loanPatch = (p: Partial<Loan>): Record<string, unknown> => {
  const row: Record<string, unknown> = {};
  if ('name'           in p) row.name            = p.name;
  if ('ico'            in p) row.ico             = p.ico;
  if ('color'          in p) row.color           = p.color;
  if ('totalAmount'    in p) row.total_amount    = p.totalAmount;
  if ('monthlyPayment' in p) row.monthly_payment = p.monthlyPayment;
  if ('startDate'      in p) row.start_date      = p.startDate;
  if ('totalMonths'    in p) row.total_months    = p.totalMonths;
  return row;
};

// ── Store interface ─────────────────────────────────────────
interface StoreValue {
  cats: Category[];
  tx: Transaction[];
  loans: Loan[];
  loading: boolean;
  profile: { name: string; email: string; initials: string };
  darkMode: boolean;
  grad: GradientKey;
  gradMap: Record<string, string>;
  getCat: (id: string) => Category;
  addTx:    (t: Omit<Transaction, 'id'>) => Promise<void>;
  updateTx: (id: string, patch: Partial<Transaction>) => Promise<void>;
  deleteTx: (id: string) => Promise<void>;
  addCat:    (c: Omit<Category, 'id'>) => Promise<void>;
  updateCat: (id: string, patch: Partial<Category>) => Promise<void>;
  deleteCat: (id: string) => Promise<void>;
  addLoan:    (l: Omit<Loan, 'id'>) => Promise<void>;
  updateLoan: (id: string, patch: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  reset: () => Promise<void>;
  toggleDark: () => void;
  setGrad: (g: GradientKey) => void;
  useMonthTx: (mk?: string) => Transaction[];
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cats,    setCats]    = useState<Category[]>([]);
  const [tx,      setTx]      = useState<Transaction[]>([]);
  const [loans,   setLoans]   = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [grad, setGradState]   = useState<GradientKey>('slate');

  const profile = {
    name: 'Alejandro Mediavilla',
    email: 'alejandromediavilla@ebroker.es',
    initials: 'AM',
  };

  // Preferencias del tema desde localStorage
  useEffect(() => {
    const dm = localStorage.getItem('darkMode');
    if (dm !== null) setDarkMode(dm === 'true');
    const g = localStorage.getItem('grad') as GradientKey | null;
    if (g && GRAD_MAP[g]) setGradState(g);
  }, []);

  // Carga inicial desde Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [catsRes, txRes, loansRes] = await Promise.all([
        supabase.from('categories').select('*').order('created_at'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('loans').select('*').order('created_at'),
      ]);

      // Primera ejecución: insertar categorías por defecto
      if (!catsRes.error && (!catsRes.data || catsRes.data.length === 0)) {
        const { data } = await supabase.from('categories').insert(DEFAULT_CATS).select();
        setCats((data as Category[]) ?? DEFAULT_CATS);
      } else if (catsRes.data) {
        setCats(catsRes.data as Category[]);
      }

      if (txRes.data)    setTx(txRes.data.map(r => rowToTx(r as TxRow)));
      if (loansRes.data) setLoans(loansRes.data.map(r => rowToLoan(r as LoanRow)));

      setLoading(false);
    }
    load();
  }, []);

  // Transacciones recurrentes (se ejecuta una vez tras la carga)
  useEffect(() => {
    if (loading) return;
    const currentMk = monthKey(new Date());
    const toAdd: Transaction[] = [];
    const recurringFromPast = tx.filter(t => t.recurring && monthKey(t.date) !== currentMk);

    for (const t of recurringFromPast) {
      const exists = tx.some(
        x => x.name === t.name && x.catId === t.catId && x.amt === t.amt && monthKey(x.date) === currentMk
      );
      if (!exists) {
        const day = Math.min(
          new Date(t.date).getDate(),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        );
        const newDate = new Date(new Date().getFullYear(), new Date().getMonth(), day, 12, 0, 0).toISOString();
        toAdd.push({ ...t, id: `rec-${t.id}-${currentMk}`, date: newDate });
      }
    }

    if (toAdd.length > 0) {
      setTx(prev => [...toAdd, ...prev]);
      supabase.from('transactions').insert(toAdd.map(txToRow));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const api = useMemo<StoreValue>(() => ({
    cats, tx, loans, loading, profile, darkMode, grad,
    gradMap: GRAD_MAP,

    getCat: (id) =>
      cats.find(c => c.id === id) ??
      { id: '', name: 'Sin categoría', color: '#a3a3a3', ico: '❓', kind: 'gasto' },

    // ── Transacciones ──
    addTx: async (t) => {
      const n: Transaction = { ...t, id: 't' + Date.now() };
      setTx(p => [n, ...p]);
      await supabase.from('transactions').insert(txToRow(n));
    },
    updateTx: async (id, patch) => {
      setTx(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
      await supabase.from('transactions').update(txPatch(patch)).eq('id', id);
    },
    deleteTx: async (id) => {
      setTx(p => p.filter(t => t.id !== id));
      await supabase.from('transactions').delete().eq('id', id);
    },

    // ── Categorías ──
    addCat: async (c) => {
      const n: Category = { ...c, id: 'c' + Date.now() };
      setCats(p => [...p, n]);
      await supabase.from('categories').insert(n);
    },
    updateCat: async (id, patch) => {
      setCats(p => p.map(c => c.id === id ? { ...c, ...patch } : c));
      await supabase.from('categories').update(patch).eq('id', id);
    },
    deleteCat: async (id) => {
      setCats(p => p.filter(c => c.id !== id));
      await supabase.from('categories').delete().eq('id', id);
    },

    // ── Préstamos ──
    addLoan: async (l) => {
      const n: Loan = { ...l, id: 'ln' + Date.now() };
      setLoans(p => [...p, n]);
      await supabase.from('loans').insert(loanToRow(n));
    },
    updateLoan: async (id, patch) => {
      setLoans(p => p.map(l => l.id === id ? { ...l, ...patch } : l));
      await supabase.from('loans').update(loanPatch(patch)).eq('id', id);
    },
    deleteLoan: async (id) => {
      setLoans(p => p.filter(l => l.id !== id));
      await supabase.from('loans').delete().eq('id', id);
    },

    // ── Reset ──
    reset: async () => {
      await Promise.all([
        supabase.from('transactions').delete().not('id', 'is', null),
        supabase.from('loans').delete().not('id', 'is', null),
        supabase.from('categories').delete().not('id', 'is', null),
      ]);
      const { data: catsData } = await supabase.from('categories').insert(DEFAULT_CATS).select();
      setCats((catsData as Category[]) ?? DEFAULT_CATS);
      const { data: txData } = await supabase.from('transactions').insert(SEED_TX.map(txToRow)).select();
      setTx(txData ? (txData as TxRow[]).map(rowToTx) : SEED_TX);
      const { data: lnData } = await supabase.from('loans').insert(SEED_LOANS.map(loanToRow)).select();
      setLoans(lnData ? (lnData as LoanRow[]).map(rowToLoan) : SEED_LOANS);
    },

    // ── Tema ──
    toggleDark: () => setDarkMode(v => {
      const next = !v;
      localStorage.setItem('darkMode', String(next));
      return next;
    }),
    setGrad: (g) => {
      setGradState(g);
      localStorage.setItem('grad', g);
    },

    useMonthTx: (mk = monthKey(new Date())) =>
      tx
        .filter(t => monthKey(t.date) === mk)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

  }), [cats, tx, loans, loading, darkMode, grad]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
