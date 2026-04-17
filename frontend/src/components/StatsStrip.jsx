import { Layers, AlertTriangle, Activity, BrainCircuit } from 'lucide-react';

export default function StatsStrip({ totalZones, anomalies, confidence }) {
  const cards = [
    { label: 'TOTAL ZONES', value: totalZones, sub: 'All channels online', color: 'var(--color-primary)', Icon: Layers, alert: false },
    { label: 'LIVE ANOMALIES', value: anomalies, sub: anomalies > 0 ? 'Requires attention' : 'All clear', color: anomalies > 0 ? 'var(--color-destructive)' : 'var(--color-accent)', Icon: AlertTriangle, alert: anomalies > 0 },
    { label: 'SYSTEM UPTIME', value: '99.9', sub: 'Last 30 days', color: 'var(--color-accent)', Icon: Activity, unit: '%', alert: false },
    { label: 'AI CONFIDENCE', value: confidence, sub: 'Isolation Forest', color: 'var(--color-violet)', Icon: BrainCircuit, unit: '%', alert: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`glass grid-noise p-5 flex items-center justify-between ${c.alert ? 'animate-pulse-glow' : ''}`}
          style={c.alert ? { borderColor: 'oklch(0.66 0.24 25 / 0.4)' } : {}}>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--color-muted)' }}>{c.label}</p>
            <p className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: c.alert ? 'var(--color-destructive)' : 'var(--color-foreground)' }}>
              {c.value}{c.unit && <span className="text-base font-normal ml-0.5" style={{ color: 'var(--color-muted)' }}>{c.unit}</span>}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{c.sub}</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in oklch, ${c.color}, transparent 85%)` }}>
            <c.Icon size={22} style={{ color: c.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
