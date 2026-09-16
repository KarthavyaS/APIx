import React from 'react';
import { Airline, DataSource } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Plane, ShieldCheck, CheckCircle2, AlertCircle, Clock, Timer, AlertTriangle } from 'lucide-react';

interface AirlineComparisonViewProps {
  airlines: Airline[];
  sources: DataSource[];
}

export const AirlineComparisonView: React.FC<AirlineComparisonViewProps> = ({ airlines, sources }) => {
  // Component breakdown sample data for airlines
  const chartData = airlines.map((a) => {
    const base = Math.round(a.avgFareInr * 0.70);
    const taxes = Math.round(base * 0.05);
    const udf = 480;
    const convenience = a.type === 'FSC' ? 299 : 350;
    return {
      name: a.name,
      code: a.code,
      BaseFare: base,
      GST_Taxes: taxes,
      AirportUDF: udf,
      ConvenienceFee: convenience,
      TotalFare: a.avgFareInr,
      marketShare: a.marketSharePct,
    };
  });

  return (
    <div className="space-y-6 mb-6">
      {/* Carrier Performance & Component Split */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Airline Comparison & Fare Component Separation
            </h2>
            <p className="text-xs text-slate-500">
              Analysis of commercial carrier domestic yields and regulatory unbundled fare structures
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            DGCA Civil Aviation Yield Framework
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stacked Bar Chart */}
          <div className="lg:col-span-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="BaseFare" name="Base Fare" stackId="a" fill="#6366f1" />
                <Bar dataKey="GST_Taxes" name="GST (5%)" stackId="a" fill="#10b981" />
                <Bar dataKey="AirportUDF" name="Airport UDF" stackId="a" fill="#f59e0b" />
                <Bar dataKey="ConvenienceFee" name="Convenience Fee" stackId="a" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Share Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Domestic Passenger Market Share
            </h3>
            {airlines.map((airline) => (
              <div
                key={airline.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-3 h-8 rounded-sm"
                    style={{ backgroundColor: airline.brandColor }}
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>{airline.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {airline.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Avg: ₹{airline.avgFareInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-slate-900">
                    {airline.marketSharePct}%
                  </div>
                  <div className="text-[10px] text-slate-400">DGCA Share</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Data Sources (Airlines + OTAs) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ethical Scraper Adapters & Data Sources</h3>
            <p className="text-xs text-slate-500">Live health, rate limits, robots.txt compliance & polite backoff wait queues</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Zero Duplicate Ingestion</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ethical Retry Cooldown</span>
            </div>
          </div>
        </div>

        {/* Informational Policy Banner */}
        <div className="mb-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Polite Retry & Zero-Duplication Protocol:</strong> If an airline or OTA blocks requests, encounters rate limiting (429), or requires transient cool-off, the adapter automatically pauses and enters a 3-minute backoff wait queue. It will <em>never</em> generate duplicate rows or hammer target systems.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src) => {
            const isWaiting = src.status === 'COOLDOWN_WAIT' || src.isWaitingCooldown;
            return (
              <div
                key={src.id}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  isWaiting
                    ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-200'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{src.name}</span>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        {src.type}
                      </div>
                    </div>
                    {isWaiting ? (
                      <span className="flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        <Timer className="w-3 h-3 text-amber-600" />
                        <span>COOLDOWN ({Math.floor((src.cooldownRemainingSeconds || 160) / 60)}m {(src.cooldownRemainingSeconds || 160) % 60}s)</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{src.status}</span>
                      </span>
                    )}
                  </div>

                  {isWaiting && src.cooldownReason && (
                    <div className="mt-2 text-[10px] bg-amber-100/60 text-amber-900 px-2 py-1 rounded border border-amber-200/60 leading-tight">
                      {src.cooldownReason}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                  <span>Rate: {src.rateLimitPerMin} req/m</span>
                  <span className="text-indigo-600 font-semibold">{src.quotesToday} quotes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
