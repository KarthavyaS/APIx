import React, { useState } from 'react';
import { Route } from '../types';
import { X, Sliders, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface RouteWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Route[];
  onSaveWeights: (weights: Record<string, number>) => Promise<void>;
}

export const RouteWeightsModal: React.FC<RouteWeightsModalProps> = ({
  isOpen,
  onClose,
  routes,
  onSaveWeights,
}) => {
  if (!isOpen) return null;

  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    routes.forEach((r) => {
      initial[r.code] = r.weight;
    });
    return initial;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sum = Number(Object.values(weights).reduce<number>((acc, val) => acc + (typeof val === 'number' ? val : 0), 0).toFixed(3));
  const isValid = Math.abs(sum - 1.0) <= 0.02;

  const handleWeightChange = (routeCode: string, newVal: number) => {
    setWeights((prev) => ({
      ...prev,
      [routeCode]: Number(newVal.toFixed(3)),
    }));
  };

  const handleResetToDgca = () => {
    const dgcaDefaults: Record<string, number> = {
      'DEL-BOM': 0.28,
      'DEL-BLR': 0.22,
      'BOM-BLR': 0.16,
      'DEL-CCU': 0.14,
      'BLR-HYD': 0.10,
      'MAA-DEL': 0.10,
    };
    setWeights(dgcaDefaults);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setErrorMsg(`Weights must sum to 1.00 (Current: ${(sum * 100).toFixed(1)}%)`);
      return;
    }
    setErrorMsg(null);
    setIsSaving(true);
    try {
      await onSaveWeights(weights);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update weights on database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Configure Route Basket Weights
            </h3>
            <p className="text-xs text-slate-500">
              Weights stored dynamically in database — adjust without modifying application code
            </p>
          </div>
        </div>

        {/* Sum Indicator */}
        <div className={`p-3 rounded-lg border my-4 flex items-center justify-between text-xs ${
          isValid
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
        }`}>
          <div className="flex items-center space-x-2">
            {isValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>Basket Total Sum: <strong>{(sum * 100).toFixed(1)}%</strong> (Target: 100.0%)</span>
          </div>
          <button
            type="button"
            onClick={handleResetToDgca}
            className="text-[11px] underline hover:text-slate-900"
          >
            Reset to DGCA Shares
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 mb-3 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Weights Sliders */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {routes.map((route) => {
            const currentWeight = weights[route.code] ?? route.weight;
            return (
              <div key={route.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{route.code}</span>
                    <span className="text-slate-500 ml-1.5 font-sans">
                      ({route.originCity} ↔ {route.destinationCity})
                    </span>
                  </div>
                  <div className="font-mono font-extrabold text-indigo-600">
                    {(currentWeight * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0.02"
                    max="0.60"
                    step="0.01"
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(route.code, parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    min="0.02"
                    max="0.60"
                    step="0.01"
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(route.code, parseFloat(e.target.value) || 0)}
                    className="w-16 text-xs text-right font-mono bg-white border border-slate-300 rounded px-1.5 py-0.5"
                  />
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className={`px-4 py-2 text-xs font-semibold rounded-lg text-white flex items-center space-x-1.5 ${
                !isValid || isSaving
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Recalculating Index...' : 'Save & Recalculate Index'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
