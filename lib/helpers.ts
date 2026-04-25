export function monthKey(d: string | Date): string {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`;
}

export function sumSpent(txs: { amt: number }[]): number {
  return txs.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0);
}

export function sumIncome(txs: { amt: number }[]): number {
  return txs.filter(t => t.amt > 0).reduce((s, t) => s + t.amt, 0);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = new Date(d); dd.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - dd.getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: diff > 365 ? 'numeric' : undefined });
}

export interface FmtAmt { int: string; cents: string; sign: string }
export function fmtAmt(n: number): FmtAmt {
  const abs = Math.abs(n);
  return {
    int:   Math.floor(abs).toLocaleString('es-ES'),
    cents: String(Math.round((abs % 1) * 100)).padStart(2, '0'),
    sign:  n < 0 ? '−' : '+',
  };
}
