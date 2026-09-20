import React from 'react';
import {
  Menu,
  RefreshCw,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface TopHeaderProps {
  summary: DashboardSummary;
  onOpenWeightsModal: () => void;
  onTriggerScrape: () => void;
  isScrapingRunning: boolean;
  language?: 'en' | 'hi';
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  activeTabTitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenWeightsModal,
  onTriggerScrape,
  isScrapingRunning,
  language = 'en',
  isCollapsed,
  setIsCollapsed,
  activeTabTitle,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 sticky top-0 z-20 shadow-xs">
      <div className="w-full max-w-[1400px] xl:w-[75%] 2xl:w-[70%] mx-auto flex flex-wrap justify-between items-center gap-3 min-w-0">
      {/* Left: Hamburger + Official Ministry Hierarchy */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          <Menu className="w-4 h-4 text-blue-900" />
        </button>

        {isCollapsed && (
          <img
            src="/emblem.svg"
            alt="State Emblem of India"
            className="hidden lg:block h-8 w-auto object-contain shrink-0"
          />
        )}

        <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
          <span className="text-slate-900 font-bold flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
            भारत सरकार
          </span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline font-semibold text-slate-700">MoSPI</span>
          <span className="hidden sm:inline text-slate-300">›</span>
          <span className="hidden md:inline text-slate-700">National Statistical Office</span>
          {activeTabTitle && (
            <>
              <span className="text-slate-300">›</span>
              <span className="text-blue-900 font-bold">{activeTabTitle}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Ethical Crawl Badge, Basket Config & Live Harvest */}
      <div className="flex items-center space-x-2.5">
        <div className="hidden md:flex items-center space-x-1 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'hi' ? 'सत्यापित डेटा' : 'Official CPI Feed'}</span>
        </div>

        <button
          id="top-configure-weights-btn"
          onClick={onOpenWeightsModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-900" />
          <span>{language === 'hi' ? 'रूट भार' : 'Basket Weights'}</span>
        </button>

        <button
          id="top-run-scraping-btn"
          onClick={onTriggerScrape}
          disabled={isScrapingRunning}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition cursor-pointer ${
            isScrapingRunning
              ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
              : 'bg-blue-900 hover:bg-blue-800 text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
          <span>
            {isScrapingRunning
              ? language === 'hi'
                ? 'संकलन जारी...'
                : 'Harvesting...'
              : language === 'hi'
              ? 'लाइव डेटा रीफ्रेश'
              : 'Harvest Live'}
          </span>
        </button>
      </div>
      </div>
    </header>
  );
};
