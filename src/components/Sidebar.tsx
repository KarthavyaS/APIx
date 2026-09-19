import React, { useState } from 'react';
import {
  TrendingUp,
  HelpCircle,
  Activity,
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

// Official State Emblem of India (Lion Capital of Ashoka) Real Government Vector
const OfficialEmblem: React.FC<{ className?: string }> = ({ className = 'h-14 w-auto' }) => (
  <img
    src="/emblem.svg"
    alt="State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate)"
    className={`object-contain ${className}`}
    loading="eager"
  />
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
          <OfficialEmblem className="h-12 w-auto shrink-0" />
          <div className="border-l border-slate-300 pl-2.5">
            <span className="font-black text-sm text-slate-900 tracking-tight block">
              भारत सरकार | Government of India
            </span>
            <span className="text-[11px] text-slate-600 font-semibold block">
              Airfare Price Index (APIx) • MoSPI
            </span>
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
        {/* National Indian Tricolor Header Ribbon (GIGW Guidelines) */}
        <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] w-full shrink-0 shadow-xs" />

        {/* 1. Official State Emblem Header (Authentic National Government Portal Style) */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white shrink-0">
          <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-start space-x-3'}`}>
            {/* Real Official Lion Capital of Ashoka Emblem */}
            <div className="shrink-0 flex items-center justify-center pt-0.5">
              <OfficialEmblem className={isCollapsed ? 'h-12 w-auto' : 'h-16 w-auto'} />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1 border-l-2 border-slate-200/80 pl-3">
                {/* Government Hierarchy */}
                <div className="text-[11px] font-extrabold text-[#993D00] tracking-wide uppercase leading-tight">
                  भारत सरकार
                </div>
                <div className="text-[10px] font-bold text-slate-700 tracking-wider uppercase leading-tight">
                  GOVERNMENT OF INDIA
                </div>

                {/* Ministry */}
                <div className="text-[11px] font-bold text-blue-950 leading-snug mt-1">
                  सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय
                </div>
                <div className="text-[10px] font-semibold text-slate-600 leading-tight">
                  Ministry of Statistics & PI
                </div>

                {/* Portal Title & Division */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                  <span className="inline-block bg-blue-900 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                    NSO Official Portal
                  </span>
                  <div className="text-xs font-black text-slate-900 leading-tight mt-1">
                    Airfare Price Index (APIx)
                  </div>
                </div>
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
