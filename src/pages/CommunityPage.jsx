import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { 
  Users, 
  Sparkles, 
  Flame, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Globe2, 
  TrendingUp, 
  ShieldCheck,
  Recycle,
  Sprout
} from 'lucide-react';

export const CommunityPage = () => {
  const { currentUser } = useAuth();
  const { userStats, addToast, triggerConfetti } = useApp();

  const [challenges, setChallenges] = useState([]);
  const [feed, setFeed] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [postActionType, setPostActionType] = useState('reuse');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const loadCommunityData = async () => {
      const ch = await dataService.getChallenges();
      const fd = await dataService.getFeed();
      setChallenges(ch);
      setFeed(fd);
    };
    loadCommunityData();
  }, [userStats]);

  const handleToggleJoin = async (challengeId) => {
    try {
      const { challenges: updated, joined } = await dataService.toggleJoinChallenge(challengeId);
      setChallenges(updated);
      if (joined) {
        triggerConfetti();
        addToast({
          title: 'Challenge Joined! 🚀',
          message: 'Track progress and complete circular tasks before expiry to earn bonus points.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Challenge Left',
          message: 'You have left the challenge.',
          type: 'info',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSharePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      setIsPosting(true);
      const post = await dataService.postToFeed(newPostText, postActionType);
      setFeed([post, ...feed]);
      setNewPostText('');
      triggerConfetti();
      addToast({
        title: 'Posted to Impact Feed! 🎉',
        message: 'Shared with Ahmedabad community. +25 Community Bonus EcoPoints awarded!',
        type: 'points',
        points: 25,
      });
    } catch (err) {
      addToast({ title: 'Post Failed', message: err.message, type: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Social Accountability & Momentum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Community Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join collective eco-sprints, hold peers accountable, and share circular victories.
          </p>
        </div>
      </div>

      {/* 1. Community Macro Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">1,280,450 kg</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Total CO₂e Saved</div>
          <div className="text-[11px] text-slate-400">Equivalent to 4,200 cars off road</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-teal-600">84,210</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Actions Completed</div>
          <div className="text-[11px] text-slate-400">100% verified submissions</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-sky-600">14,520</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Active Citizens</div>
          <div className="text-[11px] text-slate-400">Ahmedabad & Regional Hubs</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-amber-600">42,800 kg</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Material Recycled</div>
          <div className="text-[11px] text-slate-400">E-waste, plastic & textiles</div>
        </div>
      </div>

      {/* 2. Community Challenges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Collective Sprints
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Active Community Challenges
            </h2>
            <p className="text-xs text-slate-500">
              Join a squad challenge to multiply your EcoPoints and boost neighborhood rankings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={challenge.banner}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                      {challenge.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow">
                      +{challenge.reward} EcoPoints
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm">
                      ⏳ {challenge.endDate}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {challenge.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Community Progress</span>
                      <span className="text-emerald-700">{challenge.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {challenge.participants} citizens actively participating
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleToggleJoin(challenge.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    challenge.joined
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  }`}
                >
                  {challenge.joined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Joined (Click to Leave)</span>
                    </>
                  ) : (
                    <>
                      <span>Join Challenge (+{challenge.reward} pts)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Impact Feed & Post Box */}
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
            Social Proof
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Live Impact Feed
          </h2>
          <p className="text-xs text-slate-500">
            See real-time actions completed by citizens and share your circular accomplishments.
          </p>
        </div>

        {/* Share New Milestone Input Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Share your eco-milestone with neighbors:</span>
          </div>

          <form onSubmit={handleSharePost} className="space-y-3">
            <textarea
              rows={2}
              placeholder="e.g. Completed Day 5 of Plastic-Free Week! Replaced cling film with beeswax wraps."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Tag:</span>
                {['repair', 'reuse', 'recycle', 'offset'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPostActionType(t)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition ${
                      postActionType === t
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isPosting || !newPostText.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share (+25 pts bonus)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Feed Stream */}
        <div className="space-y-3">
          {feed.map((post) => (
            <div
              key={post.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 transition hover:border-slate-300"
            >
              <img
                src={post.avatar}
                alt={post.user}
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    {post.user}
                  </div>
                  <span className="text-[11px] text-slate-400">{post.time}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {post.actionText}
                </p>

                <div className="flex items-center gap-4 pt-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    +{post.points} EcoPoints
                  </span>
                  <span className="text-slate-500 font-semibold text-[11px]">
                    Avoided -{post.carbonSaved} kg CO₂e
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 hover:text-rose-500 cursor-pointer transition">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
