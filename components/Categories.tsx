'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Category } from '@/lib/types';
import { PALETTE, EMOJIS } from '@/lib/data';
import { HdrBtn, Card } from './Shared';
import { TabBar } from './TabBar';

function CatSheet({ cat, onClose, onSave, onDelete }: {
  cat: Category | null;
  onClose: () => void;
  onSave: (data: Omit<Category, 'id'>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(cat?.name ?? '');
  const [ico, setIco] = useState(cat?.ico ?? '✨');
  const [color, setColor] = useState(cat?.color ?? '#a78bfa');
  const [kind, setKind] = useState<'gasto' | 'ingreso'>(cat?.kind ?? 'gasto');
  const [budget, setBudget] = useState(cat?.budget ? String(cat.budget) : '');
  const isNew = !cat;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ paddingBottom: 40 }}>
        <div className="sheet-grip"/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <HdrBtn onClick={onClose} style={{ background: 'var(--surface2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/></svg>
          </HdrBtn>
          <div className="dn" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{isNew ? 'Nueva categoría' : 'Editar categoría'}</div>
          {!isNew ? (
            <HdrBtn onClick={onDelete} style={{ background: 'var(--surface2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </HdrBtn>
          ) : <div style={{ width: 40 }}/>}
        </div>

        {/* Preview + name + kind */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${color}22`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {ico}
          </div>
          <div style={{ flex: 1 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de categoría"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}/>
            <div style={{ display: 'inline-flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 999, padding: 3 }}>
              {(['gasto', 'ingreso'] as const).map(k => (
                <button key={k} onClick={() => setKind(k)} style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  color: kind === k ? k === 'gasto' ? 'color-mix(in srgb,var(--red) 75%,var(--text-s))' : 'color-mix(in srgb,var(--green) 75%,var(--text-s))' : 'var(--text-m)',
                  background: kind === k ? k === 'gasto' ? 'rgba(255,90,110,0.12)' : 'rgba(34,211,165,0.12)' : 'transparent',
                  border: 'none', transition: 'all .2s', textTransform: 'capitalize',
                }}>{k}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Color</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PALETTE.map(c => (
              <div key={c} onClick={() => setColor(c)} style={{
                width: 32, height: 32, borderRadius: 999, background: c, cursor: 'pointer', flexShrink: 0,
                border: `2.5px solid ${color === c ? '#fff' : 'transparent'}`,
                boxShadow: color === c ? `0 0 0 1px ${c}` : 'none',
                transition: 'all .15s',
              }}/>
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Icono</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setIco(e)} style={{
                width: 38, height: 38, borderRadius: 10,
                background: ico === e ? `${color}20` : 'var(--surface2)',
                border: `1px solid ${ico === e ? `${color}40` : 'var(--border)'}`,
                fontSize: 18, cursor: 'pointer',
                transition: 'all .15s',
              }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Budget (gastos only) */}
        {kind === 'gasto' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Presupuesto mensual (€)</div>
            <input type="number" inputMode="decimal" value={budget} onChange={e => setBudget(e.target.value)} placeholder="ej. 150"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 15 }}/>
          </div>
        )}

        <button className="btn-primary"
          style={{ background: color, boxShadow: `0 6px 18px ${color}44` }}
          onClick={() => onSave({ name: name || 'Sin nombre', ico, color, kind, budget: budget ? Number(budget) : undefined })}>
          {isNew ? 'Crear categoría' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

export function Categories({ onGo }: { onGo: (s: string) => void }) {
  const { cats, addCat, updateCat, deleteCat } = useStore();
  const [tab, setTab] = useState<'gasto' | 'ingreso'>('gasto');
  const [sheet, setSheet] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const filtered = cats.filter(c => c.kind === tab);

  const handleSave = (data: Omit<Category, 'id'>) => {
    if (editCat) updateCat(editCat.id, data);
    else addCat(data);
    setSheet(false); setEditCat(null);
  };
  const handleDelete = () => {
    if (editCat && confirm(`¿Eliminar "${editCat.name}"?`)) deleteCat(editCat.id);
    setSheet(false); setEditCat(null);
  };

  return (
    <div className="screen">
      <div className="hdr">
        <HdrBtn onClick={() => onGo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </HdrBtn>
        <div className="dn" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Categorías</div>
        <HdrBtn onClick={() => { setEditCat(null); setSheet(true); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
        </HdrBtn>
      </div>
      <div className="screen-body">
        <div className="pill-group" style={{ marginBottom: 16 }}>
          {(['gasto', 'ingreso'] as const).map(k => (
            <button key={k} className={`pill${tab === k ? ' active' : ''}`}
              style={tab === k ? { background: k === 'gasto' ? 'rgba(255,90,110,0.12)' : 'rgba(34,211,165,0.12)', color: k === 'gasto' ? 'color-mix(in srgb,var(--red) 75%,var(--text-s))' : 'color-mix(in srgb,var(--green) 75%,var(--text-s))' } : {}}
              onClick={() => setTab(k)}>
              {k === 'gasto' ? 'Gastos' : 'Ingresos'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗂️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Sin categorías</div>
            <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 4 }}>Toca + para crear una nueva</div>
          </Card>
        ) : (
          <Card style={{ padding: '4px 16px' }}>
            {filtered.map((c, i) => (
              <div key={c.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border)', cursor: 'pointer', transition: 'opacity .15s' }}
                onClick={() => { setEditCat(c); setSheet(true); }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${c.color}22`, border: `1px solid ${c.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {c.ico}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                  {c.budget && <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 1 }}>Presupuesto: {c.budget} €/mes</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: `${c.color}90` }}/>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.35, color: 'var(--text)' }}><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </Card>
        )}
        <div style={{ marginTop: 14, padding: '0 4px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-m)', lineHeight: 1.6 }}>
            Toca cualquier categoría para editarla o eliminarla.
          </div>
        </div>
      </div>
      <TabBar current="cats" onGo={id => id === 'add' ? (setEditCat(null), setSheet(true)) : onGo(id)}/>
      {sheet && <CatSheet cat={editCat} onClose={() => { setSheet(false); setEditCat(null); }} onSave={handleSave} onDelete={handleDelete}/>}
    </div>
  );
}
