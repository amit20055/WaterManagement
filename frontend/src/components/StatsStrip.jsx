import { BrainCircuit, Layers, AlertCircle, Activity } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';

export default function StatsStrip({ totalZones, anomalies, confidence }) {
  const animatedPrecision = useCountUp(parseFloat(confidence || 97.0), 2000, 1);
  const animatedAnomalies = useCountUp(anomalies, 1500, 0);

  const stats = [
    { label: 'TOTAL ZONES', value: totalZones, sub: 'All channels active', Icon: Layers, color: 'var(--color-primary)' },
    { label: 'ANOMALIES', value: animatedAnomalies, sub: anomalies > 0 ? 'Action Required' : 'Nominal status', Icon: AlertCircle, color: anomalies > 0 ? 'var(--color-primary)' : 'var(--color-success)' },
    { label: 'UPTIME', value: '99.9', unit: '%', sub: 'Redundant nodes', Icon: Activity, color: 'var(--color-accent)' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* AI Precision Hero Card */}
      <div className="lg:col-span-4 glass-aurora p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative">
         {/* Gradient Background for Hero */}
         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-transparent pointer-events-none" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <BrainCircuit size={20} />
               </div>
               <span className="text-[11px] font-black tracking-widest text-white/60 uppercase">AI Precision</span>
            </div>
            
            <div className="flex flex-col gap-1 mb-8">
               <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black hero-text text-white">{animatedPrecision}</span>
                  <span className="text-3xl font-bold text-white/40">%</span>
               </div>
               <p className="text-sm font-medium text-white/50">Isolation Forest v2 · Edge inference active</p>
            </div>
         </div>

         <div className="relative z-10 w-full">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
               <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                style={{ width: `${animatedPrecision}%` }} 
               />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-white/40 tracking-widest">
               <span>SYSTEM CORE</span>
               <span>{animatedPrecision}/100</span>
            </div>
         </div>
      </div>

      {/* 3 Arch (Tombstone) Cards */}
      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
         {stats.map((s, i) => (
           <div 
            key={i} 
            className="glass-aurora tombstone p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden group hover:bg-white/[0.08]"
           >
              {/* Floating Icon with Glow */}
              <div className="relative">
                 <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-2xl" style={{ backgroundColor: `${s.color}20` }}>
                    <s.Icon size={32} style={{ color: s.color }} />
                 </div>
                 <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: s.color }} />
              </div>

              <div className="text-center flex flex-col gap-1">
                 <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">{s.label}</span>
                 <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black hero-text text-white">{s.value}</span>
                    {s.unit && <span className="text-xl font-bold text-white/30">{s.unit}</span>}
                 </div>
              </div>

              <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{s.sub}</span>

              {/* Decorative side cutouts to enhance tombstone shape visually */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
           </div>
         ))}
      </div>
    </div>
  );
}
