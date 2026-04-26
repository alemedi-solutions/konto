'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { sumSpent, fmtAmt } from '@/lib/helpers';
import { HdrBtn, HeroCard, Card, SectionTitle, Progress, CatIcon } from './Shared';
import { TabBar } from './TabBar';

export function Budgets({ onGo }: { onGo: (s: string) => void }) {
  const { cats, updateCat } = useStore();
  const txs = useStore().useMonthTx();
  const spentByCat: Record<string, number> = {};
  txs.filter(t => t.amt < 0).forEach(t => { spentByCat[t.catId] = (spentByCat[t.catId] ?? 0) + Math.abs(t.amt); });
  const budgetCats = cats.filter(c => c.kind === 'gasto' && (c.budget ?? 0) > 0);
  const totalBudget = budgetCats.reduce((s, c) => s + (c.budget ?? 0), 0);
  const totalSpent = budgetCats.reduce((s, c) => s + (spentByCat[c.id] ?? 0), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const pctTotal = Math.min(100, (totalSpent / (totalBudget || 1)) * 100);
  const { int, cents } = fmtAmt(remaining);
  const [editing, setEditing] = useState<string | null>(null);
  const [val, setVal] = useState('');

  return (
    <div className="screen">
      <div className="hdr">
        <HdrBtn onClick={() => onGo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </HdrBtn>
        <div className="dn" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Presupuestos</div>
        <div style={{ width: 40 }}/>
      </div>
      <div className="screen-body">
        <HeroCard style={{ textAlign: 'center' }}>
          <div className="hero-label" style={{ justifyContent: 'center' }}>
            <span className="hero-label-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 10px color-mix(in srgb, var(--grad) 60%, transparent)' }}/>
            Te queda
          </div>
          <div className="hero-amount" style={{ justifyContent: 'center' }}>
            <span style={{ color: 'var(--text)' }}>{int}</span>
            <span style={{ color: 'var(--text-m)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>,{cents}</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-m)', marginBottom: 6, alignSelf: 'flex-end', marginLeft: 4 }}>€</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 6 }}>De {totalBudget} € · {Math.round(pctTotal)}% usado</div>
          <div style={{ marginTop: 14 }}><Progress pct={pctTotal} height={10}/></div>
        </HeroCard>

        <SectionTitle title="Por categoría"/>
        {budgetCats.map(c => {
          const used = spentByCat[c.id] ?? 0;
          const pct = Math.min(100, (used / (c.budget ?? 1)) * 100);
          const over = used > (c.budget ?? 0);
          return (
            <Card key={c.id} style={{ marginBottom: 10, cursor: 'pointer' }}
              onClick={() => { setEditing(c.id); setVal(String(c.budget ?? '')); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CatIcon ico={c.ico} logo={c.logo} color={c.color} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                    <span className="dn" style={{ fontSize: 13, fontWeight: 700, color: over ? 'var(--red)' : 'var(--text)' }}>{used.toFixed(0)} € / {c.budget} €</span>
                  </div>
                  <Progress pct={pct} color={over ? 'var(--red)' : c.color}/>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <TabBar current="budget" onGo={onGo}/>

      {editing && (
        <div className="sheet-backdrop" onClick={() => setEditing(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-grip"/>
            <div className="dn" style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: 'var(--text)' }}>
              Presupuesto · {cats.find(x => x.id === editing)?.name}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div className="dn" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--text)' }}>
                {val || '0'}<span style={{ color: 'var(--text-m)', fontWeight: 500, marginLeft: 4 }}>€</span>
              </div>
            </div>
            <input type="number" inputMode="decimal" value={val} onChange={e => setVal(e.target.value)}
              style={{ width: '100%', padding: 14, borderRadius: 14, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 16, marginBottom: 12 }}/>
            <button className="btn-primary"
              style={{ background: 'color-mix(in srgb,var(--grad) 13%,transparent)', borderColor: 'color-mix(in srgb,var(--grad) 28%,transparent)', color: 'var(--grad)' }}
              onClick={() => { updateCat(editing, { budget: Number(val) || 0 }); setEditing(null); }}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
