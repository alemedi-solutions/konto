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
  const { cats, addTx, updateTx, deleteTx, gradMap, grad } = useStore();
  const [kind, setKind] = useState<'gasto' | 'ingreso'>(existing ? (existing.amt > 0 ? 'ingreso' : 'gasto') : defaultKind);
  const isGasto = kind === 'gasto';
  const [amount, setAmount] = useState(existing ? Math.abs(existing.amt).toFixed(2).replace(/\.00$/, '') : '0');
  const catList = cats.filter(c => c.kind === kind);
  const [catId, setCatId] = useState(existing?.catId ?? catList[0]?.id ?? '');
  const [name, setName] = useState(existing?.name ?? '');
  const [date, setDate] = useState(existing ? existing.date.slice(0, 10) : new Date().toISOString().slice(0, 10));

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
    };
    if (existing) updateTx(existing.id, payload); else addTx(payload);
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grip"/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <HdrBtn onClick={onClose} style={{ background: 'var(--surface2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/></svg>
          </HdrBtn>
          <div className="dn" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{existing ? 'Editar' : 'Nuevo'} {kind}</div>
          {existing ? (
            <HdrBtn onClick={() => { deleteTx(existing.id); onClose(); }} style={{ background: 'var(--surface2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </HdrBtn>
          ) : <div style={{ width: 40 }}/>}
        </div>

        {!existing && (
          <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 999, padding: 4, marginBottom: 14 }}>
            <button onClick={() => setKind('gasto')} style={{ flex: 1, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: kind === 'gasto' ? '#fff' : 'var(--text-s)', background: kind === 'gasto' ? 'linear-gradient(135deg,#ff5a6e 0%,#ef4444 100%)' : 'transparent', border: 'none', transition: 'all .2s' }}>− Gasto</button>
            <button onClick={() => setKind('ingreso')} style={{ flex: 1, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: kind === 'ingreso' ? '#fff' : 'var(--text-s)', background: kind === 'ingreso' ? 'linear-gradient(135deg,#22d3a5 0%,#14b87f 100%)' : 'transparent', border: 'none', transition: 'all .2s' }}>+ Ingreso</button>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '14px 0' }}>
          <div className="dn" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px', lineHeight: 1, color: isGasto ? 'var(--text)' : 'var(--green)' }}>
            {amount}<span style={{ color: 'var(--text-m)', fontWeight: 500, marginLeft: 4 }}>€</span>
          </div>
        </div>

        <input value={name} onChange={e => setName(e.target.value)}
          placeholder={isGasto ? 'ej. Cena con Laura' : 'ej. Nómina abril'}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, marginBottom: 10, textAlign: 'center' }}/>

        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, marginBottom: 10, colorScheme: 'light dark' }}/>

        <div className="chip-row" style={{ margin: '4px -4px 10px' }}>
          {catList.map(c => (
            <span key={c.id} className={`chip${catId === c.id ? ' active' : ''}`}
              style={catId === c.id ? { background: c.color, borderColor: 'transparent', boxShadow: `0 4px 12px ${c.color}66` } : {}}
              onClick={() => setCatId(c.id)}>
              {c.ico} {c.name}
            </span>
          ))}
        </div>

        <div className="keypad">
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
            <button key={k} className="key" onClick={() => press(k)}>{k}</button>
          ))}
        </div>

        <button className="btn-primary" style={{
          marginTop: 14,
          background: isGasto ? 'linear-gradient(135deg,#ff5a6e 0%,#ef4444 100%)' : gradMap[grad],
          boxShadow: isGasto ? '0 6px 18px rgba(255,90,110,0.18)' : '0 6px 18px color-mix(in srgb, var(--grad) 22%, transparent)',
        }} onClick={save}>
          {existing ? 'Guardar cambios' : `Guardar ${kind}`}
        </button>
      </div>
    </div>
  );
}
