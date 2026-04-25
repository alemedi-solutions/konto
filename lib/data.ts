import type { Category, Transaction } from './types';

export const DEFAULT_CATS: Category[] = [
  { id: 'super', name: 'Supermercado', color: '#ff6b3d', ico: '🛒', kind: 'gasto', budget: 250 },
  { id: 'rest',  name: 'Restaurantes', color: '#ff9f0a', ico: '🍔', kind: 'gasto', budget: 120 },
  { id: 'home2', name: 'Hogar',        color: '#8b5cf6', ico: '🏠', kind: 'gasto', budget: 200 },
  { id: 'trans', name: 'Transporte',   color: '#0075eb', ico: '🚗', kind: 'gasto', budget: 150 },
  { id: 'ocio',  name: 'Ocio',         color: '#ff4d8f', ico: '🎬', kind: 'gasto', budget: 100 },
  { id: 'salud', name: 'Salud',        color: '#3ecf8e', ico: '💊', kind: 'gasto', budget: 80  },
  { id: 'subs',  name: 'Suscripciones',color: '#e50914', ico: '📺', kind: 'gasto', budget: 50  },
  { id: 'sal',   name: 'Salario',      color: '#3ecf8e', ico: '💼', kind: 'ingreso' },
  { id: 'free',  name: 'Freelance',    color: '#06b6d4', ico: '💻', kind: 'ingreso' },
  { id: 'othe',  name: 'Otros',        color: '#a3a3a3', ico: '💰', kind: 'ingreso' },
];

const nowIso = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const SEED_TX: Transaction[] = [
  { id: 't1',  name: 'Mercadona',      catId: 'super', date: nowIso(),    amt: -42.30 },
  { id: 't2',  name: 'Café Nómada',    catId: 'rest',  date: nowIso(),    amt: -2.80  },
  { id: 't3',  name: 'Nómina Abril',   catId: 'sal',   date: daysAgo(1), amt: 1860.00},
  { id: 't4',  name: 'Repsol',         catId: 'trans', date: daysAgo(1), amt: -55.00 },
  { id: 't5',  name: 'Netflix',        catId: 'subs',  date: daysAgo(2), amt: -12.99 },
  { id: 't6',  name: 'Iberdrola',      catId: 'home2', date: daysAgo(3), amt: -68.40 },
  { id: 't7',  name: 'Telepizza',      catId: 'rest',  date: daysAgo(4), amt: -18.50 },
  { id: 't8',  name: 'BasicFit',       catId: 'salud', date: daysAgo(5), amt: -29.90 },
  { id: 't9',  name: 'Freelance web',  catId: 'free',  date: daysAgo(6), amt: 350.00 },
  { id: 't10', name: 'Carrefour',      catId: 'super', date: daysAgo(7), amt: -61.20 },
];

export const GRAD_MAP: Record<string, string> = {
  violet: '#a78bfa',
  sunset: '#fb923c',
  ocean:  '#38bdf8',
  mint:   '#34d399',
};

export const PALETTE = [
  '#ff6b3d','#ff9f0a','#fbbf24','#22d3a5','#3ecf8e','#06b6d4',
  '#0075eb','#60a5fa','#a78bfa','#8b5cf6','#c084e8','#f472b6',
  '#ff4d8f','#ff5a6e','#e50914','#a3a3a3','#94a3b8','#64748b',
];

export const EMOJIS = [
  '🛒','🍔','🍕','☕','🚗','🚌','✈️','🏠','💡','🛁',
  '🎬','🎮','🎵','💊','🏋️','🐾','📚','👗','🛍','💄',
  '💰','💼','💻','📱','🎓','🎁','✨','💸','🏦','📺','⚡','🌿',
];
