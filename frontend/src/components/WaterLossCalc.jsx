import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';

const COST_PER_LITER = 0.003; 

export default function WaterLossCalc({ latest, isAnomaly }) {
  if (!latest) return null;

  const normalFlow = 100; 
  const currentFlow = latest.flow_rate || normalFlow;
  const flowDiff = Math.abs(currentFlow - normalFlow);
  
  const lossPerHour = isAnomaly ? flowDiff * 3600 : 0;
  const costPerHour = lossPerHour * COST_PER_LITER;
  const costPerDay = costPerHour * 24;
  const costPerMonth = costPerDay * 30;

  const animatedLoss = useCountUp(costPerHour, 2000, 2);
  const savingsPerHour = isAnomaly ? costPerHour : 42.50;

  return (
    <div className={`glass-aurora p-8 rounded-[40px] flex flex-col gap-8 relative overflow-hidden transition-all duration-500 ${isAnomaly ? 'border-primary/40 bg-primary/5' : ''}`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-1">Impact Analysis</span>
          <h3 className="text-2xl font-black hero-text text-white uppercase italic">Financial Pulse</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${
          isAnomaly ? 'bg-primary/20 border-primary/40 text-primary animate-bounce' : 'bg-success/10 border-success/30 text-success'
        }`}>
          <DollarSign size={28} />
        </div>
      </div>

      {isAnomaly ? (
        <div className="flex flex-col gap-8 relative z-10">
          <div className="p-8 rounded-[32px] bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-2 relative group overflow-hidden">
             <div className="absolute top-4 right-4 text-primary opacity-20"><AlertCircle size={20} /></div>
             <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase italic">Active Revenue Leak</span>
             <div className="flex items-baseline gap-3">
                <span className="text-xl font-black text-white/40">$</span>
                <span className="text-7xl font-black hero-text text-white">{animatedLoss}</span>
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest">/ HR</span>
             </div>
             <p className="text-xs font-bold text-white/30 uppercase mt-2">
                Equivalent to <span className="text-white">{lossPerHour.toLocaleString()}</span> Liters per hour
             </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-2">
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Daily projection</span>
                <span className="text-2xl font-black text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>${costPerDay.toFixed(0)}</span>
             </div>
             <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-2">
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">Monthly projection</span>
                <span className="text-2xl font-black text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>${costPerMonth.toLocaleString()}</span>
             </div>
          </div>

          <div className="p-5 rounded-3xl bg-accent/10 border border-accent/30 flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0 shadow-lg">
                <TrendingUp size={20} />
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-accent uppercase italic decoration-accent/40 decoration-wavy underline underline-offset-4">Prediction Threshold</span>
                <p className="text-sm font-bold text-white leading-tight mt-1">
                   Failure to isolate within 72h results in <span className="text-primary">${(costPerHour * 72).toFixed(0)}</span> secondary waste.
                </p>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 relative z-10 py-12 items-center justify-center text-center">
           <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-success/5 border border-success/10 flex items-center justify-center mb-4 transition-transform duration-700 group-hover:rotate-180">
                 <TrendingDown size={40} className="text-success opacity-40" />
              </div>
              <div className="absolute inset-0 bg-success blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
           </div>
           
           <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black tracking-[0.4em] text-success uppercase italic">Network Efficient</span>
              <h4 className="text-5xl font-black hero-text text-white tracking-tighter">$0.00 <span className="text-xl font-bold text-white/20 ml-2 italic">/hr loss</span></h4>
           </div>
           
           <div className="mt-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                 Guardian Logic saving approx. <span className="text-success">${savingsPerHour.toFixed(2)}/hr</span>
              </p>
           </div>
        </div>
      )}

      {/* Decorative pulse glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000 ${isAnomaly ? 'bg-primary' : 'bg-success'}`} />
    </div>
  );
}
