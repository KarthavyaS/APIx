import React from 'react';
import {
  Plane,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Building,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface TopHeaderProps {
  summary: DashboardSummary;
  onOpenWeightsModal: () => void;
  onTriggerScrape: () => void;
  isScrapingRunning: boolean;
  language?: 'en' | 'hi';
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  summary,
  onOpenWeightsModal,
  onTriggerScrape,
  isScrapingRunning,
  language = 'en',
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-20 shadow-xs flex flex-wrap justify-between items-center gap-4">
      {/* Breadcrumb & Institutional Context */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span className="text-slate-800 font-bold">MoSPI</span>
          <span>›</span>
          <span>National Statistical Office</span>
          <span>›</span>
          <span className="text-indigo-600 font-bold">APIx Civil Aviation Observatory</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Compliance Badge */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? '100% नैतिक डेटा संग्रह' : '100% Ethical Crawl Policy'}</span>
        </div>

        {/* Configure Weights Modal */}
        <button
          id="top-configure-weights-btn"
          onClick={onOpenWeightsModal}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          <span>{language === 'hi' ? 'रूट भार (Weights)' : 'Route Basket Weights'}</span>
        </button>

        {/* Live Scraper Harvest */}
        <button
          id="top-run-scraping-btn"
          onClick={onTriggerScrape}
          disabled={isScrapingRunning}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition cursor-pointer ${
            isScrapingRunning
              ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
          <span>
            {isScrapingRunning
              ? language === 'hi' ? 'डेटा संकलित हो रहा है...' : 'Harvesting...'
              : language === 'hi' ? 'लाइव डेटा रीफ्रेश' : 'Fetch Live Quotes'}
          </span>
        </button>
      </div>
    </header>
  );
};
