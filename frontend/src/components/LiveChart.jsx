import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LiveChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Awaiting telemetry data...</p>
      </div>
    );
  }

  // Format data for Recharts
  const data = history.map(item => ({
    time: item.timestamp.split(' ')[1], // Display just the time portion
    Pressure: item.pressure,
    Flow: item.flow_rate,
    is_anomaly: item.is_anomaly
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isAnomaly = payload[0].payload.is_anomaly;
      return (
        <div style={{
          background: isAnomaly ? 'rgba(255, 68, 68, 0.9)' : 'rgba(10, 15, 37, 0.9)',
          border: `1px solid ${isAnomaly ? 'var(--accent-red)' : 'var(--accent-cyan)'}`,
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          color: '#fff'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: 'var(--accent-cyan)' }}>
            Pressure: {payload[0].value.toFixed(2)} bar
          </p>
          <p style={{ margin: '4px 0 0 0', color: 'var(--accent-green)' }}>
            Flow: {payload[1].value.toFixed(1)} L/s
          </p>
          {isAnomaly && (
             <p style={{ margin: '8px 0 0 0', color: '#ffb3b3', fontSize: '0.8rem', fontWeight: 'bold' }}>
               ⚠️ AI Detected Anomaly
             </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Pipeline Telemetry (Real-Time Area Mapping)</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{fontSize: 12}} minTickGap={30} />
            <YAxis yAxisId="left" stroke="var(--accent-cyan)" domain={['auto', 'auto']} tick={{fontSize: 12}} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--accent-green)" domain={['auto', 'auto']} tick={{fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="Pressure" 
              stroke="var(--accent-cyan)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPressure)" 
              activeDot={{ r: 8, fill: 'var(--accent-cyan)', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="Flow" 
              stroke="var(--accent-green)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorFlow)" 
              activeDot={{ r: 8, fill: 'var(--accent-green)', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LiveChart;
