import React from 'react';

function LogsTable({ history }) {
  // Show the most recent 10 logs in descending order (newest first)
  const recentLogs = [...history].reverse().slice(0, 10);

  return (
    <div className="panel logs-container">
      <h2>Recent Events</h2>
      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Pressure (bar)</th>
              <th>Flow Rate (L/s)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ color: '#94a3b8' }}>{log.timestamp}</td>
                <td>{log.pressure.toFixed(2)}</td>
                <td>{log.flow_rate.toFixed(2)}</td>
                <td>
                  <span className={`badge ${log.is_anomaly ? 'anomaly' : 'normal'}`}>
                    {log.is_anomaly ? 'Leak Alert' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
            {recentLogs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>Waiting for data...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsTable;
