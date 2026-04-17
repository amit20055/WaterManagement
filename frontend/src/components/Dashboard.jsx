import React, { useState } from 'react';
import { Settings, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import StatusCards from './StatusCards';
import LiveChart from './LiveChart';
import LogsTable from './LogsTable';
import AlertPopup from './AlertPopup';
import ZoneOverview from './ZoneOverview';
import MLExplanationPanel from './MLExplanationPanel';
import StatsStrip from './StatsStrip';

function Dashboard({ data, error }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(false);

  if (error) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="panel" style={{ textAlign: 'center', borderColor: 'var(--accent-red)' }}>
          <h2 style={{ color: 'var(--accent-red)' }}>Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Filter data for the selected zone
  const zoneLatest = selectedZone && data.recent ? data.recent[selectedZone] : null;
  const zoneHistory = selectedZone && data.history ? data.history.filter(item => item.zone === selectedZone) : [];

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          {selectedZone ? (
            <button className="back-btn" onClick={() => setSelectedZone(null)} title="Back to Overview">
              <ArrowLeft size={28} />
            </button>
          ) : (
            <Settings color="var(--accent-cyan)" size={28} />
          )}
          <h1>
            {selectedZone ? `Pipeline Detail: ${selectedZone}` : 'IoT Water Flow Monitor'}
          </h1>
        </div>
        <div className="header-controls" style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="back-btn" 
            title={voiceAlertsEnabled ? "Mute Voice Alerts" : "Enable Voice Alerts"}
            onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
          >
            {voiceAlertsEnabled ? <Volume2 size={24} color="var(--accent-green)" /> : <VolumeX size={24} color="var(--text-secondary)" />}
          </button>
          
          {selectedZone && (
            <select 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
              <option value="Zone E">Zone E</option>
            </select>
          )}
        </div>
      </header>

      {!selectedZone ? (
        <>
          <StatsStrip data={data} />
          <MLExplanationPanel />
          <ZoneOverview data={data} onSelectZone={setSelectedZone} />
        </>
      ) : (
        <>
          <StatusCards latestData={zoneLatest} />
          <LiveChart history={zoneHistory} />
          <LogsTable history={zoneHistory} />
        </>
      )}
      
      {/* AlertPopup stays mounted globally so it can show alerts across any zone in overview mode */}
      <AlertPopup data={data} globalView={!selectedZone} selectedZone={selectedZone} voiceEnabled={voiceAlertsEnabled} />
    </div>
  );
}

export default Dashboard;
