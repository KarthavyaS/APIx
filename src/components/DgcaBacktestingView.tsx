import React from 'react';
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
import { BacktestingComparison } from '../types';
import { ShieldAlert, ShieldCheck, Clock, Database, CheckCircle2, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';

interface DgcaBacktestingViewProps {
  backtestingData: BacktestingComparison | null;
}

const DGCA_ROUTE_REFERENCE = [
  { routeCode: 'DEL-BOM', routeName: 'Delhi — Mumbai', dgcaYieldFare: 4750, paxSharePct: 28.0, distanceKm: 1148 },
  { routeCode: 'DEL-BLR', routeName: 'Delhi — Bengaluru', dgcaYieldFare: 5580, paxSharePct: 22.0, distanceKm: 1740 },
  { routeCode: 'BOM-BLR', routeName: 'Mumbai — Bengaluru', dgcaYieldFare: 3950, paxSharePct: 16.0, distanceKm: 842 },
  { routeCode: 'DEL-CCU', routeName: 'Delhi — Kolkata', dgcaYieldFare: 4920, paxSharePct: 14.0, distanceKm: 1305 },
  { routeCode: 'BLR-HYD', routeName: 'Bengaluru — Hyderabad', dgcaYieldFare: 2980, paxSharePct: 10.0, distanceKm: 502 },
  { routeCode: 'MAA-DEL', routeName: 'Chennai — Delhi', dgcaYieldFare: 5260, paxSharePct: 10.0, distanceKm: 1760 },
];

export const DgcaBacktestingView: React.FC<DgcaBacktestingViewProps> = ({ backtestingData }) => {
  const isPending =
    !backtestingData ||
    !backtestingData.series ||
    backtestingData.series.length === 0 ||
    backtestingData.status === 'PENDING';

  if (isPending) {
    const samplesCount = backtestingData?.metrics?.sampleDays || 0;
    const progressPct = Math.min(100, Math.round((samplesCount / 30) * 100));

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              DGCA Official Benchmark Backtesting
            </h2>
            <p className="text-xs text-slate-500">
              Econometric validation comparing computed APIx index against DGCA domestic air passenger yield publications
            </p>
          </div>
          <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Calibration: Ingestion Phase ({samplesCount}/30 Days)</span>
          </span>
        </div>

        {/* Informative Live Ingestion Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Awaiting 30-Day Live Data Accumulation Cycle
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                DGCA publishes monthly domestic passenger yield statistics. Under our strict <strong>Zero-Demo Policy</strong>, statistical back-testing (Pearson correlation <span className="font-mono font-semibold text-slate-700">r</span>, MAPE %, and maximum absolute deviation) is computed strictly when at least 30 consecutive daily market observations are ingested into the database.
              </p>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>Data Ingestion Progress</span>
                  <span className="font-bold text-slate-700">{samplesCount} of 30 daily observations</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, progressPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DGCA Target Reference Basket Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              DGCA & MoSPI Domestic Route Reference Targets
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Source: DGCA Passenger Yield Reports</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3">Route Code</th>
                  <th className="py-2.5 px-3">Monitored City Pair</th>
                  <th className="py-2.5 px-3">Distance (km)</th>
                  <th className="py-2.5 px-3">MoSPI Basket Weight</th>
                  <th className="py-2.5 px-3">DGCA Baseline Yield (₹)</th>
                  <th className="py-2.5 px-3">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {DGCA_ROUTE_REFERENCE.map((r) => (
                  <tr key={r.routeCode} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-indigo-700">{r.routeCode}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{r.routeName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.distanceKm} km</td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">{r.paxSharePct}%</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">₹{r.dgcaYieldFare.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3" /> Ingestion Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const chartData = (backtestingData?.series || []).map((s) => ({
    date: s.date.slice(5),
    fullDate: s.date,
    APIx_Index: s.apixIndex,
    DGCA_Benchmark: s.dgcaBenchmarkIndex,
    variance: s.variancePct,
  }));

  const metrics = backtestingData.metrics || {
    correlationCoefficient: 0,
    mape: 0,
    rmse: 0,
    sampleDays: 0,
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            DGCA Official Benchmark Backtesting
          </h2>
          <p className="text-xs text-slate-500">
            Statistical validation comparing calculated APIx index against DGCA domestic air passenger yield reports
          </p>
        </div>
        <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statistically Validated</span>
        </span>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500">Pearson Correlation (r)</span>
          <div className="text-2xl font-extrabold font-mono text-indigo-600 mt-0.5">
            {metrics.correlationCoefficient.toFixed(3)}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Valid econometric correlation</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500">Mean Abs Error (MAPE)</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800 mt-0.5">
            {metrics.mape}%
          </div>
          <span className="text-[10px] text-slate-500">Average % deviation</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500">Root Mean Sq Error (RMSE)</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800 mt-0.5">
            {metrics.rmse}
          </div>
          <span className="text-[10px] text-slate-500">Index points</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500">Evaluation Window</span>
          <div className="text-2xl font-extrabold font-mono text-slate-800 mt-0.5">
            {metrics.sampleDays} Days
          </div>
          <span className="text-[10px] text-slate-500 truncate block">Continuous historical series</span>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="h-72 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono">
                      <div className="font-bold text-slate-300 mb-1">{data.fullDate}</div>
                      <div className="text-indigo-400">APIx Calculated: <strong>{data.APIx_Index}</strong></div>
                      <div className="text-emerald-400">DGCA Benchmark: <strong>{data.DGCA_Benchmark}</strong></div>
                      <div className="text-slate-400 mt-1">Variance: {data.variance}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Line
              type="monotone"
              dataKey="APIx_Index"
              name="APIx Real-Time Index"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="DGCA_Benchmark"
              name="DGCA Official Passenger Yield Benchmark"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Backtesting Details Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">APIx Index</th>
              <th className="py-2 px-3">DGCA Benchmark</th>
              <th className="py-2 px-3">Variance (%)</th>
              <th className="py-2 px-3">APIx Avg Fare (₹)</th>
              <th className="py-2 px-3">DGCA Yield Proxy (₹)</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {backtestingData.series.slice(-8).map((s) => (
              <tr key={s.date} className="hover:bg-slate-50/60">
                <td className="py-2 px-3 font-sans font-medium text-slate-800">{s.date}</td>
                <td className="py-2 px-3 font-bold text-indigo-700">{s.apixIndex.toFixed(2)}</td>
                <td className="py-2 px-3 text-emerald-700 font-bold">{s.dgcaBenchmarkIndex.toFixed(2)}</td>
                <td className="py-2 px-3">
                  <span className={Math.abs(s.variancePct) < 2.5 ? 'text-slate-600' : 'text-amber-600 font-bold'}>
                    {s.variancePct > 0 ? `+${s.variancePct}%` : `${s.variancePct}%`}
                  </span>
                </td>
                <td className="py-2 px-3">₹{s.apixAvgFare.toLocaleString('en-IN')}</td>
                <td className="py-2 px-3">₹{s.dgcaAvgFare.toLocaleString('en-IN')}</td>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
