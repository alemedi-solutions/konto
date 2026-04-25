'use client';

import { useStore } from '@/lib/store';
import type { GradientKey } from '@/lib/types';
import { Avatar, HeroCard, Card, SectionTitle } from './Shared';
import { TabBar } from './TabBar';

export function Profile({ onGo, onReset }: { onGo: (s: string) => void; onReset: () => void }) {
  const { profile, tx, cats, darkMode, toggleDark, grad, setGrad } = useStore();

  const exportCSV = () => {
    const rows = [
      ['Fecha', 'Nombre', 'Categoría', 'Importe'],
      ...tx.map(t => [
        t.date.slice(0, 10),
        t.name,
        cats.find(c => c.id === t.catId)?.name ?? '',
        t.amt.toFixed(2),
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'gastos.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const gradients: { id: GradientKey; g: string }[] = [
    { id: 'violet', g: 'linear-gradient(135deg,#a78bfa,#f9a8d4)' },
    { id: 'sunset', g: 'linear-gradient(135deg,#fbbf77,#c4b5fd)' },
    { id: 'ocean',  g: 'linear-gradient(135deg,#7dd3fc,#c4b5fd)' },
    { id: 'mint',   g: 'linear-gradient(135deg,#6ee7c7,#a5b4fc)' },
  ];

  const rows = [
    { ico: '📤', label: 'Exportar CSV',          danger: false, action: exportCSV },
    { ico: '🔄', label: 'Restablecer datos demo', danger: true,  action: () => { if (confirm('¿Restablecer datos de demo?')) onReset(); } },
    { ico: 'ℹ️', label: 'Acerca de',             val: 'v1.0',   danger: false, action: null },
  ];

  return (
    <div className="screen">
      <div className="hdr">
        <div className="dn" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>Perfil</div>
        <div style={{ width: 40 }}/>
      </div>
      <div className="screen-body">
        <HeroCard style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={profile.initials} size={60} fontSize={22}/>
          <div style={{ flex: 1 }}>
            <div className="dn" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-m)' }}>{profile.email}</div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>
              {tx.length} movimientos · {cats.length} categorías
            </div>
          </div>
        </HeroCard>

        <SectionTitle title="Apariencia"/>
        <Card style={{ padding: '4px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌙</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>Modo oscuro</span>
            </div>
            <div onClick={toggleDark} className="toggle" style={{ background: darkMode ? 'var(--accent)' : 'var(--surface3)' }}>
              <div className="toggle-thumb" style={{ left: darkMode ? 20 : 3 }}/>
            </div>
          </div>
          <div style={{ padding: '14px 0' }}>
            <div style={{ fontSize: 12, color: 'var(--text-m)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Gradiente</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {gradients.map(({ id, g }) => (
                <div key={id} onClick={() => setGrad(id)} style={{
                  width: 36, height: 36, borderRadius: 999, background: g, cursor: 'pointer',
                  border: `2.5px solid ${grad === id ? '#fff' : 'transparent'}`,
                  boxShadow: grad === id ? '0 0 0 1px rgba(255,255,255,0.3)' : 'none',
                  transition: 'border .15s',
                }}/>
              ))}
            </div>
          </div>
        </Card>

        <SectionTitle title="Datos"/>
        <Card style={{ padding: 4 }}>
          {rows.map(({ ico, label, val, danger, action }, i, arr) => (
            <div key={label} onClick={action ?? undefined} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border)',
              cursor: action ? 'pointer' : 'default',
            }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{ico}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: danger ? 'var(--red)' : 'var(--text)' }}>{label}</span>
              {val && <span style={{ fontSize: 13, color: 'var(--text-m)' }}>{val}</span>}
              {action && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4, color: 'var(--text)' }}><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          ))}
        </Card>
        <div style={{ fontSize: 11, color: 'var(--text-f)', textAlign: 'center', marginTop: 16 }}>Datos guardados en este dispositivo</div>
      </div>
      <TabBar current="me" onGo={onGo}/>
    </div>
  );
}
