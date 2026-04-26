'use client';

import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { Transaction } from '@/lib/types';
import { HdrBtn } from './Shared';

interface Props {
  defaultKind: 'gasto' | 'ingreso';
  existing: Transaction | null;
  onClose: () => void;
}

export function AddSheet({ defaultKind, existing, onClose }: Props) {
  const { cats, addTx, updateTx, deleteTx } = useStore();
  const [kind, setKind] = useState<'gasto' | 'ingreso'>(existing ? (existing.amt > 0 ? 'ingreso' : 'gasto') : defaultKind);
  const isGasto = kind === 'gasto';
  const [amount, setAmount] = useState(existing ? Math.abs(existing.amt).toFixed(2).replace(/\.00$/, '') : '0');
  const catList = cats.filter(c => c.kind === kind);
  const [catId, setCatId] = useState(existing?.catId ?? catList[0]?.id ?? '');
  const [name, setName] = useState(existing?.name ?? '');
  const [date, setDate] = useState(existing ? existing.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [recurring, setRecurring] = useState(existing?.recurring ?? false);

  useEffect(() => {
    const list = cats.filter(c => c.kind === kind);
    if (!list.find(c => c.id === catId)) setCatId(list[0]?.id ?? '');
  }, [kind]);

  const press = useCallback((k: string) => {
    if (k === '⌫') setAmount(a => a.length <= 1 ? '0' : a.slice(0, -1));
    else if (k === '.') setAmount(a => a.includes('.') ? a : a + '.');
    else setAmount(a => a === '0' ? k : a + k);
  }, []);

  const save = () => {
    const num = Number(amount) || 0;
    if (num <= 0) { onClose(); return; }
    const payload = {
      name: name || cats.find(c => c.id === catId)?.name || 'Movimiento',
      catId, amt: isGasto ? -num : num,
      date: new Date(date + 'T12:00:00').toISOString(),
      recurring,
    };
    if (existing) updateTx(existing.id, payload); else addTx(payload);
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grip"/>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <HdrBtn onClick={onClose} style={{ background: 'var(--surface2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/></svg>
          </HdrBtn>
          <div className="dn" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {existing ? 'Editar' : 'Nuevo'} {kind}
          </div>
          {existing ? (
            <HdrBtn onClick={() => { deleteTx(existing.id); onClose(); }} style={{ background: 'var(--surface2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </HdrBtn>
          ) : <div style={{ width: 40 }}/>}
        </div>

        {/* Toggle gasto / ingreso */}
        {!existing && (
          <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 999, padding: 4, marginBottom: 20 }}>
            <button onClick={() => setKind('gasto')} style={{
              flex: 1, padding: '8px 0', borderRadius: 999, fontSize: 13, fontWeight: 600, border: 'none', transition: 'all .2s', cursor: 'pointer',
              background: isGasto ? 'rgba(255,90,110,0.12)' : 'transparent',
              color: isGasto ? 'color-mix(in srgb,var(--red) 75%,var(--text-s))' : 'var(--text-m)',
            }}>− Gasto</button>
            <button onClick={() => setKind('ingreso')} style={{
              flex: 1, padding: '8px 0', borderRadius: 999, fontSize: 13, fontWeight: 600, border: 'none', transition: 'all .2s', cursor: 'pointer',
              background: !isGasto ? 'rgba(34,211,165,0.12)' : 'transparent',
              color: !isGasto ? 'color-mix(in srgb,var(--green) 75%,var(--text-s))' : 'var(--text-m)',
            }}>+ Ingreso</button>
          </div>
        )}

        {/* Amount */}
        <div style={{ textAlign: 'center', padding: '4px 0 20px' }}>
          <div className="dn" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-2px', lineHeight: 1, color: 'var(--text)' }}>
            {amount}
            <span style={{ fontSize: 28, color: 'var(--text-m)', fontWeight: 500, marginLeft: 6 }}>€</span>
          </div>
        </div>

        {/* Details card */}
        <div style={{ borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 12, background: 'var(--surface2)' }}>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder={isGasto ? 'ej. Cena con Laura' : 'ej. Nómina abril'}
            style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, display: 'block' }}
          />
          <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }}/>
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, display: 'block', colorScheme: 'light dark' }}
          />
          <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }}/>
          <div onClick={() => setRecurring(v => !v)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--text-m)' }}>↻</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Repetir cada mes</div>
                <div style={{ fontSize: 11, color: 'var(--text-m)', marginTop: 1 }}>Se añadirá automáticamente</div>
              </div>
            </div>
            <div className="toggle" style={{ background: recurring ? 'var(--grad)' : 'var(--surface3)', flexShrink: 0 }}>
              <div className="toggle-thumb" style={{ left: recurring ? 21 : 3 }}/>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="chip-row" style={{ marginBottom: 12 }}>
          {catList.map(c => (
            <span key={c.id} className={`chip${catId === c.id ? ' active' : ''}`}
              style={catId === c.id ? { background: `${c.color}20`, borderColor: `${c.color}40`, color: c.color } : {}}
              onClick={() => setCatId(c.id)}>
              {c.ico} {c.name}
            </span>
          ))}
        </div>

        {/* Keypad */}
        <div className="keypad">
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
            <button key={k} className="key" onClick={() => press(k)}>{k}</button>
          ))}
        </div>

        {/* Save */}
        <button className="btn-primary" style={{
          marginTop: 14,
          background: isGasto ? 'rgba(255,90,110,0.12)' : 'color-mix(in srgb,var(--grad) 13%,transparent)',
          borderColor: isGasto ? 'rgba(255,90,110,0.25)' : 'color-mix(in srgb,var(--grad) 28%,transparent)',
          color: isGasto ? 'color-mix(in srgb,var(--red) 75%,var(--text-s))' : 'var(--grad)',
        }} onClick={save}>
          {existing ? 'Guardar cambios' : `Guardar ${kind}`}
        </button>
      </div>
    </div>
  );
}
