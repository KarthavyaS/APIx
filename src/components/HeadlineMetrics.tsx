import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeadlineMetricsProps {
  summary: DashboardSummary;
  language?: 'en' | 'hi';
}

export const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({
  summary,
  language = 'en',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const currentIndex = summary?.currentIndex ?? 100.0;
  const dailyChange = summary?.dailyChangePct ?? 0.0;
  const monthlyChange = summary?.monthlyChangePct ?? 0.0;
  const avgFare = summary?.averageFareInr ?? 0;
  const totalQuotes = summary?.uniqueQuotesCount || summary?.totalQuotesCollected || 0;
  const anomaliesCount = summary?.activeAnomaliesCount ?? 0;
  const cheapest = summary?.cheapestRoute || { routeCode: 'DEL-BOM', avgFare: 0, airline: 'IndiGo' };
  const priciest = summary?.mostExpensiveRoute || { routeCode: 'DEL-BLR', avgFare: 0, airline: 'Air India' };

  const inflationDiff = currentIndex - 100.0;

  return (
    <div className="space-y-4 mb-6">
      {/* Official MoSPI Portal Welcome Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="shrink-0 p-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
            <img
              src="/emblem.svg"
              alt="State Emblem of India"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">
                {language === 'hi' ? 'राष्ट्रीय सांख्यिकी कार्यालय (NSO)' : 'National Statistical Office (NSO) • MoSPI'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                {language === 'hi' ? 'दैनिक सूचकांक' : 'Official Portal'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
              {language === 'hi'
                ? 'राष्ट्रीय हवाई किराया मूल्य सूचकांक (APIx) एवं नागरिक किराया वेधशाला'
                : 'National Airfare Price Index (APIx) & Aviation Price Transparency Portal'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {language === 'hi'
                ? 'उपभोक्ता मूल्य सूचकांक (CPI) परिवहन उप-समूह के अंतर्गत भारत के मुख्य घरेलू रूटों पर वास्तविक किराया निगरानी।'
                : 'High-frequency retail airfare inflation tracking across key domestic corridors under the CPI Transport framework.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Standard Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. National Index */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'हवाई किराया सूचकांक' : 'Airfare Index (APIx)'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'apix' ? null : 'apix')}
                  className="text-slate-400 hover:text-blue-900 transition"
                  title="Explanation"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                Base 100.0
              </span>
            </div>

            {activeTooltip === 'apix' && (
              <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-950 leading-snug">
                {language === 'hi'
                  ? 'यह सूचकांक दिखाता है कि सामान्य दिनों (आधार 100) की तुलना में आज टिकट कितने महंगे या सस्ते हैं।'
                  : 'Measures how ticket prices compare to baseline August 2026 (100.0). A score of 108.45 means fares are 8.45% above base period.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{currentIndex.toFixed(2)}</span>
              <div className="flex items-center text-xs font-bold">
                {dailyChange >= 0 ? (
                  <span className="text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3.5 h-3.5" />+{dailyChange.toFixed(2)}% (24h)
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowDownRight className="w-3.5 h-3.5" />{dailyChange.toFixed(2)}% (24h)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>
              {language === 'hi' ? 'मुद्रास्फीति स्तर:' : 'Inflation:'}{' '}
              <strong className={inflationDiff > 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                {inflationDiff > 5 ? (language === 'hi' ? 'वृद्धि' : 'Elevated') : (language === 'hi' ? 'सामान्य' : 'Normal')}
              </strong>
            </span>
            <span>
              {language === 'hi' ? 'मासिक:' : 'Monthly:'}{' '}
              <strong className={monthlyChange >= 0 ? 'text-rose-600' : 'text-emerald-700'}>
                {monthlyChange >= 0 ? `+${monthlyChange}%` : `${monthlyChange}%`}
              </strong>
            </span>
          </div>
        </div>

        {/* 2. Average Ticket Price */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'राष्ट्रीय औसत किराया' : 'Average Ticket Price'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'avg' ? null : 'avg')}
                  className="text-slate-400 hover:text-blue-900 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                6 Routes
              </span>
            </div>

            {activeTooltip === 'avg' && (
              <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-950 leading-snug">
                {language === 'hi'
                  ? 'देश के 6 सबसे व्यस्त रूटों पर एक यात्री का औसत अंतिम टिकट मूल्य।'
                  : 'The weighted average total price paid per passenger across top 6 DGCA domestic corridors.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">₹{avgFare.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'प्रति यात्री' : 'per passenger'}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>{language === 'hi' ? 'मूल किराया:' : 'Base:'} ~70%</span>
            <span>{language === 'hi' ? 'जीएसटी:' : 'GST (5%):'} ₹{Math.round(avgFare * 0.05)}</span>
            <span>{language === 'hi' ? 'UDF:' : 'UDF:'} ₹480</span>
          </div>
        </div>

        {/* 3. Real Quotes Scraped */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'सत्यापित टिकट डेटा' : 'Verified Quotes'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'quotes' ? null : 'quotes')}
                  className="text-slate-400 hover:text-blue-900 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Real
              </span>
            </div>

            {activeTooltip === 'quotes' && (
              <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-950 leading-snug">
                {language === 'hi'
                  ? 'सभी 5 एयरलाइंस और 5 पोर्टल से स्वचालित नैतिक स्क्रैपिंग द्वारा एकत्रित वास्तविक उड़ान किराए।'
                  : 'Directly harvested verified flight quotes from IndiGo, Air India, Akasa, SpiceJet, MakeMyTrip, and Yatra.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                {totalQuotes.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'उड़ान दरें' : 'quotes'}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'hi' ? 'डिडुप्लिकेटेड' : 'Deduplicated'}
            </span>
            <span className="text-slate-400">{language === 'hi' ? 'दैनिक स्वचालित' : 'Automated Daily'}</span>
          </div>
        </div>

        {/* 4. Extremes */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'न्यूनतम व अधिकतम' : 'Lowest & Highest'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'extremes' ? null : 'extremes')}
                  className="text-slate-400 hover:text-blue-900 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                {anomaliesCount} {language === 'hi' ? 'अलर्ट' : 'Surges'}
              </span>
            </div>

            {activeTooltip === 'extremes' && (
              <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-950 leading-snug">
                {language === 'hi'
                  ? 'निगरानी किए जाने वाले 6 मुख्य रूटों में सबसे सस्ता और सबसे महंगा औसत किराया।'
                  : 'Current cheapest and highest priced trunk routes in the national basket.'}
              </div>
            )}

            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {cheapest.routeCode || 'DEL-BOM'}:
                </span>
                <span className="font-mono font-bold text-emerald-700">₹{(cheapest.avgFare || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {priciest.routeCode || 'DEL-BLR'}:
                </span>
                <span className="font-mono font-bold text-rose-700">₹{(priciest.avgFare || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 truncate">
            {language === 'hi'
              ? 'अग्रिम बुकिंग (30 दिन पहले) से टिकट सस्ता मिलता है'
              : 'Tip: 30+ days advance booking saves 20–35%'}
          </div>
        </div>
      </div>
    </div>
  );
};
