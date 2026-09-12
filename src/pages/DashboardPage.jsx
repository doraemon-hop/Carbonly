import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Award, 
  Flame, 
  Leaf, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  Zap, 
  ShoppingBag, 
  Coffee, 
  Wrench, 
  RefreshCw, 
  Recycle, 
  Sprout,
  ChevronRight
} from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { userStats, openVerificationModal } = useApp();
  const [footprintData, setFootprintData] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [chartView, setChartView] = useState('pie'); // 'pie' or 'trend'

  useEffect(() => {
    const loadDashboardData = async () => {
      const fp = await dataService.getFootprint();
      const acts = await dataService.getRecentActions();
      setFootprintData(fp);
      setRecentActions(acts);
    };
    loadDashboardData();
  }, [userStats]);

  const categoryIcons = {
    Transport: Car,
    Energy: Zap,
    Shopping: ShoppingBag,
    Lifestyle: Coffee,
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  // Quick Action presets for the dashboard
  const quickActions = [
    {
      title: 'E-Waste Deposit',
      category: 'recycle',
      carbonSaved: 18.5,
      ecoPoints: 120,
      provider: 'GreenCycle Navrangpura',
      icon: Recycle,
      color: 'bg-sky-500',
    },
    {
      title: 'Appliance Repair',
      category: 'repair',
      carbonSaved: 15.0,
      ecoPoints: 140,
      provider: 'QuickFix Electronics',
      icon: Wrench,
      color: 'bg-amber-500',
    },
    {
      title: 'Metro Commute',
      category: 'offset',
      carbonSaved: 4.2,
      ecoPoints: 80,
      provider: 'Ahmedabad Metro',
      icon: Leaf,
      color: 'bg-emerald-500',
    },
    {
      title: 'BYO Reusable Kit',
      category: 'reuse',
      carbonSaved: 3.5,
      ecoPoints: 60,
      provider: 'Zero-Waste Circle',
      icon: RefreshCw,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome & Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Background decorative ring */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'Geetika'}!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Your Actions. Your Impact. Your Rewards.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            You've avoided <strong className="text-emerald-300 font-bold">{userStats.carbonSaved} kg CO₂e</strong> this month through circular habits. Keep your 7-day streak burning!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/calculator"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span>Recalculate Footprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/actions"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition"
          >
            Action Hub
          </Link>
        </div>
      </div>

      {/* 1. Carbon Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Current Footprint */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-1">
          <div className="text-xs font-semibold text-slate-500">Current Footprint</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {userStats.currentFootprint}
            </span>
            <span className="text-xs font-medium text-slate-500">kg CO₂e/mo</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-18% vs last month</span>
          </div>
        </div>

        {/* Carbon Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-1">
          <div className="text-xs font-semibold text-slate-500">Carbon Saved</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {userStats.carbonSaved}
            </span>
            <span className="text-xs font-medium text-slate-500">kg avoided</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            4 circular actions
          </div>
        </div>

        {/* EcoPoints Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-1">
          <div className="text-xs font-semibold text-slate-500">Green Wallet</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {userStats.ecoPoints.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">pts</span>
          </div>
          <Link to="/rewards" className="mt-2 text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-1">
            Redeem rewards <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Leaderboard Rank */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-1">
          <div className="text-xs font-semibold text-slate-500">Ahmedabad Rank</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              #{userStats.rank}
            </span>
            <span className="text-xs font-medium text-slate-500">/ 1,420</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-700 font-bold">
            🏆 Top 3% Performer
          </div>
        </div>

        {/* Eco Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-slate-500">Daily Eco Streak</div>
          <div className="mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {userStats.streak} Days
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-semibold">
            Streak Bonus active (+15%)
          </div>
        </div>

      </div>

      {/* 2. Charts Section: Carbon Breakdown & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Carbon Breakdown & Monthly Trend</h3>
              <p className="text-xs text-slate-500">
                Detailed view of emission drivers and monthly reduction progression
              </p>
            </div>
            
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartView('pie')}
                className={`px-3 py-1 rounded-lg transition ${
                  chartView === 'pie' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setChartView('trend')}
                className={`px-3 py-1 rounded-lg transition ${
                  chartView === 'trend' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                6-Month Trend
              </button>
            </div>
          </div>

          <div className="py-4">
            {chartView === 'pie' && footprintData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={footprintData.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {footprintData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} kg CO₂e`, 'Emissions']}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {footprintData.categories.map((cat, idx) => {
                    const Icon = categoryIcons[cat.name] || Car;
                    return (
                      <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: COLORS[idx] }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{cat.name}</div>
                            <div className="text-[10px] text-slate-400">{cat.percentage}% of total</div>
                          </div>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {cat.value} <span className="text-[10px] font-normal text-slate-500">kg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {chartView === 'trend' && footprintData && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={footprintData.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(val, name) => [`${val} kg CO₂e`, name === 'footprint' ? 'Footprint' : 'Carbon Saved']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="footprint" name="Footprint (kg CO₂e)" fill="#0f172a" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="saved" name="Avoided / Saved" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest Impact Area: <strong className="text-slate-800">Transport (41%)</strong></span>
            <Link to="/calculator" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
              View Reduction Plan <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Monthly Reduction Goal & Level Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Monthly Target
              </span>
              <span className="text-xs text-slate-400 font-medium">Sep 2026</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-3">
              Reduction Progress
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Avoid 60 kg CO₂e this month to unlock Tier 4 status.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-700">39 kg achieved</span>
                <span className="text-slate-400">Target: 60 kg</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                65% completed · 18 days left
              </div>
            </div>

            {/* Level Tier Card */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Citizen Level
                </span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-base font-extrabold mt-1">Eco Guardian (Tier 3)</div>
              <div className="text-xs text-slate-300 mt-0.5">820 points to Tier 4 Ambassador</div>
              
              <div className="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
          </div>

          <Link
            to="/actions"
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
          >
            <span>Log Circular Action (+Points)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* 3. Quick Action Launchers & Recent Actions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Launchers (Calculate -> Recommend -> Act -> Verify) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Fast Track
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Log & Verify Circular Action</h3>
            <p className="text-xs text-slate-500">Pick an action, submit photo/receipt, and earn instant EcoPoints.</p>
          </div>

          <div className="space-y-2.5">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <div
                  key={qa.title}
                  onClick={() => openVerificationModal(qa, qa.category)}
                  className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500/80 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${qa.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {qa.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{qa.provider}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-700">+{qa.ecoPoints} pts</div>
                    <div className="text-[10px] text-slate-500">-{qa.carbonSaved}kg CO₂e</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/actions"
            className="block text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
          >
            Explore all Repair, Reuse, Recycle & Offset actions →
          </Link>
        </div>

        {/* Recent Actions Table / Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Verified Actions</h3>
                <p className="text-xs text-slate-500">Your verified circular submissions and claimed rewards</p>
              </div>
              <Link to="/profile" className="text-xs font-semibold text-emerald-600 hover:underline">
                View History
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentActions.slice(0, 4).map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={act.proofUrl}
                      alt="Proof"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{act.facility}</span>
                        <span>•</span>
                        <span className="text-slate-400">{act.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-700">
                        +{act.ecoPoints} EcoPoints
                      </div>
                      <div className="text-[10px] text-slate-400">
                        -{act.carbonSaved} kg CO₂e
                      </div>
                    </div>
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl mt-4 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All 4 recent actions are verified and credited to your Ahmedabad ranking.</span>
            </div>
            <Link to="/leaderboard" className="font-bold underline hover:text-emerald-700">
              Check Leaderboard
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
