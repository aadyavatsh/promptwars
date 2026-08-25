import React, { useState } from 'react';
import { Student } from '../types';
import { useApp } from '../context/AppContext';
import { calculateMatch } from '../utils/matchmaker';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Send,
  Users,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  Globe,
  Building2,
} from 'lucide-react';
import { WhyThisMatchModal } from './modals/WhyThisMatchModal';
import { ConnectModal } from './modals/ConnectModal';
import { InviteToTeamModal } from './modals/InviteToTeamModal';

interface TeammateCardProps {
  student: Student;
}

export const TeammateCard: React.FC<TeammateCardProps> = ({ student }) => {
  const {
    currentUser,
    navigateTo,
    savedTeammateIds,
    toggleSaveTeammate,
  } = useApp();

  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const isSaved = savedTeammateIds.includes(student.id);
  const match = currentUser ? calculateMatch(currentUser, student) : {
    matchPercentage: 92,
    roleSynergyScore: 90,
    skillSynergyScore: 94,
    interestSynergyScore: 92,
    availabilitySynergyScore: 90,
    experienceSynergyScore: 90,
    goalSynergyScore: 90,
    locationSynergyScore: 88,
    timezoneOverlapScore: 90,
    timezoneOverlapHours: 8,
    distanceKm: student.distanceKm || 0,
    locationTag: 'Campus',
    keyStrengths: ['High Role Complementarity', 'Strong Tech Stack Synergy'],
    recommendedTeamRoles: student.preferredRoles,
    reasoning: `${student.fullName} has a complementary technical background that accelerates product velocity.`,
    sharedInterests: student.interests.slice(0, 2),
    complementarySkills: student.skills.slice(0, 3).map((s) => s.name),
  };

  const isSameCollege =
    currentUser &&
    (currentUser.college.toLowerCase() === student.college.toLowerCase() ||
      currentUser.collegeShort.toLowerCase() === student.collegeShort.toLowerCase());

  const isNearby = !isSameCollege && (student.distanceKm !== undefined ? student.distanceKm <= 50 : false);

  return (
    <>
      <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
        {/* Top subtle synergy ribbon */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="space-y-3.5">
          {/* Header Row: Avatar, Name, College, Synergy Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className="relative cursor-pointer shrink-0"
                onClick={() => navigateTo('teammate-profile', student.id)}
              >
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform"
                />
                {student.isVerifiedStudent && (
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
                    title="Verified Student"
                  >
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div
                className="space-y-0.5 cursor-pointer min-w-0"
                onClick={() => navigateTo('teammate-profile', student.id)}
              >
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {student.fullName}
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {student.collegeShort} • {student.yearOfStudy.split(' ')[0]}
                </p>
                
                {/* Location Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {isSameCollege ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <Building2 className="w-3 h-3" />
                      <span>Same College</span>
                    </span>
                  ) : isNearby ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                      <MapPin className="w-3 h-3" />
                      <span>{student.distanceKm} km away</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                      <span>{student.countryFlag || '🌎'}</span>
                      <span>{student.country}</span>
                    </span>
                  )}

                  {match.timezoneOverlapHours && match.timezoneOverlapHours > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{match.timezoneOverlapHours}h overlap</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Synergy Match Score Badge */}
            <button
              onClick={() => setWhyModalOpen(true)}
              className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 flex flex-col items-center justify-center hover:scale-105 transition-transform shrink-0 cursor-pointer"
              title="Click for Match breakdown"
            >
              <div className="flex items-center gap-1 font-extrabold text-sm leading-none">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{match.matchPercentage}%</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 mt-0.5">
                Match
              </span>
            </button>
          </div>

          {/* Roles Pills */}
          <div className="flex flex-wrap gap-1.5">
            {student.preferredRoles.map((role) => (
              <span
                key={role}
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/60"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Short Bio */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {student.bio}
          </p>

          {/* Key Skills */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Tech Stack:
            </span>
            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 4).map((s) => (
                <span
                  key={s.name}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                >
                  {s.name}
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-400">
                  +{student.skills.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Hackathons experience & schedule tag */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{student.hackathonsCount} Hackathons</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{student.hoursPerWeek}h/wk committed</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-4 mt-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveTeammate(student.id)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bookmark candidate"
            >
              <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setInviteOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Invite to Squad"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setConnectOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Connect</span>
            </button>

            <button
              onClick={() => navigateTo('teammate-profile', student.id)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Profile</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {whyModalOpen && (
        <WhyThisMatchModal
          candidate={student}
          onClose={() => setWhyModalOpen(false)}
          onViewProfile={() => navigateTo('teammate-profile', student.id)}
        />
      )}

      {connectOpen && (
        <ConnectModal
          candidate={student}
          onClose={() => setConnectOpen(false)}
        />
      )}

      {inviteOpen && (
        <InviteToTeamModal
          candidate={student}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </>
  );
};
