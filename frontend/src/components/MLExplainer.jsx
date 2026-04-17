import { BrainCircuit } from 'lucide-react';

export default function MLExplainer() {
  // Generate scattered dots for the cluster visualization
  const clusterDots = [];
  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 38;
    const cx = 90 + Math.cos(angle) * r;
    const cy = 80 + Math.sin(angle) * r * 0.6;
    clusterDots.push({ cx, cy, key: i });
  }

  return (
    <div className="glass grid-noise p-5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.82 0.18 210 / 0.12)' }}>
          <BrainCircuit size={20} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>AI ENGINE</p>
          <h3 className="text-base font-bold">Isolation Forest</h3>
        </div>
      </div>

      {/* SVG Cluster Map */}
      <div className="rounded-xl p-3 mb-4" style={{ background: 'oklch(0.15 0.03 265)' }}>
        <svg viewBox="0 0 200 160" className="w-full">
          {/* Faint grid */}
          {[40, 80, 120].map(y => (
            <line key={`h${y}`} x1="10" y1={y} x2="190" y2={y} stroke="oklch(0.98 0.01 240 / 0.06)" strokeDasharray="4 4" />
          ))}
          {[50, 90, 130, 170].map(x => (
            <line key={`v${x}`} x1={x} y1="20" x2={x} y2="140" stroke="oklch(0.98 0.01 240 / 0.06)" strokeDasharray="4 4" />
          ))}

          {/* Cyan halo ellipse */}
          <ellipse cx="90" cy="80" rx="48" ry="30" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="6 3" opacity="0.4" />
          <ellipse cx="90" cy="80" rx="48" ry="30" fill="oklch(0.82 0.18 210 / 0.06)" />

          {/* Cluster points */}
          {clusterDots.map(d => (
            <circle key={d.key} cx={d.cx} cy={d.cy} r="2.5" fill="var(--color-primary)" opacity="0.7" />
          ))}

          {/* Anomaly outlier */}
          <line x1="138" y1="80" x2="170" y2="35" stroke="var(--color-destructive)" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="172" cy="32" r="5" fill="var(--color-destructive)" opacity="0.9" />
          <circle cx="172" cy="32" r="8" fill="none" stroke="var(--color-destructive)" strokeWidth="1.5" opacity="0.4" />

          {/* Labels */}
          <text x="90" y="130" textAnchor="middle" fill="oklch(0.65 0.02 250)" fontSize="8" fontFamily="Inter, sans-serif">normal cluster</text>
          <text x="172" y="18" textAnchor="middle" fill="oklch(0.66 0.24 25)" fontSize="8" fontFamily="Inter, sans-serif">anomaly</text>
        </svg>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
        Trained on <strong style={{ color: 'var(--color-foreground)' }}>1,000</strong> rows of pipeline history, the model learns the normal pressure/flow envelope. Points falling outside the cluster boundary are isolated and flagged in real time.
      </p>

      {/* Mini metric chips */}
      <div className="flex gap-3 mt-auto">
        <div className="flex-1 rounded-lg p-3" style={{ background: 'oklch(0.98 0.01 240 / 0.04)' }}>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Normal P</p>
          <p className="text-sm font-bold">~3.0 bar</p>
        </div>
        <div className="flex-1 rounded-lg p-3" style={{ background: 'oklch(0.98 0.01 240 / 0.04)' }}>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Normal Q</p>
          <p className="text-sm font-bold">~100 L/s</p>
        </div>
      </div>
    </div>
  );
}
