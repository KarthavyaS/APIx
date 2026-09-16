import React from 'react';
import { Plane, RefreshCw, Activity, ShieldCheck, Database, Sliders, Code2, AlertTriangle, TrendingUp, BarChart3, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerScrape: () => void;
  isScrapingRunning: boolean;
  onOpenWeightsModal: () => void;
  currentIndex?: number;
  dailyChangePct?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onTriggerScrape,
  isScrapingRunning,
  onOpenWeightsModal,
  currentIndex = 108.45,
  dailyChangePct = 0.45,
}) => {
  const tabs = [
    { id: 'overview', label: 'Index & Trends', icon: TrendingUp },
    { id: 'heatmap', label: 'Route Matrix & Heatmap', icon: Layers },
    { id: 'elasticity', label: 'Lead-Time Elasticity', icon: Activity },
    { id: 'airlines', label: 'Airlines & OTAs', icon: BarChart3 },
    { id: 'anomalies', label: 'Anomaly Intelligence', icon: AlertTriangle },
    { id: 'forecast', label: 'ML Forecast', icon: Plane },
    { id: 'backtesting', label: 'DGCA Backtesting', icon: ShieldCheck },
    { id: 'quotes', label: 'Quotes & Scrapers', icon: Database },
    { id: 'api', label: 'REST API & OpenAPI', icon: Code2 },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top Ministry / Observatory banner */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider">
            Ministry of Civil Aviation • Directorate General of Civil Aviation (DGCA) Data Framework
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Official Civil Aviation Price Observatory</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Crawl Engine: 100% Robots.txt Compliant</span>
          </span>
          <span className="text-slate-500 font-mono text-[10px]">v1.0.0-PROD</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Plane className="w-6 h-6 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                APIx <span className="text-indigo-400 font-normal">| Airfare Price Index India</span>
              </h1>
              <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded">
                National Basket
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Continuous weighted Laspeyres domestic fare index, elasticity curves & anomaly detection
            </p>
          </div>
        </div>

        {/* Live Index Pill & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">APIx Headline</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-bold font-mono text-white">{currentIndex.toFixed(2)}</span>
                <span className={`text-xs font-semibold font-mono ${dailyChangePct >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {dailyChangePct >= 0 ? `+${dailyChangePct.toFixed(2)}%` : `${dailyChangePct.toFixed(2)}%`}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">
              <span>Base: 100.0</span>
              <br />
              <span className="text-slate-400">Aug 2026</span>
            </div>
          </div>

          <button
            id="configure-weights-btn"
            onClick={onOpenWeightsModal}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
            title="Configure route basket weights stored in database"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Route Weights</span>
          </button>

          <button
            id="run-scraping-btn"
            onClick={onTriggerScrape}
            disabled={isScrapingRunning}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg shadow-sm transition ${
              isScrapingRunning
                ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
            <span>{isScrapingRunning ? 'Harvesting Data...' : 'Run Scraping'}</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none border-t border-slate-800/80">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
