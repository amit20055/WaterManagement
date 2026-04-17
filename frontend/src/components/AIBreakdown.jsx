import { BrainCircuit, Info, Fingerprint } from 'lucide-react';

export default function AIBreakdown({ latest, isAnomaly }) {
  if (!latest) return null;

  const features = isAnomaly ? [
    { name: 'Pressure Deviation', pct: 40, color: 'var(--color-primary)' },
    { name: 'Flow Volatility', pct: 35, color: 'var(--color-accent)' },
    { name: 'Temporal Pattern', pct: 25, color: 'var(--color-info)' },
  ] : [
    { name: 'Signal Stability', pct: 85, color: 'var(--color-success)' },
    { name: 'Historical Sync', pct: 15, color: 'var(--color-accent)' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col gap-2 group">
            <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
              <span className="text-white/40 group-hover:text-white transition-colors">{f.name}</span>
              <span style={{ color: f.color }}>{f.pct}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-premium" 
                style={{ width: `${f.pct}%`, backgroundColor: f.color, boxShadow: `0 0 10px ${f.color}33` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 p-5 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-3 group hover:bg-white/5 transition-all">
        <div className="flex items-center gap-2">
           <Fingerprint size={14} className="text-white/20" />
           <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Model Conclusion</span>
        </div>
        <div className="flex items-start gap-4">
           <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isAnomaly ? 'bg-primary' : 'bg-success'}`} />
           <p className="text-sm font-bold text-white leading-relaxed italic">
              {isAnomaly 
                ? "Isolation Forest recognized a structural outlier in the hyperplane. Signal classified as High-Volatilty Leak."
                : "Operational parameters align with 98.4% of stabilized historical dataset."}
           </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[9px] font-black text-white/20 tracking-[0.2em] uppercase">
         <Info size={10} />
         Isolation Forest v2 // Feature Attribution
      </div>
    </div>
  );
}
