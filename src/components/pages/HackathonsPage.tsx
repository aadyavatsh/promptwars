import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hackathon } from '../../types';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2,
  Globe,
  Filter,
  Brain,
  Layers,
} from 'lucide-react';
import { HackathonTeamBuilderModal } from '../modals/HackathonTeamBuilderModal';

export const HackathonsPage: React.FC = () => {
  const { hackathons, navigateTo, setSearchQuery, triggerNetworkPulse } = useApp();
  const [formatFilter, setFormatFilter] = useState<'All' | 'Offline' | 'Online' | 'Hybrid'>('All');
  const [reachFilter, setReachFilter] = useState<'All' | 'College' | 'Local' | 'National' | 'Global'>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedHackathonForTeam, setSelectedHackathonForTeam] = useState<Hackathon | null>(null);

  const filteredHackathons = hackathons.filter((h) => {
    if (formatFilter !== 'All' && h.format !== formatFilter) return false;
    if (reachFilter !== 'All' && h.reach !== reachFilter) return false;
    if (domainFilter !== 'All' && !h.domains.includes(domainFilter as any)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        h.title.toLowerCase().includes(q) ||
        h.organizer.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60 mb-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Collegiate & Global Hackathon Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Hackathons & Team Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Discover premier campus, national, and international competitions and auto-assemble balanced teams
          </p>
        </div>

        <button
          onClick={() => navigateTo('sunday-forge')}
          className="px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Sunday Sprint Arena ⚡</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search hackathons, colleges, prizes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Format Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-400 mr-1">Format:</span>
            {(['All', 'Offline', 'Online', 'Hybrid'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formatFilter === fmt
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Reach & Domain Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400">Reach:</span>
            {(['All', 'College', 'Local', 'National', 'Global'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setReachFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  reachFilter === r
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {r === 'College' ? '🏫 College' : r === 'Local' ? '📍 Local' : r === 'National' ? '🇮🇳 National' : r === 'Global' ? '🌎 Global' : 'All Reach'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Domains</option>
              <option value="AI/ML">AI / ML</option>
              <option value="Web Development">Web Development</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="EdTech">EdTech</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Open Innovation">Open Innovation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.map((h) => (
          <div
            key={h.id}
            className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            {h.isSundayForge && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            )}

            <div className="space-y-3">
              {/* Top Banner Thumbnail */}
              <div className="relative h-36 rounded-2xl overflow-hidden">
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

              {/* Title & Organizer */}
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{h.organizer}</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                  {h.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2 mt-1">
                  {h.description}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-1.5 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{h.startDate} – {h.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{h.location}</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-slate-900 dark:text-white font-bold">{h.prizePool}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Team: {h.teamSizeMin}-{h.teamSizeMax}</span>
                </div>
              </div>

              {/* Domains */}
              <div className="flex flex-wrap gap-1 pt-1">
                {h.domains.slice(0, 3).map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
              <button
                onClick={() => setSelectedHackathonForTeam(h)}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Build My Hackathon Team ✦</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery(h.title);
                    triggerNetworkPulse(2);
                    navigateTo('explore');
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Users className="w-3 h-3" />
                  <span>Browse Candidates</span>
                </button>

                <a
                  href={h.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Official Website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

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
