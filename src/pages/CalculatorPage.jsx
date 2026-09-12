import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  Calculator, 
  Car, 
  Zap, 
  ShoppingBag, 
  Coffee, 
  ArrowRight, 
  Save, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const CalculatorPage = () => {
  const navigate = useNavigate();
  const { addToast, triggerConfetti } = useApp();

  // Input states with realistic baseline defaults
  const [transport, setTransport] = useState({
    carKm: 35, // km per week
    fuelType: 'petrol', // petrol, diesel, ev
    bikeKm: 20,
    publicTransitKm: 40,
  });

  const [energy, setEnergy] = useState({
    electricityKwh: 140, // units per month
    lpgCylinders: 0.8, // cylinders per month
  });

  const [shopping, setShopping] = useState({
    clothingItems: 2, // items per month
    electronicsPerYear: 2,
    singleUsePlastics: 8, // items per week
  });

  const [lifestyle, setLifestyle] = useState({
    diet: 'vegetarian', // nonveg, moderate, vegetarian, vegan
    composting: false,
    recyclingHabit: 'sometimes', // always, sometimes, rare
  });

  const [calculatedResult, setCalculatedResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic emission factors
  const calculateFootprint = () => {
    // 1. Transport monthly emissions
    const fuelFactor = transport.fuelType === 'petrol' ? 0.19 : transport.fuelType === 'diesel' ? 0.17 : 0.05;
    const carMonthly = (transport.carKm * 4.33) * fuelFactor;
    const bikeMonthly = (transport.bikeKm * 4.33) * 0.08;
    const transitMonthly = (transport.publicTransitKm * 4.33) * 0.035;
    const totalTransport = Math.round(carMonthly + bikeMonthly + transitMonthly);

    // 2. Energy monthly emissions
    // Grid emission factor ~0.72 kg CO2/kWh in India
    const elecMonthly = transport.electricityKwh ? transport.electricityKwh * 0.72 : energy.electricityKwh * 0.72;
    // 1 LPG cylinder (14.2kg) produces approx 42 kg CO2e
    const lpgMonthly = energy.lpgCylinders * 42;
    const totalEnergy = Math.round(elecMonthly + lpgMonthly);

    // 3. Shopping monthly emissions
    // ~10kg CO2e per cotton/synthetic garment, electronics ~80kg/unit distributed over year
    const clothesMonthly = shopping.clothingItems * 9.5;
    const electronicsMonthly = (shopping.electronicsPerYear * 65) / 12;
    const plasticMonthly = (shopping.singleUsePlastics * 4.33) * 0.08;
    const totalShopping = Math.round(clothesMonthly + electronicsMonthly + plasticMonthly);

    // 4. Lifestyle emissions (diet + food waste)
    const dietFactors = {
      nonveg: 55,
      moderate: 35,
      vegetarian: 18,
      vegan: 12,
    };
    const recyclingDiscount = lifestyle.recyclingHabit === 'always' ? -6 : lifestyle.recyclingHabit === 'sometimes' ? -2 : 0;
    const compostDiscount = lifestyle.composting ? -4 : 0;
    const totalLifestyle = Math.max(8, Math.round(dietFactors[lifestyle.diet] + recyclingDiscount + compostDiscount));

    const grandTotal = totalTransport + totalEnergy + totalShopping + totalLifestyle;

    // Determine highest category
    const categories = [
      { name: 'Transport', value: totalTransport, color: '#10b981', percentage: Math.round((totalTransport / grandTotal) * 100) },
      { name: 'Energy', value: totalEnergy, color: '#3b82f6', percentage: Math.round((totalEnergy / grandTotal) * 100) },
      { name: 'Shopping', value: totalShopping, color: '#f59e0b', percentage: Math.round((totalShopping / grandTotal) * 100) },
      { name: 'Lifestyle', value: totalLifestyle, color: '#8b5cf6', percentage: Math.round((totalLifestyle / grandTotal) * 100) },
    ];

    const highest = [...categories].sort((a, b) => b.value - a.value)[0];
    const estimatedReduction = Math.round(grandTotal * 0.22); // 22% circular reduction potential

    setCalculatedResult({
      total: grandTotal,
      unit: 'kg CO₂e',
      highestImpact: highest.name,
      reductionOpportunity: estimatedReduction,
      categories,
      recommendations: [
        {
          title: highest.name === 'Transport' ? 'Switch 2 Commutes to Metro/Bus' : 'Repair Household Electronics First',
          saving: `${Math.round(highest.value * 0.35)} kg CO₂e/mo`,
          category: highest.name,
          points: 150,
        },
        {
          title: 'Divert Single-Use Bags & Segregate E-Waste',
          saving: '12.4 kg CO₂e/mo',
          category: 'Recycle',
          points: 120,
        },
        {
          title: 'Sponsor 1 Mangrove Tree Offset in Sundarbans',
          saving: '25.0 kg CO₂e',
          category: 'Offset',
          points: 180,
        }
      ]
    });
  };

  const handleSaveFootprint = async () => {
    if (!calculatedResult) return;
    setIsSaving(true);
    try {
      await dataService.saveFootprint(calculatedResult);
      triggerConfetti();
      addToast({
        title: 'Footprint Saved! 📊',
        message: `Updated to ${calculatedResult.total} kg CO₂e. Recommendations added to your Action Hub.`,
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({
        title: 'Save Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Circular Assessment Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Calculate Your Monthly Carbon Footprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Enter your average weekly travel, home electricity, and shopping habits. We calculate your baseline emissions and show actionable circular reduction pathways.
        </p>
      </div>

      {/* Input Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Transportation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span>1. Transportation & Mobility</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Personal Car Travel</span>
                <span className="text-emerald-700">{transport.carKm} km / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={transport.carKm}
                onChange={(e) => setTransport({ ...transport, carKm: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Fuel Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['petrol', 'diesel', 'ev'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTransport({ ...transport, fuelType: f })}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border capitalize transition ${
                      transport.fuelType === f
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f === 'ev' ? 'Electric (EV)' : f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Two-Wheeler / Motorbike</span>
                <span className="text-emerald-700">{transport.bikeKm} km / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={transport.bikeKm}
                onChange={(e) => setTransport({ ...transport, bikeKm: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Public Transit (Metro / Bus)</span>
                <span className="text-teal-700">{transport.publicTransitKm} km / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={transport.publicTransitKm}
                onChange={(e) => setTransport({ ...transport, publicTransitKm: Number(e.target.value) })}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. Household Energy */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span>2. Home Energy & Gas</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Electricity Consumption (Monthly Units)</span>
                <span className="text-blue-700">{energy.electricityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={energy.electricityKwh}
                onChange={(e) => setEnergy({ ...energy, electricityKwh: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                Average 2BHK in Ahmedabad consumes ~120 - 180 kWh/mo
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>LPG Cylinders per Month</span>
                <span className="text-blue-700">{energy.lpgCylinders} cylinder</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={energy.lpgCylinders}
                onChange={(e) => setEnergy({ ...energy, lpgCylinders: Number(e.target.value) })}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Shopping & Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span>3. Shopping & Consumption</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>New Garments / Fast Fashion per Month</span>
                <span className="text-amber-700">{shopping.clothingItems} items</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={shopping.clothingItems}
                onChange={(e) => setShopping({ ...shopping, clothingItems: Number(e.target.value) })}
                className="w-full accent-amber-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Single-Use Plastic Packaging per Week</span>
                <span className="text-amber-700">{shopping.singleUsePlastics} items</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={shopping.singleUsePlastics}
                onChange={(e) => setShopping({ ...shopping, singleUsePlastics: Number(e.target.value) })}
                className="w-full accent-amber-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Lifestyle & Diet */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <span>4. Diet & Waste Habits</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Diet</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'nonveg', label: 'Frequent Meat' },
                  { id: 'moderate', label: 'Moderate Meat' },
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'vegan', label: 'Vegan / Plant-Based' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setLifestyle({ ...lifestyle, diet: d.id })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                      lifestyle.diet === d.id
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Do you segregate dry / wet waste?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'always', label: 'Always Segregate' },
                  { id: 'sometimes', label: 'Sometimes' },
                  { id: 'rare', label: 'Rarely' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setLifestyle({ ...lifestyle, recyclingHabit: r.id })}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition ${
                      lifestyle.recyclingHabit === r.id
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Calculate Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={calculateFootprint}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 hover:scale-105 transition flex items-center justify-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze & Calculate Carbon Footprint</span>
        </button>
      </div>

      {/* Post-Calculation Result Report */}
      {calculatedResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-6 animate-scale-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Assessment Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Your Monthly Footprint: <span className="text-emerald-700">{calculatedResult.total} kg CO₂e</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Highest-impact category: <strong className="text-slate-800">{calculatedResult.highestImpact}</strong>
              </p>
            </div>

            <button
              onClick={handleSaveFootprint}
              disabled={isSaving}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? 'Saving to Firestore...' : 'Save Footprint & Recommendations'}</span>
            </button>
          </div>

          {/* Opportunity Callout Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900">
                Circular Reduction Opportunity: ~{calculatedResult.reductionOpportunity} kg CO₂e / month
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                “You could reduce approximately {calculatedResult.reductionOpportunity} kg CO₂e this month by choosing reusable products and switching 2 trips weekly to public transport.”
              </p>
            </div>
          </div>

          {/* Breakdown Chart and Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculatedResult.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {calculatedResult.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} kg CO₂e`, 'Emissions']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Personalized Circular Recommendations:
              </div>
              {calculatedResult.recommendations.map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{rec.title}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Saves ~{rec.saving}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 px-2 py-1 bg-amber-100 rounded-lg">
                    +{rec.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
