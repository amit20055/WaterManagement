import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useAppData } from '../DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const ZONE_NAMES = {
  'Zone A': 'NORTH GRID',
  'Zone B': 'EAST RESERVOIR',
  'Zone C': 'SOUTH LOOP',
  'Zone D': 'WEST PLANT',
  'Zone E': 'CENTRAL TRUNK',
};
const ALL_ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

function ZoneDetailComponent() {
  const { zoneId } = Route.useParams();
  const { data } = useAppData();
  const navigate = useNavigate();

  const zoneName = `Zone ${zoneId}`;
  const regionName = ZONE_NAMES[zoneName] || zoneName;
  const latest = data.recent?.[zoneName] || {};
  const history = (data.history || []).filter(h => h.zone === zoneName).slice(-60);
  const isAnomaly = latest.is_anomaly;

  const chartData = history.map(h => ({
    time: h.timestamp?.split(' ')[1] || '',
    Pressure: h.pressure,
    Flow: h.flow_rate,
  }));

  const confidence = latest.confidence || (isAnomaly ? 34 : 97);
  const radialData = [{ name: 'AI Score', value: confidence, fill: isAnomaly ? 'var(--color-destructive)' : 'var(--color-violet)' }];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-strong p-3 text-sm" style={{ border: '1px solid var(--color-border-hover)' }}>
        <p className="font-semibold mb-1">{label}</p>
        <p style={{ color: 'var(--color-primary)' }}>Pressure: {payload[0]?.value?.toFixed(2)} bar</p>
        {payload[1] && <p style={{ color: 'var(--color-accent)' }}>Flow: {payload[1]?.value?.toFixed(1)} L/s</p>}
      </div>
    );
  };

  return (
    <>
      {/* Detail Header */}
      <div className="glass p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate({ to: '/' })} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{ background: 'oklch(0.98 0.01 240 / 0.06)', border: '1px solid var(--color-border)' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>{regionName}</p>
            <h1 className="text-2xl font-bold">Pipeline Detail · {zoneName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ALL_ZONES.map(z => {
            const id = z.split(' ')[1];
            const isCurrent = id === zoneId;
            const zData = data.recent?.[z];
            const zAlert = zData?.is_anomaly;
            return (
              <button
                key={z}
                onClick={() => navigate({ to: '/zone/$zoneId', params: { zoneId: id } })}
                className="w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all"
                style={{
                  background: isCurrent ? (zAlert ? 'var(--color-destructive)' : 'var(--color-primary)') : 'oklch(0.98 0.01 240 / 0.06)',
                  color: isCurrent ? '#fff' : 'var(--color-muted)',
                  border: `1px solid ${isCurrent ? 'transparent' : 'var(--color-border)'}`,
                }}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'LINE PRESSURE', value: latest.pressure?.toFixed(2) || '—', unit: 'bar', color: 'var(--color-primary)', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8' },
          { label: 'FLOW RATE', value: latest.flow_rate?.toFixed(1) || '—', unit: 'L/s', color: 'var(--color-accent)', icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
          { label: 'AI DECISION', value: isAnomaly ? 'Anomaly' : 'Normal', unit: '', color: isAnomaly ? 'var(--color-destructive)' : 'var(--color-accent)', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
          { label: 'CONFIDENCE', value: typeof confidence === 'number' ? confidence.toFixed(1) : confidence, unit: '%', color: 'var(--color-violet)', icon: 'M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0' },
        ].map(card => (
          <div key={card.label} className="glass grid-noise p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--color-muted)' }}>{card.label}</p>
              <p className="text-3xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {card.value} <span className="text-base font-normal" style={{ color: 'var(--color-muted)' }}>{card.unit}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in oklch, ${card.color}, transparent 85%)` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={card.icon}/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Charts Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main Area Chart — 8 cols */}
        <div className="col-span-12 lg:col-span-8 glass grid-noise p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--color-muted)' }}>REAL-TIME MAPPING</p>
              <h3 className="text-lg font-bold">Pipeline Telemetry</h3>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-muted)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} /> Pressure (bar)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} /> Flow (L/s)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPressure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={40} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="Pressure" stroke="var(--color-primary)" strokeWidth={2} fill="url(#gPressure)" isAnimationActive={false} />
                <Area yAxisId="right" type="monotone" dataKey="Flow" stroke="var(--color-accent)" strokeWidth={2} fill="url(#gFlow)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radial Bar — 4 cols */}
        <div className="col-span-12 lg:col-span-4 glass grid-noise p-5 flex flex-col items-center justify-center">
          <div className="w-full mb-2">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--color-muted)' }}>MODEL</p>
            <h3 className="text-lg font-bold">AI Decision Score</h3>
          </div>
          <div style={{ width: 220, height: 220 }}>
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270} barSize={16}>
                <RadialBar background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-28">
            <p className="text-4xl font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: isAnomaly ? 'var(--color-destructive)' : 'var(--color-violet)' }}>
              {typeof confidence === 'number' ? confidence.toFixed(0) : confidence}<span className="text-lg">%</span>
            </p>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
              {isAnomaly ? 'ANOMALY CLASS' : 'NORMAL CLASS'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom row: Network Heatmap + Zone Vitals */}
      <div className="grid grid-cols-12 gap-4">
        {/* Network Heatmap */}
        <div className="col-span-12 md:col-span-5 glass grid-noise p-5">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-muted)' }}>Network Heatmap</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_ZONES.map(z => {
              const id = z.split(' ')[1];
              const zData = data.recent?.[z];
              const isCurrent = id === zoneId;
              const zAlert = zData?.is_anomaly;
              return (
                <button
                  key={z}
                  onClick={() => navigate({ to: '/zone/$zoneId', params: { zoneId: id } })}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: zAlert ? 'oklch(0.66 0.24 25 / 0.2)' : isCurrent ? 'oklch(0.82 0.18 210 / 0.15)' : 'oklch(0.98 0.01 240 / 0.04)',
                    border: `1px solid ${zAlert ? 'oklch(0.66 0.24 25 / 0.4)' : isCurrent ? 'oklch(0.82 0.18 210 / 0.3)' : 'var(--color-border)'}`,
                    color: zAlert ? 'var(--color-destructive)' : isCurrent ? 'var(--color-primary)' : 'var(--color-muted)',
                  }}
                >
                  {id}
                  <span className="text-[10px] font-normal">{zData?.pressure?.toFixed(1) || '—'} bar</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone Vitals */}
        <div className="col-span-12 md:col-span-7 glass grid-noise p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Zone Vitals</p>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>60s WINDOW</span>
          </div>
          <div className="flex flex-col gap-2">
            {ALL_ZONES.map(z => {
              const zData = data.recent?.[z];
              const zHistory = (data.history || []).filter(h => h.zone === z).slice(-20);
              const sparkPoints = zHistory.map((h, i) => `${(i / Math.max(zHistory.length - 1, 1)) * 100},${100 - ((h.pressure - 2) / 3) * 100}`).join(' ');
              return (
                <div key={z} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'oklch(0.98 0.01 240 / 0.03)' }}>
                  <span className="text-xs font-bold w-12" style={{ color: zData?.is_anomaly ? 'var(--color-destructive)' : 'var(--color-primary)' }}>{z.split(' ')[1]}</span>
                  <svg viewBox="0 0 100 40" className="flex-1 h-6">
                    <polyline points={sparkPoints} fill="none" stroke={zData?.is_anomaly ? 'var(--color-destructive)' : 'var(--color-primary)'} strokeWidth="2" />
                  </svg>
                  <span className="text-xs font-mono w-16 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {zData?.pressure?.toFixed(2) || '—'} bar
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="glass grid-noise p-5">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-muted)' }}>Recent Events</p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {history.slice(-10).reverse().map(evt => (
            <div key={evt.id} className="flex items-center gap-3 p-2 rounded-lg text-sm" style={{ background: 'oklch(0.98 0.01 240 / 0.03)' }}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: evt.is_anomaly ? 'var(--color-destructive)' : 'var(--color-accent)' }} />
              <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{evt.timestamp}</span>
              <span>{evt.is_anomaly ? 'Anomaly detected' : 'Normal reading'}</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--color-muted)' }}>{evt.pressure?.toFixed(2)} bar · {evt.flow_rate?.toFixed(1)} L/s</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute('/zone/$zoneId')({
  component: ZoneDetailComponent,
});
