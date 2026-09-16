export type AdvanceWindow = 'T+1' | 'T+7' | 'T+15' | 'T+30' | 'T+45';

export interface Route {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  code: string; // e.g. "DEL-BOM"
  distanceKm: number;
  weight: number; // e.g. 0.28
  dgcaPassengerSharePct: number;
  isActive: boolean;
}

export interface Airline {
  id: string;
  code: string; // e.g. "6E"
  name: string;
  type: 'LCC' | 'FSC';
  marketSharePct: number;
  brandColor: string;
  avgFareInr: number;
  quoteCount: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'AIRLINE' | 'OTA' | 'STATISTICAL' | 'API';
  ethicalStatus: 'COMPLIANT' | 'RESPECTING_ROBOTS' | 'RATE_LIMITED' | 'COOLDOWN_WAITING';
  rateLimitPerMin: number;
  retryAttempts: number;
  lastScraped: string;
  status: 'ONLINE' | 'ACTIVE' | 'STANDBY' | 'DEGRADED' | 'COOLDOWN_WAIT';
  quotesToday: number;
  captchaRespect: boolean;
  isWaitingCooldown?: boolean;
  cooldownRemainingSeconds?: number;
  cooldownReason?: string;
}

export interface FareComponents {
  baseFare: number;
  taxes: number; // GST
  udf: number; // User Development Fee
  convenienceFee: number;
  totalFare: number;
}

export interface FareQuote {
  id: string;
  timestamp: string;
  travelDate: string;
  origin: string;
  destination: string;
  routeCode: string;
  airlineCode: string;
  airlineName: string;
  source: string;
  flightNumber: string;
  fareClass: 'Economy' | 'Premium Economy' | 'Business';
  advanceWindow: AdvanceWindow;
  baseFare: number;
  taxes: number;
  udf: number;
  convenienceFee: number;
  totalFare: number;
  currency: 'INR';
  isAvailable: boolean;
  isSoldOut: boolean;
  isCancelled: boolean;
  isAnomaly: boolean;
  anomalyType?: 'SPIKE' | 'DROP' | 'CAPACITY_CRUNCH' | 'FLASH_SALE' | 'FARE_SPIKE' | 'SOLD_OUT_SURGE' | 'ATF_IMPACT';
  zScore: number;
}

export interface IndexDataPoint {
  date: string;
  indexValue: number; // e.g. 108.45 (Base = 100.0)
  basePeriod: string; // e.g. "2026-08-01"
  dailyChangePct: number;
  weeklyChangePct: number;
  monthlyChangePct: number;
  avgFareInr: number;
  quoteCount: number;
  routeIndices: Record<string, number>;
  airlineIndices: Record<string, number>;
  advanceWindowIndices: Record<AdvanceWindow, number>;
}

export interface AnomalyAlert {
  id: string;
  timestamp: string;
  routeCode: string;
  airlineName: string;
  advanceWindow: AdvanceWindow;
  observedFare: number;
  expectedFare: number;
  deviationPct: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anomalyType: 'FARE_SPIKE' | 'FLASH_SALE' | 'SOLD_OUT_SURGE' | 'ATF_IMPACT';
  causeDescription: string;
  isInvestigated: boolean;
}

export interface ForecastPoint {
  date: string;
  predictedIndex: number;
  lowerConfidence: number;
  upperConfidence: number;
  projectedAvgFare: number;
  holidayOrEvent?: string;
}

export interface LeadTimeElasticity {
  routeCode: string;
  routeTitle: string;
  windows: Record<AdvanceWindow, {
    avgFare: number;
    baseFare: number;
    taxesAndFees: number;
    multiplierVsT45: number;
    soldOutRatePct: number;
    sampleQuotes: number;
  }>;
}

export interface ScrapingPipelineStatus {
  isRunning: boolean;
  lastRunTimestamp: string;
  nextScheduledRun: string;
  scheduleFrequency: string;
  totalQuotesCollected: number;
  successfulAdapters: number;
  failedAdapters: number;
  cooldownAdaptersCount: number;
  duplicatesPrevented: number;
  uniqueQuotesStored: number;
  activeWorkers: number;
  recentRunId: string;
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
    stage: 'SCRAPE' | 'VALIDATE' | 'NORMALIZE' | 'INDEX' | 'ML_ANOMALY';
    message: string;
    source?: string;
  }>;
}

export interface BacktestingComparison {
  metrics: {
    correlationCoefficient: number;
    mape: number; // Mean Absolute Percentage Error (%)
    rmse: number;
    sampleDays: number;
    dgcaReleasePeriod: string;
  };
  series: Array<{
    date: string;
    apixIndex: number;
    dgcaBenchmarkIndex: number;
    variancePct: number;
    apixAvgFare: number;
    dgcaAvgFare: number;
  }>;
}

export interface DashboardSummary {
  currentIndex: number;
  basePeriod: string;
  dailyChangePct: number;
  weeklyChangePct: number;
  monthlyChangePct: number;
  averageFareInr: number;
  totalQuotesCollected: number;
  duplicatesPrevented: number;
  uniqueQuotesCount: number;
  soldOutRatePct: number;
  activeAnomaliesCount: number;
  cheapestRoute: { routeCode: string; avgFare: number; airline: string };
  mostExpensiveRoute: { routeCode: string; avgFare: number; airline: string };
}
