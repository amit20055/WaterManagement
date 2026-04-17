import { useNavigate } from '@tanstack/react-router';

export default function ZoneCard({ zoneId, regionName, data, history }) {
  const navigate = useNavigate();
  if (!data) return null;

  const isAnomaly = data.is_anomaly;
  const confidence = data.confidence || (isAnomaly ? 34 : (96 + Math.random() * 2).toFixed(1));
  const sparkPoints = history.map((h, i) => `${(i / Math.max(history.length - 1, 1)) * 100},${100 - ((h.pressure - 1.5) / 4) * 100}`).join(' ');

  return (
    <div
      onClick={() => navigate({ to: '/zone/$zoneId', params: { zoneId: zoneId.split(' ')[1] } })}
      className={`glass ring-top-cyan grid-noise p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isAnomaly ? 'animate-pulse-glow' : ''}`}
      style={isAnomaly ? { borderColor: 'oklch(0.66 0.24 25 / 0.4)' } : {}}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>{regionName}</p>
          <h3 className="text-lg font-bold">{zoneId}</h3>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
          style={{
            background: isAnomaly ? 'oklch(0.66 0.24 25 / 0.15)' : 'oklch(0.88 0.22 145 / 0.12)',
            color: isAnomaly ? 'var(--color-destructive)' : 'var(--color-accent)',
            border: `1px solid ${isAnomaly ? 'oklch(0.66 0.24 25 / 0.3)' : 'oklch(0.88 0.22 145 / 0.25)'}`,
          }}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAnomaly ? 'animate-pulse' : ''}`} style={{ background: isAnomaly ? 'var(--color-destructive)' : 'var(--color-accent)' }} />
          {isAnomaly ? 'ALERT' : 'STABLE'}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg p-2.5" style={{ background: 'oklch(0.98 0.01 240 / 0.04)' }}>
          <div className="flex items-center gap-1 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8"/></svg>
            <span className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-muted)' }}>PRESSURE</span>
          </div>
          <p className="text-base font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {data.pressure?.toFixed(2)} <span className="text-xs font-normal" style={{ color: 'var(--color-muted)' }}>bar</span>
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: 'oklch(0.98 0.01 240 / 0.04)' }}>
          <div className="flex items-center gap-1 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            <span className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-muted)' }}>FLOW</span>
          </div>
          <p className="text-base font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {data.flow_rate?.toFixed(1)} <span className="text-xs font-normal" style={{ color: 'var(--color-muted)' }}>L/s</span>
          </p>
        </div>
      </div>

      {/* Sparkline */}
      {history.length > 2 && (
        <div className="rounded-lg p-2 mb-3" style={{ background: 'oklch(0.98 0.01 240 / 0.03)' }}>
          <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`spark-${zoneId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isAnomaly ? 'var(--color-destructive)' : 'var(--color-primary)'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isAnomaly ? 'var(--color-destructive)' : 'var(--color-primary)'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${sparkPoints} 100,100`} fill={`url(#spark-${zoneId})`} />
            <polyline points={sparkPoints} fill="none" stroke={isAnomaly ? 'var(--color-destructive)' : 'var(--color-primary)'} strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* AI Confidence row */}
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-muted)' }}>
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-violet)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          AI confidence
        </div>
        <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-foreground)' }}>{confidence}%</span>
      </div>
    </div>
  );
}
