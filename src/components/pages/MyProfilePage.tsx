import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';
import {
  User,
  ShieldCheck,
  Award,
  Clock,
  Github,
  Linkedin,
  Globe,
  Plus,
  Save,
  Trash2,
  Sparkles,
  MapPin,
  Building2,
  Eye,
  Sliders,
  Calendar,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { MOCK_USER_HACKATHONS } from '../../data/mockData';

export const MyProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast, triggerNetworkPulse } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'hackathons'>('profile');

  // Profile Form States
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [hoursPerWeek, setHoursPerWeek] = useState(currentUser?.hoursPerWeek || 22);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  // Privacy & Location Settings States
  const [visibility, setVisibility] = useState<'college_only' | 'city_college' | 'country_only' | 'hidden'>(
    currentUser?.locationPreference?.visibility || 'city_college'
  );
  const [preferLocalOffline, setPreferLocalOffline] = useState(
    currentUser?.locationPreference?.preferLocalOffline ?? true
  );
  const [openGlobalOnline, setOpenGlobalOnline] = useState(
    currentUser?.locationPreference?.openGlobalOnline ?? true
  );
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(
    currentUser?.locationPreference?.nearbyRadiusKm || 25
  );

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      bio,
      hoursPerWeek: Number(hoursPerWeek),
      locationPreference: {
        ...currentUser.locationPreference,
        visibility,
        preferLocalOffline,
        openGlobalOnline,
        nearbyRadiusKm,
        scopes: ['same_college', 'nearby_colleges', 'country', 'global'],
      },
    });
    triggerNetworkPulse(1.5);
    showToast('Profile & Location Privacy updated successfully! 🚀', 'success');
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    updateCurrentUser({
      skills: [
        ...currentUser.skills,
        {
          name: newSkillName.trim(),
          category: newSkillCategory,
          proficiency: newSkillProficiency,
        },
      ],
    });
    setNewSkillName('');
    showToast(`Added ${newSkillName} to verified skills!`, 'success');
  };

  const handleRemoveSkill = (skillName: string) => {
    updateCurrentUser({
      skills: currentUser.skills.filter((s) => s.name !== skillName),
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Profile Card */}
      <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-md ring-4 ring-blue-50 dark:ring-blue-950/40"
            />
            {currentUser.isVerifiedStudent && (
              <span
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs"
                title="Verified University Student"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentUser.fullName}
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {currentUser.college} ({currentUser.collegeShort}) • {currentUser.yearOfStudy}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{currentUser.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <span>{currentUser.countryFlag}</span>
                <span>{currentUser.timezone}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{currentUser.hackathonsCount} Hackathons Completed</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Clock className="w-4 h-4" />
            <span>{currentUser.hoursPerWeek} hrs/week committed</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Builder Profile & Skills
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Location & Privacy Controls
        </button>
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hackathons'
              ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          My Hackathons ({MOCK_USER_HACKATHONS.length})
        </button>
      </div>

      {/* TAB 1: Profile & Skills */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Builder Bio & Technical Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Weekly Available Hackathon Hours
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Campus Location (SRM Tech Park)
              </label>
              <input
                type="text"
                defaultValue={currentUser.location}
                disabled
                className="w-full p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-500"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Verified Technical Skills ({currentUser.skills.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200/80 dark:border-slate-700"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">({s.proficiency})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.name)}
                    className="p-0.5 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Gemini 2.5 Pro, Rust, Next.js"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 min-w-[160px] p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
              />
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Location & Privacy Controls */}
      {activeTab === 'privacy' && (
        <form onSubmit={handleSaveProfile} className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Location Privacy & Discovery Controls
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Control how other students discover your campus proximity and geographic timezone.
            </p>
          </div>

          {/* Visibility Options */}
          <div className="space-y-3">
            <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Location Visibility on Your Profile:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'city_college',
                  title: 'Show City + College (Recommended)',
                  desc: `Displays "${currentUser.city}, ${currentUser.collegeShort}" on your teammate card.`,
                },
                {
                  id: 'college_only',
                  title: 'Show My College Only',
                  desc: `Displays only "${currentUser.collegeShort}" without city/state details.`,
                },
                {
                  id: 'country_only',
                  title: 'Show Country Only',
                  desc: `Displays "${currentUser.countryFlag} ${currentUser.country}" for general timezone context.`,
                },
                {
                  id: 'hidden',
                  title: 'Hide Location Scope',
                  desc: 'Match only on technical stack and role complementarity without geography.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    visibility === opt.id
                      ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.id}
                    checked={visibility === opt.id}
                    onChange={() => setVisibility(opt.id as any)}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{opt.title}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Event Preferences */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Competition Matching Preferences:
            </span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={preferLocalOffline}
                  onChange={(e) => setPreferLocalOffline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Prefer local teammates from SRM and Chennai for offline / in-person hackathons</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={openGlobalOnline}
                  onChange={(e) => setOpenGlobalOnline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Open to international builders for online competitions & Sunday sprints</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Privacy Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: My Hackathons */}
      {activeTab === 'hackathons' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                My Hackathon Participation & History
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Track your active squads, registered competitions, and previous podium placements.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_USER_HACKATHONS.map((item) => (
              <div
                key={item.hackathonId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.hackathon.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'registered'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'upcoming'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.hackathon.format} • {item.hackathon.reach}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-semibold mt-1">
                      Squad: <span className="text-slate-900 dark:text-white font-bold">{item.teamName}</span> ({item.role})
                    </div>

                    {item.result && (
                      <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.result}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={item.hackathon.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100"
                  >
                    <span>Event Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
