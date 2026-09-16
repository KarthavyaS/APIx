import React from 'react';
import {
  Plane,
  RefreshCw,
  Activity,
  ShieldCheck,
  Database,
  Sliders,
  Code2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Layers,
  HelpCircle,
  FileText,
  Eye,
  Languages,
  UserCheck,
  Building,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerScrape: () => void;
  isScrapingRunning: boolean;
  onOpenWeightsModal: () => void;
  currentIndex?: number;
  dailyChangePct?: number;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  viewMode: 'citizen' | 'policymaker';
  setViewMode: (mode: 'citizen' | 'policymaker') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onTriggerScrape,
  isScrapingRunning,
  onOpenWeightsModal,
  currentIndex = 108.45,
  dailyChangePct = 0.45,
  language,
  setLanguage,
  viewMode,
  setViewMode,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
}) => {
  const tabs = [
    {
      id: 'overview',
      labelEn: 'Inflation & Price Trends',
      labelHi: 'मूल्य व मुद्रास्फीति रुझान',
      icon: TrendingUp,
    },
    {
      id: 'guide',
      labelEn: 'Citizen Fare Checker & FAQ',
      labelHi: 'नागरिक किराया गाइड व प्रश्न',
      icon: HelpCircle,
      badge: 'Citizen',
    },
    {
      id: 'elasticity',
      labelEn: 'Advance Booking Savings',
      labelHi: 'अग्रिम बुकिंग बचत (T+1 से T+45)',
      icon: Activity,
    },
    {
      id: 'heatmap',
      labelEn: 'Route Price Matrix',
      labelHi: 'रूट किराया मैट्रिक्स',
      icon: Layers,
    },
    {
      id: 'airlines',
      labelEn: 'Airlines & OTAs Breakdown',
      labelHi: 'एयरलाइंस व टिकट पोर्टल',
      icon: BarChart3,
    },
    {
      id: 'anomalies',
      labelEn: 'Price Surge Alerts',
      labelHi: 'असामान्य किराया वृद्धि',
      icon: AlertTriangle,
    },
    {
      id: 'forecast',
      labelEn: '14-Day Price Outlook',
      labelHi: '14-दिवसीय मूल्य अनुमान',
      icon: Plane,
    },
    {
      id: 'bulletin',
      labelEn: 'Official NSO/RBI Bulletin',
      labelHi: 'आधिकारिक सांख्यिकी बुलेटिन',
      icon: FileText,
      badge: 'Official',
    },
    {
      id: 'backtesting',
      labelEn: 'DGCA Benchmark Validation',
      labelHi: 'डीजीसीए बेंचमार्क तुलना',
      icon: ShieldCheck,
    },
    {
      id: 'quotes',
      labelEn: 'Live Data Pipeline',
      labelHi: 'लाइव डेटा पाइपलाइन',
      icon: Database,
    },
    {
      id: 'api',
      labelEn: 'API Explorer',
      labelHi: 'एपीआई एक्सप्लोरर',
      icon: Code2,
    },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* 1. Indian Tricolor Ribbon (GIGW Visual Standard) */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full" />

      {/* 2. Top GIGW Official Accessibility & Ministry Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-[11px] text-slate-300 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          {/* Ashoka Pillar / Emblem Badge */}
          <span className="font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
            <span className="text-amber-400 font-serif font-bold text-xs">🏛️ भारत सरकार | Government of India</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden md:inline">
            Ministry of Statistics & Programme Implementation (MoSPI) • National Statistical Office (NSO)
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('citizen')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition cursor-pointer ${
                viewMode === 'citizen'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नागरिक दृश्य' : 'Citizen View'}
            </button>
            <button
              onClick={() => setViewMode('policymaker')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition cursor-pointer ${
                viewMode === 'policymaker'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नीति निर्माता (NSO/RBI)' : 'Policy View'}
            </button>
          </div>

          {/* Font Resize Accessibility */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">
            <span className="text-slate-400 text-[9px] mr-1">Text:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-1 rounded ${fontSize === 'sm' ? 'bg-indigo-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-1 rounded ${fontSize === 'md' ? 'bg-indigo-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Standard text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-1 rounded ${fontSize === 'lg' ? 'bg-indigo-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition ${
              highContrast
                ? 'bg-amber-400 text-black border-amber-300 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle high contrast accessibility mode"
          >
            {highContrast ? '⚡ Contrast: ON' : 'Contrast'}
          </button>

          {/* Bilingual Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 rounded text-[10px] font-medium transition cursor-pointer"
          >
            <Languages className="w-3 h-3" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Brand & Headline Index Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-600/30 border border-indigo-400/30">
            <Plane className="w-6 h-6 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>APIx</span>
                <span className="text-indigo-400 font-normal">|</span>
                <span className="text-slate-200">
                  {language === 'hi' ? 'भारतीय घरेलू हवाई किराया मूल्य सूचकांक' : 'National Airfare Price Index India'}
                </span>
              </h1>
              <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-semibold hidden sm:inline">
                MoSPI / NSO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {language === 'hi'
                ? 'घरेलू उड़ानों की वास्तविक कीमतों की पारदर्शी सांख्यिकीय निगरानी • उपभोक्ता मूल्य सूचकांक (CPI) ढांचा'
                : 'Real-time retail price inflation & dynamic tariff observatory for Indian civil aviation'}
            </p>
          </div>
        </div>

        {/* Live Index Headline Indicator & Primary Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Index Pill */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-1.5 flex items-center space-x-3 shadow-inner">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                {language === 'hi' ? 'वर्तमान सूचकांक' : 'Headline Index'}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black font-mono text-white">{currentIndex.toFixed(2)}</span>
                <span
                  className={`text-xs font-bold font-mono ${dailyChangePct >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}
                >
                  {dailyChangePct >= 0 ? `+${dailyChangePct.toFixed(2)}%` : `${dailyChangePct.toFixed(2)}%`}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 border-l border-slate-700 pl-2.5 leading-tight">
              <span className="text-slate-500 font-medium">Base 100.0</span>
              <br />
              <span className="text-indigo-300 font-mono font-semibold">Aug 2026</span>
            </div>
          </div>

          {/* Configure Weights Modal Button */}
          <button
            id="configure-weights-btn"
            onClick={onOpenWeightsModal}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
            title="Configure route basket weights stored in database"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{language === 'hi' ? 'रूट भार (Weights)' : 'Route Weights'}</span>
          </button>

          {/* Trigger Ethical Scrape Harvest Button */}
          <button
            id="run-scraping-btn"
            onClick={onTriggerScrape}
            disabled={isScrapingRunning}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg shadow-sm transition cursor-pointer ${
              isScrapingRunning
                ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
            <span>
              {isScrapingRunning
                ? language === 'hi'
                  ? 'डेटा एकत्र हो रहा है...'
                  : 'Harvesting Fares...'
                : language === 'hi'
                ? 'लाइव डेटा अपडेट'
                : 'Update Live Data'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Tab Navigation (Plain-English & Categorized) */}
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      tab.badge === 'Citizen'
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-emerald-400 text-emerald-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

