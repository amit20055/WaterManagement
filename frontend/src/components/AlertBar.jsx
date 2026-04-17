import { useEffect, useState, useRef } from 'react';
import { AlertOctagon, X, Search } from 'lucide-react';
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
          const u = new SpeechSynthesisUtterance(`Critical leak detected in ${zone}. Pressure ${readings.pressure.toFixed(1)} bar.`);
          u.rate = 1.0;
          window.speechSynthesis.speak(u);
        }

        const t = setTimeout(() => setVisible(false), 8000);
        return () => clearTimeout(t);
      }
    }
  }, [data, voiceEnabled]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[640px] pointer-events-none">
      <div
        className={`glass-strong pointer-events-auto flex items-center gap-4 p-4 transition-all duration-500 ${visible && alertContent ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'}`}
        style={{ borderColor: 'oklch(0.66 0.24 25 / 0.4)' }}
      >
        {/* Icon chip */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow" style={{ background: 'oklch(0.66 0.24 25 / 0.2)', border: '1px solid oklch(0.66 0.24 25 / 0.3)' }}>
          <AlertOctagon size={24} style={{ color: 'var(--color-destructive)' }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">Critical: Leak detected in {alertContent?.zone}</p>
          <p className="text-xs font-mono truncate" style={{ color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
            Isolation Forest anomaly · Pressure {alertContent?.pressure?.toFixed(2)} bar · Flow {alertContent?.flow?.toFixed(1)} L/s
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={() => {
            const id = alertContent?.zone?.split(' ')[1];
            if (id) navigate({ to: '/zone/$zoneId', params: { zoneId: id } });
            setVisible(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all hover:scale-105"
          style={{ background: 'oklch(0.66 0.24 25 / 0.2)', color: 'var(--color-destructive)', border: '1px solid oklch(0.66 0.24 25 / 0.3)' }}
        >
          <Search size={14} /> Inspect
        </button>
        <button onClick={() => setVisible(false)} className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--color-muted)' }}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
