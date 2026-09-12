import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  MapPin,
  LayoutDashboard,
  Calculator,
  Sparkles,
  ShoppingBag,
  Award,
  Users,
  User,
  Settings,
  X,
  ArrowRight
} from 'lucide-react';
import { VoiceSearchButton } from './VoiceSearchButton';

/* ──────────────────────────────────────────────────────────────
   Searchable Pages – each entry has a name, path, icon,
   and descriptive keywords that help match user queries.
   ────────────────────────────────────────────────────────────── */
const SEARCHABLE_PAGES = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    keywords: ['dashboard', 'home', 'overview', 'stats', 'summary', 'main', 'analytics', 'carbon', 'footprint'],
    description: 'View your eco dashboard & stats',
  },
  {
    name: 'Calculate Footprint',
    path: '/calculator',
    icon: Calculator,
    keywords: ['calculator', 'calculate', 'footprint', 'carbon', 'co2', 'emissions', 'transport', 'energy', 'food', 'diet', 'travel'],
    description: 'Calculate your carbon footprint',
  },
  {
    name: 'Action Hub',
    path: '/actions',
    icon: Sparkles,
    keywords: ['action', 'hub', 'actions', 'tasks', 'challenges', 'eco', 'green', 'reduce', 'recycle', 'reuse', 'repair', 'act'],
    description: 'Browse & log eco-friendly actions',
  },
  {
    name: 'Recycling Map',
    path: '/map',
    icon: MapPin,
    keywords: ['map', 'recycling', 'drop-off', 'drop off', 'dropoff', 'center', 'centres', 'location', 'locations', 'nearby', 'ewaste', 'e-waste'],
    description: 'Find nearby recycling drop-off points',
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    icon: ShoppingBag,
    keywords: ['marketplace', 'market', 'shop', 'shops', 'buy', 'sell', 'eco', 'products', 'sustainable', 'green', 'store'],
    description: 'Discover sustainable products & shops',
  },
  {
    name: 'Rewards',
    path: '/rewards',
    icon: Award,
    keywords: ['rewards', 'reward', 'points', 'redeem', 'voucher', 'coupon', 'gift', 'badge', 'badges', 'ecopoints', 'eco points'],
    description: 'Redeem EcoPoints for rewards',
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    icon: Users,
    keywords: ['leaderboard', 'leader', 'board', 'rank', 'ranking', 'top', 'compete', 'competition', 'score', 'scores'],
    description: 'See community rankings & your rank',
  },
  {
    name: 'Community',
    path: '/community',
    icon: Users,
    keywords: ['community', 'social', 'feed', 'posts', 'people', 'friends', 'share', 'discussion', 'forum'],
    description: 'Engage with the eco community',
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: User,
    keywords: ['profile', 'my', 'account', 'me', 'bio', 'avatar', 'personal', 'info', 'details'],
    description: 'View & edit your profile',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    keywords: ['settings', 'setting', 'preferences', 'config', 'configuration', 'theme', 'notifications', 'privacy', 'account', 'password'],
    description: 'App settings & preferences',
  },
];

export const TopNav = ({ onMenuClick }) => {
  const { currentUser } = useAuth();
  const { userStats } = useApp();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Fuzzy-ish search logic ────────────────────────────────── */
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return SEARCHABLE_PAGES
      .map((page) => {
        let score = 0;

        // Exact name match (highest priority)
        if (page.name.toLowerCase().includes(q)) score += 10;

        // Keyword matches
        for (const kw of page.keywords) {
          if (kw.startsWith(q)) score += 5;   // prefix match
          else if (kw.includes(q)) score += 3; // substring match
        }

        // Description match
        if (page.description.toLowerCase().includes(q)) score += 2;

        return { ...page, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery]);

  /* ── Navigate to a result ──────────────────────────────────── */
  const goToResult = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  /* ── Keyboard navigation ───────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) {
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowResults(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          goToResult(searchResults[selectedIndex].path);
        } else if (searchResults.length > 0) {
          goToResult(searchResults[0].path);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchQuery('');
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  /* ── Close dropdown when clicking outside ──────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Show results when query changes ───────────────────────── */
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowResults(true);
      setSelectedIndex(-1);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  /* ── Voice search handler — set query, auto-navigate top hit ─ */
  const handleVoiceResult = (text) => {
    setSearchQuery(text);
    // Give a tick for searchResults to recalculate, then navigate
    setTimeout(() => {
      const q = text.trim().toLowerCase();
      if (!q) return;

      const match = SEARCHABLE_PAGES.find((page) => {
        if (page.name.toLowerCase().includes(q)) return true;
        return page.keywords.some((kw) => kw.startsWith(q) || kw.includes(q));
      });

      if (match) {
        navigate(match.path);
        setSearchQuery('');
        setShowResults(false);
      }
    }, 100);
  };

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

      {/* ─── Center: Search Bar with Dropdown ─── */}
      <div ref={searchRef} className="hidden md:flex items-center relative max-w-xs w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none z-10" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search actions, drop-offs, shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="w-full text-xs pl-9 pr-9 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
        />

        {/* Clear button (when there's text) */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
              inputRef.current?.focus();
            }}
            className="absolute right-8 z-10 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Voice Search Button */}
        <VoiceSearchButton
          onResult={handleVoiceResult}
          className="absolute right-1.5 top-0.5"
        />

        {/* ─── Search Results Dropdown ─── */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
            {searchResults.length > 0 ? (
              <ul className="py-1">
                {searchResults.map((result, idx) => {
                  const Icon = result.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <li key={result.path}>
                      <button
                        type="button"
                        onClick={() => goToResult(result.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{result.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{result.description}</div>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                          isSelected ? 'opacity-100 text-emerald-500' : 'opacity-0'
                        }`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">
                  No results for "<span className="text-slate-700">{searchQuery}</span>"
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Try "dashboard", "map", "rewards", or "calculator"
                </p>
              </div>
            )}
          </div>
        )}
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
