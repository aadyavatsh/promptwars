/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp, AppPage } from './context/AppContext';
import { LivingNetwork } from './components/background/LivingNetwork';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ExplorePage } from './components/pages/ExplorePage';
import { TeammateProfilePage } from './components/pages/TeammateProfilePage';
import { AIMatchmakerPage } from './components/pages/AIMatchmakerPage';
import { SundayHackForgePage } from './components/pages/SundayHackForgePage';
import { DailyForgePage } from './components/pages/DailyForgePage';
import { HackathonsPage } from './components/pages/HackathonsPage';
import { TeamsPage } from './components/pages/TeamsPage';
import { MyProfilePage } from './components/pages/MyProfilePage';
import { InboxPage } from './components/pages/InboxPage';
import { AuthModal } from './components/modals/AuthModal';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, theme, pulseSignal, toast, showToast } = useApp();

  // Determine living network visual configuration based on active page
  const getNetworkConfig = (page: AppPage) => {
    switch (page) {
      case 'landing':
        return { variant: 'landing' as const, clusterMode: 'flow' as const, intensity: 'medium' as const };
      case 'explore':
        return { variant: 'find-teammates' as const, clusterMode: 'campus' as const, intensity: 'high' as const };
      case 'builder':
        return { variant: 'ai-team-builder' as const, clusterMode: 'project-hub' as const, intensity: 'high' as const };
      case 'sunday-forge':
        return { variant: 'sunday-hackforge' as const, clusterMode: 'constellation' as const, intensity: 'high' as const };
      case 'dashboard':
        return { variant: 'dashboard' as const, clusterMode: 'campus' as const, intensity: 'medium' as const };
      case 'teams':
        return { variant: 'team-profile' as const, clusterMode: 'constellation' as const, intensity: 'high' as const };
      case 'hackathons':
        return { variant: 'hackathon' as const, clusterMode: 'flow' as const, intensity: 'medium' as const };
      default:
        return { variant: 'minimal' as const, clusterMode: 'ambient' as const, intensity: 'low' as const };
    }
  };

  const networkConfig = getNetworkConfig(activePage);

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Living Network Interactive Background Canvas */}
      <LivingNetwork
        theme={theme}
        variant={networkConfig.variant}
        intensity={networkConfig.intensity}
        clusterMode={networkConfig.clusterMode}
        pulseSignal={pulseSignal}
        className="opacity-95"
      />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Routed Page Surface */}
      <main className="flex-1 relative z-10">
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'explore' && <ExplorePage />}
        {activePage === 'teammate-profile' && <TeammateProfilePage />}
        {activePage === 'builder' && <AIMatchmakerPage />}
        {activePage === 'sunday-forge' && <SundayHackForgePage />}
        {activePage === 'daily-forge' && <DailyForgePage />}
        {activePage === 'hackathons' && <HackathonsPage />}
        {activePage === 'teams' && <TeamsPage />}
        {activePage === 'profile' && <MyProfilePage />}
        {activePage === 'inbox' && <InboxPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">TeamForge AI</span>
            <span>• Living University Builder Network</span>
          </div>
          <p>© {new Date().getFullYear()} TeamForge. Connecting 2,400+ student developers across 180+ universities.</p>
        </div>
      </footer>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-xs font-bold max-w-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-red-950/90 text-red-100 border-red-500/40 shadow-red-950/50'
                : 'bg-slate-900/90 text-white border-slate-700/60 shadow-slate-950/50'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
