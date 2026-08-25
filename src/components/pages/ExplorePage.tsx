import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, LocationScope } from '../../types';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Globe,
  GraduationCap,
  Building2,
  Check,
  RefreshCw,
  Users,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { TeammateCard } from '../TeammateCard';
import { calculateMatch } from '../../utils/matchmaker';

const ROLE_OPTIONS: Array<RoleType | 'All'> = [
  'All',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'AI / ML Engineer',
  'UI/UX Designer',
  'Mobile Developer',
  'Product Manager',
  'DevOps / Cloud',
  'Smart Contract / Web3',
];

export const ExplorePage: React.FC = () => {
  const {
    students,
    currentUser,
    searchQuery,
    setSearchQuery,
    selectedLocationScope,
    setSelectedLocationScope,
    selectedRoleFilter,
    setSelectedRoleFilter,
    triggerNetworkPulse,
  } = useApp();

  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(50);
  const [minHackathons, setMinHackathons] = useState<number>(0);
  const [onlyOpenToTeam, setOnlyOpenToTeam] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'match' | 'distance' | 'hackathons' | 'hours'>('match');

  const handleScopeChange = (scope: LocationScope) => {
    setSelectedLocationScope(scope);
    triggerNetworkPulse(1.5);
  };

  const handleRoleChange = (role: RoleType | 'All') => {
    setSelectedRoleFilter(role);
    triggerNetworkPulse(1);
  };

  // Filter candidates
  const filteredStudents = students
    .filter((s) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.fullName.toLowerCase().includes(q);
        const matchCollege = s.college.toLowerCase().includes(q) || s.collegeShort.toLowerCase().includes(q);
        const matchCity = s.city ? s.city.toLowerCase().includes(q) : false;
        const matchSkills = s.skills.some((sk) => sk.name.toLowerCase().includes(q));
        const matchRoles = s.preferredRoles.some((r) => r.toLowerCase().includes(q));
        const matchInterests = s.interests.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchCollege && !matchCity && !matchSkills && !matchRoles && !matchInterests) {
          return false;
        }
      }

      // 2. Location Scope
      if (selectedLocationScope === 'college') {
        if (currentUser) {
          const isSame =
            s.college.toLowerCase() === currentUser.college.toLowerCase() ||
            s.collegeShort.toLowerCase() === currentUser.collegeShort.toLowerCase();
          if (!isSame) return false;
        }
      } else if (selectedLocationScope === 'nearby') {
        if (currentUser) {
          // Check distance
          const dist = s.distanceKm !== undefined ? s.distanceKm : 999;
          if (dist > nearbyRadiusKm) return false;
        }
      } else if (selectedLocationScope === 'country') {
        if (currentUser) {
          const matchCountry = s.countryCode === currentUser.countryCode || s.country === currentUser.country;
          if (!matchCountry) return false;
        }
      }

      // 3. Role filter
      if (selectedRoleFilter !== 'All') {
        if (!s.preferredRoles.includes(selectedRoleFilter)) {
          return false;
        }
      }

      // 4. Min Hackathons
      if (s.hackathonsCount < minHackathons) {
        return false;
      }

      // 5. Open to team
      if (onlyOpenToTeam && !s.openToTeam) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        if (!currentUser) return 0;
        const matchA = calculateMatch(currentUser, a).matchPercentage;
        const matchB = calculateMatch(currentUser, b).matchPercentage;
        return matchB - matchA;
      } else if (sortBy === 'distance') {
        const distA = a.distanceKm !== undefined ? a.distanceKm : 9999;
        const distB = b.distanceKm !== undefined ? b.distanceKm : 9999;
        return distA - distB;
      } else if (sortBy === 'hackathons') {
        return b.hackathonsCount - a.hackathonsCount;
      } else if (sortBy === 'hours') {
        return b.hoursPerWeek - a.hoursPerWeek;
      }
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60 mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Find Your Team ✦</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Your Hackathon Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find people who complement your skills — from your campus to anywhere in the world.
          </p>
        </div>

        {/* Location Scope Switcher (College, Nearby, Country, Global) */}
        <div className="flex flex-wrap bg-slate-100 dark:bg-[#131B2E] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start md:self-auto gap-1">
          <button
            onClick={() => handleScopeChange('college')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedLocationScope === 'college'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>My College ({currentUser?.collegeShort || 'SRM IST'})</span>
          </button>

          <button
            onClick={() => handleScopeChange('nearby')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedLocationScope === 'nearby'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Nearby Colleges</span>
          </button>

          <button
            onClick={() => handleScopeChange('country')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedLocationScope === 'country'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{currentUser?.countryFlag || '🇮🇳'}</span>
            <span>{currentUser?.country || 'India'}</span>
          </button>

          <button
            onClick={() => handleScopeChange('global')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedLocationScope === 'global'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global Builders</span>
          </button>
        </div>
      </div>

      {/* Sub-Radius Selector when Nearby is active */}
      {selectedLocationScope === 'nearby' && (
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200 font-semibold">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Showing colleges within {nearbyRadiusKm} km of {currentUser?.city || 'Kattankulathur'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Radius:</span>
            {([5, 25, 50, 100] as const).map((r) => (
              <button
                key={r}
                onClick={() => setNearbyRadiusKm(r)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  nearbyRadiusKm === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by skill, role, college or project (e.g. PyTorch, React, VIT, SRM, UI/UX)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              triggerNetworkPulse(0.5);
            }}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Role Pills Filter */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Filter by Primary Role:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ROLE_OPTIONS.map((role) => {
              const active = selectedRoleFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyOpenToTeam}
                onChange={(e) => setOnlyOpenToTeam(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Only actively seeking squads</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Min Hackathons:</span>
              <select
                value={minHackathons}
                onChange={(e) => setMinHackathons(Number(e.target.value))}
                className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200"
              >
                <option value={0}>Any Experience</option>
                <option value={3}>3+ Competitions</option>
                <option value={5}>5+ Competitions</option>
                <option value={8}>8+ Veteran Winner</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="match">✦ AI Synergy Match %</option>
                <option value="distance">📍 Geographic Proximity</option>
                <option value="hackathons">🏆 Hackathons Count</option>
                <option value="hours">🕐 Committed Hours/Wk</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Showing {filteredStudents.length} candidates</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRoleFilter('All');
                setSelectedLocationScope('global');
                setMinHackathons(0);
                setSortBy('match');
                triggerNetworkPulse(2);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teammate Grid */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white/60 dark:bg-[#131B2E]/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No candidates found matching your current filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRoleFilter('All');
              setSelectedLocationScope('global');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Clear Filters & Explore Global Builders
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <TeammateCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};
