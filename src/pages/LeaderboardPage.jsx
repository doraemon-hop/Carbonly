import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  Award, 
  MapPin, 
  Sparkles, 
  ArrowUp, 
  ShieldCheck, 
  Filter,
  Medal,
  ChevronRight
} from 'lucide-react';

export const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const { userStats } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeFilter, setTimeFilter] = useState('monthly'); // 'weekly', 'monthly', 'all'
  const [cityFilter, setCityFilter] = useState('Ahmedabad');

  useEffect(() => {
    const fetchBoard = async () => {
      const data = await dataService.getLeaderboard();
      setLeaderboard(data);
    };
    fetchBoard();
  }, [userStats]);

  const topUser = leaderboard[0] || { ecoPoints: 4850, name: 'Aarav Sharma' };
  const pointsGap = Math.max(0, topUser.ecoPoints - userStats.ecoPoints);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header & Motivational Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            City Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare circular impact, streak retention, and EcoPoints with citizens across {cityFilter}.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-bold">
            {['weekly', 'monthly', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1.5 rounded-xl capitalize transition ${
                  timeFilter === f
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? 'All-Time' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ahmedabad Eco-Champion Highlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ahmedabad Eco-Champion Race</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {pointsGap === 0 
              ? '🎉 You are currently #1 in Ahmedabad!' 
              : `You are only ${pointsGap} points away from #1!`}
          </h2>
          <p className="text-xs text-emerald-100 max-w-md">
            Log 1 appliance repair or 2 public transit commutes today to leapfrog {topUser.name}!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-center relative z-10 shrink-0">
          <div className="text-xs text-amber-200 font-semibold uppercase">Your Current Stand</div>
          <div className="text-3xl font-black text-white mt-0.5">Rank #{userStats.rank}</div>
          <div className="text-xs text-white/90 font-medium mt-0.5">
            {userStats.ecoPoints.toLocaleString()} EcoPoints
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((citizen, idx) => {
          const podiumStyles = [
            { border: 'border-amber-300 ring-2 ring-amber-400/20', bg: 'bg-amber-50/40', medal: '🥇 1st Place', text: 'text-amber-700' },
            { border: 'border-slate-300', bg: 'bg-slate-50', medal: '🥈 2nd Place', text: 'text-slate-700' },
            { border: 'border-emerald-400 ring-2 ring-emerald-500/20', bg: 'bg-emerald-50/40', medal: '🥉 3rd Place', text: 'text-emerald-700' },
          ];
          const style = podiumStyles[idx] || podiumStyles[1];

          return (
            <div
              key={citizen.rank}
              className={`p-5 rounded-3xl border bg-white shadow-sm flex flex-col justify-between space-y-4 ${
                citizen.isCurrentUser ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-md' : style.border
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${style.bg} ${style.text}`}>
                  {style.medal}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {citizen.streak}d streak
                </span>
              </div>

              <div className="text-center py-2">
                <img
                  src={citizen.avatar}
                  alt={citizen.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-slate-100 shadow-sm"
                />
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {citizen.name}
                </h3>
                <div className="text-xs text-slate-500">{citizen.city}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Avoided</div>
                  <div className="font-bold text-slate-800">-{citizen.carbonSaved} kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Total Points</div>
                  <div className="font-black text-emerald-700 text-sm">
                    {citizen.ecoPoints.toLocaleString()} pts
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Full Ahmedabad Rankings
          </div>
          <span className="text-xs text-slate-500">Updated hourly based on verified actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`px-6 py-4 flex items-center justify-between gap-4 transition ${
                item.isCurrentUser
                  ? 'bg-emerald-50/80 font-semibold border-l-4 border-emerald-500'
                  : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className={`w-7 text-center font-black text-sm ${
                  item.rank === 1 ? 'text-amber-500 font-extrabold' : item.rank === 2 ? 'text-slate-400' : item.rank === 3 ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  #{item.rank}
                </span>

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                />

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <span>{item.name}</span>
                    {item.isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{item.city}</span>
                    <span>•</span>
                    <span className="text-amber-600 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-500" /> {item.streak} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-emerald-800">
                  {item.ecoPoints.toLocaleString()} <span className="text-xs font-semibold text-emerald-600">pts</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  -{item.carbonSaved} kg CO₂e avoided
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
