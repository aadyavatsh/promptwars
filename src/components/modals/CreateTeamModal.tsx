import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';
import { X, Users, Sparkles, Plus, Check } from 'lucide-react';

interface CreateTeamModalProps {
  onClose: () => void;
}

const AVAILABLE_ROLES: RoleType[] = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'AI / ML Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Product Manager',
  'DevOps / Cloud',
  'Smart Contract / Web3',
  'Data Scientist',
];

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose }) => {
  const { currentUser, createTeam, hackathons } = useApp();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [targetHackathon, setTargetHackathon] = useState(hackathons[0]?.title || 'Sunday HackForge #24');
  const [targetRolesNeeded, setTargetRolesNeeded] = useState<RoleType[]>([
    'UI/UX Designer',
    'Backend Engineer',
  ]);
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('React, FastAPI, PyTorch, Figma');

  const toggleRole = (role: RoleType) => {
    if (targetRolesNeeded.includes(role)) {
      setTargetRolesNeeded((prev) => prev.filter((r) => r !== role));
    } else {
      setTargetRolesNeeded((prev) => [...prev, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !currentUser) return;

    createTeam({
      name,
      tagline: tagline || `Building ${name} for ${targetHackathon}`,
      description: description || tagline,
      projectIdea,
      targetHackathon,
      members: [
        {
          student: currentUser,
          role: currentUser.preferredRoles[0] || 'Full Stack Engineer',
          joinedAt: new Date().toISOString().split('T')[0],
          isLeader: true,
        },
      ],
      targetRolesNeeded,
      requiredSkills: requiredSkillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      readinessScore: 78,
      skillGaps: ['Low-latency streaming architecture'],
      status: 'recruiting',
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
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
            <h3 className="text-xl font-bold">Create New Hackathon Squad</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Assemble your dream team and specify the exact skills you need
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Squad Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Agents Lab"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Tagline / Mission Pitch
            </label>
            <input
              type="text"
              placeholder="e.g. Building autonomous campus scheduling agents for CalHacks"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Hackathon
            </label>
            <select
              value={targetHackathon}
              onChange={(e) => setTargetHackathon(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {hackathons.map((h) => (
                <option key={h.id} value={h.title}>
                  {h.title} ({h.format})
                </option>
              ))}
              <option value="Independent Project Sprint">Independent Project Sprint</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Open Roles Needed in Squad
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_ROLES.map((r) => {
                const active = targetRolesNeeded.includes(r);
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => toggleRole(r)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 text-[11px] ${
                      active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={requiredSkillsInput}
              onChange={(e) => setRequiredSkillsInput(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Squad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
