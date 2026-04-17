import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';

function MLExplanationPanel() {
  return (
    <div className="panel ml-explanation-panel">
      <div className="ml-header">
        <BrainCircuit color="var(--accent-blue)" size={28} />
        <h2>AI Engine: Isolation Forest</h2>
      </div>
      <div className="ml-content">
        <p className="ml-intro">
          <strong>How it works:</strong> The dashboard runs an Isolation Forest machine learning model in the background. It was trained on 1,000 rows of historical pipeline data to learn the structural "shape" of normal water flow.
        </p>
        
        <div className="ml-visual-concept">
          <div className="ml-cluster-box">
             <div className="ml-inliers">Normal Operation Cluster (Pressure ~3.0 bar)</div>
             <div className="ml-outlier-dot anomaly-example"></div>
             <div className="ml-outlier-label">Leak / Anomaly</div>
          </div>
        </div>

        <div className="ml-details">
          <div className="ml-fact">
            <Info size={16} color="var(--accent-cyan)" />
            <span>Normal bounds: Pressure ~3.0 bar | Flow ~100 L/s</span>
          </div>
          <div className="ml-fact">
             <Info size={16} color="var(--accent-red)" />
             <span>If current metrics stray too far from the tight blue cluster, the AI mathematically isolates them and triggers an automatic real-time Alert.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MLExplanationPanel;
