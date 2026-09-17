import React, { useState } from 'react';
import { Route, FareQuote, AdvanceWindow } from '../types';
import { Info, ArrowRight, TrendingUp } from 'lucide-react';

interface RouteHeatmapProps {
  routes: Route[];
  quotes: FareQuote[];
}

export const RouteHeatmap: React.FC<RouteHeatmapProps> = ({ routes, quotes }) => {
  const windows: AdvanceWindow[] = ['T+45', 'T+30', 'T+15', 'T+7', 'T+1'];
  const [selectedCell, setSelectedCell] = useState<{
    route: Route;
    window: AdvanceWindow;
    avgFare: number;
    baseFare: number;
    taxes: number;
    udf: number;
    convenience: number;
    quoteCount: number;
    soldOutCount: number;
  } | null>(null);

  // Compute average fare and metrics for each route x window cell
  const getCellStats = (routeCode: string, window: AdvanceWindow) => {
    const matched = quotes.filter((q) => q.routeCode === routeCode && q.advanceWindow === window);
    if (matched.length === 0) {
      return { avgFare: 4500, baseFare: 3200, taxes: 160, udf: 450, convenience: 350, quoteCount: 0, soldOutCount: 0 };
    }
    const avgFare = Math.round(matched.reduce((acc, q) => acc + q.totalFare, 0) / matched.length);
    const baseFare = Math.round(matched.reduce((acc, q) => acc + q.baseFare, 0) / matched.length);
    const taxes = Math.round(matched.reduce((acc, q) => acc + q.taxes, 0) / matched.length);
    const udf = Math.round(matched.reduce((acc, q) => acc + q.udf, 0) / matched.length);
    const convenience = Math.round(matched.reduce((acc, q) => acc + q.convenienceFee, 0) / matched.length);
    const soldOutCount = matched.filter((q) => q.isSoldOut).length;

    return { avgFare, baseFare, taxes, udf, convenience, quoteCount: matched.length, soldOutCount };
  };

  const getColorClass = (window: AdvanceWindow) => {
    if (window === 'T+45') return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80';
    if (window === 'T+30') return 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/80';
    if (window === 'T+15') return 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/80';
    if (window === 'T+7') return 'bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-900/80';
    // T+1
    return 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-900 font-bold';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Route Basket Heatmap Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thermal pricing distribution across Indian trunk routes vs Advance Purchase Windows (T+45 to T+1)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Surge Spectrum:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] border border-emerald-200 dark:border-emerald-800">
            T+45 Early Bird
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 text-[10px] border border-rose-300 dark:border-rose-800 font-semibold">
            T+1 Close-In Surge
          </span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950">
              <th className="py-2.5 px-3 rounded-tl-lg">Corridor / Route</th>
              <th className="py-2.5 px-3 text-center">Distance</th>
              <th className="py-2.5 px-3 text-center">Basket Weight</th>
              {windows.map((win) => (
                <th key={win} className="py-2.5 px-3 text-center">
                  <div className="font-mono">{win}</div>
                  <div className="text-[10px] font-normal text-slate-400">
                    {win === 'T+45' ? '45d early' : win === 'T+1' ? '1d departure' : `${win.slice(2)}d advance`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
                    <span>{route.code}</span>
                    <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                      {route.origin} → {route.destination}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                    {route.originCity} ↔ {route.destinationCity}
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                  {route.distanceKm} km
                </td>
                <td className="py-3 px-3 text-center font-bold text-indigo-700 dark:text-indigo-400">
                  {(route.weight * 100).toFixed(0)}%
                </td>

                {windows.map((win) => {
                  const stats = getCellStats(route.code, win);
                  const colorClass = getColorClass(win);
                  const isSelected = selectedCell?.route.code === route.code && selectedCell?.window === win;

                  return (
                    <td key={win} className="p-1.5 text-center">
                      <button
                        onClick={() => setSelectedCell({ route, window: win, ...stats })}
                        className={`w-full py-2 px-2 rounded-lg border transition text-center cursor-pointer ${colorClass} ${
                          isSelected ? 'ring-2 ring-indigo-600 shadow-sm' : ''
                        }`}
                        title="Click to view component breakdown"
                      >
                        <div className="font-bold text-xs">₹{stats.avgFare.toLocaleString('en-IN')}</div>
                        {stats.soldOutCount > 0 && (
                          <div className="text-[9px] text-rose-700 dark:text-rose-400 font-sans">
                            {stats.soldOutCount} sold-out
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Modal/Details */}
      {selectedCell && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 rounded font-mono border border-indigo-200 dark:border-indigo-800">
                {selectedCell.route.code} • {selectedCell.window}
              </span>
              <span>{selectedCell.route.originCity} to {selectedCell.route.destinationCity}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Based on {selectedCell.quoteCount} harvest samples. Basket weight: {(selectedCell.route.weight * 100).toFixed(0)}%.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs w-full md:w-auto">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Base Fare</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{selectedCell.baseFare.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">GST (5%)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{selectedCell.taxes.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Airport UDF</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{selectedCell.udf.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Convenience</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{selectedCell.convenience.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block uppercase font-bold">Total Fare</span>
              <span className="font-mono font-extrabold text-indigo-900 dark:text-indigo-200">₹{selectedCell.avgFare.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
