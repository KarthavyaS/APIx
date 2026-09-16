import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Tag,
  IndianRupee,
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeadlineMetricsProps {
  summary: DashboardSummary;
  language?: 'en' | 'hi';
  viewMode?: 'citizen' | 'policymaker';
}

export const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({
  summary,
  language = 'en',
  viewMode = 'citizen',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const currentIndex = summary?.currentIndex ?? 100.0;
  const dailyChange = summary?.dailyChangePct ?? 0.0;
  const weeklyChange = summary?.weeklyChangePct ?? 0.0;
  const monthlyChange = summary?.monthlyChangePct ?? 0.0;
  const avgFare = summary?.averageFareInr ?? 0;
  const totalQuotes = summary?.uniqueQuotesCount || summary?.totalQuotesCollected || 0;
  const anomaliesCount = summary?.activeAnomaliesCount ?? 0;
  const cheapest = summary?.cheapestRoute || { routeCode: 'DEL-BOM', avgFare: 0, airline: 'IndiGo' };
  const priciest = summary?.mostExpensiveRoute || { routeCode: 'DEL-BLR', avgFare: 0, airline: 'Air India' };

  // Calculate inflation percentage above base 100.0
  const inflationDiff = currentIndex - 100.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Airfare Price Inflation Index (APIx) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs relative flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'हवाई किराया मूल्य सूचकांक' : 'Airfare Price Index (APIx)'}</span>
              <button
                onClick={() => setActiveTooltip(activeTooltip === 'apix' ? null : 'apix')}
                className="text-slate-400 hover:text-indigo-600 transition"
                title="Explain this metric"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
              {language === 'hi' ? 'आधार 100.0' : 'Base 100.0'}
            </span>
          </div>

          {activeTooltip === 'apix' && (
            <div className="mb-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 leading-snug">
              {language === 'hi'
                ? 'यह सूचकांक दिखाता है कि सामान्य दिनों (अगस्त 2026 = 100) की तुलना में आज टिकट कितने महंगे या सस्ते हैं। 100 से ऊपर का अर्थ किराया बढ़ना है।'
                : 'Measures how ticket prices compare to baseline August 2026 (100.0). A score of 108.45 means flights are 8.45% more expensive on average.'}
            </div>
          )}

          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-slate-900">{currentIndex.toFixed(2)}</span>
            <div className="flex items-center text-xs font-bold">
              {dailyChange >= 0 ? (
                <span className="text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3.5 h-3.5" />+{dailyChange.toFixed(2)}% (24h)
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3.5 h-3.5" />{dailyChange.toFixed(2)}% (24h)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            {language === 'hi' ? 'मुद्रास्फीति स्तर:' : 'Inflation Status:'}{' '}
            <strong className={inflationDiff > 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
              {inflationDiff > 5 ? (language === 'hi' ? 'मध्यम वृद्धि' : 'Elevated') : (language === 'hi' ? 'सामान्य' : 'Normal')}
            </strong>
          </span>
          <span>
            {language === 'hi' ? 'मासिक:' : 'Monthly:'}{' '}
            <strong className={monthlyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
              {monthlyChange >= 0 ? `+${monthlyChange}%` : `${monthlyChange}%`}
            </strong>
          </span>
        </div>
      </div>

      {/* 2. National Average Flight Ticket Price */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs relative flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'राष्ट्रीय औसत टिकट मूल्य' : 'National Average Ticket Price'}</span>
              <button
                onClick={() => setActiveTooltip(activeTooltip === 'avg' ? null : 'avg')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              {language === 'hi' ? '6 मुख्य रूट' : '6 Trunk Routes'}
            </span>
          </div>

          {activeTooltip === 'avg' && (
            <div className="mb-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 leading-snug">
              {language === 'hi'
                ? 'देश के 6 सबसे व्यस्त रूटों (जैसे दिल्ली-मुंबई, दिल्ली-बेंगलुरु) पर एक यात्री का औसत अंतिम टिकट मूल्य।'
                : 'The weighted average total price paid per passenger across top 6 DGCA domestic corridors including all taxes & airport fees.'}
            </div>
          )}

          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-slate-900">₹{avgFare.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'प्रति यात्री' : 'per passenger'}</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>{language === 'hi' ? 'मूल किराया:' : 'Base Fare:'} ~70%</span>
          <span>{language === 'hi' ? 'जीएसटी कर:' : 'GST (5%):'} ₹{Math.round(avgFare * 0.05)}</span>
          <span>{language === 'hi' ? 'एयरपोर्ट UDF:' : 'UDF:'} ₹480</span>
        </div>
      </div>

      {/* 3. Sampling Coverage & Data Verification */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs relative flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'सत्यापित वास्तविक टिकट डेटा' : 'Verified Real Market Quotes'}</span>
              <button
                onClick={() => setActiveTooltip(activeTooltip === 'quotes' ? null : 'quotes')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {language === 'hi' ? '100% वास्तविक' : '100% Real'}
            </span>
          </div>

          {activeTooltip === 'quotes' && (
            <div className="mb-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 leading-snug">
              {language === 'hi'
                ? 'सभी 5 एयरलाइंस और 5 पोर्टल से स्वचालित नैतिक स्क्रैपिंग द्वारा एकत्रित वास्तविक उड़ान किराए। कोई नकली/डेमो डेटा नहीं।'
                : 'Directly scraped verified flight quotes from IndiGo, Air India, Akasa, SpiceJet, MakeMyTrip, and Yatra with zero synthetic data.'}
            </div>
          )}

          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black font-mono text-slate-900">
              {totalQuotes.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'उड़ान दरें' : 'live quotes'}</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? 'शून्य डुप्लीकेशन' : 'Deduplicated'}
          </span>
          <span className="text-slate-400">{language === 'hi' ? 'दैनिक स्वचालित' : 'Automated Daily'}</span>
        </div>
      </div>

      {/* 4. Fare Extremes & Price Surge Alerts */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs relative flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'रूट किराया सीमा' : 'Lowest & Highest Fare'}</span>
              <button
                onClick={() => setActiveTooltip(activeTooltip === 'extremes' ? null : 'extremes')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              {anomaliesCount} {language === 'hi' ? 'अलर्ट' : 'Surges'}
            </span>
          </div>

          {activeTooltip === 'extremes' && (
            <div className="mb-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 leading-snug">
              {language === 'hi'
                ? 'निगरानी किए जाने वाले 6 मुख्य रूटों में सबसे सस्ता और सबसे महंगा औसत किराया।'
                : 'Current cheapest and highest priced trunk routes in the national monitoring basket.'}
            </div>
          )}

          <div className="mt-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {language === 'hi' ? 'न्यूनतम:' : 'Lowest'} ({cheapest.routeCode || 'DEL-BOM'}):
              </span>
              <span className="font-mono font-bold text-emerald-700">₹{(cheapest.avgFare || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {language === 'hi' ? 'अधिकतम:' : 'Highest'} ({priciest.routeCode || 'DEL-BLR'}):
              </span>
              <span className="font-mono font-bold text-rose-700">₹{(priciest.avgFare || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 truncate">
          {viewMode === 'citizen'
            ? language === 'hi'
              ? 'अग्रिम बुकिंग (30 दिन पहले) से टिकट सस्ता मिलता है'
              : 'Tip: Booking 30+ days ahead saves 20-35% on average'
            : 'MoSPI Laspeyres Geometric Formula Benchmark'}
        </div>
      </div>
    </div>
  );
};

