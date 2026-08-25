import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Team } from '../../types';
import {
  Users,
  Plus,
  Sparkles,
  ShieldCheck,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  Trash2,
} from 'lucide-react';
import { CreateTeamModal } from '../modals/CreateTeamModal';

export const TeamsPage: React.FC = () => {
  const { teams, currentUser, students, navigateTo } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Squad Constellations & Readiness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Hackathon Squads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your project rosters, evaluate role balance, and plug identified skill gaps
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Squad</span>
        </button>
      </div>

      {/* Teams List */}
      <div className="space-y-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
          >
            {/* Squad Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{team.name}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {team.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {team.tagline} • Target: <span className="font-bold text-blue-600 dark:text-blue-400">{team.targetHackathon}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Squad Readiness:</span>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {team.readinessScore}%
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('builder')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Optimize</span>
                </button>
              </div>
            </div>

            {/* Roster Constellation Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Squad Members ({team.members.length} / 4)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {team.members.map((member) => (
                  <div
                    key={member.student.id}
                    onClick={() => navigateTo('teammate-profile', member.student.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-3 cursor-pointer hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.student.avatarUrl}
                        alt={member.student.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {member.student.fullName}
                          </h4>
                          {member.isLeader && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              LEAD
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {member.student.collegeShort}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Open Slots */}
                {team.targetRolesNeeded.map((openRole, i) => (
                  <div
                    key={i}
                    onClick={() => navigateTo('explore')}
                    className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Open Slot #{team.members.length + i + 1}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                        Recruit {openRole}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Skill Gaps and Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Identified Squad Skill Gaps:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-amber-900/90 dark:text-amber-200/90 font-medium">
                  {team.skillGaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Target Squad Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1">
                  {team.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {createModalOpen && <CreateTeamModal onClose={() => setCreateModalOpen(false)} />}
    </div>
  );
};
