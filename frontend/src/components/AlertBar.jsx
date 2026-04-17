import { useEffect, useState, useRef } from 'react';
import { AlertCircle, X, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AlertBar({ data, voiceEnabled }) {
  const [visible, setVisible] = useState(false);
  const [alertContent, setAlertContent] = useState(null);
  const lastAlertRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!data?.recent) return;

    for (const [zone, readings] of Object.entries(data.recent)) {
      if (readings.is_anomaly && readings.id !== lastAlertRef.current) {
        lastAlertRef.current = readings.id;
        setAlertContent({ zone, pressure: readings.pressure, flow: readings.flow_rate });
        setVisible(true);

        if (voiceEnabled && 'speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(`Critical alert in ${zone}. Anomaly detected.`);
          u.rate = 1.0;
          window.speechSynthesis.speak(u);
        }

        const t = setTimeout(() => setVisible(false), 8000);
        return () => clearTimeout(t);
      }
    }
  }, [data, voiceEnabled]);

  return (
    <div className="fixed top-8 right-8 z-[100] w-full max-w-[400px] pointer-events-none">
      <div
        className={`glass-aurora pointer-events-auto flex items-stretch gap-0 p-0 rounded-2xl overflow-hidden transition-all duration-700 ease-premium shadow-2xl ${
          visible && alertContent 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-12 opacity-0 scale-95'
        }`}
        style={{ borderColor: 'var(--color-primary)' }}
      >
        {/* Urgent Accent Bar */}
        <div className="w-2 bg-primary animate-pulse" />

        <div className="flex-1 p-5 flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                 <AlertCircle size={18} className="animate-bounce" />
                 <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Critical Signal</span>
              </div>
              <button 
                onClick={() => setVisible(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                 <X size={16} />
              </button>
           </div>

           <div className="flex flex-col gap-1">
              <h4 className="text-lg font-black hero-text text-white leading-tight">
                 Anomaly in {alertContent?.zone}
              </h4>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                 System integrity compromised · Pulse {alertContent?.pressure?.toFixed(2)} Bar
              </p>
           </div>

           <button
             onClick={() => {
                const id = alertContent?.zone?.split(' ')[1];
                if (id) navigate({ to: '/zone/$zoneId', params: { zoneId: id } });
                setVisible(false);
             }}
             className="mt-2 flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group/btn"
           >
              <span className="text-[10px] font-black tracking-widest uppercase">Inspect Node</span>
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
}
