'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Loan } from '@/lib/types';
import { PALETTE, EMOJIS } from '@/lib/data';
import { HdrBtn, HeroCard, Card, SectionTitle } from './Shared';
import { TabBar } from './TabBar';

const fmt = (n: number) => Math.round(n).toLocaleString('es-ES');

function monthsElapsed(startDate: string): number {
  const s = new Date(startDate);
  const now = new Date();
  return Math.max(0, (now.getFullYear() - s.getFullYear()) * 12 + (now.getMonth() - s.getMonth()));
}

function loanStats(loan: Loan) {
  const elapsed = Math.min(monthsElapsed(loan.startDate), loan.totalMonths);
  const paid = elapsed * loan.monthlyPayment;
  const remaining = Math.max(0, loan.totalAmount - paid);
  const monthsLeft = Math.max(0, loan.totalMonths - elapsed);
  const pct = Math.min(100, loan.totalAmount > 0 ? (paid / loan.totalAmount) * 100 : 0);
  const end = new Date(loan.startDate);
  end.setMonth(end.getMonth() + loan.totalMonths);
  return { paid, remaining, monthsLeft, pct, endDate: end };
}

function LoanCard({ loan, onEdit }: { loan: Loan; onEdit: () => void }) {
  const { paid, remaining, monthsLeft, pct, endDate } = loanStats(loan);
  const endStr = endDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  const years = Math.floor(monthsLeft / 12);
  const mos = monthsLeft % 12;
  const timeLeft = monthsLeft === 0 ? '¡Pagado!' : years > 0 ? `${years}a ${mos}m` : `${mos} meses`;

  return (
    <div className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={onEdit}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: `${loan.color}22`, border: `1px solid ${loan.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
          {loan.ico}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>{loan.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 2 }}>
            {fmt(loan.monthlyPayment)} €/mes · {loan.totalMonths} meses
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="dn" style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            {fmt(remaining)} €
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-m)', marginTop: 1 }}>pendiente</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: 'var(--text-m)' }}>{fmt(paid)} € pagado</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: `color-mix(in srgb,${loan.color} 70%,var(--text-s))` }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <div className="progress" style={{ height: 8, borderRadius: 999 }}>
          <span className="progress-bar" style={{
            width: `${pct}%`,
            background: `color-mix(in srgb,${loan.color} 65%,transparent)`,
            borderRadius: 999,
          }}/>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-f)', marginTop: 5, textAlign: 'right' }}>
          de {fmt(loan.totalAmount)} € totales
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: 12, gap: 0 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>{timeLeft}</div>
          <div style={{ fontSize: 10, color: 'var(--text-m)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>restante</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }}/>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="dn" style={{ fontSize: 14, fontWeight: 700, color: `color-mix(in srgb,var(--red) 70%,var(--text-s))`, letterSpacing: '-0.3px' }}>
            {fmt(loan.monthlyPayment)} €
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-m)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>cuota</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }}/>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>{endStr}</div>
          <div style={{ fontSize: 10, color: 'var(--text-m)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>fin est.</div>
        </div>
      </div>
    </div>
  );
}

function LoanSheet({ loan, onClose, onSave, onDelete }: {
  loan: Loan | null;
  onClose: () => void;
  onSave: (data: Omit<Loan, 'id'>) => void;
  onDelete: () => void;
}) {
  const isNew = !loan;
  const [name, setName] = useState(loan?.name ?? '');
  const [ico, setIco] = useState(loan?.ico ?? '🏦');
  const [color, setColor] = useState(loan?.color ?? '#60a5fa');
  const [totalAmount, setTotalAmount] = useState(loan?.totalAmount ? String(loan.totalAmount) : '');
  const [monthlyPayment, setMonthlyPayment] = useState(loan?.monthlyPayment ? String(loan.monthlyPayment) : '');
  const [startDate, setStartDate] = useState(loan?.startDate ?? new Date().toISOString().slice(0, 10));
  const [totalMonths, setTotalMonths] = useState(loan?.totalMonths ? String(loan.totalMonths) : '');

  const rowStyle = { padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const inputRight = { background: 'transparent', border: 'none', color: 'var(--text)' as const, fontSize: 15, fontWeight: 600, textAlign: 'right' as const, width: 130, fontFamily: 'Inter, sans-serif' };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ paddingBottom: 40 }}>
        <div className="sheet-grip"/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <HdrBtn onClick={onClose} style={{ background: 'var(--surface2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/></svg>
          </HdrBtn>
          <div className="dn" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {isNew ? 'Nuevo préstamo' : 'Editar préstamo'}
          </div>
          {!isNew ? (
            <HdrBtn onClick={onDelete} style={{ background: 'var(--surface2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </HdrBtn>
          ) : <div style={{ width: 40 }}/>}
        </div>

        {/* Preview + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 58, height: 58, borderRadius: 18, background: `${color}22`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {ico}
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del préstamo"
            style={{ flex: 1, padding: '11px 14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 15, fontWeight: 600 }}/>
        </div>

        {/* Color */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Color</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '3px 0' }}>
            {PALETTE.map(c => (
              <div key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: 999, background: c, cursor: 'pointer', flexShrink: 0, border: `2.5px solid ${color === c ? '#fff' : 'transparent'}`, boxShadow: color === c ? `0 0 0 1px ${c}` : 'none', transition: 'all .15s' }}/>
            ))}
          </div>
        </div>

        {/* Emoji */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Icono</div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '3px 0' }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setIco(e)} style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: ico === e ? `${color}20` : 'var(--surface2)', border: `1px solid ${ico === e ? `${color}40` : 'var(--border)'}`, fontSize: 18, cursor: 'pointer', transition: 'all .15s' }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Campos agrupados */}
        <div style={{ borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 18, background: 'var(--surface2)' }}>
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 500 }}>Importe total</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" inputMode="decimal" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0" style={inputRight}/>
              <span style={{ fontSize: 13, color: 'var(--text-m)' }}>€</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }}/>
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 500 }}>Cuota mensual</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" inputMode="decimal" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="0" style={inputRight}/>
              <span style={{ fontSize: 13, color: 'var(--text-m)' }}>€</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }}/>
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 500 }}>Fecha inicio</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, colorScheme: 'light dark' }}/>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '0 14px' }}/>
          <div style={rowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 500 }}>Duración</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="number" inputMode="numeric" value={totalMonths} onChange={e => setTotalMonths(e.target.value)} placeholder="0" style={inputRight}/>
              <span style={{ fontSize: 13, color: 'var(--text-m)' }}>meses</span>
            </div>
          </div>
        </div>

        <button className="btn-primary"
          style={{ background: `${color}20`, borderColor: `${color}40`, color: color }}
          onClick={() => {
            if (!name || !totalAmount || !monthlyPayment || !totalMonths) return;
            onSave({ name, ico, color, totalAmount: Number(totalAmount), monthlyPayment: Number(monthlyPayment), startDate, totalMonths: Number(totalMonths) });
          }}>
          {isNew ? 'Añadir préstamo' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

export function Loans({ onGo }: { onGo: (s: string) => void }) {
  const { loans, addLoan, updateLoan, deleteLoan } = useStore();
  const [sheet, setSheet] = useState(false);
  const [editLoan, setEditLoan] = useState<Loan | null>(null);

  const stats = loans.map(l => ({ ...l, ...loanStats(l) }));
  const totalRemaining = stats.reduce((s, l) => s + l.remaining, 0);
  const totalMonthly   = stats.reduce((s, l) => s + l.monthlyPayment, 0);
  const totalPaid      = stats.reduce((s, l) => s + l.paid, 0);
  const totalAmount    = stats.reduce((s, l) => s + l.totalAmount, 0);
  const overallPct     = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const remInt   = fmt(Math.floor(totalRemaining));
  const remCents = String(Math.round((totalRemaining % 1) * 100)).padStart(2, '0');

  const openEdit = (loan: Loan) => { setEditLoan(loan); setSheet(true); };
  const openNew  = () => { setEditLoan(null); setSheet(true); };

  return (
    <div className="screen">
      <div className="hdr">
        <HdrBtn onClick={() => onGo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </HdrBtn>
        <div className="dn" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Préstamos</div>
        <HdrBtn onClick={openNew}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
        </HdrBtn>
      </div>

      <div className="screen-body">
        <HeroCard>
          <div className="hero-label">
            <span className="hero-label-dot" style={{ background: 'color-mix(in srgb,var(--red) 60%,var(--surface2))' }}/>
            Deuda pendiente total
          </div>
          <div className="hero-amount">
            <span style={{ color: 'var(--text)' }}>{remInt}</span>
            <span style={{ color: 'var(--text-m)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>,{remCents}</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-m)', marginBottom: 6, alignSelf: 'flex-end', marginLeft: 4 }}>€</span>
          </div>

          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-m)', marginBottom: 6 }}>
              <span>{fmt(totalPaid)} € pagado</span>
              <span>{overallPct.toFixed(0)}% del total</span>
            </div>
            <div className="progress" style={{ height: 6 }}>
              <span className="progress-bar" style={{ width: `${overallPct}%`, background: 'color-mix(in srgb,var(--grad) 65%,transparent)' }}/>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div className="dn" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{loans.length}</div>
              <div style={{ fontSize: 10, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 0.8 }}>préstamos</div>
            </div>
            <div>
              <div className="dn" style={{ fontSize: 17, fontWeight: 700, color: 'color-mix(in srgb,var(--red) 70%,var(--text-s))' }}>{fmt(totalMonthly)} €</div>
              <div style={{ fontSize: 10, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 0.8 }}>cuota/mes</div>
            </div>
            <div>
              <div className="dn" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{fmt(totalAmount)} €</div>
              <div style={{ fontSize: 10, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 0.8 }}>importe total</div>
            </div>
          </div>
        </HeroCard>

        {loans.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '32px 16px', marginTop: 12 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Sin préstamos</div>
            <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 4 }}>Toca + para añadir uno</div>
          </Card>
        ) : (
          <>
            <SectionTitle title="Mis préstamos"/>
            {loans.map(loan => <LoanCard key={loan.id} loan={loan} onEdit={() => openEdit(loan)}/>)}
          </>
        )}
      </div>

      <TabBar current="loans" onGo={onGo}/>

      {sheet && (
        <LoanSheet
          loan={editLoan}
          onClose={() => { setSheet(false); setEditLoan(null); }}
          onSave={data => {
            editLoan ? updateLoan(editLoan.id, data) : addLoan(data);
            setSheet(false); setEditLoan(null);
          }}
          onDelete={() => {
            if (editLoan) deleteLoan(editLoan.id);
            setSheet(false); setEditLoan(null);
          }}
        />
      )}
    </div>
  );
}
