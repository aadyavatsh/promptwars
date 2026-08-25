import React, { useState } from 'react';
import { useApp, AppPage } from '../context/AppContext';
import {
  Sparkles,
  Users,
  Compass,
  Zap,
  Flame,
  Trophy,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  FolderKanban,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    theme,
    toggleTheme,
    currentUser,
    setCurrentUser,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    setAuthModalOpen,
    setAuthMode,
    triggerNetworkPulse,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: Array<{ id: AppPage; label: string; icon: React.FC<{ className?: string }>; badge?: string }> = [
    { id: 'explore', label: 'Find Teammates', icon: Compass },
    { id: 'builder', label: 'AI Team Builder', icon: Sparkles, badge: '✦ AI' },
    { id: 'sunday-forge', label: 'Sunday HackForge', icon: Zap, badge: '⚡ Live' },
    { id: 'daily-forge', label: 'DailyForge', icon: Flame, badge: '🔥 Streak' },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'teams', label: 'My Squads', icon: FolderKanban },
  ];

  const handleNavClick = (page: AppPage) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#0B0F19]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                TeamForge
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                AI
              </span>
            </div>
            <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
              Living Builder Network
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      item.badge.includes('⚡')
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : item.badge.includes('🔥')
                        ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300'
                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Living Network Pulse, Notifications, Theme, User) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Living Network Ambient Trigger */}
          <button
            onClick={() => triggerNetworkPulse(1.5)}
            title="Pulse Living Network"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span className="text-[11px]">Sync Network</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center gap-1.5 shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
            <span className="text-[11px] font-bold hidden sm:inline text-slate-700 dark:text-slate-300">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notificationsOpen) markNotificationsAsRead();
              }}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-slate-900 dark:text-white text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-extrabold text-sm">Notifications</h4>
                  <span className="text-[10px] text-slate-400">All caught up</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.actionPage) navigateTo(n.actionPage as AppPage);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-xl object-cover border border-blue-500/40"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:block">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-slate-900 dark:text-white text-xs animate-in fade-in duration-150 space-y-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.collegeShort}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigateTo('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>My Builder Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('inbox');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-purple-500" />
                    <span>Inbox & Invites</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                Join Network
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Interface Theme</span>
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
