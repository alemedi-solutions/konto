'use client';

import { useStore } from '@/lib/store';
import { sumSpent, fmtAmt, monthKey } from '@/lib/helpers';
import { HdrBtn, HeroCard, Card, SectionTitle, Progress } from './Shared';

export function Analytics({ onGo }: { onGo: (s: string) => void }) {
  const { tx, cats } = useStore();
  const txs = useStore().useMonthTx();
  const spent = sumSpent(txs);
  const { int, cents } = fmtAmt(spent);

  const byCat: Record<string, number> = {};
  txs.filter(t => t.amt < 0).forEach(t => { byCat[t.catId] = (byCat[t.catId] ?? 0) + Math.abs(t.amt); });
  const catRows = Object.entries(byCat)
    .map(([id, eur]) => ({ ...(cats.find(c => c.id === id) ?? { id, name: 'Otros', color: '#888', ico: '❓', kind: 'gasto' as const }), eur }))
    .sort((a, b) => b.eur - a.eur);

  const months = [];
  const base = new Date(); base.setDate(1);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(base); d.setMonth(d.getMonth() - i);
    const k = monthKey(d);
    const total = tx.filter(t => t.amt < 0 && monthKey(t.date) === k).reduce((s, t) => s + Math.abs(t.amt), 0);
    months.push({ key: k, label: d.toLocaleDateString('es-ES', { month: 'short' }), eur: total, current: i === 0 });
  }
  const maxM = Math.max(1, ...months.map(m => m.eur));

  const now = new Date();
  const dayOfMonth = now.getDate();
  const dailyAvg = dayOfMonth > 0 ? spent / dayOfMonth : 0;

  const prevMk = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const prevSpent = tx.filter(t => t.amt < 0 && monthKey(t.date) === prevMk).reduce((s, t) => s + Math.abs(t.amt), 0);
  const momDiff = prevSpent > 0 ? ((spent - prevSpent) / prevSpent) * 100 : null;
  const prevMonthName = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString('es-ES', { month: 'long' });

  const subIds = ['nflx','dsnp','spfy','peph','amzn','hbo','subs'];
  const subSpent = txs.filter(t => t.amt < 0 && subIds.includes(t.catId)).reduce((s, t) => s + Math.abs(t.amt), 0);

  const topCat = catRows[0] ?? null;

  const insights: { ico: string; label: string; value: string; sub?: string; positive?: boolean; negative?: boolean }[] = [
    ...(momDiff !== null ? [{
      ico: momDiff <= 0 ? '📉' : '📈',
      label: `vs ${prevMonthName}`,
      value: `${momDiff > 0 ? '+' : ''}${momDiff.toFixed(0)}%`,
      positive: momDiff <= 0,
      negative: momDiff > 10,
    }] : []),
    {
      ico: '📅',
      label: 'Media diaria',
      value: `${dailyAvg.toFixed(0)} €`,
      sub: `${dayOfMonth} días`,
    },
    ...(topCat ? [{
      ico: topCat.ico,
      label: 'Mayor gasto',
      value: `${topCat.eur.toFixed(0)} €`,
      sub: topCat.name,
    }] : []),
    ...(subSpent > 0 ? [{
      ico: '📺',
      label: 'Suscripciones',
      value: `${subSpent.toFixed(0)} €`,
      sub: 'este mes',
    }] : []),
  ];

  return (
    <div className="screen">
      <div className="hdr">
        <HdrBtn onClick={() => onGo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </HdrBtn>
        <div className="dn" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Analytics</div>
        <div style={{ width: 40 }}/>
      </div>
      <div className="screen-body">
        <HeroCard>
          <div className="hero-label">
            <span className="hero-label-dot" style={{ background: 'color-mix(in srgb,var(--red) 60%,var(--surface2))' }}/>
            Gastado · {new Date().toLocaleDateString('es-ES', { month: 'long' })}
          </div>
          <div className="hero-amount">
            <span style={{ color: 'var(--text)' }}>{int}</span>
            <span style={{ color: 'var(--text-m)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>,{cents}</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-m)', marginBottom: 6, alignSelf: 'flex-end', marginLeft: 4 }}>€</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, marginTop: 20 }}>
            {months.map(m => (
              <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: Math.max(3, (m.eur / maxM * 88)) + 'px',
                    borderRadius: 8,
                    background: m.current ? 'color-mix(in srgb,var(--grad) 60%,var(--surface2))' : 'rgba(255,255,255,0.08)',
                    transition: 'height .4s ease',
                  }}/>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-m)', fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </HeroCard>

        <SectionTitle title="Insights"/>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 0 8px', margin: '0 -4px' }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ flexShrink: 0, background: 'var(--surface)', border: `1px solid ${ins.positive ? 'rgba(34,211,165,0.2)' : ins.negative ? 'rgba(255,90,110,0.2)' : 'var(--border)'}`, borderRadius: 18, padding: '12px 16px', minWidth: 120 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{ins.ico}</div>
              <div style={{ fontSize: 11, color: 'var(--text-f)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{ins.label}</div>
              <div className="dn" style={{ fontSize: 20, fontWeight: 700, color: ins.positive ? 'color-mix(in srgb,var(--green) 70%,var(--text-s))' : ins.negative ? 'color-mix(in srgb,var(--red) 70%,var(--text-s))' : 'var(--text)', letterSpacing: '-0.5px' }}>{ins.value}</div>
              {ins.sub && <div style={{ fontSize: 11, color: 'var(--text-m)', marginTop: 2 }}>{ins.sub}</div>}
            </div>
          ))}
        </div>

        <SectionTitle title="Por categoría"/>
        {catRows.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-m)' }}>Sin gastos este mes</div>
          </Card>
        ) : (
          <Card style={{ padding: '6px 16px' }}>
            {catRows.map((c, i) => (
              <div key={c.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === catRows.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 14, background: `${c.color}22`, border: `1px solid ${c.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.ico}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text)' }}>{c.name}</span>
                    <span className="dn" style={{ color: 'var(--text)' }}>{c.eur.toFixed(2)} €</span>
                  </div>
                  <Progress pct={(c.eur / (spent || 1)) * 100} color={`color-mix(in srgb,${c.color} 65%,transparent)`}/>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
