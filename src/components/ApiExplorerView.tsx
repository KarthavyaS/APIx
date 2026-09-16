import React, { useState } from 'react';
import { Code2, Play, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

export const ApiExplorerView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/index');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { path: '/api/index', method: 'GET', description: 'Headline Airfare Price Index summary & basket averages' },
    { path: '/api/index/daily?limit=10', method: 'GET', description: 'Daily historical series for 35 days' },
    { path: '/api/index/weekly', method: 'GET', description: 'Weekly aggregated price index' },
    { path: '/api/index/monthly', method: 'GET', description: 'Monthly index trends and base comparison' },
    { path: '/api/fares?limit=5', method: 'GET', description: 'Normalized quotes with unbundled fare components' },
    { path: '/api/routes', method: 'GET', description: 'Monitored route basket and database weights' },
    { path: '/api/airlines', method: 'GET', description: 'Indian commercial airlines, type and market shares' },
    { path: '/api/sources', method: 'GET', description: 'Scraping adapters status and rate limits' },
    { path: '/api/analytics/forecast', method: 'GET', description: '14-day ML fare forecast with 95% confidence bands' },
    { path: '/api/analytics/anomalies', method: 'GET', description: 'Real-time statistical anomaly alerts' },
    { path: '/api/analytics/lead-time', method: 'GET', description: 'Lead-time elasticity analysis across T+45 to T+1' },
    { path: '/api/analytics/backtesting', method: 'GET', description: 'DGCA benchmark comparison (correlation, MAPE, RMSE)' },
    { path: '/api/scraping/status', method: 'GET', description: 'Scraping pipeline health and recent ETL activity logs' },
    { path: '/api/openapi.json', method: 'GET', description: 'Complete OpenAPI 3.0 specification' },
  ];

  const handleExecute = async () => {
    setLoading(true);
    setResponseJson(null);
    setStatus(null);
    const start = performance.now();
    try {
      const res = await fetch(selectedEndpoint);
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setStatus(res.status);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setStatus(500);
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const curlCommand = `curl -X GET "http://localhost:3000${selectedEndpoint}" -H "Accept: application/json"`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            REST API & OpenAPI Explorer
          </h2>
          <p className="text-xs text-slate-500">
            Interactive console to query and inspect APIx national aviation data endpoints in real-time
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md font-mono"
          >
            <span>OpenAPI JSON</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            API Endpoints
          </span>
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint === ep.path;
            return (
              <button
                key={ep.path}
                onClick={() => {
                  setSelectedEndpoint(ep.path);
                  setResponseJson(null);
                  setStatus(null);
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ep.method}
                  </span>
                  <span className="font-mono text-slate-800 font-semibold text-[11px] truncate ml-2">
                    {ep.path}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                  {ep.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Console / Executor */}
        <div className="lg:col-span-2 space-y-3">
          {/* Request Header Bar */}
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2 py-1.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              GET
            </span>
            <input
              type="text"
              readOnly
              value={selectedEndpoint}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            />
            <button
              onClick={handleExecute}
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm transition shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? 'Calling...' : 'Execute'}</span>
            </button>
          </div>

          {/* cURL snippet */}
          <div className="bg-slate-900 text-slate-200 rounded-lg p-2.5 text-[11px] font-mono flex items-center justify-between">
            <span className="truncate text-slate-400 mr-2">$ {curlCommand}</span>
            <button
              onClick={() => copyToClipboard(curlCommand)}
              className="p-1 rounded text-slate-400 hover:text-white shrink-0"
              title="Copy cURL command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Response Inspector */}
          <div className="bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-800 font-mono text-xs min-h-64 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
              <span className="text-slate-400">Response Payload (JSON)</span>
              {status && (
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">Status: {status} OK</span>
                  <span className="text-slate-400">Latency: {latencyMs}ms</span>
                </div>
              )}
            </div>

            <div className="py-2 overflow-x-auto max-h-72 scrollbar-thin">
              {loading ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Executing request to server endpoint...
                </div>
              ) : responseJson ? (
                <pre className="text-[11px] text-emerald-300 font-mono">{responseJson}</pre>
              ) : (
                <div className="text-slate-600 italic py-8 text-center">
                  Click 'Execute' above to test endpoint and view live response.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>FastAPI & Express Production Router</span>
              <span>Content-Type: application/json</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
