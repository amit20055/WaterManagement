import { Activity, Volume2, VolumeX } from 'lucide-react';

export default function Header({ voiceEnabled, setVoiceEnabled }) {
  return (
    <div className="glass grid-noise p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Pulsing activity icon */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'oklch(0.82 0.18 210 / 0.12)' }}>
            <Activity size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse-glow" style={{ background: 'var(--color-accent)', border: '2px solid var(--color-background)' }} />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--color-muted)' }}>
            SMART WATER · ML ANOMALY DETECTION
          </p>
          <h1 className="text-2xl font-bold text-gradient">IoT Water Flow Command Center</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* LIVE pill */}
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider" style={{ background: 'oklch(0.88 0.22 145 / 0.12)', color: 'var(--color-accent)', border: '1px solid oklch(0.88 0.22 145 / 0.25)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }} />
          LIVE
        </span>

        {/* Mute/Unmute button */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'oklch(0.98 0.01 240 / 0.06)',
            border: '1px solid var(--color-border)',
          }}
          title={voiceEnabled ? 'Mute Voice Alerts' : 'Enable Voice Alerts'}
        >
          {voiceEnabled
            ? <Volume2 size={18} style={{ color: 'var(--color-accent)' }} />
            : <VolumeX size={18} style={{ color: 'var(--color-muted)' }} />
          }
        </button>
      </div>
    </div>
  );
}
