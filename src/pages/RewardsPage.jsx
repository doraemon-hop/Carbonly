import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  Award, 
  Sparkles, 
  Ticket, 
  Trees, 
  ShoppingBag, 
  Train, 
  PackageCheck, 
  Bike, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Lock, 
  Unlock,
  ChevronRight
} from 'lucide-react';

export const RewardsPage = () => {
  const { userStats, redeemReward, addToast } = useApp();
  const [rewards, setRewards] = useState([]);
  const [badges, setBadges] = useState([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const loadRewardsData = async () => {
      const rew = await dataService.getRewards();
      const bg = await dataService.getBadges();
      const hist = await dataService.getRedeemedRewards();
      setRewards(rew);
      setBadges(bg);
      setRedeemedVouchers(hist);
    };
    loadRewardsData();
  }, [userStats]);

  const rewardIcons = {
    Ticket,
    ShoppingBag,
    Trees,
    Train,
    PackageCheck,
    Bike,
  };

  const handleRedeem = async (reward) => {
    if (userStats.ecoPoints < reward.points) {
      addToast({
        title: 'Insufficient Points',
        message: `You need ${reward.points} EcoPoints for this reward. Complete circular actions to earn more!`,
        type: 'error',
      });
      return;
    }

    try {
      setIsRedeeming(true);
      const redeemed = await redeemReward(reward);
      setRedeemedVouchers([redeemed, ...redeemedVouchers]);
    } catch (err) {
      // Toast already handled by AppContext
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({ title: 'Code Copied!', message: `${code} copied to clipboard.`, type: 'info' });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Green Wallet Balance Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Green Wallet</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            EcoPoints: <span className="text-amber-300">{userStats.ecoPoints.toLocaleString()}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your circular habits convert directly to store discounts, clean transit passes, and direct reforestation.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-2 relative z-10 shrink-0">
          <div className="flex justify-between gap-6 text-slate-300">
            <span>Monthly Points Earned:</span>
            <strong className="text-white">+840 pts</strong>
          </div>
          <div className="flex justify-between gap-6 text-slate-300">
            <span>Points Redeemed:</span>
            <strong className="text-amber-300">{redeemedVouchers.reduce((acc, r) => acc + r.pointsSpent, 0)} pts</strong>
          </div>
          <div className="flex justify-between gap-6 text-slate-300 border-t border-white/10 pt-1.5 font-bold">
            <span>Ahmedabad Rank:</span>
            <strong className="text-emerald-300">#{userStats.rank}</strong>
          </div>
        </div>
      </div>

      {/* SECTION 1: AVAILABLE REWARDS */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Spend & Save
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Available Rewards
          </h2>
          <p className="text-xs text-slate-500">
            Select a reward to instantly redeem using your EcoPoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const Icon = rewardIcons[reward.icon] || Ticket;
            const canAfford = userStats.ecoPoints >= reward.points;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-black text-xs rounded-xl">
                      {reward.points} Points
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {reward.category} · {reward.partner}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {reward.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {reward.description}
                  </p>

                  <div className="mt-3 text-[11px] font-medium text-emerald-700">
                    {reward.validity}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRedeem(reward)}
                    disabled={isRedeeming || !canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Redeem Voucher →' : `Need ${reward.points - userStats.ecoPoints} more pts`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ACTIVE REDEEMED VOUCHERS (Wallet) */}
      {redeemedVouchers.length > 0 && (
        <div className="space-y-4 bg-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Your Active Vouchers & Coupons</h3>
              <p className="text-xs text-emerald-800">Copy these codes to redeem at partner checkouts.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
              {redeemedVouchers.length} Vouchers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemedVouchers.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Redeemed on {item.redeemedAt} · {item.pointsSpent} pts spent
                  </div>
                  <div className="mt-1 font-mono font-bold text-sm text-emerald-700 tracking-wider">
                    {item.code}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(item.code)}
                  className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                >
                  {copiedCode === item.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === item.code ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ACHIEVEMENT BADGES */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
            Gamified Milestones
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Achievement Badges
          </h2>
          <p className="text-xs text-slate-500">
            Showcase your circular dedication with verifiable badges for your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                badge.unlocked
                  ? 'bg-white border-emerald-300 shadow-md shadow-emerald-500/5'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{badge.icon}</span>
                  {badge.unlocked ? (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <Unlock className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-slate-200 text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {badge.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold">
                {badge.unlocked ? (
                  <div className="text-emerald-700 flex items-center justify-between">
                    <span>Unlocked</span>
                    <span className="text-slate-400 font-normal">{badge.unlockedAt}</span>
                  </div>
                ) : (
                  <div className="text-slate-500">
                    Progress: {badge.progress} / {badge.totalRequired}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
