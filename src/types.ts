export type RoleType =
  | 'Frontend Engineer'
  | 'Backend Engineer'
  | 'Full Stack Engineer'
  | 'AI / ML Engineer'
  | 'Mobile Developer'
  | 'UI/UX Designer'
  | 'Product Manager'
  | 'DevOps / Cloud'
  | 'Smart Contract / Web3'
  | 'Data Scientist';

export type LocationScope = 'college' | 'nearby' | 'global' | 'country';

export type HackathonFormat = 'Offline' | 'Online' | 'Hybrid';
export type HackathonReach = 'College' | 'Local' | 'National' | 'Global';
export type HackathonDomain =
  | 'AI/ML'
  | 'Web Development'
  | 'FinTech'
  | 'HealthTech'
  | 'EdTech'
  | 'Sustainability'
  | 'Cybersecurity'
  | 'Blockchain'
  | 'Open Innovation';

export type LocationVisibility = 'college_only' | 'city_college' | 'country_only' | 'hidden';

export interface LocationPreference {
  scopes: ('same_college' | 'nearby_colleges' | 'country' | 'global')[];
  preferLocalOffline: boolean;
  openGlobalOnline: boolean;
  nearbyRadiusKm: 5 | 25 | 50;
  visibility: LocationVisibility;
}

export interface CollegeInfo {
  id: string;
  name: string;
  shortName: string;
  pinCode: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude: number;
  longitude: number;
  studentCount?: number;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'Design' | 'Mobile' | 'DevOps' | 'Database' | 'Other';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  projectLink?: string;
  githubLink?: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  college: string;
  collegeShort: string;
  pinCode?: string;
  city: string;
  degree: string;
  yearOfStudy: string;
  location: string;
  distanceKm?: number; // Calculated relative to current user
  country: string;
  countryCode: string;
  countryFlag: string;
  timezone: string;
  timezoneOffsetHours: number; // UTC offset in hours e.g. +5.5 for IST, -8 for PST
  timezoneOverlapHours?: number; // Calculated relative to current user
  isVerifiedStudent: boolean;
  bio: string;
  preferredRoles: RoleType[];
  skills: Skill[];
  projects: PortfolioProject[];
  interests: string[];
  availability: string[];
  hoursPerWeek: number;
  hackathonsCount: number;
  hackathonHighlights: string[];
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  rating?: number;
  openToTeam: boolean;
  locationScope: LocationScope;
  locationPreference?: LocationPreference;
}

export interface MatchingWeights {
  skills: number; // 0.35
  role: number; // 0.20
  interests: number; // 0.15
  availability: number; // 0.10
  experience: number; // 0.10
  goal: number; // 0.05
  location: number; // 0.05
}

export interface MatchSynergy {
  matchPercentage: number;
  roleSynergyScore: number;
  skillSynergyScore: number;
  interestSynergyScore: number;
  availabilitySynergyScore: number;
  experienceSynergyScore: number;
  goalSynergyScore: number;
  locationSynergyScore: number;
  timezoneOverlapScore: number;
  timezoneOverlapHours: number;
  distanceKm?: number;
  locationTag: string; // e.g. "Same College", "18 km away", "Spain 🇪🇸", "Global"
  keyStrengths: string[];
  recommendedTeamRoles: RoleType[];
  reasoning: string;
  sharedInterests: string[];
  complementarySkills: string[];
}

export interface GlobalTeamChemistry {
  skillsScore: number;
  availabilityScore: number;
  timezoneScore: number;
  interestsScore: number;
  communicationScore: number;
  overallMatch: number;
  overlappingHoursDaily: number;
  summary: string;
}

export interface TeamMember {
  student: Student;
  role: RoleType;
  joinedAt: string;
  isLeader?: boolean;
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  description: string;
  projectIdea?: string;
  targetHackathon?: string;
  members: TeamMember[];
  targetRolesNeeded: RoleType[];
  requiredSkills: string[];
  readinessScore: number;
  skillGaps: string[];
  createdAt: string;
  status: 'recruiting' | 'complete' | 'competing' | 'shipped';
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  bannerUrl: string;
  format: HackathonFormat;
  reach: HackathonReach;
  location: string;
  city?: string;
  college?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool: string;
  participantsCount: number;
  teamSizeMin: number;
  teamSizeMax: number;
  domains: HackathonDomain[];
  tags: string[];
  description: string;
  challengeBrief: string;
  rules: string[];
  isSundayForge?: boolean;
  registrationOpen: boolean;
  websiteUrl?: string;
}

export interface UserHackathonParticipation {
  hackathonId: string;
  hackathon: Hackathon;
  status: 'upcoming' | 'registered' | 'participated' | 'completed';
  teamName?: string;
  role?: string;
  result?: string;
}

export interface SundaySubmission {
  id: string;
  teamName: string;
  projectName: string;
  tagline: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  videoUrl?: string;
  techStack: string[];
  submittedAt: string;
  author: {
    name: string;
    avatar: string;
    college: string;
  };
  votes: number;
  badges: string[];
}

export interface DailyProblem {
  id: string;
  date: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Algorithms' | 'Data Structures' | 'Debugging' | 'Full Stack' | 'SQL' | 'System Design';
  timeEstimate: string;
  points: number;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
  };
  hints: string[];
  solutionExplanation: string;
}

export interface ConnectionRequest {
  id: string;
  fromStudentId: string;
  toStudentId: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface TeamInvite {
  id: string;
  teamId: string;
  fromStudentId: string;
  toStudentId: string;
  role: RoleType;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'invite' | 'connection' | 'hackathon' | 'daily';
  time: string;
  read: boolean;
  actionPage?: string;
}

export interface LivingNetworkConfig {
  variant?: 'default' | 'landing' | 'explorer' | 'builder' | 'dashboard' | 'team' | 'hackathon' | 'minimal';
  intensity?: number; // 0 to 1
  nodeCount?: number;
  connectionDistance?: number;
  speed?: number;
  opacity?: number;
  interactive?: boolean;
  clusterMode?: 'normal' | 'central-project' | 'campus-clusters' | 'global-spread' | 'reorganizing';
  pulseSignal?: number;
}
