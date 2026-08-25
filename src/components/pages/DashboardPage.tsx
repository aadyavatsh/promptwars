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
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  Brain,
  GraduationCap,
  MapPin,
  Globe,
  Building2,
  Award,
} from 'lucide-react';
import { TeammateCard } from '../TeammateCard';
import { calculateMatch } from '../../utils/matchmaker';
import { HackathonTeamBuilderModal } from '../modals/HackathonTeamBuilderModal';
import { Hackathon } from '../../types';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    students,
    teams,
    dailyStreak,
    solvedToday,
    navigateTo,
    hackathons,
  } = useApp();

  const [selectedHackathonForTeam, setSelectedHackathonForTeam] = useState<Hackathon | null>(null);

  const currentHackathon = hackathons.find((h) => h.isSundayForge) || hackathons[0];
  const myTeam = teams[0];

  // 1. Recommended Candidates (Sorted by 7-factor synergy)
  const recommendedCandidates = [...students]
    .sort((a, b) => {
      if (!currentUser) return 0;
      return calculateMatch(currentUser, b).matchPercentage - calculateMatch(currentUser, a).matchPercentage;
    })
    .slice(0, 3);

  // 2. People from Same College
  const collegeCandidates = students.filter((s) => {
    if (!currentUser) return false;
    return (
      s.college.toLowerCase() === currentUser.college.toLowerCase() ||
      s.collegeShort.toLowerCase() === currentUser.collegeShort.toLowerCase()
    );
  });

  // 3. Builders near you (< 50 km and different college)
  const nearbyCandidates = students.filter((s) => {
    if (!currentUser) return false;
    const isSame =
      s.college.toLowerCase() === currentUser.college.toLowerCase() ||
      s.collegeShort.toLowerCase() === currentUser.collegeShort.toLowerCase();
    if (isSame) return false;
    return s.distanceKm !== undefined && s.distanceKm <= 50;
  });

  // 4. Global Builders
  const globalCandidates = students.filter((s) => {
    return s.locationScope === 'global' || (s.distanceKm !== undefined && s.distanceKm > 1000);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-9 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {currentUser?.fullName || 'Builder'} 👋
            </h1>
            {currentUser?.isVerifiedStudent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{currentUser.collegeShort} Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Smart matching considers skills, roles, interests, college proximity, and hackathon schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('builder')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Team Builder ✦</span>
          </button>
          <button
            onClick={() => navigateTo('explore')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Teammates</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Top High Synergy Recommended Teammates */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Compatibility</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recommended Teammates For You
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              7-factor multi-vector synergy matching your exact stack & competition preferences
            </p>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCandidates.map((c) => (
            <TeammateCard key={c.id} student={c} />
          ))}
        </div>
      </section>

      {/* SECTION 2: People From Your College */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                People from your college ({currentUser?.collegeShort || 'SRM IST'})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified campus peers available for local offline collaboration & campus hackathons
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Campus directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {collegeCandidates.map((c) => (
            <TeammateCard key={c.id} student={c} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Builders Near You (< 50 km) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Builders near you (&lt; 50 km)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Students from neighboring colleges (VIT Chennai, IIT Madras, SSN) ready for local sprints
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Nearby directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearbyCandidates.slice(0, 2).map((c) => (
            <TeammateCard key={c.id} student={c} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Global Builders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Global Builders
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                International teammates from top universities with timezone overlap & online competition chemistry
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Global network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {globalCandidates.slice(0, 3).map((c) => (
            <TeammateCard key={c.id} student={c} />
          ))}
        </div>
      </section>

      {/* SECTION 5: Hackathons & Build Team CTA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Upcoming Competitions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Hackathons & Squad Matching
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by format, reach, and click "Build My Hackathon Team" to auto-assemble a balanced squad
            </p>
          </div>

          <button
            onClick={() => navigateTo('hackathons')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all hackathons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackathons.slice(0, 3).map((h) => (
            <div
              key={h.id}
              className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <img
                    src={h.bannerUrl}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${
                        h.format === 'Offline'
                          ? 'bg-emerald-600 text-white'
                          : h.format === 'Online'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {h.format}
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {h.reach}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {h.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {h.organizer}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 font-medium">
                    {h.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{h.prizePool}</span>
                  <span>{h.startDate}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHackathonForTeam(h)}
                className="w-full py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Build My Hackathon Team ✦</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Weekly Sunday Sprint + DailyForge */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sunday HackForge Spotlight */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-blue-800/40 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md border border-white/10">
              <Zap className="w-3.5 h-3.5" />
              <span>Sunday Sprint Spotlight</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {currentHackathon.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              12-Hour lightning sprint to build and ship functional web products with local or global squads.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Every Sunday @ 09:00 UTC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{currentHackathon.participantsCount} Registered</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('sunday-forge')}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-white text-indigo-950 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Enter Sprint Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DailyForge Streak Widget */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">DailyForge Streak</h3>
                  <p className="text-[11px] text-slate-400">Synergy Algo Challenge</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  🔥 {dailyStreak}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Day Streak</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Today's Problem:</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Medium • 150 XP
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Optimal Hackathon Team Synergy Partitioning
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('daily-forge')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              solvedToday
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20'
            }`}
          >
            {solvedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Solved for Today (+150 XP)</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                <span>Solve Today's Challenge</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Hackathon Team Builder Modal */}
      {selectedHackathonForTeam && (
        <HackathonTeamBuilderModal
          hackathon={selectedHackathonForTeam}
          onClose={() => setSelectedHackathonForTeam(null)}
        />
      )}
    </div>
  );
};
