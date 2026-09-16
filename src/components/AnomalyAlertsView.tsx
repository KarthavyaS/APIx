import React, { useState } from 'react';
import { AnomalyAlert } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnomalyAlertsViewProps {
  anomalies: AnomalyAlert[];
  onToggleInvestigated: (id: string) => void;
}

export const AnomalyAlertsView: React.FC<AnomalyAlertsViewProps> = ({
  anomalies,
  onToggleInvestigated,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = anomalies.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: AnomalyAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Automated Anomaly Intelligence & Alerts
          </h2>
          <p className="text-xs text-slate-500">
            Real-time statistical outlier detection using Isolation Forest and Route-Window Z-Score thresholds
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((anomaly) => (
          <div
            key={anomaly.id}
            className={`p-4 rounded-xl border transition ${
              anomaly.isInvestigated
                ? 'bg-slate-50/70 border-slate-200 opacity-75'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 p-2 rounded-lg ${
                    anomaly.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-700'
                      : anomaly.severity === 'HIGH'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      {anomaly.routeCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {anomaly.airlineName} ({anomaly.advanceWindow})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(
                        anomaly.severity
                      )}`}
                    >
                      {anomaly.severity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {anomaly.anomalyType.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    {anomaly.causeDescription}
                  </p>

                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Detected: {new Date(anomaly.timestamp).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Price comparison & action */}
              <div className="flex items-center justify-between md:justify-end space-x-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-sans">Observed vs Expected</div>
                  <div className="flex items-baseline space-x-1.5 font-mono">
                    <span className="text-sm font-bold text-slate-900">
                      ₹{anomaly.observedFare.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{anomaly.expectedFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold font-mono">
                    {anomaly.deviationPct >= 0 ? (
                      <span className="text-rose-600 flex items-center justify-end">
                        <ArrowUpRight className="w-3 h-3" />+{anomaly.deviationPct}%
                      </span>
                    ) : (
                      <span className="text-emerald-600 flex items-center justify-end">
                        <ArrowDownRight className="w-3 h-3" />{anomaly.deviationPct}%
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onToggleInvestigated(anomaly.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    anomaly.isInvestigated
                      ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 font-semibold'
                  }`}
                >
                  {anomaly.isInvestigated ? 'Mark Active' : 'Acknowledge'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
