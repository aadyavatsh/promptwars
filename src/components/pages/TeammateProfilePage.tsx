import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMatch } from '../../utils/matchmaker';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Send,
  Users,
  Award,
  Globe,
  Github,
  Linkedin,
  Clock,
  Star,
  Building2,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ConnectModal } from '../modals/ConnectModal';
import { InviteToTeamModal } from '../modals/InviteToTeamModal';
import { AICompatibilityModal } from '../modals/AICompatibilityModal';
import { GlobalTeamChemistryModal } from '../modals/GlobalTeamChemistryModal';

export const TeammateProfilePage: React.FC = () => {
  const {
    selectedTeammateId,
    students,
    currentUser,
    goBack,
    savedTeammateIds,
    toggleSaveTeammate,
  } = useApp();

  const [connectOpen, setConnectOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [chemistryOpen, setChemistryOpen] = useState(false);

  // Find candidate by selected ID or fallback to first student
  const candidate =
    students.find((s) => s.id === selectedTeammateId) || students[0];
  const isSaved = savedTeammateIds.includes(candidate.id);
  const match = currentUser ? calculateMatch(currentUser, candidate) : {
    matchPercentage: 92,
    roleSynergyScore: 90,
    skillSynergyScore: 94,
    interestSynergyScore: 92,
    availabilitySynergyScore: 90,
    experienceSynergyScore: 88,
    goalSynergyScore: 90,
    locationSynergyScore: 88,
    distanceKm: candidate.distanceKm,
    timezoneOverlapHours: candidate.timezoneOverlapHours || 6,
    keyStrengths: ['High Role Complementarity', 'Strong Tech Stack Synergy', 'Active Hackathon Competitor'],
    recommendedTeamRoles: candidate.preferredRoles,
    reasoning: `${candidate.fullName} has a complementary technical background that accelerates product velocity.`,
    sharedInterests: candidate.interests.slice(0, 2),
    complementarySkills: candidate.skills.slice(0, 3).map((s) => s.name),
  };

  const isSameCollege =
    currentUser &&
    (candidate.college.toLowerCase() === currentUser.college.toLowerCase() ||
      candidate.collegeShort.toLowerCase() === currentUser.collegeShort.toLowerCase());

  const isNearby = candidate.distanceKm !== undefined && candidate.distanceKm <= 50;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        id="profile-back-btn"
        onClick={() => goBack()}
        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to previous page</span>
      </button>

      {/* Main Profile Header Banner */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-md ring-4 ring-slate-50 dark:ring-slate-900"
              />
              {candidate.isVerifiedStudent && (
                <span
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
                  title="Verified University Student"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {candidate.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  {candidate.yearOfStudy}
                </span>

                {isSameCollege ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Building2 className="w-3 h-3" />
                    <span>Same College</span>
                  </span>
                ) : isNearby ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <MapPin className="w-3 h-3" />
                    <span>{candidate.distanceKm} km away</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <span>{candidate.countryFlag || '🌎'}</span>
                    <span>{candidate.country}</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {candidate.college} ({candidate.collegeShort}) • {candidate.degree}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{candidate.city || candidate.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{candidate.timezone} ({candidate.timezoneOverlapHours || 6}h Daily Overlap)</span>
                </span>
              </div>

              {/* Roles pills */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {candidate.preferredRoles.map((r) => (
                  <span
                    key={r}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/60"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => toggleSaveTeammate(candidate.id)}
              className={`p-3 rounded-2xl border transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Bookmark candidate"
            >
              <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="sm:hidden">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              id="invite-to-team-btn"
              onClick={() => setInviteOpen(true)}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Invite to Team</span>
            </button>

            <button
              id="send-connect-request-btn"
              onClick={() => setConnectOpen(true)}
              className="px-6 py-3 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Connection Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Match Compatibility Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>7-Factor AI Synergy Analysis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {match.matchPercentage}% Team Compatibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {match.reasoning}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAiModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-extrabold bg-white text-indigo-950 hover:bg-slate-100 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Synergy Breakdown</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => setChemistryOpen(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-300" />
              <span>Global Chemistry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Bio, Skills, Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / Bio */}
          <div className="bg-white dark:bg-[#131B2E] p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{candidate.bio}</p>
          </div>

          {/* Skills & Proficiencies */}
          <div className="bg-white dark:bg-[#131B2E] p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Skills & Proficiencies ({candidate.skills.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.skills.map((s) => {
                const isExpert = s.proficiency === 'Expert';
                const isAdvanced = s.proficiency === 'Advanced';
                const isInter = s.proficiency === 'Intermediate';

                return (
                  <div
                    key={s.name}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{s.category}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isExpert
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                          : isAdvanced
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : isInter
                          ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s.proficiency}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects Portfolio */}
          <div className="bg-white dark:bg-[#131B2E] p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Featured Projects & Portfolio
            </h3>

            <div className="space-y-4">
              {candidate.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {proj.role}
                      </span>
                    </div>
                    {proj.projectLink && (
                      <a
                        href={proj.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo / Code</span>
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Competition History, Interests, Availability */}
        <div className="space-y-6">
          {/* Hackathon Podium & Competitions */}
          <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Hackathon Experience
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
              <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-200">
                {candidate.hackathonsCount}
              </span>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 ml-2">Competitions Completed</span>
            </div>

            {candidate.hackathonHighlights && candidate.hackathonHighlights.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Podium Finishes:
                </span>
                {candidate.hackathonHighlights.map((hl, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2"
                  >
                    <span>🏆</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interests & Domains */}
          <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Domains & Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs font-medium px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Schedule */}
          <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Working Availability
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.availability.map((avail) => (
                <span
                  key={avail}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                >
                  ✓ {avail}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(candidate.githubUsername || candidate.linkedinUrl || candidate.portfolioUrl) && (
            <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Verified Links
              </h3>
              <div className="space-y-2">
                {candidate.githubUsername && (
                  <a
                    href={`https://github.com/${candidate.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Github className="w-4 h-4" />
                    <span>github.com/{candidate.githubUsername}</span>
                  </a>
                )}
                {candidate.linkedinUrl && (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {connectOpen && (
        <ConnectModal
          candidate={candidate}
          onClose={() => setConnectOpen(false)}
        />
      )}
      {inviteOpen && (
        <InviteToTeamModal
          candidate={candidate}
          onClose={() => setInviteOpen(false)}
        />
      )}
      {aiModalOpen && (
        <AICompatibilityModal
          candidate={candidate}
          onClose={() => setAiModalOpen(false)}
          onConnect={() => {
            setAiModalOpen(false);
            setConnectOpen(true);
          }}
        />
      )}
      {chemistryOpen && (
        <GlobalTeamChemistryModal
          students={currentUser ? [currentUser, candidate] : [candidate]}
          onClose={() => setChemistryOpen(false)}
        />
      )}
    </div>
  );
};
