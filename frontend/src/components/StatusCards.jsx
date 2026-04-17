import React from 'react';
import { Activity, Droplets, BrainCircuit, CheckCircle } from 'lucide-react';

function StatusCards({ latestData }) {
  if (!latestData) return null;

  const { pressure, flow_rate, is_anomaly } = latestData;

  const healthStatus = is_anomaly ? 'Anomaly Identified' : 'Running Normally';
  const healthClass = is_anomaly ? 'anomaly' : '';

  return (
    <div className="status-grid">
      <div className="panel status-card">
        <div className="status-icon icon-blue">
          <Activity size={24} />
        </div>
        <div className="status-content">
          <h3>Line Pressure</h3>
          <div className="value">{pressure ? pressure.toFixed(2) : '--'} <span style={{fontSize: '1rem', color: '#94a3b8'}}>bar</span></div>
        </div>
      </div>

      <div className="panel status-card">
        <div className="status-icon icon-green">
          <Droplets size={24} />
        </div>
        <div className="status-content">
          <h3>Flow Rate</h3>
          <div className="value">{flow_rate ? flow_rate.toFixed(1) : '--'} <span style={{fontSize: '1rem', color: '#94a3b8'}}>L/s</span></div>
        </div>
      </div>

      <div className={`panel status-card ai-logic-card ${healthClass}`}>
        <div className={`status-icon ${is_anomaly ? 'icon-red' : 'icon-green'}`}>
          {is_anomaly ? <BrainCircuit size={24} /> : <CheckCircle size={24} />}
        </div>
        <div className="status-content" style={{ width: '100%' }}>
          <h3>AI Decision Engine</h3>
          <div className="value" style={{ color: is_anomaly ? '#ef4444' : '#10b981', fontSize: '1.2rem' }}>{healthStatus}</div>
          {is_anomaly && (
            <div className="logic-reasoning">
              Isolation Forest isolated this vector. Pressure or Flow broke statistically outside the historical cluster boundaries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusCards;
