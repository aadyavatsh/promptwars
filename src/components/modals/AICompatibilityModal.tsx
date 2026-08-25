import React from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateMatch } from '../../utils/matchmaker';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Send,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';

interface AICompatibilityModalProps {
  candidate: Student;
  onClose: () => void;
  onConnect?: () => void;
}

export const AICompatibilityModal: React.FC<AICompatibilityModalProps> = ({
  candidate,
  onClose,
  onConnect,
}) => {
  const { currentUser } = useApp();
  const match = currentUser ? calculateMatch(currentUser, candidate) : {
    matchPercentage: 92,
    roleSynergyScore: 90,
    skillSynergyScore: 94,
    interestSynergyScore: 92,
    availabilitySynergyScore: 90,
    locationSynergyScore: 88,
    keyStrengths: ['High Role Complementarity', 'Strong Tech Stack Synergy', 'Active Hackathon Competitor'],
    recommendedTeamRoles: candidate.preferredRoles,
    reasoning: `${candidate.fullName} has a complementary technical background that accelerates product velocity.`,
    sharedInterests: candidate.interests.slice(0, 2),
    complementarySkills: candidate.skills.slice(0, 4).map((s) => s.name),
  };

  const metrics = [
    { label: 'Role Balance & Complementarity', score: match.roleSynergyScore, icon: Layers, color: 'from-blue-500 to-indigo-500' },
    { label: 'Technical Stack Synergy', score: match.skillSynergyScore, icon: Zap, color: 'from-purple-500 to-pink-500' },
    { label: 'Domain & Hackathon Interests', score: match.interestSynergyScore, icon: Brain, color: 'from-amber-500 to-orange-500' },
    { label: 'Schedule & Sprint Availability', score: match.availabilitySynergyScore, icon: Clock, color: 'from-emerald-500 to-teal-500' },
    { label: 'Campus & Location Proximity', score: match.locationSynergyScore, icon: MapPin, color: 'from-sky-500 to-blue-500' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
            />
            {candidate.isVerifiedStudent && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full text-white">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles className="w-3 h-3" />
              <span>Living Network Synergy Diagnostic</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {match.matchPercentage}% Compatibility Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pairing analysis between you and {candidate.fullName} ({candidate.collegeShort})
            </p>
          </div>
        </div>

        {/* AI Synthesis Reasoning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-100 dark:border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Synergy Synthesis</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {match.reasoning}
          </p>
        </div>

        {/* Vector Score Breakdown Bars */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Multi-Vector Metric Alignment
          </h3>
          <div className="space-y-3">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.label}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{m.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Strengths & Tech Complementarity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Key Strengths</span>
            </h4>
            <ul className="space-y-1">
              {match.keyStrengths.map((ks, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{ks}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-500" />
              <span>Complementary Skills Added</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {match.complementarySkills.map((cs) => (
                <span
                  key={cs}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300"
                >
                  +{cs}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          {onConnect && (
            <button
              onClick={onConnect}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Connection Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
