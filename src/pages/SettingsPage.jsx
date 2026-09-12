import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  Settings, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck, 
  Bell, 
  Key, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const SettingsPage = () => {
  const { isFirebaseConfigured, currentUser } = useAuth();
  const { addToast } = useApp();

  const handleResetData = () => {
    dataService.resetAllDemoData();
    addToast({
      title: 'Demo Data Reset',
      message: 'All mock state has been re-seeded to defaults.',
      type: 'info',
    });
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your cloud backend configuration, notifications, and demo environment settings.
        </p>
      </div>

      {/* Backend / Firebase Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isFirebaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Firebase Backend Connection</h3>
              <p className="text-xs text-slate-500">
                Firestore, Authentication, and Cloud Storage state
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isFirebaseConfigured 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}>
            {isFirebaseConfigured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live Firebase Connected</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Zero-Setup Hackathon Mode (Reactive Local Storage)</span>
              </>
            )}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
          <p className="leading-relaxed">
            <strong>Carbonly</strong> is engineered with a <strong>dual-engine data service</strong>. When you supply standard Firebase environment variables in your <code>.env</code> file, it directly connects to Google Firebase Auth, Firestore, and Storage:
          </p>
          <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
            VITE_FIREBASE_API_KEY=AIzaSy...<br />
            VITE_FIREBASE_AUTH_DOMAIN=carbonly-app.firebaseapp.com<br />
            VITE_FIREBASE_PROJECT_ID=carbonly-app<br />
            VITE_FIREBASE_STORAGE_BUCKET=carbonly-app.appspot.com<br />
            VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
          </div>
          <p className="text-slate-500 text-[11px]">
            In the absence of Firebase keys, the application gracefully operates using the high-fidelity mock storage engine with real-time reactive updates so judges and testers can run the product without setup delays.
          </p>
        </div>
      </div>

      {/* Demo Controls Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Demo Testing & Reset Utility</h3>
            <p className="text-xs text-slate-500">Restore default seeded mock data for footprints, actions, and marketplace.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-600">
            Resetting clears custom simulated actions and reloads the default Ahmedabad leaderboard and baseline footprint.
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo Data</span>
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">Notification Preferences</h3>
        
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">Daily Streak Reminders (Habit accountability)</span>
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">Action Verification Alerts (When photo proof is approved)</span>
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">Community Challenge Invitations</span>
            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 rounded cursor-pointer" />
          </label>
        </div>
      </div>

    </div>
  );
};
