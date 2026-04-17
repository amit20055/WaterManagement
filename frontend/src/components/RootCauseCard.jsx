import { Search, AlertTriangle, Wrench, Droplets, ShieldCheck, Microscope } from 'lucide-react';

function analyzeRootCause(latest, history) {
  if (!latest?.is_anomaly) return null;

  const p = latest.pressure;
  const f = latest.flow_rate;

  const recentPressures = history.slice(-10).map(h => h.pressure);
  const pressureTrend = recentPressures.length > 2
    ? recentPressures[recentPressures.length - 1] - recentPressures[0]
    : 0;

  if (p > 4.0 && f < 50) {
    return {
      type: 'VALVE RESTRICTION',
      label: 'VALVE FAILURE',
      reason: 'Downstream obstruction suspected',
      action: 'INITIATE VALVE BYPASS',
      color: 'var(--color-primary)'
    };
  } else if (p < 2.0 && f > 150) {
    return {
      type: 'CATASTROPHIC BURST',
      label: 'MAIN BURST',
      reason: 'Primary trunk line failure',
      action: 'ISOLATE MAIN FEEDER',
      color: 'var(--color-primary)'
    };
  } else if (Math.abs(pressureTrend) > 0.4) {
    return {
      type: 'PROGRESSIVE LEAK',
      label: 'GRADUAL LEAK',
      reason: 'Gasket degradation identified',
      action: 'SCHEDULE INSPECTION',
      color: 'var(--color-accent)'
    };
  } else {
    return {
      type: 'TELEMETRY ANOMALY',
      label: 'SIGNAL NOISE',
      reason: 'Transient sensor fluctuation',
      action: 'RECALIBRATE SENSOR',
      color: 'var(--color-info)'
    };
  }
}

export default function RootCauseCard({ latest, history }) {
  const diagnosis = analyzeRootCause(latest, history || []);

  return (
    <div className={`glass-aurora p-8 rounded-[40px] flex flex-col gap-8 relative overflow-hidden transition-all duration-500 min-h-[400px] ${latest?.is_anomaly ? 'bg-primary/5 border-primary/40 shadow-2xl' : ''}`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-1">Root Cause Analysis</span>
          <h3 className="text-2xl font-black hero-text text-white uppercase italic tracking-tight">Diagnostic Stack</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl ${
          latest?.is_anomaly ? 'bg-primary/20 border-primary/40 text-primary animate-pulse' : 'bg-success/10 border-success/30 text-success'
        }`}>
          <Search size={28} />
        </div>
      </div>

      {!latest?.is_anomaly ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12 text-center relative z-10">
           <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-success/5 border border-success/10 flex items-center justify-center mb-4 transition-transform duration-1000 group-hover:rotate-180">
                 <ShieldCheck size={40} className="text-success opacity-24" />
              </div>
              <div className="absolute inset-0 bg-success blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black tracking-[0.4em] text-success uppercase italic">System Integrity Verified</span>
              <p className="text-sm font-bold text-white/40 max-w-[240px]">
                 Isolation Forest confirms zero structural deviations in current signal buffer.
              </p>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-8 relative z-10">
          <div className="flex flex-col gap-5">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-primary uppercase italic">Threat Identification</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">Layer 4 Analysis</span>
             </div>
             
             <div className="flex items-start gap-5 p-6 rounded-[32px] bg-primary/10 border border-primary/20">
                <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shrink-0 shadow-lg">
                   <AlertTriangle size={32} />
                </div>
                <div className="flex flex-col gap-1">
                   <h4 className="text-2xl font-black hero-text text-white leading-tight uppercase italic underline decoration-primary/40 decoration-wavy underline-offset-4">{diagnosis.label}</h4>
                   <p className="text-sm font-bold text-white/60 leading-relaxed italic">
                      Classification Confidence: <span className="text-primary">{(latest.confidence || 0).toFixed(1)}%</span> against Hyperplane dataset.
                   </p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-3 group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center text-info"><Wrench size={16} /></div>
                   <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Recommendation</span>
                </div>
                <p className="text-sm font-black text-white italic underline decoration-info/30 underline-offset-4">{diagnosis.action}</p>
             </div>
             <div className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-3 group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent"><Microscope size={16} /></div>
                   <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Deduction</span>
                </div>
                <p className="text-sm font-bold text-white/60 leading-tight">Anomaly pattern matches <span className="text-accent italic font-black">{diagnosis.reason}</span> logic.</p>
             </div>
          </div>
        </div>
      )}

      {/* Decorative pulse glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000 ${latest?.is_anomaly ? 'bg-primary' : 'bg-success'}`} />
    </div>
  );
}
