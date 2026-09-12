import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Flame, 
  Award, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  TrendingDown,
  Sparkles,
  Camera
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { userStats, addToast, triggerConfetti } = useApp();

  const [actions, setActions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [city, setCity] = useState(currentUser?.city || 'Ahmedabad');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  useEffect(() => {
    const loadProfileData = async () => {
      const acts = await dataService.getRecentActions();
      const bg = await dataService.getBadges();
      setActions(acts);
      setBadges(bg);
    };
    loadProfileData();
  }, [userStats]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setCity(currentUser.city || 'Ahmedabad');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await dataService.updateUser({
        name,
        bio,
        city,
        avatar: avatar || currentUser.avatar,
      });
      setCurrentUser(updated);
      setIsEditing(false);
      triggerConfetti();
      addToast({
        title: 'Profile Updated! ✨',
        message: 'Your public profile changes have been saved.',
        type: 'success',
      });
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser?.name || 'Geetika Soni'}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  {currentUser?.role || 'Citizen'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{currentUser?.email || 'geetika@carbonly.eco'}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-slate-600">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {currentUser?.city || 'Ahmedabad'}, Gujarat
                </span>
              </p>
              <p className="text-xs text-slate-600 mt-2 max-w-md italic">
                “{currentUser?.bio || 'Passionate about zero-waste living and circular electronics.'}”
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Edit Profile Form Popup */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="py-6 border-b border-slate-100 space-y-4 animate-scale-in">
            <h3 className="text-sm font-bold text-slate-900">Edit Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Personal Mission</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Macro Impact Badges in Profile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div>
            <div className="text-xs text-slate-400 font-semibold">EcoPoints Balance</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {userStats.ecoPoints.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">Tier 3 Eco Guardian</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Avoided CO₂e</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {userStats.carbonSaved} kg
            </div>
            <div className="text-[11px] text-slate-500">Verified through proof</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">City Leaderboard</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              Rank #{userStats.rank}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">Top 3% in Ahmedabad</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Daily Habit Streak</div>
            <div className="text-2xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500" />
              <span>{userStats.streak} Days</span>
            </div>
            <div className="text-[11px] text-slate-500">+15% point multiplier</div>
          </div>
        </div>

      </div>

      {/* Badges Shelf */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Your Achievement Shelf</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                b.unlocked ? 'bg-white border-emerald-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-900">{b.name}</div>
                <div className="text-[10px] text-slate-500">
                  {b.unlocked ? b.unlockedAt : 'Locked'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action History Log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Completed Action Log</h3>
            <p className="text-xs text-slate-500">All circular actions validated with photos and receipts</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            {actions.length} Total Submissions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {actions.map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={act.proofUrl}
                  alt={act.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{act.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{act.facility}</span>
                    <span>•</span>
                    <span className="text-slate-400">{act.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-emerald-700">+{act.ecoPoints} pts</div>
                <div className="text-[10px] text-slate-400">-{act.carbonSaved} kg CO₂e</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
