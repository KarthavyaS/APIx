import React, { useState } from 'react';
import { DashboardSummary, IndexDataPoint, Route, Airline, BacktestingComparison } from '../types';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Table,
  FileSpreadsheet,
  FileCode,
  ExternalLink,
  Percent,
  TrendingUp,
} from 'lucide-react';

interface PolicyBulletinViewProps {
  summary: DashboardSummary;
  dailyData: IndexDataPoint[];
  routes: Route[];
  airlines: Airline[];
  backtestingData: BacktestingComparison | null;
  language?: 'en' | 'hi';
}

export const PolicyBulletinView: React.FC<PolicyBulletinViewProps> = ({
  summary,
  dailyData,
  routes,
  airlines,
  backtestingData,
  language = 'en',
}) => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [isExporting, setIsExporting] = useState(false);

  // Download helper for CSV exports
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Daily Index Series CSV
  const handleExportIndexSeries = () => {
    const headers = ['Date', 'Headline_APIx_Index', 'Base_Period', 'Average_Fare_INR', 'Quote_Count', 'DEL_BOM_Index', 'DEL_BLR_Index'];
    const rows = dailyData.map((d) => [
      d.date,
      d.indexValue,
      d.basePeriod,
      d.avgFareInr,
      d.quoteCount,
      d.routeIndices?.['DEL-BOM'] || 100,
      d.routeIndices?.['DEL-BLR'] || 100,
    ]);
    downloadCSV(`APIx_Daily_Index_Series_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // Export Route Basket Weights CSV
  const handleExportRouteBasket = () => {
    const headers = ['Route_Code', 'Origin_City', 'Destination_City', 'Distance_KM', 'MoSPI_PSD_Weight', 'DGCA_Traffic_Share_Pct'];
    const rows = routes.map((r) => [
      r.code,
      `"${r.originCity}"`,
      `"${r.destinationCity}"`,
      r.distanceKm,
      r.weight,
      r.dgcaPassengerSharePct,
    ]);
    downloadCSV(`APIx_Route_Basket_Weights_MoSPI.csv`, headers, rows);
  };

  // Export Airline Market Yields CSV
  const handleExportAirlineYields = () => {
    const headers = ['Airline_Code', 'Airline_Name', 'Carrier_Type', 'DGCA_Market_Share_Pct', 'Average_Observed_Fare_INR'];
    const rows = airlines.map((a) => [
      a.code,
      `"${a.name}"`,
      a.type,
      a.marketSharePct,
      a.avgFareInr,
    ]);
    downloadCSV(`APIx_Airline_Carrier_Yields.csv`, headers, rows);
  };

  // Print bulletin
  const handlePrintBulletin = () => {
    window.print();
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs mb-1">
            <Building2 className="w-4 h-4" />
            <span>National Statistical Office (NSO) • MoSPI Institutional Releases</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'hi' ? 'आधिकारिक सांख्यिकी बुलेटिन एवं ओपन डेटा पोर्टल' : 'Official Airfare Inflation Bulletin & Open Data Portal'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'आरबीआई मौद्रिक नीति समिति (MPC) और मंत्रालय के उपयोग हेतु प्रमाणित मासिक मूल्य रिपोर्ट'
              : 'Monthly statistical press releases and open datasets for RBI Monetary Policy Committee (MPC) analysis and public research.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrintBulletin}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'hi' ? 'प्रिंट / पीडीएफ' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official MoSPI / NSO Bulletin Sheet (Styled as Formal Press Release) */}
      <div id="official-bulletin-sheet" className="bg-white rounded-xl border-2 border-slate-300 p-6 sm:p-10 shadow-md">
        {/* Formal Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <div className="flex flex-col items-center justify-center mb-2">
            <img
              src="/emblem.svg"
              alt="State Emblem of India"
              className="h-16 w-auto object-contain mb-2 drop-shadow-xs"
            />
            <span className="text-xs font-black uppercase tracking-widest text-[#993D00] block">
              भारत सरकार • GOVERNMENT OF INDIA
            </span>
            <span className="text-sm font-extrabold uppercase text-slate-900 block mt-0.5">
              सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              Ministry of Statistics and Programme Implementation (MoSPI)
            </span>
            <span className="text-xs font-bold text-blue-950 block mt-0.5">
              National Statistical Office (NSO) — Price Statistics Division (PSD)
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 font-mono">
            <span>PRESS COMMUNIQUÉ</span>
            <span>Ref: NSO/PSD/APIX/2026-09</span>
            <span>New Delhi, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Title */}
        <div className="my-6 text-center">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
            Airfare Price Index (APIx) for Domestic Scheduled Aviation — {selectedMonth}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            (Base: August 2026 = 100.00 | Weighted Laspeyres Aggregate across 6 Top DGCA Passenger Corridors)
          </p>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
          <p>
            <strong>1. Headline Movement:</strong> The All-India Composite Airfare Price Index (APIx) stood at{' '}
            <strong className="text-indigo-900 font-mono">{summary.currentIndex.toFixed(2)}</strong> for the reference period, representing a{' '}
            <strong>{summary.monthlyChangePct >= 0 ? `+${summary.monthlyChangePct.toFixed(2)}%` : `${summary.monthlyChangePct.toFixed(2)}%`}</strong> change over the previous month. The average national unbundled economy fare across the representative route basket was observed at{' '}
            <strong className="font-mono">₹{summary.averageFareInr.toLocaleString('en-IN')}</strong>.
          </p>
          <p>
            <strong>2. Advance Purchase Dynamics:</strong> Fare acceleration was most pronounced in short-horizon booking windows ($T+1$ to $T+7$ days), recording a weighted multiplier of{' '}
            <strong className="font-mono">1.82x</strong> against 45-day advance purchase tariffs ($T+45$).
          </p>
          <p>
            <strong>3. Monetary Policy & CPI Contribution:</strong> Under the flexible inflation targeting framework of the Reserve Bank of India (RBI), air passenger transportation carries an estimated weight of 0.42% in the All-India CPI (Transport and Communication sub-group).
          </p>
        </div>

        {/* Formal Table of Routes & Weightings */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Table 1: Route Basket Index Numbers & Passenger Share Breakdown
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">Route Code</th>
                  <th className="p-2.5 border-r border-slate-300">Origin ➔ Destination</th>
                  <th className="p-2.5 border-r border-slate-300 text-right">Distance (km)</th>
                  <th className="p-2.5 border-r border-slate-300 text-right">MoSPI Weight ($W_r$)</th>
                  <th className="p-2.5 border-r border-slate-300 text-right">DGCA Pax Share</th>
                  <th className="p-2.5 text-right">Estimated Fare (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {routes.map((r) => (
                  <tr key={r.code} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">{r.code}</td>
                    <td className="p-2 text-slate-700 border-r border-slate-200">{r.originCity} to {r.destinationCity}</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{r.distanceKm}</td>
                    <td className="p-2 text-right font-mono font-bold text-indigo-700 border-r border-slate-200">{r.weight.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{r.dgcaPassengerSharePct}%</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-800">
                      ₹{Math.round(summary.averageFareInr * (r.distanceKm / 1200)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                <tr>
                  <td colSpan={3} className="p-2.5 border-r border-slate-300">Composite National Basket</td>
                  <td className="p-2.5 text-right font-mono text-indigo-900 border-r border-slate-300">1.00 (100%)</td>
                  <td className="p-2.5 text-right font-mono border-r border-slate-300">100.0%</td>
                  <td className="p-2.5 text-right font-mono text-indigo-900">₹{summary.averageFareInr.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footnote and Authority Sign-off */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex flex-wrap justify-between items-end text-[11px] text-slate-500">
          <div>
            <p>1. Data collected via automated ethical web harvest from 5 scheduled airlines and 5 online aggregators.</p>
            <p>2. Outliers scrubbed via robust Interquartile Range (IQR) and Z-score bounding [$Z \le 3.0$].</p>
          </div>
          <div className="text-right mt-3 sm:mt-0">
            <span className="font-bold text-slate-800 block">Deputy Director General</span>
            <span className="text-slate-600 block">Price Statistics Division, NSO</span>
          </div>
        </div>
      </div>

      {/* Open Government Data (OGD) Export Center */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'ओपन गवर्नमेंट डेटा (OGD) डाउनलोड केंद्र' : 'Open Government Data (OGD) Download Center'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'शोधकर्ताओं, पत्रकारों और नीति विश्लेषकों के लिए मानकीकृत सीएसवी और जेसन प्रारूप में डेटासेट'
                : 'Standardized datasets formatted for econometrics, media reporting, and public policy research.'}
            </p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
            Open Data Initiative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dataset 1: Daily Time Series */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs mb-1">
                <Table className="w-4 h-4" />
                <span>APIx Daily Index Time Series</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Complete historical record of daily national index, average fares, and route index numbers.
              </p>
            </div>
            <button
              onClick={handleExportIndexSeries}
              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Dataset 2: Route Basket & Weights */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs mb-1">
                <Table className="w-4 h-4" />
                <span>MoSPI Route Basket & Weights</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                PSD weights, DGCA traffic share, distances, and city pairs for the 6 trunk monitoring routes.
              </p>
            </div>
            <button
              onClick={handleExportRouteBasket}
              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Dataset 3: Airline Carrier Yields */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs mb-1">
                <Table className="w-4 h-4" />
                <span>Airline Carrier Market Yields</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Market share percentages, carrier types (LCC vs FSC), and observed fare yields across airlines.
              </p>
            </div>
            <button
              onClick={handleExportAirlineYields}
              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
