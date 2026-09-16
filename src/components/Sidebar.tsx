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
  SlidersHorizontal,
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
  onOpenWeightsModal,
  onTriggerScrape,
  isScrapingRunning,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Grouped and Prioritized Navigation Items
  const navSections = [
    {
      titleEn: 'Citizen & Public Services',
      titleHi: 'नागरिक एवं सार्वजनिक सेवाएं',
      priority: 'HIGH',
      items: [
        {
          id: 'overview',
          labelEn: 'Inflation & Price Trends',
          labelHi: 'मूल्य व मुद्रास्फीति रुझान',
          icon: TrendingUp,
          descEn: 'National headline index & inflation tracker',
          descHi: 'राष्ट्रीय सूचकांक एवं मूल्य स्तर',
        },
        {
          id: 'guide',
          labelEn: 'Citizen Price Checker & FAQ',
          labelHi: 'नागरिक किराया गाइड व प्रश्न',
          icon: HelpCircle,
          badge: 'Popular',
          badgeColor: 'bg-amber-400 text-amber-950',
          descEn: 'Compare advance booking & ticket fees',
          descHi: 'अग्रिम बुकिंग बचत व शुल्क विभाजन',
        },
        {
          id: 'elasticity',
          labelEn: 'Advance Booking Savings',
          labelHi: 'अग्रिम बुकिंग बचत (T+1 से T+45)',
          icon: Activity,
          descEn: 'Price curve as departure date nears',
          descHi: 'यात्रा तिथि के पास आने पर किराया वृद्धि',
        },
        {
          id: 'heatmap',
          labelEn: 'Route Price Matrix & Map',
          labelHi: 'रूट किराया मैट्रिक्स एवं मानचित्र',
          icon: Layers,
          descEn: 'Origin-Destination trunk fares',
          descHi: 'प्रमुख शहरों के मध्य हवाई किराया',
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
          badge: 'Live',
          badgeColor: 'bg-rose-500 text-white',
          descEn: 'Peak spikes & festival rush alerts',
          descHi: 'अचानक मूल्य वृद्धि व स्लॉट बाधाएं',
        },
        {
          id: 'airlines',
          labelEn: 'Airlines & OTAs Breakdown',
          labelHi: 'एयरलाइंस एवं टिकट पोर्टल',
          icon: BarChart3,
          descEn: 'Carrier market share & base fare yields',
          descHi: 'एयरलाइंस का बाजार हिस्सा व किराया',
        },
        {
          id: 'forecast',
          labelEn: '14-Day Price Outlook',
          labelHi: '14-दिवसीय मूल्य अनुमान',
          icon: Plane,
          descEn: 'Predictive trend & event calendar',
          descHi: 'आगामी 14 दिनों का मूल्य पूर्वानुमान',
        },
      ],
    },
    {
      titleEn: 'Official Policy & Open Data',
      titleHi: 'सरकारी एवं नीतिगत सांख्यिकी',
      priority: 'INSTITUTIONAL',
      items: [
        {
          id: 'bulletin',
          labelEn: 'Official NSO/RBI Bulletin',
          labelHi: 'आधिकारिक सांख्यिकी बुलेटिन',
          icon: FileText,
          badge: 'Official',
          badgeColor: 'bg-emerald-500 text-white',
          descEn: 'Printable monthly press release & CSV export',
          descHi: 'मासिक प्रेस विज्ञप्ति व डेटा डाउनलोड',
        },
        {
          id: 'backtesting',
          labelEn: 'DGCA Benchmark Validation',
          labelHi: 'डीजीसीए बेंचमार्क तुलना',
          icon: ShieldCheck,
          descEn: 'Historical 30-day yield correlation',
          descHi: 'डीजीसीए के आंकड़ों के साथ सत्यापन',
        },
        {
          id: 'quotes',
          labelEn: 'Live Data Pipeline',
          labelHi: 'लाइव डेटा पाइपलाइन',
          icon: Database,
          descEn: 'Scraping logs & deduplication rate',
          descHi: 'डेटा संग्रह स्थिति व स्वास्थ्य',
        },
        {
          id: 'api',
          labelEn: 'REST API & OpenAPI',
          labelHi: 'एपीआई एक्सप्लोरर (NSO/RBI)',
          icon: Code2,
          descEn: 'Machine-readable endpoints for economists',
          descHi: 'अर्थशास्त्रियों के लिए ओपन एपीआई',
        },
        {
          id: 'contact',
          labelEn: 'Helpdesk & Official Contact',
          labelHi: 'नागरिक सहायता एवं संपर्क',
          icon: PhoneCall,
          descEn: 'MoSPI PSD address, inquiry form & helplines',
          descHi: 'मंत्रालय पता, पूछताछ फॉर्म व हेल्पलाइन',
        },
      ],
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden bg-slate-950 text-white p-3 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          {/* Ashoka Emblem Mini */}
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-base">
            🏛️
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1">
              APIx <span className="text-amber-400 font-normal">| भारत सरकार</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Airfare Price Index</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-200 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Tricolor Strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full shrink-0" />

        {/* 1. Header with Official State Emblem of India */}
        <div className="p-4 border-b border-slate-800/90 bg-slate-900/60 shrink-0">
          <div className="flex items-start space-x-3">
            {/* Lion Capital of Ashoka / State Emblem SVG Representation */}
            <div className="w-12 h-14 rounded-lg bg-slate-900 border border-amber-500/40 flex flex-col items-center justify-center shadow-md p-1 shrink-0 text-center">
              <span className="text-lg">🏛️</span>
              <span className="text-[7px] text-amber-400 font-bold uppercase tracking-tighter mt-0.5">
                सत्यमेव जयते
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <span>भारत सरकार</span>
                <span className="text-slate-500">•</span>
                <span>Govt. of India</span>
              </div>
              <h1 className="text-sm font-black text-white leading-tight tracking-tight mt-0.5">
                National Airfare Price Index
              </h1>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 font-medium">
                National Statistical Office (NSO) • MoSPI
              </p>
            </div>
          </div>

          {/* Mode Switcher inside Sidebar */}
          <div className="mt-3.5 grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('citizen')}
              className={`py-1 text-xs font-bold rounded-md transition text-center cursor-pointer ${
                viewMode === 'citizen'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नागरिक दृश्य' : 'Citizen View'}
            </button>
            <button
              onClick={() => setViewMode('policymaker')}
              className={`py-1 text-xs font-bold rounded-md transition text-center cursor-pointer ${
                viewMode === 'policymaker'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नीति निर्माता' : 'Policy View'}
            </button>
          </div>
        </div>

        {/* 2. Navigation Items (Grouped by Priority with Larger Typography) */}
        <div className="overflow-y-auto px-3 py-3 space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2.5 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{language === 'hi' ? section.titleHi : section.titleEn}</span>
                {section.priority === 'HIGH' && (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/50">
                    High Priority
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {section.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-3 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                          : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
                            {language === 'hi' ? tab.labelHi : tab.labelEn}
                          </span>
                          {tab.badge && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase shrink-0 ml-1.5 ${tab.badgeColor || 'bg-indigo-500 text-white'}`}>
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {language === 'hi' ? tab.descHi : tab.descEn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Bottom Accessibility, Language & Utility Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 shrink-0 space-y-2.5">
          {/* Headline Index Miniature */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {language === 'hi' ? 'राष्ट्रीय सूचकांक' : 'Headline APIx Index'}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-extrabold font-mono text-white">{currentIndex.toFixed(2)}</span>
                <span className={`text-[11px] font-bold font-mono ${dailyChangePct >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {dailyChangePct >= 0 ? `+${dailyChangePct.toFixed(2)}%` : `${dailyChangePct.toFixed(2)}%`}
                </span>
              </div>
            </div>

            <button
              onClick={onTriggerScrape}
              disabled={isScrapingRunning}
              title="Harvest live prices"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-70 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Accessibility & Language Quick Bar */}
          <div className="flex items-center justify-between text-xs pt-1">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 rounded-md font-semibold transition cursor-pointer text-xs"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Font Sizer */}
            <div className="flex items-center space-x-1 bg-slate-950 px-1.5 py-1 rounded border border-slate-800 text-[11px]">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 rounded font-bold ${fontSize === 'sm' ? 'bg-indigo-700 text-white' : 'text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-1.5 rounded font-bold ${fontSize === 'md' ? 'bg-indigo-700 text-white' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 rounded font-bold ${fontSize === 'lg' ? 'bg-indigo-700 text-white' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2 py-1 rounded text-xs font-bold border transition cursor-pointer ${
                highContrast ? 'bg-amber-400 text-black border-amber-300' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
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
