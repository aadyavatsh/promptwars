import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Team,
  Hackathon,
  SundaySubmission,
  DailyProblem,
  ConnectionRequest,
  TeamInvite,
  NotificationItem,
  LocationScope,
  RoleType,
} from '../types';
import {
  MOCK_CURRENT_USER,
  MOCK_STUDENTS,
  MOCK_HACKATHONS,
  MOCK_DAILY_PROBLEM,
  MOCK_SUNDAY_SUBMISSIONS,
  MOCK_TEAMS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';

export type AppPage =
  | 'landing'
  | 'dashboard'
  | 'explore'
  | 'teammate-profile'
  | 'builder'
  | 'hackathons'
  | 'sunday-forge'
  | 'daily-forge'
  | 'teams'
  | 'profile'
  | 'inbox'
  | 'settings';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface SundayProjectView {
  id: string;
  projectName: string;
  teamName: string;
  tagline: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  videoUrl?: string;
  techStack: string[];
  author: {
    name: string;
    avatar: string;
    college: string;
  };
  upvotes: number;
}

export interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  activePage: AppPage;
  navigateTo: (page: AppPage, id?: string) => void;
  goBack: () => void;
  selectedTeammateId: string;
  setSelectedTeammateId: (id: string) => void;
  currentUser: Student | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Student | null>>;
  updateCurrentUser: (updated: Partial<Student>) => void;
  students: Student[];
  savedTeammateIds: string[];
  toggleSaveTeammate: (id: string) => void;
  teams: Team[];
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Team;
  hackathons: Hackathon[];
  sundaySubmissions: SundaySubmission[];
  sundayProjects: SundayProjectView[];
  submitSundayProject: (sub: {
    projectName: string;
    teamName: string;
    tagline: string;
    description: string;
    repoUrl: string;
    demoUrl?: string;
    videoUrl?: string;
    techStack: string[];
    author: {
      name: string;
      avatar: string;
      college: string;
    };
  }) => void;
  voteSundayProject: (id: string) => void;
  upvoteSundayProject: (id: string) => void;
  dailyProblem: DailyProblem;
  dailyStreak: number;
  solvedToday: boolean;
  solveDailyProblem: () => void;
  completeDailyChallenge: () => void;
  connectionRequests: ConnectionRequest[];
  sendConnectionRequest: (candidateId: string, message: string) => void;
  teamInvites: TeamInvite[];
  sendTeamInvite: (teamId: string, candidateId: string, role: RoleType, message: string) => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  networkPulse: number;
  pulseSignal: number;
  triggerNetworkPulse: (intensity?: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLocationScope: LocationScope;
  setSelectedLocationScope: (scope: LocationScope) => void;
  selectedRoleFilter: RoleType | 'All';
  setSelectedRoleFilter: (role: RoleType | 'All') => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'onboarding';
  setAuthMode: (mode: 'login' | 'signup' | 'onboarding') => void;
  toasts: ToastInfo[];
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teamforge_theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'dark';
  });
  const [activePage, setActivePage] = useState<AppPage>('landing');
  const [pageHistory, setPageHistory] = useState<AppPage[]>(['landing']);
  const [selectedTeammateId, setSelectedTeammateId] = useState<string>(MOCK_STUDENTS[0].id);
  const [currentUser, setCurrentUser] = useState<Student | null>(MOCK_CURRENT_USER);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [savedTeammateIds, setSavedTeammateIds] = useState<string[]>([MOCK_STUDENTS[0].id]);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [hackathons] = useState<Hackathon[]>(MOCK_HACKATHONS);
  const [sundaySubmissions, setSundaySubmissions] = useState<SundaySubmission[]>(MOCK_SUNDAY_SUBMISSIONS);
  const [dailyProblem] = useState<DailyProblem>(MOCK_DAILY_PROBLEM);
  const [dailyStreak, setDailyStreak] = useState<number>(5);
  const [solvedToday, setSolvedToday] = useState<boolean>(false);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [networkPulse, setNetworkPulse] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocationScope, setSelectedLocationScope] = useState<LocationScope>('college');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<RoleType | 'All'>('All');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'onboarding'>('signup');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Apply theme class to <html> element and persist in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('teamforge_theme', theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    triggerNetworkPulse(1);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
    triggerNetworkPulse(1);
  };

  const triggerNetworkPulse = (intensity = 1) => {
    setNetworkPulse((p) => p + intensity);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const navigateTo = (page: AppPage, id?: string) => {
    if (id) {
      setSelectedTeammateId(id);
    }
    setPageHistory((prev) => [...prev, page]);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerNetworkPulse(0.5);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setActivePage(prevPage);
    } else {
      setActivePage('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCurrentUser = (updated: Partial<Student>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    setStudents((prev) => prev.map((s) => (s.id === newProfile.id ? newProfile : s)));
  };

  const toggleSaveTeammate = (id: string) => {
    setSavedTeammateIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Candidate removed from saved bookmarks', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Candidate bookmarked to saved roster ⭐', 'success');
        return [...prev, id];
      }
    });
  };

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt'>): Team => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTeams((prev) => [newTeam, ...prev]);
    showToast(`Squad "${newTeam.name}" created successfully! 🚀`, 'success');
    triggerNetworkPulse(2);
    return newTeam;
  };

  const submitSundayProject = (sub: {
    projectName: string;
    teamName: string;
    tagline: string;
    description: string;
    repoUrl: string;
    demoUrl?: string;
    videoUrl?: string;
    techStack: string[];
    author: {
      name: string;
      avatar: string;
      college: string;
    };
  }) => {
    const newSubmission: SundaySubmission = {
      id: `sub-${Date.now()}`,
      projectName: sub.projectName,
      teamName: sub.teamName,
      tagline: sub.tagline,
      description: sub.description,
      repoUrl: sub.repoUrl,
      demoUrl: sub.demoUrl || 'https://demo.teamforge.io',
      videoUrl: sub.videoUrl,
      techStack: sub.techStack,
      author: sub.author,
      submittedAt: new Date().toISOString(),
      votes: 1,
      badges: ['Sunday Sprint #24 Entry'],
    };
    setSundaySubmissions((prev) => [newSubmission, ...prev]);
    showToast(`Project "${sub.projectName}" submitted to Sunday HackForge Leaderboard! ⚡`, 'success');
    triggerNetworkPulse(2);
  };

  const voteSundayProject = (id: string) => {
    setSundaySubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, votes: sub.votes + 1 } : sub))
    );
    showToast('Upvote recorded! +1 to project leaderboard 👍', 'success');
    triggerNetworkPulse(0.5);
  };

  const solveDailyProblem = () => {
    if (!solvedToday) {
      setDailyStreak((prev) => prev + 1);
      setSolvedToday(true);
      showToast('Daily challenge solved! +120 XP added to your streak 🔥', 'success');
    }
  };

  const sendConnectionRequest = (candidateId: string, message: string) => {
    const req: ConnectionRequest = {
      id: `req-${Date.now()}`,
      fromStudentId: currentUser?.id || 'alex-chen',
      toStudentId: candidateId,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
    };
    setConnectionRequests((prev) => [...prev, req]);
    showToast('Connection request sent to candidate! 🚀', 'success');
    triggerNetworkPulse(1.5);
  };

  const sendTeamInvite = (teamId: string, candidateId: string, role: RoleType, message: string) => {
    const invite: TeamInvite = {
      id: `invite-${Date.now()}`,
      teamId,
      fromStudentId: currentUser?.id || 'alex-chen',
      toStudentId: candidateId,
      role,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
    };
    setTeamInvites((prev) => [...prev, invite]);
    showToast('Squad invitation delivered successfully! ✦', 'success');
    triggerNetworkPulse(1.5);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Mapped Sunday projects view helper
  const sundayProjects: SundayProjectView[] = sundaySubmissions.map((sub) => {
    return {
      id: sub.id,
      projectName: sub.projectName,
      teamName: sub.teamName,
      tagline: sub.tagline,
      description: sub.description,
      repoUrl: sub.repoUrl,
      demoUrl: sub.demoUrl,
      videoUrl: sub.videoUrl,
      techStack: sub.techStack,
      author: sub.author,
      upvotes: sub.votes,
    };
  });

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        activePage,
        navigateTo,
        goBack,
        selectedTeammateId,
        setSelectedTeammateId,
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        students,
        savedTeammateIds,
        toggleSaveTeammate,
        teams,
        createTeam,
        hackathons,
        sundaySubmissions,
        sundayProjects,
        submitSundayProject,
        voteSundayProject,
        upvoteSundayProject: voteSundayProject,
        dailyProblem,
        dailyStreak,
        solvedToday,
        solveDailyProblem,
        completeDailyChallenge: solveDailyProblem,
        connectionRequests,
        sendConnectionRequest,
        teamInvites,
        sendTeamInvite,
        notifications,
        unreadNotificationCount: notifications.filter((n) => !n.read).length,
        markNotificationsAsRead,
        networkPulse,
        pulseSignal: networkPulse,
        triggerNetworkPulse,
        searchQuery,
        setSearchQuery,
        selectedLocationScope,
        setSelectedLocationScope,
        selectedRoleFilter,
        setSelectedRoleFilter,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        toasts,
        toast: toasts.length > 0 ? toasts[toasts.length - 1] : null,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = AppContextProvider;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
