'use client';

import React, { useState, useRef, type CSSProperties, type ReactNode } from 'react';
import { useStore } from '@/lib/store';
import type { Transaction } from '@/lib/types';
import { formatDate, fmtAmt } from '@/lib/helpers';

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

export function Card({ children, style: s = {}, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="card" style={s} {...rest}>{children}</div>;
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

// ─── TX ROW ──────────────────────────────────────────────────────────────────

const SNAP = 72;

export function TxRow({ tx, onClick, last }: { tx: Transaction; onClick: () => void; last: boolean }) {
  const { getCat, deleteTx } = useStore();
  const c = getCat(tx.catId);
  const { int, cents, sign } = fmtAmt(tx.amt);
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = startX.current - e.touches[0].clientX;
    setOffset(Math.max(0, Math.min(dx, SNAP)));
  };
  const onTouchEnd = () => setOffset(v => v > SNAP / 2 ? SNAP : 0);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: SNAP, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => deleteTx(tx.id)}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="tx-row"
        style={{ transform: `translateX(-${offset}px)`, transition: offset === 0 || offset === SNAP ? 'transform 0.2s ease' : 'none', background: 'var(--surface)' }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onClick={offset > 0 ? () => setOffset(0) : onClick}>
        <div className="tx-ico" style={{ background: c.color }}>{c.ico}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
            {tx.name || c.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
            <span style={{ fontSize: 12, color: 'var(--text-m)' }}>{c.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-f)', fontWeight: 500 }}>{formatDate(tx.date)}</span>
          </div>
        </div>
        <div className="dn" style={{ fontSize: 15, fontWeight: 700, color: tx.amt > 0 ? 'var(--green)' : 'var(--text)', whiteSpace: 'nowrap' }}>
          {sign}{int},{cents} €
        </div>
      </div>
    </div>
  );
}
