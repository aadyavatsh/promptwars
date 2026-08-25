import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Clock,
  Trophy,
  Users,
  Rocket,
  Github,
  Globe,
  ThumbsUp,
  Award,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SubmitProjectModal } from '../modals/SubmitProjectModal';

export const SundayHackForgePage: React.FC = () => {
  const {
    sundayProjects,
    upvoteSundayProject,
    hackathons,
  } = useApp();

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const currentSprint = hackathons.find((h) => h.isSundayForge) || hackathons[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Hero Sprint Arena Header */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-indigo-950 text-white shadow-xl overflow-hidden border border-amber-400/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              <span>Sprint #24 • 12-Hour Build Sprint Arena</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sunday HackForge ⚡
            </h1>

            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-medium">
              Every Sunday, student engineers and designers ship an end-to-end working software prototype in 12 hours. Compete for builder grants, community votes, and hackathon squad glory.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-amber-100">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>$4,000 Cash Grant Pool</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-300" />
                <span>{currentSprint.participantsCount} Registered Builders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>09:00 UTC – 21:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Action CTA & Timer Box */}
          <div className="bg-slate-950/60 backdrop-blur-md border border-white/20 p-5 rounded-3xl space-y-3 shrink-0 text-center w-full lg:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              Sprint Time Remaining
            </span>
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black font-mono text-white">
              <span className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10">07</span>
              <span>:</span>
              <span className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10">42</span>
              <span>:</span>
              <span className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10">18</span>
            </div>
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="w-full py-3 px-6 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              <span>Submit Sprint Prototype</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules & Theme Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-bold">This Week's Theme</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            <strong>"Autonomous Campus Systems":</strong> Build smart AI agents, classroom automation, degree planning graphs, or campus peer services.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold">Sprint Verification</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            All code commits must be pushed between 09:00 and 21:00 UTC. Every project must include a live demo link and public GitHub repository.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-5 h-5" />
            <h3 className="text-sm font-bold">Grants & Recognition</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            1st Place: $2,000 Grant • 2nd Place: $1,200 Grant • 3rd Place: $800 Grant + Fast-track spotlight to collegiate hackathon judges.
          </p>
        </div>
      </div>

      {/* Submitted Projects Leaderboard & Showcase */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Sprint Submissions ({sundayProjects.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Community voting is open. Test live demos and upvote the most impressive 12-hour prototypes.
            </p>
          </div>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2 shadow-sm"
          >
            <Rocket className="w-4 h-4" />
            <span>Submit Your Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sundayProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all group"
            >
              <div className="space-y-3">
                {/* Header: Project Name & Upvote Button */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      by {project.teamName}
                    </p>
                  </div>

                  <button
                    onClick={() => upvoteSundayProject(project.id)}
                    className="p-2 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-center gap-1.5 hover:scale-105 transition-transform"
                    title="Upvote Project"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-black">{project.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  "{project.tagline}"
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & External Links */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={project.author.avatar}
                    alt={project.author.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold text-slate-900 dark:text-white">{project.author.name}</p>
                    <p className="text-slate-400">{project.author.college}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      title="Live Demo Link"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {submitModalOpen && (
        <SubmitProjectModal onClose={() => setSubmitModalOpen(false)} />
      )}
    </div>
  );
};
