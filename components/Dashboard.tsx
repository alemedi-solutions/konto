'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { sumIncome, sumSpent, fmtAmt, monthKey } from '@/lib/helpers';
import { Avatar, HeroCard, Card, SectionTitle, TxRow } from './Shared';
import { TabBar } from './TabBar';

interface Props { onGo: (s: string) => void; onAdd: (k: string) => void; onOpenTx: (t: any) => void; }

function offsetDate(base: Date, months: number): Date {
  return new Date(base.getFullYear(), base.getMonth() + months, 1);
}

export function Dashboard({ onGo, onAdd, onOpenTx }: Props) {
  const { profile, gradMap, grad } = useStore();
  const [monthOffset, setMonthOffset] = useState(0);
  const viewDate = offsetDate(new Date(), monthOffset);
  const mk = monthKey(viewDate);
  const txs = useStore().useMonthTx(mk);
  const income = sumIncome(txs);
  const spent = sumSpent(txs);
  const balance = income - spent;
  const { int, cents } = fmtAmt(balance);
  const isCurrentMonth = monthOffset === 0;
  const monthName = viewDate.toLocaleDateString('es-ES', { month: 'long' });

  const actions = [
    { label: 'Añadir',  primary: true, action: () => onAdd('gasto'),    svg: <path d="M12 5v14M5 12h14" strokeLinecap="round"/> },
    { label: 'Ingreso',              action: () => onAdd('ingreso'),  svg: <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/> },
    { label: 'Stats',                action: () => onGo('stats'),    svg: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeLinecap="round"/> },
    { label: 'Presup.',              action: () => onGo('budget'),   svg: <><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3" strokeLinecap="round"/></> },
  ];

  return (
    <div className="screen">
      <div className="hdr">
        <img src="/konto.png" alt="Konto" style={{ height: 48, width: 48, borderRadius: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 4px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <button onClick={() => setMonthOffset(v => v - 1)}
            style={{ width: 30, height: 30, borderRadius: 999, background: 'transparent', border: 'none', color: 'var(--text-m)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ‹
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 4px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: isCurrentMonth ? 'var(--text-s)' : 'var(--text-m)', textTransform: 'capitalize', minWidth: 52, textAlign: 'center' }}>{monthName}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-f)' }}>{viewDate.getFullYear()}</span>
          </div>
          <button onClick={() => setMonthOffset(v => Math.min(v + 1, 0))}
            style={{ width: 30, height: 30, borderRadius: 999, background: 'transparent', border: 'none', color: monthOffset >= 0 ? 'var(--border-s)' : 'var(--text-m)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: monthOffset >= 0 ? 'default' : 'pointer' }}>
            ›
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onGo('me')}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 500 }}>Hola,</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{profile.name.split(' ')[0]}</div>
          </div>
          <Avatar initials={profile.initials}/>
        </div>
      </div>

      <div className="screen-body">
        <HeroCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="hero-label">
                <span className="hero-label-dot" style={{ background: 'color-mix(in srgb,var(--green) 60%,var(--surface2))' }}/>
                Balance disponible
              </div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--text-m)', marginTop: 4, textTransform: 'lowercase' }}>
                {monthName}
              </div>
            </div>
            <div className={`delta${balance < 0 ? ' neg' : ''}`}>
              {balance >= 0 ? '↑' : '↓'} {Math.abs(balance).toFixed(0)} €
            </div>
          </div>
          <div className="hero-amount">
            <span style={{ color: 'var(--text)' }}>{balance < 0 ? '−' : ''}{int}</span>
            <span style={{ color: 'var(--text-m)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>,{cents}</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-m)', marginBottom: 6, alignSelf: 'flex-end', marginLeft: 4 }}>€</span>
          </div>
          <div className="actions-grid">
            {actions.map(({ label, primary, action, svg }) => (
              <button key={label} className="action-btn" onClick={action}>
                <div className={`action-ico${primary ? ' primary' : ''}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    {svg}
                  </svg>
                </div>
                <span className="action-label">{label}</span>
              </button>
            ))}
          </div>
        </HeroCard>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <div className="stat-card">
            <div className="stat-tag green">↑ Ingresos</div>
            <div className="dn" style={{ fontSize: 22, fontWeight: 700, color: 'color-mix(in srgb,var(--green) 70%,var(--text-s))' }}>+{income.toFixed(0)} €</div>
          </div>
          <div className="stat-card">
            <div className="stat-tag red">↓ Gastos</div>
            <div className="dn" style={{ fontSize: 22, fontWeight: 700, color: 'color-mix(in srgb,var(--red) 70%,var(--text-s))' }}>−{spent.toFixed(0)} €</div>
          </div>
        </div>

        <SectionTitle title="Movimientos" action="Ver todo →" onAction={() => onGo('tx')}/>
        {txs.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontSize: 36 }}>✨</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6, color: 'var(--text)' }}>Sin movimientos</div>
            <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 4 }}>No hay registros en {monthName}</div>
          </Card>
        ) : (
          <Card style={{ padding: '4px 16px' }}>
            {txs.slice(0, 5).map((t, i, a) => (
              <TxRow key={t.id} tx={t} onClick={() => onOpenTx(t)} last={i === a.length - 1}/>
            ))}
          </Card>
        )}
      </div>

      <TabBar current="home" onGo={onGo}/>
    </div>
  );
}
