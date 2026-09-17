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
  Zap,
  Code2,
  PhoneCall,
  Menu,
  X,
  Languages,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentIndex?: number;
  dailyChangePct?: number;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
}

// Official State Emblem of India (Lion Capital of Ashoka) Vector Representation
const IndiaEmblemSvg = () => (
  <svg
    viewBox="0 0 100 125"
    className="w-12 h-16 shrink-0 drop-shadow-xs"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="State Emblem of India"
  >
    {/* Central & Side Lions Silhouette */}
    <path
      d="M50 14 C46 14 42 16 41 20 C38 18 34 19 32 23 C30 27 32 32 35 34 C33 37 34 42 38 45 C41 47 45 46 47 43 C48 45 52 45 53 43 C55 46 59 47 62 45 C66 42 67 37 65 34 C68 32 70 27 68 23 C66 19 62 18 59 20 C58 16 54 14 50 14 Z"
      fill="#854d0e"
    />
    {/* Crown & Manes Details */}
    <path
      d="M44 24 C44 22 47 20 50 20 C53 20 56 22 56 24 C56 27 53 29 50 29 C47 29 44 27 44 24 Z"
      fill="#ca8a04"
    />
    <circle cx="50" cy="24" r="2.5" fill="#713f12" />
    <circle cx="39" cy="27" r="2" fill="#713f12" />
    <circle cx="61" cy="27" r="2" fill="#713f12" />
    
    {/* Pillars & Abacus Base */}
    <path
      d="M32 48 L68 48 C70 48 71 50 70 52 L67 58 C66 60 64 61 62 61 L38 61 C36 61 34 60 33 58 L30 52 C29 50 30 48 32 48 Z"
      fill="#a16207"
    />

    {/* Ashoka Chakra Wheel */}
    <circle cx="50" cy="54.5" r="4.5" stroke="#1e3a8a" strokeWidth="1.2" fill="#ffffff" />
    <circle cx="50" cy="54.5" r="1" fill="#1e3a8a" />
    <line x1="50" y1="50" x2="50" y2="59" stroke="#1e3a8a" strokeWidth="0.6" />
    <line x1="45.5" y1="54.5" x2="54.5" y2="54.5" stroke="#1e3a8a" strokeWidth="0.6" />
    <line x1="46.8" y1="51.3" x2="53.2" y2="57.7" stroke="#1e3a8a" strokeWidth="0.6" />
    <line x1="46.8" y1="57.7" x2="53.2" y2="51.3" stroke="#1e3a8a" strokeWidth="0.6" />

    {/* Galloping Horse (Left) & Bull (Right) Mini Shapes */}
    <path d="M36 53 C34 53 33 55 35 56 C36 57 38 56 38 54 Z" fill="#713f12" />
    <path d="M64 53 C66 53 67 55 65 56 C64 57 62 56 62 54 Z" fill="#713f12" />

    {/* Lotus Bell Base Foundation */}
    <path
      d="M26 63 C33 62 67 62 74 63 C76 64 75 67 73 68 L27 68 C25 67 24 64 26 63 Z"
      fill="#854d0e"
    />
    <path
      d="M30 68 L70 68 L68 73 L32 73 Z"
      fill="#ca8a04"
    />
    <path
      d="M24 74 L76 74 L78 77 L22 77 Z"
      fill="#713f12"
    />

    {/* Official Satyameva Jayate (सत्यमेव जयते) Inscription */}
    <text
      x="50"
      y="89"
      textAnchor="middle"
      fontSize="8.5"
      fontWeight="900"
      fontFamily="'Plus Jakarta Sans', 'Segoe UI', sans-serif"
      fill="#78350f"
      letterSpacing="0.5"
    >
      सत्यमेव जयते
    </text>
    <text
      x="50"
      y="98"
      textAnchor="middle"
      fontSize="5.5"
      fontWeight="800"
      fontFamily="'Plus Jakarta Sans', 'Segoe UI', sans-serif"
      fill="#9a3412"
      letterSpacing="0.8"
    >
      GOVERNMENT OF INDIA
    </text>
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentIndex = 108.45,
  dailyChangePct = 0.45,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  isCollapsed = false,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Concise, Clean Indian Government Portal Navigation Menu
  const navItems = [
    {
      id: 'quotes',
      labelEn: 'Live Data Harvest',
      labelHi: 'लाइव डेटा संकलन',
      icon: Zap,
      badge: 'Live',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'overview',
      labelEn: 'National Price Overview',
      labelHi: 'राष्ट्रीय मूल्य अवलोकन',
      icon: TrendingUp,
    },
    {
      id: 'guide',
      labelEn: 'Citizen Price Calculator',
      labelHi: 'नागरिक किराया कैलकुलेटर',
      icon: HelpCircle,
      badge: 'Citizen',
      badgeColor: 'bg-emerald-600 text-white',
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
      id: 'anomalies',
      labelEn: 'Price Surge Alerts',
      labelHi: 'किराया वृद्धि अलर्ट',
      icon: AlertTriangle,
    },
    {
      id: 'airlines',
      labelEn: 'Airlines & Portals Share',
      labelHi: 'एयरलाइंस व बुकिंग पोर्टल',
      icon: BarChart3,
    },
    {
      id: 'forecast',
      labelEn: '14-Day Price Outlook',
      labelHi: '14-दिवसीय मूल्य अनुमान',
      icon: Plane,
    },
    {
      id: 'bulletin',
      labelEn: 'NSO Official Bulletin & Data',
      labelHi: 'NSO आधिकारिक बुलेटिन व डेटा',
      icon: FileText,
      badge: 'Official',
      badgeColor: 'bg-indigo-700 text-white',
    },
    {
      id: 'backtesting',
      labelEn: 'DGCA Benchmark Validation',
      labelHi: 'डीजीसीए बेंचमार्क तुलना',
      icon: ShieldCheck,
    },
    {
      id: 'api',
      labelEn: 'OpenAPI REST Service',
      labelHi: 'ओपन एपीआई सर्विस',
      icon: Code2,
    },
    {
      id: 'contact',
      labelEn: 'Ministry Contact & Helpdesk',
      labelHi: 'मंत्रालय संपर्क व सहायता',
      icon: PhoneCall,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white text-slate-900 border-b border-slate-200 p-3 flex justify-between items-center sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-3">
          <IndiaEmblemSvg />
          <div>
            <span className="font-black text-base text-slate-900 tracking-tight flex items-center gap-1">
              APIx <span className="text-orange-600 font-bold">| भारत सरकार</span>
            </span>
            <span className="text-xs text-slate-600 font-semibold block">Airfare Price Index • MoSPI</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        {/* National Indian Tricolor Strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full shrink-0" />

        {/* 1. Official State Emblem Header with Large Visibility */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center space-x-3.5">
            {/* Official State Emblem of India Vector Graphic */}
            <div className="p-1.5 bg-amber-50/70 border border-amber-300 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
              <IndiaEmblemSvg />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                {/* Large Government Tag */}
                <div className="flex items-center gap-1.5 text-xs font-black text-orange-700 uppercase tracking-wide">
                  <span>भारत सरकार</span>
                  <span className="text-slate-400 font-normal">•</span>
                  <span>GOVERNMENT OF INDIA</span>
                </div>

                {/* Large Product Name */}
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight mt-0.5">
                  Airfare Price Index (APIx)
                </h1>

                {/* Large Government Explanation */}
                <p className="text-xs font-bold text-blue-900 leading-tight mt-0.5">
                  National Statistical Office (NSO)
                </p>
                <p className="text-[11px] font-semibold text-slate-600 leading-tight">
                  Ministry of Statistics & Programme Implementation (MoSPI)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Navigation Items (Large, Crisp & Easy to Read) */}
        <div className="overflow-y-auto px-2.5 py-3 space-y-1.5 flex-1 scrollbar-thin scrollbar-thumb-slate-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isCollapsed ? (language === 'hi' ? item.labelHi : item.labelEn) : undefined}
                className={`w-full text-left rounded-xl transition flex items-center cursor-pointer ${
                  isCollapsed ? 'p-3 justify-center' : 'px-3.5 py-3 space-x-3'
                } ${
                  isActive
                    ? 'bg-blue-900 text-white font-bold shadow-md shadow-blue-900/20'
                    : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-semibold'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.id === 'quotes'
                      ? 'text-rose-600'
                      : 'text-slate-600'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className={`text-sm sm:text-base font-bold truncate leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {language === 'hi' ? item.labelHi : item.labelEn}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase shrink-0 ml-1.5 ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Bottom Accessibility & Language Toolbar */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2.5">
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block leading-tight">
                  {language === 'hi' ? 'राष्ट्रीय सूचकांक (आधार 100.0)' : 'Headline Index (Base 100.0)'}
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-base font-black font-mono text-slate-900">
                    {currentIndex.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      dailyChangePct >= 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {dailyChangePct >= 0 ? `+${dailyChangePct.toFixed(2)}%` : `${dailyChangePct.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active
              </span>
            </div>
          )}

          <div className={`flex items-center text-xs ${isCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-bold transition cursor-pointer text-xs flex items-center space-x-1.5 hover:bg-blue-100"
            >
              <Languages className="w-4 h-4 text-blue-900" />
              {!isCollapsed && <span className="text-xs">{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>}
            </button>

            {/* Font Sizer */}
            {!isCollapsed && (
              <div className="flex items-center space-x-0.5 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-0.5 rounded font-extrabold ${
                    fontSize === 'sm' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                  title="Small Font"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-0.5 rounded font-extrabold ${
                    fontSize === 'md' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                  title="Normal Font"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-0.5 rounded font-extrabold ${
                    fontSize === 'lg' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                  title="Large Font"
                >
                  A+
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
        />
      )}
    </>
  );
};
