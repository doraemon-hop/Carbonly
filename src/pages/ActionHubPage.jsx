import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { circularActionCategories } from '../data/mockData';
import { 
  Wrench, 
  RefreshCw, 
  Recycle, 
  Sprout, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export const ActionHubPage = () => {
  const { openVerificationModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeActionDetail, setActiveActionDetail] = useState(null);

  const categoryIcons = {
    repair: Wrench,
    reuse: RefreshCw,
    recycle: Recycle,
    offset: Sprout,
  };

  const filteredCategories = selectedCategory === 'all'
    ? circularActionCategories
    : circularActionCategories.filter((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Heart of Carbonly</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Circular Action Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Choose practical circular actions to repair, reuse, segregate recyclables, or fund verified carbon sinks. Upload proof to earn verifiable EcoPoints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-semibold overflow-x-auto">
          {['all', 'repair', 'reuse', 'recycle', 'offset'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Core Workflow Explainer Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Core Flow:</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="font-bold text-slate-900">1. View Action</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">2. Take Action</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">3. Verify with Photo/Receipt</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-emerald-700">4. Earn EcoPoints & Climb Rank</span>
        </div>
      </div>

      {/* The 4 Circular Sections */}
      <div className="space-y-10">
        {filteredCategories.map((cat) => {
          const Icon = categoryIcons[cat.id] || Sparkles;
          return (
            <div key={cat.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Category Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{cat.title}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.tagline}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 max-w-sm sm:text-right">
                  <span className="font-bold text-emerald-700">Did you know?</span> {cat.stat}
                </div>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.actions.map((act) => (
                  <div
                    key={act.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500/80 bg-slate-50/50 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          +{act.ecoPoints} EcoPoints
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          -{act.carbonSaved} kg CO₂e
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition">
                        {act.title}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{act.provider}</span>
                        </div>
                        {act.timeEstimate && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{act.timeEstimate}</span>
                          </div>
                        )}
                        {act.cost && (
                          <div className="text-[11px] font-semibold text-slate-700">
                            Contribution: {act.cost}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action trigger button */}
                    <button
                      type="button"
                      onClick={() => openVerificationModal(act, cat.id)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Take Action & Verify</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
