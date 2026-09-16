import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  IndianRupee,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeadlineMetricsProps {
  summary: DashboardSummary;
  language?: 'en' | 'hi';
  viewMode?: 'citizen' | 'policymaker';
  isDark?: boolean;
}

export const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({
  summary,
  language = 'en',
  viewMode = 'citizen',
  isDark = false,
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

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const subBorder = isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600';
  const tooltipBg = isDark ? 'bg-slate-800 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-950';

  return (
    <div className="space-y-4 mb-6">
      {/* Dynamic Mode Hero Banner for Citizen vs Policy View */}
      {viewMode === 'citizen' ? (
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${
            isDark
              ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border-indigo-800/60 text-white'
              : 'bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-indigo-200 text-indigo-950'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-base">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {language === 'hi' ? 'नागरिक किराया पारदर्शिता केंद्र' : 'Citizen Airfare Transparency Hub'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {language === 'hi' ? 'सार्वजनिक सेवा' : 'Public Utility'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight mt-0.5">
                {language === 'hi'
                  ? 'उड़ान किराए का उचित मूल्य, अग्रिम बुकिंग बचत व टैक्स विभाजन'
                  : 'Fair Airfare Benchmarks, Advance Booking Windows & Transparent Ticket Fee Breakdown'}
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {language === 'hi'
                  ? 'जानिए अपनी यात्रा के लिए कब टिकट बुक करना सबसे किफायती रहेगा और बेस फेयर, जीएसटी एवं एयरपोर्ट चार्ज का सही विवरण क्या है।'
                  : 'Discover how much you save by booking 30–45 days ahead and see exactly what portion of your ticket is Base Fare vs Airport Taxes.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${
            isDark
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-indigo-700/50 text-white'
              : 'bg-gradient-to-r from-slate-900 to-indigo-950 border-slate-800 text-white shadow-md'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-base">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                  {language === 'hi' ? 'MoSPI सांख्यिकी प्रभाग एवं RBI मौद्रिक नीति' : 'MoSPI Price Statistics Division & RBI Monetary Policy Suite'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Institutional
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight mt-0.5 text-white">
                {language === 'hi'
                  ? 'CPI परिवहन उप-समूह उच्च-आवृत्ति सूचकांक एवं लास्पेयर भारित सांख्यिकी'
                  : 'CPI Transport Sub-Group High-Frequency Index & Laspeyres Geometric Price Suite'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'दैनिक ओटीए वेब-हार्वेस्टिंग, डीजीसीए 30-दिवसीय सत्यापन, वाहक एकाधिकार (HHI) और खुली सरकारी डेटा (OGD) प्रणाली।'
                  : 'Automated high-frequency market crawling across 5 trunk carriers, DGCA 30-day lag validation, carrier pricing power, and OGD exports.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Airfare Price Inflation Index (APIx) */}
        <div className={`rounded-xl p-4 border shadow-xs relative flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span>{language === 'hi' ? 'हवाई किराया मूल्य सूचकांक' : 'Airfare Price Index (APIx)'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'apix' ? null : 'apix')}
                  className="text-slate-400 hover:text-indigo-600 transition"
                  title="Explain this metric"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold">
                {language === 'hi' ? 'आधार 100.0' : 'Base 100.0'}
              </span>
            </div>

            {activeTooltip === 'apix' && (
              <div className={`mb-2 p-2.5 border rounded-lg text-[11px] leading-snug ${tooltipBg}`}>
                {language === 'hi'
                  ? 'यह सूचकांक दिखाता है कि सामान्य दिनों (आधार 100) की तुलना में आज टिकट कितने महंगे या सस्ते हैं।'
                  : 'Measures how ticket prices compare to baseline August 2026 (100.0). A score of 108.45 means fares are 8.45% above base period.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black font-mono tracking-tight">{currentIndex.toFixed(2)}</span>
              <div className="flex items-center text-xs font-bold">
                {dailyChange >= 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3.5 h-3.5" />+{dailyChange.toFixed(2)}% (24h)
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    <ArrowDownRight className="w-3.5 h-3.5" />{dailyChange.toFixed(2)}% (24h)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${subBorder}`}>
            <span>
              {language === 'hi' ? 'मुद्रास्फीति स्तर:' : 'Inflation Status:'}{' '}
              <strong className={inflationDiff > 5 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                {inflationDiff > 5 ? (language === 'hi' ? 'मध्यम वृद्धि' : 'Elevated') : (language === 'hi' ? 'सामान्य' : 'Normal')}
              </strong>
            </span>
            <span>
              {language === 'hi' ? 'मासिक:' : 'Monthly:'}{' '}
              <strong className={monthlyChange >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {monthlyChange >= 0 ? `+${monthlyChange}%` : `${monthlyChange}%`}
              </strong>
            </span>
          </div>
        </div>

        {/* 2. National Average Flight Ticket Price */}
        <div className={`rounded-xl p-4 border shadow-xs relative flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span>{language === 'hi' ? 'राष्ट्रीय औसत टिकट मूल्य' : 'National Average Ticket Price'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'avg' ? null : 'avg')}
                  className="text-slate-400 hover:text-indigo-600 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {language === 'hi' ? '6 मुख्य रूट' : '6 Trunk Routes'}
              </span>
            </div>

            {activeTooltip === 'avg' && (
              <div className={`mb-2 p-2.5 border rounded-lg text-[11px] leading-snug ${tooltipBg}`}>
                {language === 'hi'
                  ? 'देश के 6 सबसे व्यस्त रूटों (जैसे दिल्ली-मुंबई, दिल्ली-बेंगलुरु) पर एक यात्री का औसत अंतिम टिकट मूल्य।'
                  : 'The weighted average total price paid per passenger across top 6 DGCA domestic corridors including all taxes & airport fees.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black font-mono tracking-tight">₹{avgFare.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'प्रति यात्री' : 'per passenger'}</span>
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${subBorder}`}>
            <span>{language === 'hi' ? 'मूल किराया:' : 'Base Fare:'} ~70%</span>
            <span>{language === 'hi' ? 'जीएसटी कर:' : 'GST (5%):'} ₹{Math.round(avgFare * 0.05)}</span>
            <span>{language === 'hi' ? 'एयरपोर्ट UDF:' : 'UDF:'} ₹480</span>
          </div>
        </div>

        {/* 3. Sampling Coverage & Data Verification */}
        <div className={`rounded-xl p-4 border shadow-xs relative flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span>{language === 'hi' ? 'सत्यापित वास्तविक टिकट डेटा' : 'Verified Real Market Quotes'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'quotes' ? null : 'quotes')}
                  className="text-slate-400 hover:text-indigo-600 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {language === 'hi' ? '100% वास्तविक' : '100% Real'}
              </span>
            </div>

            {activeTooltip === 'quotes' && (
              <div className={`mb-2 p-2.5 border rounded-lg text-[11px] leading-snug ${tooltipBg}`}>
                {language === 'hi'
                  ? 'सभी 5 एयरलाइंस और 5 पोर्टल से स्वचालित नैतिक स्क्रैपिंग द्वारा एकत्रित वास्तविक उड़ान किराए। कोई नकली डेटा नहीं।'
                  : 'Directly scraped verified flight quotes from IndiGo, Air India, Akasa, SpiceJet, MakeMyTrip, and Yatra with zero synthetic data.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black font-mono tracking-tight">
                {totalQuotes.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'उड़ान दरें' : 'live quotes'}</span>
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${subBorder}`}>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'hi' ? 'शून्य डुप्लीकेशन' : 'Deduplicated'}
            </span>
            <span className="text-slate-400">{language === 'hi' ? 'दैनिक स्वचालित' : 'Automated Daily'}</span>
          </div>
        </div>

        {/* 4. Fare Extremes & Price Surge Alerts */}
        <div className={`rounded-xl p-4 border shadow-xs relative flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <span>{language === 'hi' ? 'रूट किराया सीमा' : 'Lowest & Highest Fare'}</span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'extremes' ? null : 'extremes')}
                  className="text-slate-400 hover:text-indigo-600 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </span>
              <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {anomaliesCount} {language === 'hi' ? 'अलर्ट' : 'Surges'}
              </span>
            </div>

            {activeTooltip === 'extremes' && (
              <div className={`mb-2 p-2.5 border rounded-lg text-[11px] leading-snug ${tooltipBg}`}>
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
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{(cheapest.avgFare || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {language === 'hi' ? 'अधिकतम:' : 'Highest'} ({priciest.routeCode || 'DEL-BLR'}):
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  ₹{(priciest.avgFare || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t text-[10px] truncate ${subBorder}`}>
            {viewMode === 'citizen'
              ? language === 'hi'
                ? 'अग्रिम बुकिंग (30 दिन पहले) से टिकट 20-35% सस्ता मिलता है'
                : 'Tip: Booking 30+ days ahead saves 20–35% on average'
              : 'MoSPI Laspeyres Geometric Formula Benchmark'}
          </div>
        </div>
      </div>
    </div>
  );
};
