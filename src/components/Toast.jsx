import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Sparkles, X, Award } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
            toast.type === 'points'
              ? 'bg-emerald-950/90 text-white border-emerald-500/50 shadow-emerald-900/30'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-500/50 shadow-rose-900/30'
              : 'bg-slate-900/90 text-white border-slate-700 shadow-slate-900/40'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'points' && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-400/40">
                +{toast.points}
              </div>
            )}
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            {toast.type === 'info' && (
              <Sparkles className="w-5 h-5 text-teal-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              {toast.title}
              {toast.points && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-medium">
                  EcoPoints
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
