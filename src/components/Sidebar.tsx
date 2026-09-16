import React, { useState } from 'react';
import {
  TrendingUp,
  HelpCircle,
  Activity,
  Layers,
  BarChart3,
  AlertTriangle,
  Plane,
  FileText,
  ShieldCheck,
  Database,
  Code2,
  PhoneCall,
  Menu,
  X,
  Languages,
  Eye,
  Building2,
  Sparkles,
  Sliders,
  RefreshCw,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenWeightsModal: () => void;
  onTriggerScrape: () => void;
  isScrapingRunning: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
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
  isDark,
  setIsDark,
  isCollapsed,
  setIsCollapsed,
  onOpenWeightsModal,
  onTriggerScrape,
  isScrapingRunning,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Grouped Navigation Items with LIVE SCRAPER TOPPED at Priority 1
  const navSections = [
    {
      titleEn: 'Live Data & Pipeline (Top Priority)',
      titleHi: 'लाइव डेटा एवं पाइपलाइन (शीर्ष प्राथमिकता)',
      priority: 'LIVE',
      items: [
        {
          id: 'quotes',
          labelEn: 'Live Data Pipeline & Scraper',
          labelHi: 'लाइव डेटा पाइपलाइन व स्क्रैपर',
          icon: Zap,
          badge: 'Live',
          badgeColor: 'bg-rose-500 text-white animate-pulse',
          descEn: 'Scraping logs, deduplication & active OTA feeds',
          descHi: 'लाइव डेटा संग्रहण, डिडुप्लीकेशन व पोर्टल स्थिति',
        },
      ],
    },
    {
      titleEn: 'Citizen Services & Price Guide',
      titleHi: 'नागरिक सेवाएं एवं किराया गाइड',
      priority: 'HIGH',
      items: [
        {
          id: 'overview',
          labelEn: 'National Price & Inflation Trends',
          labelHi: 'राष्ट्रीय मूल्य एवं मुद्रास्फीति रुझान',
          icon: TrendingUp,
          descEn: 'Headline index & daily price movement',
          descHi: 'राष्ट्रीय सूचकांक व दैनिक मूल्य उतार-चढ़ाव',
        },
        {
          id: 'guide',
          labelEn: 'Citizen Fare Guide & Price Checker',
          labelHi: 'नागरिक किराया गाइड व कैलकुलेटर',
          icon: HelpCircle,
          badge: 'Popular',
          badgeColor: 'bg-amber-500 text-amber-950 font-bold',
          descEn: 'Compare advance booking & ticket fee breakdown',
          descHi: 'अग्रिम बुकिंग बचत व बेस फेयर/टैक्स विभाजन',
        },
        {
          id: 'elasticity',
          labelEn: 'Advance Booking Savings (T+1 to T+45)',
          labelHi: 'अग्रिम बुकिंग बचत (T+1 से T+45)',
          icon: Activity,
          descEn: 'Price acceleration curve as departure nears',
          descHi: 'यात्रा तिथि के पास आने पर किराया वृद्धि',
        },
        {
          id: 'heatmap',
          labelEn: 'Route Price Matrix & Heatmap',
          labelHi: 'रूट किराया मैट्रिक्स एवं मैप',
          icon: Layers,
          descEn: 'Trunk corridor fares (DEL, BOM, BLR, etc.)',
          descHi: 'प्रमुख शहरों के मध्य हवाई किराया तुलना',
        },
      ],
    },
    {
      titleEn: 'Market Intelligence & Alerts',
      titleHi: 'बाजार विश्लेषण एवं अलर्ट',
      priority: 'MEDIUM',
      items: [
        {
          id: 'anomalies',
          labelEn: 'Price Surge Alerts',
          labelHi: 'असामान्य किराया वृद्धि अलर्ट',
          icon: AlertTriangle,
          badge: 'Alerts',
          badgeColor: 'bg-amber-500 text-black font-bold',
          descEn: 'Peak spikes & festival rush surge alerts',
          descHi: 'त्योहारों व पीक समय की अचानक मूल्य वृद्धि',
        },
        {
          id: 'airlines',
          labelEn: 'Airlines & OTAs Breakdown',
          labelHi: 'एयरलाइंस एवं टिकट पोर्टल शेयर',
          icon: BarChart3,
          descEn: 'Carrier market share & base yields',
          descHi: 'एयरलाइंस का बाजार हिस्सा व किराया उपज',
        },
        {
          id: 'forecast',
          labelEn: '14-Day Price Outlook',
          labelHi: '14-दिवसीय मूल्य पूर्वानुमान',
          icon: Plane,
          descEn: 'Predictive trend & event calendar',
          descHi: 'आगामी 14 दिनों का मूल्य अनुमान',
        },
      ],
    },
    {
      titleEn: 'Official Policy, Open Data & Helpdesk',
      titleHi: 'सरकारी सांख्यिकी, डेटा एवं सहायता',
      priority: 'INSTITUTIONAL',
      items: [
        {
          id: 'bulletin',
          labelEn: 'Official NSO/RBI Monthly Bulletin',
          labelHi: 'आधिकारिक NSO/RBI सांख्यिकी बुलेटिन',
          icon: FileText,
          badge: 'Official',
          badgeColor: 'bg-emerald-600 text-white font-bold',
          descEn: 'Printable press release & OGD CSV exports',
          descHi: 'मासिक प्रेस विज्ञप्ति व सरकारी CSV डेटा',
        },
        {
          id: 'backtesting',
          labelEn: 'DGCA Benchmark Validation',
          labelHi: 'डीजीसीए बेंचमार्क तुलना (30-Day Lag)',
          icon: ShieldCheck,
          descEn: 'Historical yield correlation & accuracy',
          descHi: 'डीजीसीए आधिकारिक आंकड़ों के साथ सत्यापन',
        },
        {
          id: 'api',
          labelEn: 'OpenAPI REST Explorer',
          labelHi: 'ओपन एपीआई एक्सप्लोरर (NSO/RBI)',
          icon: Code2,
          descEn: 'Machine-readable endpoints for economists',
          descHi: 'अर्थशास्त्रियों के लिए ओपन एंडपॉइंट्स',
        },
        {
          id: 'contact',
          labelEn: 'Helpdesk & Official Contact',
          labelHi: 'नागरिक सहायता एवं मंत्रालय संपर्क',
          icon: PhoneCall,
          descEn: 'MoSPI PSD address, inquiry form & helpline 1915',
          descHi: 'मंत्रालय पता, पूछताछ फॉर्म व राष्ट्रीय हेल्पलाइन',
        },
      ],
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  // Base theme classes (Light by default, Dark when toggled)
  const sidebarBg = isDark
    ? 'bg-slate-950 text-slate-200 border-slate-800'
    : 'bg-white text-slate-800 border-slate-200/90 shadow-sm';

  const headerBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200';
  const itemActive = 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20';
  const itemHover = isDark
    ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950';

  const subtextColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const bottomBoxBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/80 border-slate-200';

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div
        className={`lg:hidden p-3 border-b flex justify-between items-center sticky top-0 z-50 ${
          isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-base">
            🏛️
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight flex items-center gap-1">
              APIx <span className="text-amber-600 font-normal">| भारत सरकार</span>
            </span>
            <span className="text-[10px] text-slate-500 block -mt-0.5">Airfare Price Index</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button Mobile */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 border rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarBg} ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        {/* Top Tricolor Strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full shrink-0" />

        {/* 1. Header with Official State Emblem of India and Expand/Collapse Toggle */}
        <div className={`p-3.5 border-b shrink-0 ${headerBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              {/* Lion Capital of Ashoka / State Emblem */}
              <div className="w-10 h-12 rounded-lg bg-amber-500/10 border border-amber-500/40 flex flex-col items-center justify-center shadow-xs shrink-0 text-center">
                <span className="text-base">🏛️</span>
                {!isCollapsed && (
                  <span className="text-[6px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-tighter mt-0.5">
                    सत्यमेव जयते
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    <span>भारत सरकार</span>
                    <span className="text-slate-400">•</span>
                    <span>Govt. of India</span>
                  </div>
                  <h1 className="text-xs font-black text-slate-900 dark:text-white leading-tight tracking-tight mt-0.5 truncate">
                    Airfare Price Index (APIx)
                  </h1>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                    NSO • MoSPI Civil Aviation
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse / Expand (Three Lines / Reverse) Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar (Reverse)'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Mode Switcher inside Sidebar (Citizen vs Policymaker) */}
          {!isCollapsed && (
            <div className="mt-3 grid grid-cols-2 gap-1 p-1 rounded-lg border bg-slate-200/70 dark:bg-slate-900 border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setViewMode('citizen')}
                className={`py-1 text-xs font-bold rounded-md transition text-center cursor-pointer ${
                  viewMode === 'citizen'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'नागरिक दृश्य' : 'Citizen View'}
              </button>
              <button
                onClick={() => setViewMode('policymaker')}
                className={`py-1 text-xs font-bold rounded-md transition text-center cursor-pointer ${
                  viewMode === 'policymaker'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'नीति निर्माता' : 'Policy View'}
              </button>
            </div>
          )}
        </div>

        {/* 2. Navigation Items (Grouped by Priority with Live Scraper at Top) */}
        <div className="overflow-y-auto px-2 py-3 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate">{language === 'hi' ? section.titleHi : section.titleEn}</span>
                  {section.priority === 'LIVE' && (
                    <span className="text-[8px] font-extrabold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-300 dark:border-rose-800">
                      LIVE HARVEST
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      title={isCollapsed ? (language === 'hi' ? tab.labelHi : tab.labelEn) : undefined}
                      className={`w-full text-left rounded-xl transition flex items-center cursor-pointer ${
                        isCollapsed ? 'p-2.5 justify-center' : 'p-2.5 space-x-3'
                      } ${isActive ? itemActive : itemHover}`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : tab.id === 'quotes'
                            ? 'text-rose-500'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
                              {language === 'hi' ? tab.labelHi : tab.labelEn}
                            </span>
                            {tab.badge && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase shrink-0 ml-1.5 ${
                                  tab.badgeColor || 'bg-indigo-500 text-white'
                                }`}
                              >
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-indigo-100' : subtextColor}`}>
                            {language === 'hi' ? tab.descHi : tab.descEn}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Bottom Accessibility, Theme, Language & Headline Bar */}
        <div className={`p-2.5 border-t shrink-0 space-y-2 ${bottomBoxBg}`}>
          {/* Headline Index Miniature (when expanded) */}
          {!isCollapsed && (
            <div className={`p-2 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold block leading-tight">
                  {language === 'hi' ? 'राष्ट्रीय सूचकांक' : 'Headline APIx Index'}
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                    {currentIndex.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono ${
                      dailyChangePct >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {dailyChangePct >= 0 ? `+${dailyChangePct.toFixed(2)}%` : `${dailyChangePct.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              <button
                onClick={onTriggerScrape}
                disabled={isScrapingRunning}
                title="Harvest live flight fares"
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-70 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}

          {/* Quick Toolbar: Theme Toggle, Language, Font Sizer, High Contrast */}
          <div className={`flex items-center text-xs pt-0.5 ${isCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              {!isCollapsed && <span className="text-[10px] font-semibold">{isDark ? 'Light' : 'Dark'}</span>}
            </button>

            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 rounded-md font-bold transition cursor-pointer text-[10px] flex items-center space-x-1"
              title="Toggle English / Hindi"
            >
              <Languages className="w-3 h-3" />
              {!isCollapsed && <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>}
            </button>

            {/* Font Sizer (when expanded) */}
            {!isCollapsed && (
              <div className="flex items-center space-x-0.5 bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-800 text-[10px]">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-1 rounded font-bold ${
                    fontSize === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-1 rounded font-bold ${
                    fontSize === 'md' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-1 rounded font-bold ${
                    fontSize === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  A+
                </button>
              </div>
            )}

            {/* High Contrast */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-1.5 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                highContrast
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-slate-200 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:text-black dark:hover:text-white'
              }`}
              title="Toggle High Contrast"
            >
              {highContrast ? 'C: ON' : 'Contrast'}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}
    </>
  );
};
