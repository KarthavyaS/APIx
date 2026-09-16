import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { IndexDataPoint } from '../types';

interface IndexTrendChartProps {
  dailyData: IndexDataPoint[];
  weeklyData: Array<{ weekNumber: string; avgIndex: number; avgFare: number }>;
  monthlyData: Array<{ month: string; indexValue: number; avgFare: number }>;
}

export const IndexTrendChart: React.FC<IndexTrendChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showSubRoutes, setShowSubRoutes] = useState(false);

  // Transform data according to timeframe
  let chartData: any[] = [];
  if (timeframe === 'daily') {
    chartData = (dailyData || []).map((d) => ({
      label: d?.date ? d.date.slice(5) : 'N/A', // MM-DD
      fullDate: d?.date || 'N/A',
      headlineIndex: d?.indexValue ?? 100.0,
      avgFare: d?.avgFareInr ?? 0,
      'DEL-BOM': d?.routeIndices?.['DEL-BOM'],
      'DEL-BLR': d?.routeIndices?.['DEL-BLR'],
      'BOM-BLR': d?.routeIndices?.['BOM-BLR'],
      'DEL-CCU': d?.routeIndices?.['DEL-CCU'],
      'BLR-HYD': d?.routeIndices?.['BLR-HYD'],
      'MAA-DEL': d?.routeIndices?.['MAA-DEL'],
    }));
  } else if (timeframe === 'weekly') {
    chartData = (weeklyData || []).map((w) => ({
      label: w?.weekNumber || 'W1',
      fullDate: w?.weekNumber || 'Week 1',
      headlineIndex: w?.avgIndex ?? 100.0,
      avgFare: w?.avgFare ?? 0,
    }));
  } else {
    chartData = (monthlyData || []).map((m) => ({
      label: m?.month ? m.month.split(' ')[0] : 'Month',
      fullDate: m?.month || 'Current Month',
      headlineIndex: m?.indexValue ?? 100.0,
      avgFare: m?.avgFare ?? 0,
    }));
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono space-y-1">
          <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1 font-sans">
            {data.fullDate}
          </div>
          <div className="flex justify-between items-center gap-4 text-indigo-400 font-semibold">
            <span>APIx Composite:</span>
            <span>{data.headlineIndex?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-4 text-emerald-400">
            <span>Basket Avg Fare:</span>
            <span>₹{data.avgFare?.toLocaleString('en-IN')}</span>
          </div>
          {showSubRoutes && (
            <div className="pt-1 mt-1 border-t border-slate-800 space-y-0.5 text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>DEL-BOM:</span> <span>{data['DEL-BOM']}</span>
              </div>
              <div className="flex justify-between">
                <span>DEL-BLR:</span> <span>{data['DEL-BLR']}</span>
              </div>
              <div className="flex justify-between">
                <span>DEL-CCU:</span> <span>{data['DEL-CCU']}</span>
              </div>
              <div className="flex justify-between">
                <span>BOM-BLR:</span> <span>{data['BOM-BLR']}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Airfare Price Index (APIx) Time Series
          </h2>
          <p className="text-xs text-slate-500">
            Weighted Laspeyres base aggregation benchmarked at 100.00 (Base Period: Aug 2026)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {timeframe === 'daily' && (
            <label className="flex items-center space-x-1.5 text-xs text-slate-600 mr-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSubRoutes}
                onChange={(e) => setShowSubRoutes(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span>Route Basket Lines</span>
            </label>
          )}

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                timeframe === 'daily'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                timeframe === 'weekly'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                timeframe === 'monthly'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
            <p className="text-xs font-medium">No index records found for the selected timeframe.</p>
            <p className="text-[11px] text-slate-400 mt-1">Trigger an ethical scrape run to compute new index points.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(v) => Number(v).toFixed(0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="4 4" label={{ value: 'Base 100.0', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }} />

              <Area
                type="monotone"
                dataKey="headlineIndex"
                name="APIx Composite Index"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#indexGradient)"
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#4f46e5' }}
              />

              {showSubRoutes && timeframe === 'daily' && (
                <>
                  <Line type="monotone" dataKey="DEL-BOM" name="DEL-BOM" stroke="#0ea5e9" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="DEL-BLR" name="DEL-BLR" stroke="#10b981" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="DEL-CCU" name="DEL-CCU" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="BLR-HYD" name="BLR-HYD" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="2 2" />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-indigo-600 inline-block"></span>
            <span>Composite Weighted Basket (Headline Index)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-400">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
            <span>Base Benchmark: 100.00</span>
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Source: Automated Multi-Source Scraper Engine & DGCA Basket Weights
        </div>
      </div>
    </div>
  );
};
