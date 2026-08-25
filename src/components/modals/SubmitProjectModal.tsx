import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Rocket, Github, Globe, Video, Sparkles } from 'lucide-react';

interface SubmitProjectModalProps {
  onClose: () => void;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ onClose }) => {
  const { currentUser, submitSundayProject } = useApp();
  const [projectName, setProjectName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, Gemini API, Tailwind');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !repoUrl) return;

    submitSundayProject({
      projectName,
      teamName: teamName || 'Solo Builder',
      tagline: tagline || 'Built during Sunday HackForge #24',
      description,
      repoUrl,
      demoUrl: demoUrl || 'https://demo.teamforge.io',
      videoUrl: videoUrl || undefined,
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      author: {
        name: currentUser?.fullName || 'Anonymous Builder',
        avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        college: currentUser?.college || 'Student Builder',
      },
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
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-md">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Submit Sunday HackForge Project</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Publish your 12-hour sprint prototype to the community leaderboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Nexus Campus Agent"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Agents (or Solo)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              One-Line Elevator Pitch
            </label>
            <input
              type="text"
              placeholder="Autonomous degree audit and syllabus scraper powered by Gemini"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description & Architecture
            </label>
            <textarea
              rows={3}
              placeholder="What does it do? How did you build it in 12 hours? What APIs did you integrate?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository *</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Demo URL</span>
              </label>
              <input
                type="url"
                placeholder="https://your-demo.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Loom / YouTube Demo Video (Optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
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
              className="px-6 py-2.5 rounded-xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit & Publish to Leaderboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
