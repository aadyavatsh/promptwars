import React, { useState } from 'react';
import { Student, RoleType } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Users, Sparkles, Plus } from 'lucide-react';

interface InviteToTeamModalProps {
  candidate: Student;
  onClose: () => void;
}

export const InviteToTeamModal: React.FC<InviteToTeamModalProps> = ({ candidate, onClose }) => {
  const { teams, sendTeamInvite, navigateTo } = useApp();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [assignedRole, setAssignedRole] = useState<RoleType>(candidate.preferredRoles[0] || 'Frontend Engineer');
  const [message, setMessage] = useState(
    `We'd love to have you on our squad as a ${candidate.preferredRoles[0] || 'core developer'}! Your skills are an ideal fit for our project roadmap.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    sendTeamInvite(selectedTeamId, candidate.id, assignedRole, message);
    onClose();
  };

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Invite {candidate.fullName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Select one of your squads to extend an official invitation
            </p>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven't created any teams yet. Create a squad first to invite members.
            </p>
            <button
              onClick={() => {
                onClose();
                navigateTo('teams');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create a Team</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Target Team Squad
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full text-xs font-medium p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.members.length} members • {t.targetHackathon || 'Open Sprint'})
                  </option>
                ))}
              </select>
            </div>

            {selectedTeam && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{selectedTeam.tagline}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Roles needed:</span>
                  {selectedTeam.targetRolesNeeded.map((r) => (
                    <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Designated Squad Role
              </label>
              <select
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value as RoleType)}
                className="w-full text-xs font-medium p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              >
                {candidate.preferredRoles.map((r) => (
                  <option key={r} value={r}>
                    {r} (Candidate Preferred)
                  </option>
                ))}
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="DevOps / Cloud">DevOps / Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Personalized Invite Note
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs font-medium p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Squad Invitation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
