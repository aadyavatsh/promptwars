import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Users,
  Compass,
  Zap,
  Flame,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Brain,
  Star,
  Globe,
  Layers,
} from 'lucide-react';
import { TeammateCard } from '../TeammateCard';

export const LandingPage: React.FC = () => {
  const { navigateTo, students, currentUser, setAuthModalOpen, setAuthMode, triggerNetworkPulse } = useApp();
  const [selectedDemoSkill, setSelectedDemoSkill] = useState<string>('AI / ML');

  const demoMatches = [
    { role: 'AI / ML Engineer', name: 'Priya Sharma (IIT Bombay)', synergy: '98%', highlight: 'PyTorch, Gemini 2.5, RAG' },
    { role: 'UI / UX Designer', name: 'Sarah Lin (UC Berkeley)', synergy: '96%', highlight: 'Figma Tokens, Micro-Interactions' },
    { role: 'Backend / Infra', name: 'Marcus Vance (MIT)', synergy: '95%', highlight: 'Go, Rust, Low-Latency WebSockets' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Subtle Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Living Builder Network for University Hackers
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              v2.4
            </span>
          </div>

          {/* Core Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Build the right team.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Build something great.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Connect with verified student engineers, designers, and researchers. Discover high-synergy hackathon teammates, join 12-hour Sunday sprints, and level up daily.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo('explore');
                } else {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Your Squad Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('builder')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all"
            >
              <Brain className="w-4 h-4 text-purple-500" />
              <span>AI Team Builder ✦</span>
            </button>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Verified .edu University Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>96% Team Completion Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Weekly Sunday HackForges</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Synergy Sandbox Preview */}
        <div className="mt-14 max-w-4xl mx-auto bg-white/80 dark:bg-[#131B2E]/80 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Brain className="w-4 h-4" />
                <span>Live Matching Engine Simulator</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                How TeamForge Pairs Your Dream Squad
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">I need:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {['AI / ML', 'Frontend', 'Design'].map((sk) => (
                  <button
                    key={sk}
                    onClick={() => {
                      setSelectedDemoSkill(sk);
                      triggerNetworkPulse(1);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      selectedDemoSkill === sk
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoMatches.map((dm, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {dm.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {dm.synergy} Match
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{dm.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{dm.highlight}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-500">Autonomous multi-vector pairing across 180+ universities</span>
            <button
              onClick={() => navigateTo('explore')}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Teammate Spotlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Live Roster
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Student Competitors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Looking for squads for CalHacks, Hack The North, and Sunday sprints
            </p>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors flex items-center gap-1.5 w-fit"
          >
            <span>View All 2,400+ Builders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.slice(0, 3).map((student) => (
            <TeammateCard key={student.id} student={student} />
          ))}
        </div>
      </section>

      {/* 4 Pillars of TeamForge */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Engineered For Builders
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need To Ship Hackathon Winners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigateTo('explore')}
            className="p-6 rounded-3xl bg-white/80 dark:bg-[#131B2E]/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="p-3 w-fit rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Location-Aware Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Toggle between your university campus, regional hubs (&lt;50km), or world-class global collaborators with timezone overlap.
            </p>
          </div>

          <div
            onClick={() => navigateTo('builder')}
            className="p-6 rounded-3xl bg-white/80 dark:bg-[#131B2E]/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="p-3 w-fit rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              AI Team Builder ✦
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Describe your project concept and target roles. Our autonomous engine assembles balanced squads and identifies skill gaps.
            </p>
          </div>

          <div
            onClick={() => navigateTo('sunday-forge')}
            className="p-6 rounded-3xl bg-white/80 dark:bg-[#131B2E]/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="p-3 w-fit rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Sunday HackForge ⚡
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Weekly 12-hour sprint arena with cash grants, live demo showcase, and automated GitHub repo submission verifications.
            </p>
          </div>

          <div
            onClick={() => navigateTo('daily-forge')}
            className="p-6 rounded-3xl bg-white/80 dark:bg-[#131B2E]/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="p-3 w-fit rounded-2xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              DailyForge 🔥
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Daily algorithmic, system design, and debugging challenges to keep your coding streak alive and earn squad reputation XP.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find your next hackathon dream team?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of university builders from Stanford, Berkeley, MIT, IIT Bombay, Waterloo, and CMU today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo('dashboard');
                } else {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }
              }}
              className="px-8 py-4 rounded-2xl text-sm font-extrabold bg-white text-indigo-950 hover:bg-slate-100 shadow-lg transition-all"
            >
              Get Started with Verified Student ID
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
