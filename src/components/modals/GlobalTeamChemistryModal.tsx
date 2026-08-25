import React from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Globe,
  Clock,
  Zap,
  CheckCircle2,
  Users,
  Code2,
  Layers,
  MapPin,
} from 'lucide-react';
import { Student } from '../../types';

interface GlobalTeamChemistryModalProps {
  students: Student[];
  onClose: () => void;
}

export const GlobalTeamChemistryModal: React.FC<GlobalTeamChemistryModalProps> = ({
  students,
  onClose,
}) => {
  const avgOverlapHours = Math.round(
    students.reduce((acc, s) => acc + (s.timezoneOverlapHours || 6), 0) / (students.length || 1)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Global Team Chemistry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-border synchronization and timezone overlap breakdown
            </p>
          </div>
        </div>

        {/* Big Overlap Highlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Daily Synchronous Overlap
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {avgOverlapHours} Hours Shared Daily
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your squad shares {avgOverlapHours} hours of overlapping waking sprint time every single day.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-600 text-white font-extrabold text-lg shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Breakdown Synergy Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Multi-Vector Team Chemistry
          </h4>

          <div className="space-y-2.5 text-xs">
            {/* Skills Synergy */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Skills Complementarity</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400">94%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* Availability Overlap */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Availability Overlap</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">88%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* Timezone Compatibility */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-500" />
                  <span>Timezone Overlap</span>
                </span>
                <span className="text-purple-600 dark:text-purple-400">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            {/* Communication Balance */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Communication Balance</span>
                </span>
                <span className="text-amber-600 dark:text-amber-400">90%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Roster Locations */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Squad Geographic Hubs
          </h4>
          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={s.avatarUrl}
                    alt={s.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{s.fullName}</div>
                    <div className="text-[10px] text-slate-500">
                      {s.collegeShort} • {s.city || s.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
                    <span>{s.countryFlag || '🌎'}</span>
                    <span>{s.timezone}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {s.hoursPerWeek}h/wk committed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs transition-all cursor-pointer shadow-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
};
