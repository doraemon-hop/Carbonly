import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  MapPin
} from 'lucide-react';

export const TopNav = ({ onMenuClick }) => {
  const { currentUser } = useAuth();
  const { userStats } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Mobile Toggle & Location */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ahmedabad Hub · <strong className="text-emerald-700">Rank #{userStats.rank}</strong></span>
        </div>
      </div>

      {/* Center / Search bar */}
      <div className="hidden md:flex items-center relative max-w-xs w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search actions, drop-offs, shops..."
          className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
        />
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-emerald-600 font-semibold">2 New</span>
              </div>
              <div className="divide-y divide-slate-100 py-1 space-y-1">
                <div className="py-2">
                  <div className="font-semibold text-slate-800">🔥 7-Day Streak Unlocked!</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    You earned the 7-Day Eco Streak badge. Keep going!
                  </div>
                </div>
                <div className="py-2">
                  <div className="font-semibold text-slate-800">♻️ E-waste Verification Approved</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    GreenCycle Center verified your 2.4kg deposit. +120 points.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Mini */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.name || 'Eco Citizen'}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {userStats.ecoPoints.toLocaleString()} EcoPoints
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
