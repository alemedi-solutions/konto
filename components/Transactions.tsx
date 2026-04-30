'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/helpers';
import type { Transaction } from '@/lib/types';
import { HdrBtn, Card, TxRow } from './Shared';
import { TabBar } from './TabBar';

interface Props { onGo: (s: string) => void; onAdd: (k: string) => void; onOpenTx: (t: Transaction) => void; }

export function Transactions({ onGo, onAdd, onOpenTx }: Props) {
  const { cats, tx: allTx } = useStore();
  const txs = [...allTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [filter, setFilter] = useState<'todos' | 'ingresos' | 'gastos'>('todos');
  const [catFilter, setCatFilter] = useState('all');
  const [q, setQ] = useState('');

  const filtered = txs.filter(t => {
    if (filter === 'gastos' && t.amt >= 0) return false;
    if (filter === 'ingresos' && t.amt <= 0) return false;
    if (catFilter !== 'all' && t.catId !== catFilter) return false;
    if (q && !(t.name ?? '').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const groups: Record<string, Transaction[]> = {};
  filtered.forEach(t => { const k = new Date(t.date).toDateString(); (groups[k] ??= []).push(t); });

  return (
    <div className="screen">
      <div className="hdr">
        <HdrBtn onClick={() => onGo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </HdrBtn>
        <div className="dn" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Movimientos</div>
        <HdrBtn onClick={() => onAdd('gasto')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
        </HdrBtn>
      </div>
      <div className="screen-body">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, marginBottom: 12 }}/>
        <div className="pill-group" style={{ marginBottom: 12 }}>
          {([['todos','Todos'],['ingresos','Ingresos'],['gastos','Gastos']] as const).map(([k, l]) => (
            <button key={k} className={`pill${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <div className="chip-row">
          <span className={`chip${catFilter === 'all' ? ' active' : ''}`} onClick={() => setCatFilter('all')}>Todas</span>
          {cats.filter(c => c.kind === 'gasto').map(c => (
            <span key={c.id} className={`chip${catFilter === c.id ? ' active' : ''}`}
              style={catFilter === c.id ? { background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color } : {}}
              onClick={() => setCatFilter(c.id)}>
              {c.ico} {c.name}
            </span>
          ))}
        </div>
        {Object.keys(groups).length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '28px 16px', marginTop: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--text-m)' }}>Sin resultados</div>
          </Card>
        ) : Object.entries(groups).map(([day, arr]) => {
          const lbl = formatDate(arr[0].date);
          const dayLabel = lbl.startsWith('Hoy') ? 'Hoy' : lbl === 'Ayer' ? 'Ayer'
            : new Date(day).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
          return (
            <div key={day}>
              <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '14px 4px 4px' }}>{dayLabel}</div>
              <Card style={{ padding: '4px 16px' }}>
                {arr.map((t, i) => <TxRow key={t.id} tx={t} onClick={() => onOpenTx(t)} last={i === arr.length - 1}/>)}
              </Card>
            </div>
          );
        })}
      </div>
      <TabBar current="tx" onGo={onGo}/>
    </div>
  );
}
