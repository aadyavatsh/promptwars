import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, Student } from '../../types';
import {
  Sparkles,
  Brain,
  Zap,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Award,
  Star,
  Send,
} from 'lucide-react';
import { ConnectModal } from '../modals/ConnectModal';
import { InviteToTeamModal } from '../modals/InviteToTeamModal';

interface GeneratedSquadSlot {
  role: RoleType;
  primarySkills: string[];
  candidate: Student;
  synergyReason: string;
}

export const AIMatchmakerPage: React.FC = () => {
  const { students, currentUser, triggerNetworkPulse, showToast, navigateTo } = useApp();
  const [projectIdea, setProjectIdea] = useState(
    'Autonomous multi-agent research assistant for college students that parses syllabi and generates interactive study mockups.'
  );
  const [teamSize, setTeamSize] = useState<number>(4);
  const [selectedHackathon, setSelectedHackathon] = useState('Sunday HackForge #24');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSquad, setGeneratedSquad] = useState<GeneratedSquadSlot[] | null>(null);

  const [selectedConnectCandidate, setSelectedConnectCandidate] = useState<Student | null>(null);

  const PRESETS = [
    {
      title: 'Autonomous Campus AI Agent',
      desc: 'Autonomous multi-agent research assistant that parses course syllabi and automates schedule balancing.',
      skills: 'Python, Gemini API, FastAPI, React',
    },
    {
      title: 'Live Multiplayer Canvas',
      desc: 'Ultra-low latency infinite collaborative whiteboard for system design interviews and design sprints.',
      skills: 'WebSockets, Rust, Canvas API, TypeScript',
    },
    {
      title: 'Decentralized Micro-Grants',
      desc: 'Smart contract protocol enabling alumni to fund student hackathon prototypes with automated milestone payouts.',
      skills: 'Solidity, Next.js, Wagmi, Tailwind',
    },
  ];

  const handleGenerateSquad = () => {
    setIsGenerating(true);
    triggerNetworkPulse(2.5);

    setTimeout(() => {
      // Pick complementary candidates
      const aiDev = students.find((s) => s.preferredRoles.includes('AI / ML Engineer')) || students[1];
      const designer = students.find((s) => s.preferredRoles.includes('UI/UX Designer')) || students[2];
      const backend = students.find((s) => s.preferredRoles.includes('Backend Engineer')) || students[3];
      const frontend = students.find((s) => s.preferredRoles.includes('Frontend Engineer')) || students[0];

      const slots: GeneratedSquadSlot[] = [
        {
          role: 'AI / ML Engineer',
          primarySkills: ['PyTorch', 'Gemini API', 'Vector Search'],
          candidate: aiDev,
          synergyReason: 'Deep expertise in LLM pipeline orchestration and multi-agent reasoning.',
        },
        {
          role: 'UI/UX Designer',
          primarySkills: ['Figma', 'React', 'Motion / Micro-Interactions'],
          candidate: designer,
          synergyReason: 'High visual craft and swift prototyping velocity for hackathon presentation polish.',
        },
        {
          role: 'Backend Engineer',
          primarySkills: ['Go', 'PostgreSQL', 'FastAPI'],
          candidate: backend,
          synergyReason: 'Ensures robust data pipelines and low-latency API proxying under high load.',
        },
      ];

      if (teamSize >= 4) {
        slots.push({
          role: 'Full Stack Engineer',
          primarySkills: ['TypeScript', 'Cloud Infra', 'Product Velocity'],
          candidate: currentUser || frontend,
          synergyReason: 'Bridges interface with backend endpoints and leads sprint milestone delivery.',
        });
      }

      setGeneratedSquad(slots);
      setIsGenerating(false);
      showToast('Optimal dream squad synthesized with 96% multi-vector synergy! ✦', 'success');
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/60">
          <Brain className="w-3.5 h-3.5" />
          <span>Autonomous AI Squad Synthesizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Team Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Enter your hackathon concept. Our multi-agent matching engine analyzes role balance, tech stacks, timezone overlap, and victory track records to assemble your optimal dream team.
        </p>
      </div>

      {/* Configuration Box */}
      <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Project Idea Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Project Concept / Hackathon Track Pitch:
          </label>
          <textarea
            rows={3}
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            placeholder="Describe what you plan to build, target hackathon tracks, and key technical requirements..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white leading-relaxed"
          />
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Or Pick a Hackathon Archetype:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setProjectIdea(p.desc)}
                className="p-3 text-left rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-purple-500/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</span>
                  <Sparkles className="w-3 h-3 text-purple-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Controls Row: Team Size, Target Hackathon & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-400">Squad Size:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {[2, 3, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTeamSize(size)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      teamSize === size
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {size} Builders
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-400">Target Hackathon:</span>
              <select
                value={selectedHackathon}
                onChange={(e) => setSelectedHackathon(e.target.value)}
                className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="Sunday HackForge #24">Sunday HackForge #24 (12h)</option>
                <option value="CalHacks 11.0">CalHacks 11.0</option>
                <option value="Hack The North 2026">Hack The North 2026</option>
                <option value="MIT Blueprint 2026">MIT Blueprint 2026</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateSquad}
            disabled={isGenerating}
            className="px-6 py-3.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Multi-Vector Synergy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Dream Squad ✦</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Squad Constellation / Results */}
      {generatedSquad && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Synergy Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-purple-400">96%</span>
                <h3 className="text-lg font-bold">Optimal Squad Balance Synthesized</h3>
              </div>
              <p className="text-xs text-slate-300">
                Zero critical skill gaps detected. Role coverage spans Machine Learning, Product Design, Distributed Systems, and Front-end Architecture.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast('Invitations sent to all synthesized squad members! 🚀', 'success');
                  triggerNetworkPulse(2);
                }}
                className="px-5 py-3 rounded-2xl text-xs font-extrabold bg-white text-purple-950 hover:bg-slate-100 transition-all shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-purple-600" />
                <span>Invite All {generatedSquad.length} to Squad</span>
              </button>
            </div>
          </div>

          {/* Squad Member Slot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {generatedSquad.map((slot, index) => (
              <div
                key={index}
                className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Slot #{index + 1} • {slot.role.split(' ')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      95%+ Fit
                    </span>
                  </div>

                  {/* Candidate Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={slot.candidate.avatarUrl}
                      alt={slot.candidate.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {slot.candidate.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {slot.candidate.collegeShort}
                      </p>
                    </div>
                  </div>

                  {/* Role and Synergy Reason */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {slot.synergyReason}
                  </div>

                  {/* Key Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {slot.primarySkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedConnectCandidate(slot.candidate)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1 shadow-xs transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Connect</span>
                  </button>
                  <button
                    onClick={() => navigateTo('teammate-profile', slot.candidate.id)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedConnectCandidate && (
        <ConnectModal
          candidate={selectedConnectCandidate}
          onClose={() => setSelectedConnectCandidate(null)}
        />
      )}
    </div>
  );
};
