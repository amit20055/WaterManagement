import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAppData } from '../DataContext';
import { ArrowLeft, BarChart3, ShieldCheck, Zap, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ZONE_NAMES = {
  'Zone A': 'NORTH GRID',
  'Zone B': 'EAST RESERVOIR',
  'Zone C': 'SOUTH LOOP',
  'Zone D': 'WEST PLANT',
  'Zone E': 'CENTRAL TRUNK',
};

function calcEfficiency(zoneData, history) {
  if (!zoneData) return 100;
  const anomalyEvents = history.filter(h => h.is_anomaly).length;
  const total = Math.max(history.length, 1);
  return Math.round((1 - anomalyEvents / total) * 100);
}

function CompareComponent() {
  const { data } = useAppData();
  const navigate = useNavigate();
  const zones = Object.keys(data.recent).sort();

  const zoneStats = zones.map(zone => {
    const zData = data.recent[zone];
    const zHistory = (data.history || []).filter(h => h.zone === zone);
    const efficiency = calcEfficiency(zData, zHistory);
    const anomalyCount = zHistory.filter(h => h.is_anomaly).length;
    return {
      zone,
      name: ZONE_NAMES[zone] || zone,
      shortName: zone.split(' ')[1],
      pressure: zData?.pressure || 0,
      flow: zData?.flow_rate || 0,
      efficiency,
      anomalies: anomalyCount,
      confidence: zData?.confidence || 97,
      isAnomaly: zData?.is_anomaly || false,
    };
  });

  const ranked = [...zoneStats].sort((a, b) => b.efficiency - a.efficiency);
  const mostAnomalous = [...zoneStats].sort((a, b) => b.anomalies - a.anomalies)[0];
  const leastAnomalous = [...zoneStats].sort((a, b) => a.anomalies - b.anomalies)[0];
  const ratio = leastAnomalous.anomalies > 0 ? (mostAnomalous.anomalies / leastAnomalous.anomalies).toFixed(1) : '∞';

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="glass-aurora p-5 flex flex-col gap-3 rounded-2xl border border-white/10 shadow-2xl">
        <p className="font-black text-white hero-text tracking-tight uppercase italic underline decoration-primary decoration-2 underline-offset-4">{d.zone}</p>
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Efficiency Index</span>
           <span className="text-2xl font-black text-primary">{d.efficiency}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10 animate-entrance relative z-10 font-sans">
      {/* Header: Ticket Style */}
      <header className="glass-aurora ticket-cutout p-8 rounded-[40px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate({ to: '/' })} 
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white/5 border border-white/10 hover:bg-primary hover:text-white group"
          >
            <ArrowLeft size={24} className="text-white/40 group-hover:text-white" />
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-[0.4em] text-accent uppercase mb-1 italic">
               Network Analytics
            </span>
            <h1 className="text-4xl font-black hero-text text-white uppercase italic tracking-tight">
              Comparative Intelligence
            </h1>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
           <BarChart3 size={20} className="text-accent" />
           <span className="text-[11px] font-black tracking-widest text-white/60">LAYER 4 ANALYSIS ACTIVE</span>
        </div>
      </header>

      {/* Main Bar Chart: Warm Gradient Theme */}
      <div className="glass-aurora p-10 rounded-[40px] flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black hero-text text-white uppercase italic">Efficiency Ranking</h3>
            <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">Cross-node stability matrix</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-success" />
                 <span className="text-[9px] font-black text-white/40 tracking-widest uppercase italic">Nominal</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-[9px] font-black text-white/40 tracking-widest uppercase italic">Anomalous</span>
              </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <BarChart data={ranked} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsla(20, 10%, 100%, 0.05)" />
              <XAxis dataKey="zone" tick={{ fill: 'hsla(20, 10%, 100%, 0.3)', fontSize: 12, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsla(20, 10%, 100%, 0.3)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(20, 10%, 100%, 0.03)' }} />
              <Bar dataKey="efficiency" radius={[12, 12, 4, 4]} barSize={60}>
                {ranked.map((entry, i) => (
                  <Cell 
                    key={i} 
                    fill={entry.efficiency >= 90 ? 'var(--color-success)' : entry.efficiency >= 70 ? 'var(--color-accent)' : 'var(--color-primary)'} 
                    className="transition-all duration-1000 ease-premium" 
                    opacity={0.85} 
                    style={{ filter: `drop-shadow(0 0 10px ${entry.efficiency >= 90 ? 'var(--color-success)33' : 'var(--color-primary)33'})` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table: Ticket Rows */}
      <div className="glass-aurora rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
           <h3 className="text-xl font-black hero-text text-white uppercase italic italic">Data Matrix</h3>
           <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{zones.length} Nodes Synchronized</span>
        </div>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase">Rank</th>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase">Node ID</th>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase text-right">Pressure</th>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase text-right">Flow Velocity</th>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase text-right">Efficiency</th>
                <th className="py-2 px-6 text-[10px] font-black tracking-widest text-white/30 uppercase text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((z, i) => (
                <tr 
                  key={z.zone} 
                  className="group cursor-pointer hover:scale-[1.01] transition-transform duration-300"
                  onClick={() => navigate({ to: '/zone/$zoneId', params: { zoneId: z.shortName } })}
                >
                  <td className="py-6 px-6 bg-white/5 first:rounded-l-2xl font-black text-white/20 text-xl italic" style={{ fontVariantNumeric: 'tabular-nums' }}>#{i + 1}</td>
                  <td className="py-6 px-6 bg-white/5">
                    <div className="flex flex-col">
                       <span className="text-base font-black text-white group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary/40 underline-offset-4 decoration-2">{z.zone}</span>
                       <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{z.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 bg-white/5 text-right font-black text-white text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {z.pressure.toFixed(2)} <span className="text-[10px] font-medium text-white/30">BAR</span>
                  </td>
                  <td className="py-6 px-6 bg-white/5 text-right font-black text-white text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {z.flow.toFixed(1)} <span className="text-[10px] font-medium text-white/30">L/S</span>
                  </td>
                  <td className="py-6 px-6 bg-white/5 text-right">
                    <div className="flex items-center justify-end gap-4">
                       <span className={`text-lg font-black`} style={{ color: z.efficiency >= 90 ? 'var(--color-success)' : 'var(--color-accent)' }}>
                          {z.efficiency}%
                       </span>
                       <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full transition-all duration-1000" style={{ width: `${z.efficiency}%`, backgroundColor: z.efficiency >= 90 ? 'var(--color-success)' : 'var(--color-accent)' }} />
                       </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 bg-white/5 last:rounded-r-2xl text-right">
                     <span className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-black text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {z.confidence}%
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic AI Insights: Tombstone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: 'EFFICIENCY LEADER', val: ranked[0].zone, sub: `${ranked[0].efficiency}% stability`, icon: Zap, color: 'var(--color-success)' },
           { label: 'RISK DEVIATION', val: mostAnomalous.zone, sub: `${ratio}x volatility spike`, icon: TrendingUp, color: 'var(--color-primary)' },
           { label: 'GLOBAL ACCURACY', val: `${(zoneStats.reduce((s, z) => s + z.confidence, 0) / zoneStats.length).toFixed(1)}%`, sub: 'Confidence verified', icon: Target, color: 'var(--color-accent)' },
         ].map((item, i) => (
           <div key={i} className="glass-aurora tombstone p-8 flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
                 <item.icon size={24} />
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase italic">{item.label}</span>
                 <h4 className="text-2xl font-black hero-text text-white leading-tight">{item.val}</h4>
                 <p className="text-sm font-bold opacity-60 italic" style={{ color: item.color }}>{item.sub}</p>
              </div>
              <div className="h-px w-full bg-white/5 mt-auto" />
           </div>
         ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/compare')({
  component: CompareComponent,
});
