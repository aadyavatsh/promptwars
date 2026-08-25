import React from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateMatch } from '../../utils/matchmaker';
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';

interface WhyThisMatchModalProps {
  candidate: Student;
  onClose: () => void;
  onViewProfile?: () => void;
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  candidate,
  onClose,
  onViewProfile,
}) => {
  const { currentUser } = useApp();
  const match = currentUser ? calculateMatch(currentUser, candidate) : {
    matchPercentage: 94,
    roleSynergyScore: 92,
    skillSynergyScore: 96,
    interestSynergyScore: 90,
    availabilitySynergyScore: 92,
    locationSynergyScore: 90,
    keyStrengths: ['High Role Complementarity', 'Strong Tech Stack Synergy', 'Active Hackathon Competitor'],
    recommendedTeamRoles: candidate.preferredRoles,
    reasoning: `${candidate.fullName} has a complementary technical background that accelerates product velocity.`,
    sharedInterests: candidate.interests.slice(0, 2),
    complementarySkills: candidate.skills.slice(0, 4).map((s) => s.name),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Why this Match?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Multi-vector synergy factors calculated for {candidate.fullName}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-indigo-700 dark:text-indigo-400 tracking-wider">
              Synergy Factor Score
            </span>
            <div className="text-3xl font-extrabold text-indigo-950 dark:text-white">
              {match.matchPercentage}%
            </div>
          </div>
          <div className="flex -space-x-2">
            <img
              src={currentUser?.avatarUrl}
              alt="You"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
            />
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
            />
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Role Balance:</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Your role ({currentUser?.preferredRoles[0] || 'Engineer'}) pairs smoothly with {candidate.fullName}'s primary expertise in {candidate.preferredRoles.join(', ')}.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Tech Stack Complementarity:</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Adds high-demand proficiencies: {match.complementarySkills.slice(0, 3).join(', ')}.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Track Record & Podiums:</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Competed in {candidate.hackathonsCount} hackathons with verified wins in collegiate tracks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          {onViewProfile && (
            <button
              onClick={() => {
                onClose();
                onViewProfile();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
