import React, { useState } from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Send, Sparkles, ShieldCheck } from 'lucide-react';

interface ConnectModalProps {
  candidate: Student;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ candidate, onClose }) => {
  const { sendConnectionRequest, currentUser } = useApp();
  const [message, setMessage] = useState(
    `Hey ${candidate.fullName.split(' ')[0]}! I saw your profile and impressive project experience in ${candidate.skills.slice(0, 2).map((s) => s.name).join(' & ')}. I'd love to connect for upcoming hackathons and sprints!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendConnectionRequest(candidate.id, message);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
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

        <div className="flex items-center gap-4">
          <img
            src={candidate.avatarUrl}
            alt={candidate.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold">{candidate.fullName}</h3>
              {candidate.isVerifiedStudent && (
                <ShieldCheck className="w-4 h-4 text-blue-500" title="Verified University Student" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {candidate.college} • {candidate.preferredRoles[0]}
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            Connect requests allow direct chat, private calendar schedule sharing, and 1-click squad invites.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Personal Note / Introduction
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs font-medium p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
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
              <Send className="w-3.5 h-3.5" />
              <span>Send Connection Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
