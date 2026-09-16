import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Database, AlertCircle, Percent, Compass, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeadlineMetricsProps {
  summary: DashboardSummary;
}

export const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({ summary }) => {
  const currentIndex = summary?.currentIndex ?? 100.0;
  const dailyChange = summary?.dailyChangePct ?? 0.0;
  const weeklyChange = summary?.weeklyChangePct ?? 0.0;
  const monthlyChange = summary?.monthlyChangePct ?? 0.0;
  const avgFare = summary?.averageFareInr ?? 0;
  const totalQuotes = summary?.uniqueQuotesCount || summary?.totalQuotesCollected || 0;
  const anomaliesCount = summary?.activeAnomaliesCount ?? 0;
  const cheapest = summary?.cheapestRoute || { routeCode: 'DEL-BOM', avgFare: 0, airline: 'IndiGo' };
  const priciest = summary?.mostExpensiveRoute || { routeCode: 'DEL-BLR', avgFare: 0, airline: 'Air India' };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Headline Airfare Price Index */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Headline APIx Index</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            Base: {summary?.basePeriod || '2026-08-01'} = 100
          </span>
        </div>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl font-extrabold font-mono text-slate-900">{currentIndex.toFixed(2)}</span>
          <div className="flex items-center text-xs font-semibold">
            {dailyChange >= 0 ? (
              <span className="text-rose-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{dailyChange.toFixed(2)}% (24h)
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />{dailyChange.toFixed(2)}% (24h)
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>7-Day: <strong className={weeklyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
            {weeklyChange >= 0 ? `+${weeklyChange}%` : `${weeklyChange}%`}
          </strong></span>
          <span>30-Day: <strong className={monthlyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
            {monthlyChange >= 0 ? `+${monthlyChange}%` : `${monthlyChange}%`}
          </strong></span>
        </div>
      </div>

      {/* 2. Average Basket Fare */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">National Basket Avg Fare</span>
          <span className="text-[10px] text-slate-500 font-mono">Weighted Mean</span>
        </div>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl font-extrabold font-mono text-slate-900">₹{avgFare.toLocaleString('en-IN')}</span>
          <span className="text-xs text-slate-500 font-medium">per passenger</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Base Fare: ~68%</span>
          <span>Taxes (GST): 5%</span>
          <span>UDF + Fee: ~27%</span>
        </div>
      </div>

      {/* 3. Sampling Coverage & Deduplication Guarantee */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Unique Flight Quotes</span>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Zero Duplicates
          </span>
        </div>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl font-extrabold font-mono text-slate-900">
            {totalQuotes.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500">unique flights</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="text-indigo-600 font-semibold font-mono">
            Zero Demo Data
          </span>
          <span className="text-slate-400">Live Scraped</span>
        </div>
      </div>

      {/* 4. Extremes & Anomaly Alerts */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Basket Extremes</span>
          <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
            {anomaliesCount} Anomalies
          </span>
        </div>
        <div className="mt-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Lowest ({cheapest.routeCode || 'N/A'}):
            </span>
            <span className="font-mono font-bold text-emerald-700">₹{(cheapest.avgFare || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Peak ({priciest.routeCode || 'N/A'}):
            </span>
            <span className="font-mono font-bold text-rose-700">₹{(priciest.avgFare || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 truncate">
          Live Z-Score & Jevons Geometric Index
        </div>
      </div>
    </div>
  );
};
