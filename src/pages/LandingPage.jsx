import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Calculator, 
  Wrench, 
  RefreshCw, 
  Recycle, 
  Sprout, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Flame,
  Globe2
} from 'lucide-react';

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleQuickStart = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Calculate Footprint',
      desc: 'Evaluate personal emissions across daily transport, home energy, food, and shopping habits in 2 minutes.',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: '02',
      title: 'Get Circular Advice',
      desc: 'Receive high-impact opportunities prioritizing Repair and Reuse rather than guilt-inducing statistics.',
      icon: Sparkles,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      num: '03',
      title: 'Take Action',
      desc: 'Locate local certified repair shops, segregation drop-off depots, and accredited carbon offset projects.',
      icon: Wrench,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      num: '04',
      title: 'Verify Proof',
      desc: 'Upload geotagged photos or receipts. Our smart validation confirms real carbon avoidance.',
      icon: ShieldCheck,
      color: 'from-purple-500 to-pink-600',
    },
    {
      num: '05',
      title: 'Earn EcoPoints',
      desc: 'Redeem points for discounts at zero-waste stores, public transit passes, or real tree plantations.',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const circularPillars = [
    {
      title: 'Repair',
      tagline: 'Repair instead of replacing',
      desc: 'Fix smartphone screens, home appliances, and shoes at vetted local artisans, dodging new manufacturing footprints.',
      icon: Wrench,
      points: 'Earn up to 180 pts',
      co2: 'Save ~38 kg CO₂e',
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Reuse',
      tagline: 'Give products a second life',
      desc: 'Thrift pre-loved apparel, carry reusable tumblers, and swap kitchen containers in the local community circle.',
      icon: RefreshCw,
      points: 'Earn up to 150 pts',
      co2: 'Save ~22 kg CO₂e',
      color: 'border-teal-200 bg-teal-50/50 text-teal-900',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      title: 'Recycle',
      tagline: 'Recycle responsibly',
      desc: 'Direct your hazardous e-waste, segregated PET plastics, and dry cartons to authorized drop-off depots.',
      icon: Recycle,
      points: 'Earn up to 160 pts',
      co2: 'Save ~28 kg CO₂e',
      color: 'border-sky-200 bg-sky-50/50 text-sky-900',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      title: 'Offset',
      tagline: 'Compensate for the unavoidable',
      desc: 'Sponsor satellite-monitored Sundarbans mangroves and solar microgrids with full Gold-Standard transparency.',
      icon: Sprout,
      points: 'Earn up to 220 pts',
      co2: 'Save ~50 kg CO₂e',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">
                Carbonly<span className="text-emerald-500 font-extrabold">.</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 -mt-1">
                Circular Ecosystem
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition">How it Works</a>
            <a href="#circular-actions" className="hover:text-emerald-600 transition">Circular Actions</a>
            <a href="#rewards" className="hover:text-emerald-600 transition">Rewards & Wallet</a>
            <a href="#community" className="hover:text-emerald-600 transition">Community</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-1.5 transition"
            >
              Log In
            </Link>
            <button
              onClick={handleQuickStart}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>The Circular Carbon Ecosystem</span>
            </div>

            {/* Tagline & Title */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your Actions. <br className="hidden sm:block" />
              <span className="eco-gradient-text">Your Impact.</span> Your Rewards.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mt-6 leading-relaxed max-w-2xl mx-auto font-normal">
              Most carbon calculators stop at giving you a depressing number. <strong>Carbonly</strong> transforms emissions insight into practical circular habits: <strong>Repair, Reuse, Recycle, and Offset</strong> — rewarding every verified eco-action.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleQuickStart}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>{currentUser ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/calculator"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Calculate Your Footprint</span>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No complex setup needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Hackathon Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified EcoPoints
              </span>
            </div>

          </div>

          {/* Interactive Carbon Visualization Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200/80 to-slate-100 border border-slate-200 shadow-2xl relative">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-inner border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    Live Circular Flow
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Ahmedabad Metro Hub</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  From Carbon Burden to Circular Momentum
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Last month, Geetika reduced <strong>48.5 kg CO₂e</strong> by repairing her phone battery and depositing 2.4kg of cords at GreenCycle Navrangpura.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    🔧 Repaired Screen
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    ♻️ E-waste Segregation
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    🚇 18km Metro Ride
                  </span>
                </div>
              </div>

              {/* Mini Interactive Stat Display */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-800/60 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-emerald-300 font-semibold tracking-wide uppercase">
                    Monthly Balance
                  </div>
                  <div className="text-3xl font-black text-white mt-1">
                    142 <span className="text-sm font-medium text-emerald-300">kg CO₂e</span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" /> -18% vs last month
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800">
                  <div className="text-xs text-emerald-300">Reward Wallet</div>
                  <div className="text-2xl font-extrabold text-amber-300 mt-0.5">
                    4,180 <span className="text-xs text-white/80 font-normal">EcoPoints</span>
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">
                    🔥 7-day streak · Rank #3
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Animated Statistics Bar */}
      <section className="py-10 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">1.28M+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Kg CO₂e Avoided</div>
              <div className="text-[11px] text-slate-400">Equivalent to 4,200 flights</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">84,210</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Verified Eco-Actions</div>
              <div className="text-[11px] text-slate-400">Photo & receipt verified</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-600">14,520</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Active Citizens</div>
              <div className="text-[11px] text-slate-400">Across Ahmedabad & Gujarat</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">2.85M</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">EcoPoints Rewarded</div>
              <div className="text-[11px] text-slate-400">Redeemed with green partners</div>
            </div>

          </div>
        </div>
      </section>

      {/* How Carbonly Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The 5-Step Circular Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              Converting carbon awareness into tangible circular actions, verifiable proof, and real-world rewards.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-400 font-mono">
                        {step.num}
                      </span>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-4">{step.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{step.desc}</p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Circular Action Section */}
      <section id="circular-actions" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Core Modules
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                The 4 Circular Pillars
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Every habit on Carbonly addresses a distinct circular strategy with measurable carbon math.
              </p>
            </div>

            <Link
              to="/actions"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore Action Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {circularPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${pillar.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${pillar.badgeColor}`}>
                        {pillar.title}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-emerald-700" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{pillar.tagline}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{pillar.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-800">{pillar.co2}</span>
                    <span className="text-amber-800">{pillar.points}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Rewards & Wallet Preview */}
      <section id="rewards" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Tangible Incentives
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              The Green Wallet & Rewards
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Earn EcoPoints for real impact and redeem them for store vouchers, metro credit, or direct tree plantations.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase">Partner Discount</div>
                <div className="text-xl font-bold text-white mt-1">₹100 Off Organic Groceries</div>
                <p className="text-xs text-slate-400 mt-2">
                  Use on GreenBazaar orders above ₹499 across clean organic farm produce and refills.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-xs font-semibold text-slate-300">500 EcoPoints</span>
                <Link to="/rewards" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  Redeem <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-sky-400 uppercase">Green Mobility</div>
                <div className="text-xl font-bold text-white mt-1">Ahmedabad Metro 10-Ride Pass</div>
                <p className="text-xs text-slate-400 mt-2">
                  Recharge your digital metro transit smartcard and skip vehicular emissions.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-xs font-semibold text-slate-300">400 EcoPoints</span>
                <Link to="/rewards" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  Redeem <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase">Permanent Impact</div>
                <div className="text-xl font-bold text-white mt-1">Plant 1 Sundarbans Mangrove</div>
                <p className="text-xs text-slate-400 mt-2">
                  Geotagged coastal mangrove sapling planted with digital certificates and lifetime monitoring.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-xs font-semibold text-slate-300">300 EcoPoints</span>
                <Link to="/rewards" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  Redeem <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link
              to="/rewards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg"
            >
              <span>Explore All Rewards & Badges</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Community Section Preview */}
      <section id="community" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Social Accountability
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Eco-action is infectious when shared.
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Join weekly challenges like the <strong>Plastic-Free Week</strong> or the <strong>Public Transport Sprint</strong>, compete on regional city leaderboards, and cheer on neighbors diverting e-waste from toxic dumps.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Daily streaks to maintain long-term habit retention</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Ahmedabad Eco-Champion rankings & neighborhood pride</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <Globe2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-time impact feed with photo receipts and verification</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  to="/community"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <span>View Community Challenges</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/leaderboard"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition"
                >
                  Check Leaderboard
                </Link>
              </div>
            </div>

            {/* Social Proof Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Impact Stream
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">Ahmedabad Hub</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                    alt="Riya"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Riya Patel</span>{' '}
                    <span className="text-slate-600">recycled 3.2 kg of e-waste at GreenCycle Center</span>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-emerald-700 font-bold">
                      <span>+120 EcoPoints</span>
                      <span className="text-slate-400 font-normal">24 mins ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
                    alt="Aarav"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Aarav Sharma</span>{' '}
                    <span className="text-slate-600">repaired running boots with local artisan cobbler</span>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-emerald-700 font-bold">
                      <span>+140 EcoPoints</span>
                      <span className="text-slate-400 font-normal">4 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-slate-900">Carbonly.</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering individuals and local businesses to lead the circular economy transition through verifiable carbon habits.
              </p>
              <div className="text-xs font-semibold text-emerald-700">
                “Your Actions. Your Impact. Your Rewards.”
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li><Link to="/calculator" className="hover:text-emerald-600">Footprint Calculator</Link></li>
                <li><Link to="/actions" className="hover:text-emerald-600">Action Hub (Repair & Reuse)</Link></li>
                <li><Link to="/map" className="hover:text-emerald-600">Recycling Locator Map</Link></li>
                <li><Link to="/marketplace" className="hover:text-emerald-600">Green Marketplace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Rewards & Social</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li><Link to="/rewards" className="hover:text-emerald-600">Green Wallet & Badges</Link></li>
                <li><Link to="/leaderboard" className="hover:text-emerald-600">City Leaderboards</Link></li>
                <li><Link to="/community" className="hover:text-emerald-600">Accountability Challenges</Link></li>
                <li><Link to="/settings" className="hover:text-emerald-600">Firebase & API Config</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Hackathon Info</h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Built with React, Tailwind CSS, Recharts, Leaflet, and Firebase for HackOut'26.
              </p>
              <button
                onClick={handleQuickStart}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition"
              >
                Launch Dashboard →
              </button>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <div>© 2026 Carbonly Inc. All rights reserved. Designed for Net-Zero living.</div>
            <div className="mt-2 sm:mt-0 flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Impact</span>
              <span>Carbon Standards</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
