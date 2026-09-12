import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calculator, 
  Sparkles, 
  MapPin, 
  ShoppingBag, 
  Award, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Flame,
  Leaf,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout } = useAuth();
  const { userStats } = useApp();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Calculate Footprint', path: '/calculator', icon: Calculator },
    { name: 'Action Hub', path: '/actions', icon: Sparkles, highlight: true },
    { name: 'Recycling Map', path: '/map', icon: MapPin },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Rewards', path: '/rewards', icon: Award },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  Carbonly<span className="text-emerald-500 font-extrabold">.</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 -mt-1">
                  Circular Impact
                </div>
              </div>
            </NavLink>
          </div>

          {/* Quick Eco Status Pill */}
          <div className="px-4 py-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-b border-emerald-100/60 m-3 rounded-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">EcoPoints</span>
              <div className="flex items-center gap-1 font-bold text-emerald-800">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{userStats.ecoPoints.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-emerald-100/50">
              <div className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{userStats.streak}d Streak</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>-{userStats.carbonSaved}kg CO₂e</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </div>
                  {link.highlight && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                      Act
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile mini footer & Logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {currentUser?.name || 'Geetika Soni'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate capitalize">
                    {currentUser?.role || 'Citizen'} · Rank #{userStats.rank}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
