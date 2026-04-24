'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useStore } from '@/lib/store';
import type { Transaction } from '@/lib/types';
import { formatDate, fmtAmt } from '@/lib/helpers';

// ─── STATUS BAR ──────────────────────────────────────────────────────────────

export function StatusBar() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    setTime(fmt());
    const i = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="status-bar">
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center', color: 'var(--text-m)' }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="6" width="3" height="4" rx="0.5"/>
          <rect x="4" y="4" width="3" height="6" rx="0.5"/>
          <rect x="8" y="2" width="3" height="8" rx="0.5"/>
          <rect x="12" y="0" width="3" height="10" rx="0.5"/>
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="0.5" y="0.5" width="19" height="9" rx="2"/>
          <rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor"/>
        </svg>
      </span>
    </div>
  );
}

// ─── HDR BTN ─────────────────────────────────────────────────────────────────

export function HdrBtn({ onClick, children, style: s = {} }: { onClick?: () => void; children: ReactNode; style?: CSSProperties }) {
  return (
    <button className="hdr-btn" onClick={onClick} style={s}>
      {children}
    </button>
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────

export function Avatar({ initials, size = 40, fontSize = 14 }: { initials: string; size?: number; fontSize?: number }) {
  const { gradMap, grad } = useStore();
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize, background: gradMap[grad] }}>
      {initials}
    </div>
  );
}

// ─── CARD ────────────────────────────────────────────────────────────────────

export function Card({ children, style: s = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="card" style={s}>{children}</div>;
}

// ─── HERO CARD ───────────────────────────────────────────────────────────────

export function HeroCard({ children, style: s = {} }: { children: ReactNode; style?: CSSProperties }) {
  const { darkMode } = useStore();
  return (
    <div className={`hero-card ${darkMode ? 'hero-card-dark' : 'hero-card-light'}`} style={s}>
      {children}
    </div>
  );
}

// ─── SECTION TITLE ───────────────────────────────────────────────────────────

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="sec-title">
      <h3>{title}</h3>
      {action && <span className="sec-link" onClick={onAction}>{action}</span>}
    </div>
  );
}

// ─── PROGRESS ────────────────────────────────────────────────────────────────

export function Progress({ pct, color, height = 6 }: { pct: number; color?: string; height?: number }) {
  return (
    <div className="progress" style={{ height }}>
      <span className="progress-bar" style={{ width: `${pct}%`, background: color ?? 'var(--grad)' }} />
    </div>
  );
}

// ─── HOME INDICATOR ──────────────────────────────────────────────────────────

export function HomeIndicator() {
  const { darkMode } = useStore();
  return (
    <div className="home-ind" style={{ background: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)' }} />
  );
}

// ─── TX ROW ──────────────────────────────────────────────────────────────────

export function TxRow({ tx, onClick, last }: { tx: Transaction; onClick: () => void; last: boolean }) {
  const { getCat } = useStore();
  const c = getCat(tx.catId);
  const { int, cents, sign } = fmtAmt(tx.amt);
  return (
    <div className="tx-row" onClick={onClick}
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <div className="tx-ico" style={{ background: c.color }}>{c.ico}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
          {tx.name || c.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 2 }}>
          {c.name} · {formatDate(tx.date)}
        </div>
      </div>
      <div className="dn" style={{ fontSize: 15, fontWeight: 700, color: tx.amt > 0 ? 'var(--green)' : 'var(--text)', whiteSpace: 'nowrap' }}>
        {sign}€{int},{cents}
      </div>
    </div>
  );
}
