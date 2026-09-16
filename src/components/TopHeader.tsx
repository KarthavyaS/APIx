import React from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
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
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  viewMode: 'citizen' | 'policymaker';
  setViewMode: (mode: 'citizen' | 'policymaker') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  summary,
  onOpenWeightsModal,
  onTriggerScrape,
  isScrapingRunning,
  language = 'en',
  isCollapsed,
  setIsCollapsed,
  isDark,
  setIsDark,
  viewMode,
  setViewMode,
}) => {
  return (
    <header
      className={`border-b px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-xs flex flex-wrap justify-between items-center gap-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Left: Sidebar Toggle Hamburger & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {/* Expand / Collapse Sidebar Button (Desktop & Tablet) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={isCollapsed ? 'Expand Side Navigation' : 'Collapse Side Navigation'}
        >
          <Menu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </button>

        {/* Institutional Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-100 font-bold">भारत सरकार • MoSPI</span>
          <span>›</span>
          <span className="hidden sm:inline">National Statistical Office</span>
          <span className="hidden sm:inline">›</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {viewMode === 'citizen'
              ? language === 'hi'
                ? 'नागरिक किराया गाइड'
                : 'Citizen Fare Transparency'
              : language === 'hi'
              ? 'NSO / RBI नीतिगत सांख्यिकी'
              : 'CPI Transport Macro Suite'}
          </span>
        </div>
      </div>

      {/* Right: Mode Pill Switcher, Compliance & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Quick View Mode Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('citizen')}
            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
              viewMode === 'citizen'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नागरिक' : 'Citizen'}
          </button>
          <button
            onClick={() => setViewMode('policymaker')}
            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
              viewMode === 'policymaker'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नीतिगत' : 'Policy / RBI'}
          </button>
        </div>

        {/* Theme Light/Dark Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Configure Weights Modal */}
        <button
          id="top-configure-weights-btn"
          onClick={onOpenWeightsModal}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{language === 'hi' ? 'रूट भार (Weights)' : 'Route Basket'}</span>
        </button>

        {/* Live Scraper Harvest Button */}
        <button
          id="top-run-scraping-btn"
          onClick={onTriggerScrape}
          disabled={isScrapingRunning}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition cursor-pointer ${
            isScrapingRunning
              ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
    </header>
  );
};
