import React, { useEffect, useState } from 'react';
import { AlertOctagon, X, Search } from 'lucide-react';

function AlertPopup({ data, globalView, selectedZone, voiceEnabled }) {
  const [visible, setVisible] = useState(false);
  const [lastAlertId, setLastAlertId] = useState(null);
  const [alertContent, setAlertContent] = useState(null);

  useEffect(() => {
    if (!voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!data || !data.recent) return;

    let anomalyZone = null;
    let anomalyData = null;

    if (globalView) {
      for (const [zone, readings] of Object.entries(data.recent)) {
        if (readings.is_anomaly && readings.id !== lastAlertId) {
          anomalyZone = zone;
          anomalyData = readings;
          break;
        }
      }
    } else if (selectedZone && data.recent[selectedZone]) {
      const readings = data.recent[selectedZone];
      if (readings.is_anomaly && readings.id !== lastAlertId) {
        anomalyZone = selectedZone;
        anomalyData = readings;
      }
    }

    if (anomalyZone && anomalyData) {
      setVisible(true);
      setLastAlertId(anomalyData.id);
      setAlertContent({
         zone: anomalyZone, 
         pressure: anomalyData.pressure, 
         flow: anomalyData.flow_rate 
      });
      
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Critical Alert! Pipeline anomaly detected in ${anomalyZone}. Investigating required.`);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [data, globalView, selectedZone, lastAlertId, voiceEnabled]);

  return (
    <div className="alert-bar-wrapper">
      <div className={`alert-bar ${visible && alertContent ? 'visible' : ''}`}>
        <div className="alert-bar-content">
          <div className="alert-bar-icon">
            <AlertOctagon size={28} color="#FF4444" />
          </div>
          <div className="alert-bar-text">
            <h4>Critical: Leak Detected in {alertContent?.zone}</h4>
            <p>AI Engine detected anomaly: Pressure {alertContent?.pressure?.toFixed(1)}bar | Flow {alertContent?.flow?.toFixed(1)}L/s</p>
          </div>
        </div>
        <div className="alert-bar-actions">
          {globalView && (
            <button className="back-btn" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: '#fff', borderColor: 'var(--accent-red)' }}>
              <Search size={16} style={{marginRight: '6px', display: 'inline'}} /> Inspect
            </button>
          )}
          <button className="alert-bar-close" onClick={() => setVisible(false)}>
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
