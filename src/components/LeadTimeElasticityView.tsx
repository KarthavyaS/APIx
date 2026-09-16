import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LeadTimeElasticity } from '../types';
import { TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface LeadTimeElasticityViewProps {
  elasticityData: LeadTimeElasticity[];
}

export const LeadTimeElasticityView: React.FC<LeadTimeElasticityViewProps> = ({ elasticityData }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');

  const safeElasticityData = elasticityData || [];
  const windows = ['T+45', 'T+30', 'T+15', 'T+7', 'T+1'];

  // Prepare chart series: each window has points for routes
  const chartData = windows.map((w) => {
    const point: any = { window: w };
    safeElasticityData.forEach((r) => {
      point[r.routeCode] = r?.windows?.[w as keyof typeof r.windows]?.avgFare || 0;
    });
    return point;
  });

  const colors: Record<string, string> = {
    'DEL-BOM': '#0ea5e9',
    'DEL-BLR': '#10b981',
    'BOM-BLR': '#f59e0b',
    'DEL-CCU': '#8b5cf6',
    'BLR-HYD': '#ec4899',
    'MAA-DEL': '#6366f1',
  };

  const currentRouteData = safeElasticityData.find((r) => r.routeCode === selectedRoute) || safeElasticityData[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Advance-Purchase Elasticity & Surge Curves
          </h2>
          <p className="text-xs text-slate-500">
            Aviation revenue-management pricing progression from T+45 early bird to T+1 day-before departure
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Focus Route:</span>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Basket Corridors</option>
            {safeElasticityData.map((r) => (
              <option key={r.routeCode} value={r.routeCode}>
                {r.routeCode} ({r.routeTitle})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="window"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                labelFormatter={(label) => `Advance Window: ${label}`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {selectedRoute === 'ALL' ? (
                safeElasticityData.map((r) => (
                  <Line
                    key={r.routeCode}
                    type="monotone"
                    dataKey={r.routeCode}
                    name={r.routeCode}
                    stroke={colors[r.routeCode] || '#6366f1'}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={selectedRoute}
                  name={selectedRoute}
                  stroke={colors[selectedRoute] || '#6366f1'}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistical Summary Panel */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Surge Multipliers ({currentRouteData?.routeCode || 'Basket'})</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Price multiplier relative to T+45 early booking baseline across time horizons:
            </p>

            <div className="space-y-2 text-xs">
              {windows.map((win) => {
                const info = currentRouteData?.windows?.[win as keyof typeof currentRouteData.windows];
                const mult = info?.multiplierVsT45 || 1.0;
                const avgFare = info?.avgFare || 0;
                return (
                  <div key={win} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700">{win}</span>
                      <span className="text-[10px] text-slate-400">
                        {win === 'T+45' ? 'Early Baseline' : win === 'T+1' ? 'Last-Minute' : 'Intermediate'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 font-mono">
                      <span className="text-slate-600">₹{avgFare.toLocaleString('en-IN')}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          mult >= 2.0
                            ? 'bg-rose-100 text-rose-800'
                            : mult >= 1.4
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {mult}x
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Aviation Insight:</span> Indian domestic routes experience steep surge acceleration starting at <strong className="text-indigo-600">T+7</strong> due to corporate and emergency booking elasticity.
          </div>
        </div>
      </div>
    </div>
  );
};
