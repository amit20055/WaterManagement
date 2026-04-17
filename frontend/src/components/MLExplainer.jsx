import { Target, Fingerprint } from 'lucide-react';

export default function MLExplainer() {
  // SVG Donut chart data (Mock percentages based on the logic)
  const donuts = [
    { label: 'NETWORK SCORE', val: 97, color: 'var(--color-primary)' },
    { label: 'SYNC', val: 99.9, color: 'var(--color-success)' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-around py-4">
      {donuts.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-6 group">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="hsla(20, 10%, 100%, 0.05)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke={d.color}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * (d.val / 100))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out shadow-2xl"
                style={{ filter: `drop-shadow(0 0 10px ${d.color}66)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black hero-text text-white">{d.val === 99.9 ? '99.9' : d.val.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-white/30">%</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-1">
             <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">{d.label}</span>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Inference Valid</span>
             </div>
          </div>
        </div>
      ))}

      {/* Center Divider for larger screens */}
      <div className="hidden lg:block w-px h-24 bg-white/5" />

      {/* Model Tech Specs */}
      <div className="flex flex-col gap-4 min-w-[140px]">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
               <Target size={14} />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-white/30 uppercase">Goal Recall</span>
               <span className="text-sm font-black text-white italic">High-Precision</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
               <Fingerprint size={14} />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-white/30 uppercase">Hyperplane</span>
               <span className="text-sm font-black text-white italic">Isolated</span>
            </div>
         </div>
      </div>
    </div>
  );
}
