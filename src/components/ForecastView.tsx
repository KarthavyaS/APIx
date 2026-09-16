import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ForecastPoint } from '../types';
import { Calendar, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';

interface ForecastViewProps {
  forecastData: ForecastPoint[];
}

export const ForecastView: React.FC<ForecastViewProps> = ({ forecastData }) => {
  const chartData = (forecastData || []).map((d) => ({
    date: d?.date ? d.date.slice(5) : 'N/A',
    fullDate: d?.date || 'N/A',
    predictedIndex: d?.predictedIndex ?? 100.0,
    lower: d?.lowerConfidence ?? 95.0,
    upper: d?.upperConfidence ?? 105.0,
    avgFare: d?.projectedAvgFare ?? 0,
    event: d?.holidayOrEvent,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            14-Day ML Fare Index Forecast
          </h2>
          <p className="text-xs text-slate-500">
            XGBoost & Seasonal Holt-Winters hybrid model projecting price index with 95% confidence intervals
          </p>
        </div>
        <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md">
          Model: XGB-HoltWinters-v1.4
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastSpread" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono">
                        <div className="font-bold text-indigo-300 mb-1">{data.fullDate}</div>
                        <div>Forecast Index: <strong className="text-white">{data.predictedIndex}</strong></div>
                        <div className="text-slate-400">95% Range: [{data.lower} — {data.upper}]</div>
                        <div className="text-emerald-400 mt-1">Projected Fare: ₹{data.avgFare?.toLocaleString('en-IN')}</div>
                        {data.event && (
                          <div className="text-amber-300 mt-1 pt-1 border-t border-slate-700 font-sans">
                            ⚡ Event: {data.event}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="url(#forecastSpread)"
                name="Confidence Range (Upper)"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="#ffffff"
                name="Confidence Range (Lower)"
              />
              <Line
                type="monotone"
                dataKey="predictedIndex"
                name="Projected Index"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f46e5' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Calendar Events */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Projected Aviation Events</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Upcoming external factors influencing booking curves over next 14 days:
            </p>

            <div className="space-y-2">
              {forecastData
                .filter((f) => f.holidayOrEvent)
                .map((f) => (
                  <div key={f.date} className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-600">
                      <span>{f.date}</span>
                      <span>Index ~{f.predictedIndex}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      {f.holidayOrEvent}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Expected Avg: ₹{f.projectedAvgFare.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Model retrained on every scheduled 24h scraping run.
          </div>
        </div>
      </div>
    </div>
  );
};
