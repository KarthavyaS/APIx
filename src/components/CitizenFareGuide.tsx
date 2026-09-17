import React, { useState } from 'react';
import { Route, FareQuote } from '../types';
import {
  HelpCircle,
  Search,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CitizenFareGuideProps {
  routes: Route[];
  quotes: FareQuote[];
  language?: 'en' | 'hi';
}

export const CitizenFareGuide: React.FC<CitizenFareGuideProps> = ({
  routes = [],
  quotes = [],
  language = 'en',
}) => {
  const fallbackRoute: Route = {
    id: '1',
    code: 'DEL-BOM',
    origin: 'DEL',
    destination: 'BOM',
    originCity: 'New Delhi',
    destinationCity: 'Mumbai',
    distanceKm: 1148,
    weight: 0.28,
    dgcaPassengerSharePct: 28.0,
    isActive: true,
  };

  const safeRoutes = Array.isArray(routes) && routes.length > 0 ? routes : [fallbackRoute];
  const [selectedRouteCode, setSelectedRouteCode] = useState<string>(safeRoutes[0]?.code || 'DEL-BOM');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>('APIx');

  const selectedRoute = safeRoutes.find((r) => r?.code === selectedRouteCode) || safeRoutes[0] || fallbackRoute;
  const originCity = selectedRoute?.originCity || (selectedRoute as any)?.origin_city || selectedRoute?.origin || 'New Delhi';
  const destinationCity = selectedRoute?.destinationCity || (selectedRoute as any)?.destination_city || selectedRoute?.destination || 'Mumbai';
  const routeCode = selectedRoute?.code || selectedRouteCode || 'DEL-BOM';

  // Route-specific pricing statistics from real quotes with robust fallbacks
  const safeQuotes = Array.isArray(quotes) ? quotes : [];
  const routeQuotes = safeQuotes.filter((q) => q?.routeCode === routeCode);
  const avgTotalFare = routeQuotes.length > 0
    ? Math.round(routeQuotes.reduce((acc, q) => acc + (q?.totalFare || 0), 0) / routeQuotes.length)
    : (routeCode === 'DEL-BOM' ? 5450 : routeCode === 'DEL-BLR' ? 6280 : 4900);

  const t1Fare = Math.round(avgTotalFare * 1.65);
  const t7Fare = Math.round(avgTotalFare * 1.15);
  const t15Fare = Math.round(avgTotalFare * 0.95);
  const t30Fare = Math.round(avgTotalFare * 0.82);
  const t45Fare = Math.round(avgTotalFare * 0.72);

  // Component breakdown for selected route
  const baseFare = Math.round(avgTotalFare * 0.72);
  const gstTax = Math.round(avgTotalFare * 0.05);
  const udfFee = 480;
  const convenienceFee = 350;

  const feeBreakdownData = [
    { name: language === 'hi' ? 'मूल किराया (Base Fare)' : 'Base Fare (Airline Revenue)', value: baseFare, color: '#1e3a8a' },
    { name: language === 'hi' ? 'जीएसटी कर (5% GST)' : 'GST Tax (5% Government)', value: gstTax, color: '#059669' },
    { name: language === 'hi' ? 'हवाई अड्डा विकास शुल्क (UDF)' : 'Airport Dev Fee (UDF)', value: udfFee, color: '#d97706' },
    { name: language === 'hi' ? 'सुविधा शुल्क (Convenience Fee)' : 'Convenience Fee (OTA/Booking)', value: convenienceFee, color: '#db2777' },
  ];

  const faqs = [
    {
      qEn: 'What is the Airfare Price Index (APIx) and why does MoSPI track it?',
      qHi: 'हवाई किराया मूल्य सूचकांक (APIx) क्या है और MoSPI इसे क्यों ट्रैक करता है?',
      aEn: 'The National Statistical Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI), tracks retail inflation via the Consumer Price Index (CPI). Since over 90% of domestic flight tickets are booked online with dynamic pricing, APIx measures transparent retail price changes that everyday citizens pay.',
      aHi: 'राष्ट्रीय सांख्यिकी कार्यालय (NSO), सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), उपभोक्ता मूल्य सूचकांक (CPI) के माध्यम से मुद्रास्फीति को मापता है। APIx वास्तविक हवाई किराए में बदलाव को पारदर्शी तरीके से ट्रैक करता है।',
    },
    {
      qEn: 'Why do flight prices increase sharply when booking last minute?',
      qHi: 'अंतिम समय में टिकट बुक करने पर हवाई किराया इतना अधिक क्यों हो जाता है?',
      aEn: 'Indian airlines use dynamic revenue algorithms. As the departure date nears (e.g. T+1 day vs T+30 days) and seat availability shrinks, remaining seats shift to highest fare buckets. On average, booking 30–45 days ahead saves Indian travellers ₹2,000 to ₹4,500 per ticket.',
      aHi: 'एयरलाइंस डायनेमिक प्राइसिंग प्रणाली का उपयोग करती हैं। यात्रा से 30-45 दिन पहले बुकिंग करने पर आमतौर पर ₹2,000 से ₹4,500 तक की बचत होती है।',
    },
    {
      qEn: 'What are the different components included in my flight ticket price?',
      qHi: 'हवाई टिकट के कुल मूल्य में कौन-कौन से शुल्क शामिल होते हैं?',
      aEn: 'Your total ticket price comprises four regulated parts: (1) Base Fare kept by the airline (~70%), (2) 5% GST on Economy class, (3) User Development Fee (UDF) collected for airport infrastructure, and (4) Booking Convenience Fee charged by portals.',
      aHi: 'आपके टिकट में 4 मुख्य भाग शामिल हैं: मूल किराया (~70%), 5% जीएसटी कर, हवाई अड्डा विकास शुल्क (UDF), और बुकिंग सुविधा शुल्क।',
    },
    {
      qEn: 'How does the Reserve Bank of India (RBI) use this airfare index?',
      qHi: 'भारतीय रिजर्व बैंक (RBI) इस हवाई किराया सूचकांक का उपयोग कैसे करता है?',
      aEn: 'The RBI Monetary Policy Committee (MPC) monitors CPI inflation to evaluate macroeconomic price stability. Airfares are a vital component of the "Transport & Communication" inflation basket.',
      aHi: 'आरबीआई की मौद्रिक नीति समिति (MPC) रेपो दर और मूल्य स्थिरता के लिए उपभोक्ता मूल्य सूचकांक (CPI) की निगरानी करती है।',
    },
    {
      qEn: 'Is the data collection ethical and compliant with Government privacy norms?',
      qHi: 'क्या यह डेटा संग्रह सरकार के नैतिक और गोपनीयता मानकों के अनुरूप है?',
      aEn: 'Yes. APIx is 100% compliant with robots.txt, respects site crawl limits, uses non-intrusive rate-limiting (12–25 req/min), never collects personal traveler details, and tracks strictly public tariff metadata.',
      aHi: 'हाँ। APIx पूरी तरह से नैतिक है, वेबसाइटों की robots.txt नीति का सम्मान करता है, और केवल सार्वजनिक मूल्य डेटा एकत्र करता है।',
    },
  ];

  const glossary = [
    {
      term: 'APIx (Airfare Price Index)',
      hindiTerm: 'हवाई किराया मूल्य सूचकांक',
      simpleDef: 'A national statistical benchmark starting at 100.0 (Base: August 2026). An index of 108.0 means domestic fares are 8% higher on average than normal.',
    },
    {
      term: 'Advance Purchase Window (T+1 to T+45)',
      hindiTerm: 'अग्रिम खरीद अवधि (T+1 से T+45 दिन)',
      simpleDef: 'The number of days between booking and flying. T+1 means buying a ticket for tomorrow; T+45 means booking 45 days in advance.',
    },
    {
      term: 'Base Fare vs Total Fare',
      hindiTerm: 'मूल किराया बनाम कुल किराया',
      simpleDef: 'Base fare is the core charge for the flight seat. Total fare is the final amount paid after adding 5% GST, airport user development fees (UDF), and convenience fees.',
    },
    {
      term: 'Dynamic Pricing',
      hindiTerm: 'गतिशील मूल्य निर्धारण (डायनेमिक प्राइसिंग)',
      simpleDef: 'An automated pricing system where ticket prices change in real time based on demand, seasonal rush, fuel prices, and seat availability.',
    },
    {
      term: 'DGCA Route Basket',
      hindiTerm: 'डीजीसीए रूट बास्केट',
      simpleDef: 'The top 6 busiest domestic flight corridors in India (e.g., Delhi-Mumbai, Delhi-Bengaluru) chosen based on Directorate General of Civil Aviation passenger traffic reports.',
    },
    {
      term: 'Laspeyres Price Formula',
      hindiTerm: 'लास्पेयर मूल्य सूत्र',
      simpleDef: 'The official Government statistical formula used to calculate inflation by weighting price changes across fixed route passenger shares.',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome & Citizen Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-medium text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'hi' ? 'नागरिक सूचना पोर्टल • उपभोक्ता मूल्य पारदर्शिता' : 'Citizen Information & Consumer Price Transparency Portal'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            {language === 'hi'
              ? 'भारतीय घरेलू हवाई किराया उपभोक्ता गाइड'
              : 'Citizen Guide to Indian Domestic Airfares & Price Transparency'}
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            {language === 'hi'
              ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) और राष्ट्रीय सांख्यिकी कार्यालय (NSO) द्वारा प्रमाणित सार्वजनिक मूल्य अवलोकन पोर्टल। जानें कि सबसे किफायती टिकट कैसे बुक करें।'
              : 'An official Ministry of Statistics & Programme Implementation (MoSPI) public service to help Indian consumers understand flight price movements, fare structures, and optimal booking windows.'}
          </p>
        </div>
      </div>

      {/* 1. Interactive Route Price Checker & Savings Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-900" />
              <span>{language === 'hi' ? 'रूट किराया कैलकुलेटर और बचत अनुमान' : 'Route Fare Checker & Advance-Booking Savings Calculator'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'एक रूट चुनें और देखें कि अग्रिम बुकिंग से कितनी बचत होती है तथा टिकट में क्या शुल्क शामिल हैं'
                : 'Select a representative trunk route to check fair price benchmarks and advance-booking cost curves.'}
            </p>
          </div>

          {/* Route selector dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">{language === 'hi' ? 'रूट चुनें:' : 'Select Route:'}</span>
            <select
              id="citizen-route-select"
              value={selectedRouteCode}
              onChange={(e) => setSelectedRouteCode(e.target.value)}
              className="text-xs font-semibold text-blue-950 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {safeRoutes.map((r) => {
                const cOrigin = r?.originCity || (r as any)?.origin_city || r?.origin || 'Origin';
                const cDest = r?.destinationCity || (r as any)?.destination_city || r?.destination || 'Destination';
                const cCode = r?.code || `${r?.origin}-${r?.destination}` || 'ROUTE';
                return (
                  <option key={cCode} value={cCode} className="bg-white text-slate-900">
                    {cCode} — {cOrigin} to {cDest}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Booking Curve Window Card */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'hi' ? 'अग्रिम बुकिंग विंडो तुलना (Average Expected Ticket Fare)' : 'Advance Booking Window Price Comparison'}
              </h4>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                {language === 'hi' ? 'सर्वोत्तम बचत: T+45 दिन' : 'Best Value: 45 Days Ahead'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {/* T+1 */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-[10px] font-bold text-rose-700 block uppercase">Tomorrow (T+1)</span>
                <span className="text-sm sm:text-base font-extrabold text-rose-900 font-mono mt-1 block">₹{t1Fare.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-rose-600 block mt-1 font-semibold">+65% Surge</span>
              </div>

              {/* T+7 */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">1 Week (T+7)</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-900 font-mono mt-1 block">₹{t7Fare.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-amber-600 block mt-1 font-semibold">+15% Peak</span>
              </div>

              {/* T+15 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-700 block uppercase">15 Days (T+15)</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 font-mono mt-1 block">₹{t15Fare.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-slate-500 block mt-1">Normal Rate</span>
              </div>

              {/* T+30 */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[10px] font-bold text-blue-900 block uppercase">30 Days (T+30)</span>
                <span className="text-sm sm:text-base font-extrabold text-blue-950 font-mono mt-1 block">₹{t30Fare.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-blue-700 block mt-1 font-semibold">Save 18%</span>
              </div>

              {/* T+45 */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl ring-2 ring-emerald-400">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase">45 Days (T+45)</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-950 font-mono mt-1 block">₹{t45Fare.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-emerald-700 block mt-1 font-bold">Save 28%</span>
              </div>
            </div>

            {/* Practical Advice Banner */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-950">
              <Info className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>{language === 'hi' ? 'उपभोक्ता परामर्श:' : 'Consumer Advisory for'} {originCity} ➔ {destinationCity}:</strong>{' '}
                {language === 'hi'
                  ? `यात्रा से 30 से 45 दिन पहले टिकट बुक करने पर आप औसतन ₹${(t1Fare - t45Fare).toLocaleString('en-IN')} प्रति यात्री बचा सकते हैं।`
                  : `Booking this route 30–45 days ahead saves an estimated ₹${(t1Fare - t45Fare).toLocaleString('en-IN')} per seat compared to last-minute booking.`}
              </div>
            </div>
          </div>

          {/* Component Decomposition Chart */}
          <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                {language === 'hi' ? 'टिकट मूल्य घटक विभाजन' : 'Ticket Price Breakdown (Where Your Money Goes)'}
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Avg Fare ₹{avgTotalFare.toLocaleString('en-IN')} on {routeCode}
              </p>

              <div className="h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {feeBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                {feeBreakdownData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 truncate">{item.name}:</span>
                    <span className="font-bold text-slate-800 font-mono">₹{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-900" />
              <span>{language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (Citizen & Traveller FAQ)'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' ? 'हवाई किराया, मुद्रास्फीति गणना और सरकारी निगरानी के बारे में स्पष्टीकरण' : 'Simple explanations regarding airfare pricing dynamics, inflation metrics, and regulatory monitoring.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition cursor-pointer"
                >
                  <span className="font-semibold text-xs sm:text-sm text-slate-800">
                    {language === 'hi' ? faq.qHi : faq.qEn}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Aviation & Inflation Layman Glossary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="pb-3 mb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-900" />
            <span>{language === 'hi' ? 'हवाई यात्रा और सांख्यिकी शब्दावली (Glossary)' : 'Aviation & Inflation Terminology Glossary'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'कठिन सांख्यिकीय और विमानन शब्दों के सरल अर्थ' : 'Plain-English translations of complex aviation and economic index terms.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {glossary.map((item) => (
            <div
              key={item.term}
              onClick={() => setSelectedGlossaryTerm(item.term)}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-xs text-blue-950 block">
                  {item.term}
                </span>
                <span className="text-[10px] text-slate-500 block mb-1 font-sans">
                  {item.hindiTerm}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {item.simpleDef}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
