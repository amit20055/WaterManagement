import React from 'react';
import { Activity, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';

function ZoneOverview({ data, onSelectZone }) {
  if (!data || !data.recent) return null;

  // Assuming ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
  const zones = Object.keys(data.recent).sort();

  return (
    <div className="zone-overview-grid">
      {zones.map((zoneName) => {
        const zoneData = data.recent[zoneName];
        if (!zoneData) return null; // Still waiting for initial data

        const isAnomaly = zoneData.is_anomaly;
        const cardClass = `panel zone-card ${isAnomaly ? 'zone-alert' : ''}`;
        const StatusIcon = isAnomaly ? AlertTriangle : CheckCircle;

        return (
          <div 
            key={zoneName} 
            className={cardClass}
            onClick={() => onSelectZone(zoneName)}
          >
            <div className="zone-card-header">
              <h2>{zoneName}</h2>
              <div className={`zone-status-icon ${isAnomaly ? 'text-red' : 'text-green'}`}>
                <StatusIcon size={24} />
              </div>
            </div>
            
            <div className="zone-metrics">
              <div className="metric">
                <Activity size={18} className="text-secondary" />
                <span>{zoneData.pressure ? zoneData.pressure.toFixed(2) : '--'} <small>bar</small></span>
              </div>
              <div className="metric">
                <Droplets size={18} className="text-secondary" />
                <span>{zoneData.flow_rate ? zoneData.flow_rate.toFixed(1) : '--'} <small>L/s</small></span>
              </div>
            </div>

            {isAnomaly && (
              <div className="anomaly-warning">
                ⚠️ Leak Alert Detected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ZoneOverview;
