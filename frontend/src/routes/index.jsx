import { createFileRoute } from '@tanstack/react-router';
import { useAppData } from '../DataContext';
import StatsStrip from '../components/StatsStrip';
import MLExplainer from '../components/MLExplainer';
import ZoneCard from '../components/ZoneCard';

function IndexComponent() {
  const { data, ZONE_NAMES } = useAppData();
  const zones = Object.keys(data.recent).sort();
  const anomalyCount = Object.values(data.recent).filter(z => z.is_anomaly).length;
  const avgConfidence = zones.length > 0
    ? (zones.reduce((s, z) => s + (data.recent[z]?.confidence || 97), 0) / zones.length).toFixed(1)
    : '—';

  return (
    <>
      <StatsStrip totalZones={zones.length || 5} anomalies={anomalyCount} confidence={avgConfidence} />

      <div className="grid grid-cols-12 gap-6">
        {/* Left: ML Explainer */}
        <div className="col-span-12 lg:col-span-4">
          <MLExplainer />
        </div>

        {/* Right: Zone Cards + System Summary */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {zones.map(zone => (
              <ZoneCard
                key={zone}
                zoneId={zone}
                regionName={ZONE_NAMES[zone] || zone}
                data={data.recent[zone]}
                history={(data.history || []).filter(h => h.zone === zone).slice(-20)}
              />
            ))}

            {/* System Summary Card */}
            <div className="glass grid-noise p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--color-muted)' }}>NETWORK HEALTH</p>
                <h3 className="text-lg font-bold mb-4">System Summary</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: anomalyCount > 0 ? 'oklch(0.66 0.24 25 / 0.15)' : 'oklch(0.88 0.22 145 / 0.15)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={anomalyCount > 0 ? 'oklch(0.66 0.24 25)' : 'oklch(0.88 0.22 145)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{avgConfidence}%</p>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    {anomalyCount > 0 ? `${anomalyCount} active alert${anomalyCount > 1 ? 's' : ''}` : 'All systems nominal'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass p-4 flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: 'var(--color-muted)' }}>
        <span>Edge inference · Isolation Forest · 1,000-row training set</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} /> Pressure</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-accent)' }} /> Flow</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-destructive)' }} /> Anomaly</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-violet)' }} /> AI Score</span>
        </div>
      </footer>
    </>
  );
}

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
