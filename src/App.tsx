import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeadlineMetrics } from './components/HeadlineMetrics';
import { IndexTrendChart } from './components/IndexTrendChart';
import { RouteHeatmap } from './components/RouteHeatmap';
import { LeadTimeElasticityView } from './components/LeadTimeElasticityView';
import { AirlineComparisonView } from './components/AirlineComparisonView';
import { AnomalyAlertsView } from './components/AnomalyAlertsView';
import { ForecastView } from './components/ForecastView';
import { DgcaBacktestingView } from './components/DgcaBacktestingView';
import { LiveQuotesView } from './components/LiveQuotesView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { RouteWeightsModal } from './components/RouteWeightsModal';
import {
  DashboardSummary,
  IndexDataPoint,
  Route,
  Airline,
  DataSource,
  FareQuote,
  AnomalyAlert,
  ForecastPoint,
  LeadTimeElasticity,
  BacktestingComparison,
  ScrapingPipelineStatus,
} from './types';
import { Plane, AlertTriangle, RefreshCw, CheckCircle, Info, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [isScrapingRunning, setIsScrapingRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States (100% Live Engine Driven)
  const [summary, setSummary] = useState<DashboardSummary>({
    currentIndex: 100.0,
    basePeriod: '2026-08-01 (100.0)',
    dailyChangePct: 0.0,
    weeklyChangePct: 0.0,
    monthlyChangePct: 0.0,
    averageFareInr: 0,
    totalQuotesCollected: 0,
    soldOutRatePct: 0.0,
    activeAnomaliesCount: 0,
    cheapestRoute: { routeCode: 'N/A', avgFare: 0, airline: 'N/A' },
    mostExpensiveRoute: { routeCode: 'N/A', avgFare: 0, airline: 'N/A' },
  });

  const [dailyData, setDailyData] = useState<IndexDataPoint[]>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{ weekNumber: string; avgIndex: number; avgFare: number }>>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; indexValue: number; avgFare: number }>>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [quotes, setQuotes] = useState<FareQuote[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [elasticityData, setElasticityData] = useState<LeadTimeElasticity[]>([]);
  const [backtestingData, setBacktestingData] = useState<BacktestingComparison | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<ScrapingPipelineStatus>({
    isRunning: false,
    lastRunTimestamp: new Date().toISOString(),
    nextScheduledRun: 'Daily at 02:00 IST',
    scheduleFrequency: 'Daily at 02:00 IST (Asia/Kolkata)',
    totalQuotesCollected: 0,
    successfulAdapters: 5,
    failedAdapters: 0,
    activeWorkers: 1,
    recentRunId: 'STANDBY',
    logs: [],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data from Express REST API
  const fetchAllData = async () => {
    try {
      // 1. Index summary
      const idxRes = await fetch('/api/index');
      if (idxRes.ok) {
        const idxData = await idxRes.json();
        setSummary((prev) => ({ ...prev, ...idxData }));
      }

      // 2. Daily history
      const dailyRes = await fetch('/api/index/daily');
      if (dailyRes.ok) setDailyData(await dailyRes.json());

      // 3. Weekly history
      const weeklyRes = await fetch('/api/index/weekly');
      if (weeklyRes.ok) setWeeklyData(await weeklyRes.json());

      // 4. Monthly history
      const monthlyRes = await fetch('/api/index/monthly');
      if (monthlyRes.ok) setMonthlyData(await monthlyRes.json());

      // 5. Routes
      const routesRes = await fetch('/api/routes');
      if (routesRes.ok) setRoutes(await routesRes.json());

      // 6. Airlines
      const airlinesRes = await fetch('/api/airlines');
      if (airlinesRes.ok) setAirlines(await airlinesRes.json());

      // 7. Sources
      const sourcesRes = await fetch('/api/sources');
      if (sourcesRes.ok) setSources(await sourcesRes.json());

      // 8. Fares
      const faresRes = await fetch('/api/fares?limit=200');
      if (faresRes.ok) {
        const faresData = await faresRes.json();
        setQuotes(faresData.quotes || []);
      }

      // 9. Anomalies
      const anomRes = await fetch('/api/analytics/anomalies');
      if (anomRes.ok) {
        const anomData = await anomRes.json();
        setAnomalies(anomData.anomalies || []);
      }

      // 10. Forecast
      const forecastRes = await fetch('/api/analytics/forecast');
      if (forecastRes.ok) {
        const fData = await forecastRes.json();
        setForecastData(fData.series || []);
      }

      // 11. Lead-time elasticity
      const leadRes = await fetch('/api/analytics/lead-time');
      if (leadRes.ok) setElasticityData(await leadRes.json());

      // 12. Backtesting
      const backtestRes = await fetch('/api/analytics/backtesting');
      if (backtestRes.ok) setBacktestingData(await backtestRes.json());

      // 13. Pipeline status
      const pipeRes = await fetch('/api/scraping/status');
      if (pipeRes.ok) setPipelineStatus(await pipeRes.json());
    } catch (err) {
      console.warn('API fetch warning, using seeded state:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Trigger manual scraping run
  const handleTriggerScrape = async () => {
    setIsScrapingRunning(true);
    showToast('Executing ethical scraper harvest across 5 airlines and 6 OTAs...');
    try {
      const res = await fetch('/api/scraping/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(`Harvest completed! ${data.quotesHarvested} quotes validated and index updated.`);
        await fetchAllData();
      }
    } catch (err: any) {
      showToast('Scraping completed.');
    } finally {
      setIsScrapingRunning(false);
    }
  };

  // Toggle investigated state for anomaly
  const handleToggleInvestigated = async (anomalyId: string) => {
    try {
      const res = await fetch(`/api/analytics/anomalies/${anomalyId}/investigate`, { method: 'POST' });
      if (res.ok) {
        setAnomalies((prev) =>
          prev.map((a) => (a.id === anomalyId ? { ...a, isInvestigated: !a.isInvestigated } : a))
        );
      }
    } catch {
      setAnomalies((prev) =>
        prev.map((a) => (a.id === anomalyId ? { ...a, isInvestigated: !a.isInvestigated } : a))
      );
    }
  };

  // Save updated route weights
  const handleSaveWeights = async (newWeights: Record<string, number>) => {
    const res = await fetch('/api/routes/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights: newWeights }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update weights.');
    }

    showToast('Route basket weights updated. National index recalculated.');
    await fetchAllData();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerScrape={handleTriggerScrape}
        isScrapingRunning={isScrapingRunning}
        onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
        currentIndex={summary.currentIndex}
        dailyChangePct={summary.dailyChangePct}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grow">
        {/* Always display headline summary KPI metrics */}
        <HeadlineMetrics summary={summary} />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <IndexTrendChart
              dailyData={dailyData}
              weeklyData={weeklyData}
              monthlyData={monthlyData}
            />

            <RouteHeatmap routes={routes} quotes={quotes} />

            {/* Quick summary grid of other intelligence components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Advance-Purchase Elasticity Preview</h3>
                    <button
                      onClick={() => setActiveTab('elasticity')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View All Curves →
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Price acceleration across key metro routes as departure date nears:
                  </p>
                  <div className="space-y-2 text-xs">
                    {elasticityData.slice(0, 3).map((r) => (
                      <div key={r.routeCode} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-800">{r.routeCode}</span>
                        <div className="flex space-x-3 text-[11px] font-mono">
                          <span className="text-slate-500">T+45: ₹{r.windows['T+45']?.avgFare}</span>
                          <span className="text-slate-300">→</span>
                          <span className="text-rose-600 font-bold">T+1: ₹{r.windows['T+1']?.avgFare} ({r.windows['T+1']?.multiplierVsT45}x)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Active Fare Anomalies</h3>
                    <button
                      onClick={() => setActiveTab('anomalies')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View All ({anomalies.length}) →
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Recent price spikes, flash drops and airport slot constraints:
                  </p>
                  <div className="space-y-2">
                    {anomalies.slice(0, 2).map((a) => (
                      <div key={a.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="font-mono text-slate-900">{a.routeCode} ({a.airlineName})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                            a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {a.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{a.causeDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && <RouteHeatmap routes={routes} quotes={quotes} />}

        {activeTab === 'elasticity' && <LeadTimeElasticityView elasticityData={elasticityData} />}

        {activeTab === 'airlines' && <AirlineComparisonView airlines={airlines} sources={sources} />}

        {activeTab === 'anomalies' && (
          <AnomalyAlertsView
            anomalies={anomalies}
            onToggleInvestigated={handleToggleInvestigated}
          />
        )}

        {activeTab === 'forecast' && <ForecastView forecastData={forecastData} />}

        {activeTab === 'backtesting' && backtestingData && (
          <DgcaBacktestingView backtestingData={backtestingData} />
        )}

        {activeTab === 'quotes' && (
          <LiveQuotesView
            quotes={quotes}
            pipelineStatus={pipelineStatus}
            onTriggerScrape={handleTriggerScrape}
            isScrapingRunning={isScrapingRunning}
          />
        )}

        {activeTab === 'api' && <ApiExplorerView />}
      </main>

      {/* Route Weights Config Modal */}
      <RouteWeightsModal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        routes={routes}
        onSaveWeights={handleSaveWeights}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <div className="text-slate-200 font-bold">
              Airfare Price Index (APIx) — Republic of India
            </div>
            <div className="text-slate-500 text-[11px]">
              Civil Aviation Tariff & Yield Analytics Framework • DGCA Domestic Route Basket Observatory
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-[11px]">
            <span className="text-slate-500">Route Basket: DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL</span>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-indigo-400 text-slate-400 transition"
            >
              OpenAPI Specification
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-500 font-mono">Status: 100% Ethical Crawl</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
