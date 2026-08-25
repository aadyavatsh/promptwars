import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Globe,
  Users,
  Send,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { Hackathon, Student, RoleType } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateHackathonTeam } from '../../utils/matchmaker';
import { GlobalTeamChemistryModal } from './GlobalTeamChemistryModal';

interface HackathonTeamBuilderModalProps {
  hackathon: Hackathon;
  onClose: () => void;
}

export const HackathonTeamBuilderModal: React.FC<HackathonTeamBuilderModalProps> = ({
  hackathon,
  onClose,
}) => {
  const { currentUser, students, showToast, triggerNetworkPulse, navigateTo } = useApp();
  const [teamSize, setTeamSize] = useState<number>(4);
  const [chemistryOpen, setChemistryOpen] = useState(false);

  const teamResult = currentUser
    ? generateHackathonTeam(students, currentUser, hackathon, teamSize)
    : {
        selectedSquad: [] as Student[],
        squadSynergy: 90,
        roleAssignments: {} as Record<string, RoleType>,
        identifiedGaps: [] as string[],
        teamReadinessScore: 88,
        formatNote: '',
      };

  const squad = teamResult.selectedSquad;
  const teammates = squad.filter((s) => s.id !== currentUser?.id);
  const isOffline = hackathon.format === 'Offline';

  const handleInviteAll = () => {
    triggerNetworkPulse(3);
    showToast(`Squad invites dispatched to ${teammates.length} builders for ${hackathon.title}! 🚀`, 'success');
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Header */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {hackathon.format} • {hackathon.reach}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{hackathon.prizePool}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Build My Hackathon Team ✦
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hackathon.title} — {hackathon.location}
              </p>
            </div>
          </div>

          {/* Location & Matching Strategy Card */}
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isOffline
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5 mb-1">
              {isOffline ? <Building2 className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              <span>{isOffline ? 'Offline Campus Strategy Active' : 'Global Synergy Strategy Active'}</span>
            </div>
            <p>
              {isOffline
                ? `Prioritizing verified builders from your college (${currentUser?.collegeShort || 'SRM IST'}) and neighboring colleges (<50km) for direct in-person collaboration at the venue.`
                : `Prioritizing maximum skill complementarity, multi-agent AI domain mastery, and synchronized timezone overlap across international builders.`}
            </p>
          </div>

          {/* Team Size Selector & Synergy score */}
          <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Target Squad Size:</span>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTeamSize(size)}
                    className={`px-3 py-1 rounded-xl font-extrabold transition-all cursor-pointer ${
                      teamSize === size
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {size} Members
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-extrabold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Squad Synergy: {teamResult.squadSynergy}%</span>
            </div>
          </div>

          {/* Squad Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Squad Lineup ({squad.length} / {teamSize})
              </h4>
              <button
                onClick={() => setChemistryOpen(true)}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Inspect Chemistry Breakdown</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Current User Card */}
              {currentUser && (
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {currentUser.fullName}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                          You (Lead)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {teamResult.roleAssignments[currentUser.id] || currentUser.preferredRoles[0]} • {currentUser.collegeShort}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Primary Architect</span>
                  </div>
                </div>
              )}

              {/* Recommended Teammates */}
              {teammates.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatarUrl}
                      alt={s.fullName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {s.fullName}
                        </span>
                        {s.collegeShort === currentUser?.collegeShort ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Same College
                          </span>
                        ) : s.distanceKm !== undefined && s.distanceKm <= 50 ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {s.distanceKm} km away
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {s.countryFlag || '🌎'} {s.country}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {teamResult.roleAssignments[s.id] || s.preferredRoles[0]} • {s.collegeShort} • {s.skills[0]?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3" />
                      <span>{94 - idx * 2}% Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {s.hackathonsCount} Hackathons
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleInviteAll}
              className="flex-1 py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Squad Invitations ({teammates.length})</span>
            </button>
          </div>
        </div>
      </div>

      {chemistryOpen && (
        <GlobalTeamChemistryModal
          students={squad}
          onClose={() => setChemistryOpen(false)}
        />
      )}
    </>
  );
};
