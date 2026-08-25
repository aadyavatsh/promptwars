import {
  Student,
  MatchSynergy,
  RoleType,
  MatchingWeights,
  GlobalTeamChemistry,
  Hackathon,
} from '../types';

// Reusable 7-factor matching weight configuration (Location never overpowers skills)
export const MATCHING_WEIGHTS: MatchingWeights = {
  skills: 0.35, // 35% Skills compatibility
  role: 0.20, // 20% Role compatibility
  interests: 0.15, // 15% Interests
  availability: 0.10, // 10% Availability
  experience: 0.10, // 10% Experience (Hackathons & track record)
  goal: 0.05, // 5% Competition / project goal
  location: 0.05, // 5% Location / college preference
};

// Calculate approximate geographical distance between 2 coordinate points
export function calculateDistanceKm(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 25;
  }
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate timezone overlap hours between two students
export function calculateTimezoneOverlap(userOffset: number, candidateOffset: number): {
  overlapHours: number;
  overlapPercentage: number;
} {
  const diffHours = Math.abs(userOffset - candidateOffset);
  // Assuming standard 14h waking/working window (e.g. 9am to 11pm)
  const overlapHours = Math.max(0, Math.min(10, Math.round(10 - Math.min(diffHours, 8) * 0.8)));
  const overlapPercentage = Math.min(100, Math.max(50, Math.round(100 - diffHours * 4.5)));
  return { overlapHours, overlapPercentage };
}

export function calculateMatch(user: Student, candidate: Student): MatchSynergy {
  // If comparing self
  if (user.id === candidate.id) {
    return {
      matchPercentage: 100,
      roleSynergyScore: 100,
      skillSynergyScore: 100,
      interestSynergyScore: 100,
      availabilitySynergyScore: 100,
      experienceSynergyScore: 100,
      goalSynergyScore: 100,
      locationSynergyScore: 100,
      timezoneOverlapScore: 100,
      timezoneOverlapHours: 10,
      distanceKm: 0,
      locationTag: 'Your Profile',
      keyStrengths: ['Self Profile', 'Full Compatibility'],
      recommendedTeamRoles: user.preferredRoles,
      reasoning: 'This is your own profile.',
      sharedInterests: user.interests,
      complementarySkills: user.skills.map((s) => s.name),
    };
  }

  // 1. Role Compatibility (20%)
  const userRoles = new Set(user.preferredRoles);
  const candidateRoles = new Set(candidate.preferredRoles);
  let roleOverlap = 0;
  candidate.preferredRoles.forEach((r) => {
    if (userRoles.has(r)) roleOverlap++;
  });

  let roleSynergyScore = 80;
  if (
    (userRoles.has('Full Stack Engineer') || userRoles.has('Frontend Engineer')) &&
    (candidateRoles.has('UI/UX Designer') ||
      candidateRoles.has('Backend Engineer') ||
      candidateRoles.has('AI / ML Engineer'))
  ) {
    roleSynergyScore = 96;
  } else if (
    userRoles.has('AI / ML Engineer') &&
    (candidateRoles.has('Frontend Engineer') ||
      candidateRoles.has('Full Stack Engineer') ||
      candidateRoles.has('Product Manager'))
  ) {
    roleSynergyScore = 97;
  } else if (roleOverlap === 0 && candidate.preferredRoles.length > 0) {
    roleSynergyScore = 92;
  } else if (roleOverlap > 0 && candidate.preferredRoles.length > 1) {
    roleSynergyScore = 86;
  }

  // 2. Skills Compatibility (35%)
  const userSkillNames = new Set(user.skills.map((s) => s.name.toLowerCase()));
  const complementarySkills: string[] = [];
  let sharedSkillCount = 0;

  candidate.skills.forEach((cs) => {
    const isShared = userSkillNames.has(cs.name.toLowerCase());
    if (isShared) {
      sharedSkillCount++;
    } else if (cs.proficiency === 'Expert' || cs.proficiency === 'Advanced') {
      complementarySkills.push(cs.name);
    }
  });

  const skillSynergyScore = Math.min(
    99,
    Math.max(72, 74 + complementarySkills.length * 3 + sharedSkillCount * 2.5)
  );

  // 3. Shared Interests (15%)
  const userInterests = new Set(user.interests.map((i) => i.toLowerCase()));
  const sharedInterests = candidate.interests.filter((i) =>
    userInterests.has(i.toLowerCase())
  );
  const interestSynergyScore = Math.min(
    98,
    Math.max(68, 72 + sharedInterests.length * 7)
  );

  // 4. Availability (10%)
  const userAvail = new Set(user.availability.map((a) => a.toLowerCase()));
  const sharedAvail = candidate.availability.filter((a) =>
    userAvail.has(a.toLowerCase())
  );
  const availabilitySynergyScore = Math.min(
    98,
    Math.max(70, 75 + sharedAvail.length * 8 + (candidate.hoursPerWeek >= 15 ? 4 : 0))
  );

  // 5. Experience / Hackathon Track Record (10%)
  const experienceSynergyScore = Math.min(
    98,
    Math.max(70, 72 + Math.min(candidate.hackathonsCount * 2.5, 24))
  );

  // 6. Competition / Project Goal (5%)
  const goalSynergyScore = candidate.openToTeam ? 94 : 75;

  // 7. Location & College Preference (5%)
  const isSameCollege =
    user.college.toLowerCase() === candidate.college.toLowerCase() ||
    user.collegeShort.toLowerCase() === candidate.collegeShort.toLowerCase();

  const isSameCity = user.city && candidate.city && user.city.toLowerCase() === candidate.city.toLowerCase();
  const isSameCountry = user.countryCode === candidate.countryCode;

  let locationSynergyScore = 80;
  let locationTag = '🌎 Global';
  const distanceKm = candidate.distanceKm !== undefined ? candidate.distanceKm : (isSameCollege ? 0 : isSameCity ? 18 : isSameCountry ? 120 : 6500);

  if (isSameCollege) {
    locationSynergyScore = 98;
    locationTag = '🏫 Same College';
  } else if (distanceKm <= 50) {
    locationSynergyScore = 94;
    locationTag = `📍 ${distanceKm} km away`;
  } else if (isSameCountry) {
    locationSynergyScore = 88;
    locationTag = `${candidate.countryFlag || '🇮🇳'} ${candidate.country}`;
  } else {
    locationSynergyScore = 82;
    locationTag = `${candidate.countryFlag || '🌎'} ${candidate.country}`;
  }

  // Timezone Overlap calculation
  const userTzOffset = user.timezoneOffsetHours !== undefined ? user.timezoneOffsetHours : 5.5; // default IST (+5.5)
  const candidateTzOffset = candidate.timezoneOffsetHours !== undefined ? candidate.timezoneOffsetHours : 5.5;
  const { overlapHours, overlapPercentage } = calculateTimezoneOverlap(userTzOffset, candidateTzOffset);

  // Weighted total according to exact 7-weight mandate
  const weightedTotal = Math.round(
    skillSynergyScore * MATCHING_WEIGHTS.skills +
      roleSynergyScore * MATCHING_WEIGHTS.role +
      interestSynergyScore * MATCHING_WEIGHTS.interests +
      availabilitySynergyScore * MATCHING_WEIGHTS.availability +
      experienceSynergyScore * MATCHING_WEIGHTS.experience +
      goalSynergyScore * MATCHING_WEIGHTS.goal +
      locationSynergyScore * MATCHING_WEIGHTS.location
  );

  const matchPercentage = Math.min(99, Math.max(76, weightedTotal));

  // Determine Key Strengths
  const keyStrengths: string[] = [];
  if (isSameCollege) keyStrengths.push('Same College Campus');
  else if (distanceKm <= 50) keyStrengths.push(`Nearby College (${distanceKm} km)`);
  else if (!isSameCountry) keyStrengths.push(`${overlapHours}h Daily Timezone Overlap`);

  if (roleSynergyScore >= 92) keyStrengths.push('High Role Complementarity');
  if (complementarySkills.length >= 2) keyStrengths.push('Strong Stack Synergy');
  if (candidate.hackathonsCount >= 5) keyStrengths.push('Proven Hackathon Track Record');
  if (sharedInterests.length >= 2) keyStrengths.push(`Shared: ${sharedInterests.slice(0, 2).join(', ')}`);

  if (keyStrengths.length === 0) {
    keyStrengths.push('General Technical Balance', 'Active Student Builder');
  }

  // Reasoning description
  let reasoning = `${candidate.fullName} brings complementary expertise in ${candidate.preferredRoles.slice(0, 2).join(' and ')} that accelerates squad execution.`;
  if (isSameCollege) {
    reasoning = `${candidate.fullName} is also studying at ${candidate.collegeShort}, making fast in-person syncs, whiteboarding, and sprint milestones effortless.`;
  } else if (distanceKm <= 50) {
    reasoning = `${candidate.fullName} is at ${candidate.collegeShort} (~${distanceKm} km away), ideal for both regional in-person hackathons and hybrid sprints.`;
  } else if (!isSameCountry) {
    reasoning = `${candidate.fullName} is at ${candidate.collegeShort} (${candidate.country}). You share ${overlapHours} hours of daily working overlap and high domain alignment in ${sharedInterests.slice(0, 2).join(', ') || 'AI & web development'}.`;
  }

  return {
    matchPercentage,
    roleSynergyScore,
    skillSynergyScore,
    interestSynergyScore,
    availabilitySynergyScore,
    experienceSynergyScore,
    goalSynergyScore,
    locationSynergyScore,
    timezoneOverlapScore: overlapPercentage,
    timezoneOverlapHours: overlapHours,
    distanceKm,
    locationTag,
    keyStrengths,
    recommendedTeamRoles: candidate.preferredRoles,
    reasoning,
    sharedInterests: sharedInterests.length > 0 ? sharedInterests : candidate.interests.slice(0, 2),
    complementarySkills:
      complementarySkills.length > 0
        ? complementarySkills.slice(0, 5)
        : candidate.skills.slice(0, 3).map((s) => s.name),
  };
}

// Generate Global Team Chemistry Breakdown
export function calculateGlobalTeamChemistry(
  user: Student,
  candidate: Student
): GlobalTeamChemistry {
  const match = calculateMatch(user, candidate);
  const skillsScore = match.skillSynergyScore;
  const availabilityScore = match.availabilitySynergyScore;
  const timezoneScore = match.timezoneOverlapScore;
  const interestsScore = match.interestSynergyScore;
  const communicationScore = Math.min(98, Math.max(82, Math.round((match.roleSynergyScore + match.availabilitySynergyScore) / 2)));
  const overallMatch = match.matchPercentage;
  const overlappingHoursDaily = match.timezoneOverlapHours;

  const summary = `Your team has ${overlappingHoursDaily} hours of overlapping availability each day, with strong role coverage and complementary technical capabilities.`;

  return {
    skillsScore,
    availabilityScore,
    timezoneScore,
    interestsScore,
    communicationScore,
    overallMatch,
    overlappingHoursDaily,
    summary,
  };
}

// Generate Hackathon-Specific Dream Team (Prioritizing Offline vs Online rules)
export function generateHackathonTeam(
  students: Student[],
  currentUser: Student,
  hackathon: Hackathon,
  teamSize: number
): {
  selectedSquad: Student[];
  squadSynergy: number;
  roleAssignments: Record<string, RoleType>;
  identifiedGaps: string[];
  teamReadinessScore: number;
  formatNote: string;
} {
  const isOffline = hackathon.format === 'Offline';
  const squad: Student[] = [currentUser];
  const roleAssignments: Record<string, RoleType> = {
    [currentUser.id]: currentUser.preferredRoles[0] || 'Frontend Engineer',
  };

  const availableStudents = students.filter(
    (s) => s.id !== currentUser.id && s.openToTeam
  );

  // Score all candidates specifically for this hackathon
  const scoredCandidates = availableStudents.map((s) => {
    const baseMatch = calculateMatch(currentUser, s);
    let hackathonBonus = 0;

    // Check domain tag overlaps
    const studentInterests = s.interests.map((i) => i.toLowerCase());
    const domainMatches = hackathon.domains.filter((d) =>
      studentInterests.some((i) => i.includes(d.toLowerCase()) || d.toLowerCase().includes(i))
    ).length;
    hackathonBonus += domainMatches * 3;

    // OFFLINE LOGIC: Prioritize same college, nearby colleges (<50km), same city
    if (isOffline) {
      const isSameCollege =
        s.college.toLowerCase() === currentUser.college.toLowerCase() ||
        s.collegeShort.toLowerCase() === currentUser.collegeShort.toLowerCase();
      if (isSameCollege) hackathonBonus += 15;
      else if ((s.distanceKm || 100) <= 50) hackathonBonus += 10;
      else if (s.countryCode === currentUser.countryCode) hackathonBonus += 4;
      else hackathonBonus -= 8; // penalty for distant offline events
    } else {
      // ONLINE / GLOBAL LOGIC: Prioritize skill complementarity, timezone overlap, availability
      if (baseMatch.timezoneOverlapHours >= 4) hackathonBonus += 6;
      if (s.skills.some((sk) => hackathon.tags.some((t) => t.toLowerCase().includes(sk.name.toLowerCase())))) {
        hackathonBonus += 8;
      }
    }

    return {
      student: s,
      score: baseMatch.matchPercentage + hackathonBonus,
      match: baseMatch,
    };
  });

  // Sort candidates by combined score
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Target diverse complementary roles
  const standardRoles: RoleType[] = [
    'Backend Engineer',
    'AI / ML Engineer',
    'UI/UX Designer',
    'Mobile Developer',
    'Product Manager',
    'Smart Contract / Web3',
  ];
  const desiredRoles: RoleType[] = standardRoles.filter((r) => r !== roleAssignments[currentUser.id]);

  for (const role of desiredRoles) {
    if (squad.length >= teamSize) break;
    const matchForRole = scoredCandidates.find(
      (c) => !squad.some((sq) => sq.id === c.student.id) && c.student.preferredRoles.includes(role)
    );
    if (matchForRole) {
      squad.push(matchForRole.student);
      roleAssignments[matchForRole.student.id] = role;
    }
  }

  // If squad still not full, take top scored remaining
  while (squad.length < teamSize) {
    const unpicked = scoredCandidates.find((c) => !squad.some((sq) => sq.id === c.student.id));
    if (!unpicked) break;
    squad.push(unpicked.student);
    roleAssignments[unpicked.student.id] = unpicked.student.preferredRoles[0] || 'Full Stack Engineer';
  }

  const squadSynergy = Math.round(
    squad.reduce((acc, curr) => {
      if (curr.id === currentUser.id) return acc;
      return acc + calculateMatch(currentUser, curr).matchPercentage;
    }, 0) / Math.max(1, squad.length - 1)
  );

  const allSkills = squad.flatMap((s) => s.skills.map((sk) => sk.name.toLowerCase()));
  const identifiedGaps: string[] = [];
  if (!allSkills.some((s) => s.includes('figma') || s.includes('design') || s.includes('ui'))) {
    identifiedGaps.push('UI/UX prototyping');
  }
  if (!allSkills.some((s) => s.includes('python') || s.includes('ai') || s.includes('gemini') || s.includes('pytorch'))) {
    identifiedGaps.push('Machine learning model pipeline');
  }

  const formatNote = isOffline
    ? `Prioritized ${currentUser.collegeShort} & nearby regional builders for frictionless on-site collaboration at ${hackathon.title}.`
    : `Prioritized global skill complementarity and timezone overlap for 100% online hackathon execution.`;

  return {
    selectedSquad: squad,
    squadSynergy: Math.min(98, Math.max(84, squadSynergy)),
    roleAssignments,
    identifiedGaps,
    teamReadinessScore: Math.min(99, Math.max(82, squadSynergy + 2)),
    formatNote,
  };
}

export function generateDreamTeam(
  students: Student[],
  currentUser: Student,
  projectConcept: string,
  targetRoles: RoleType[],
  teamSize: number
): {
  selectedSquad: Student[];
  squadSynergy: number;
  roleAssignments: Record<string, RoleType>;
  coverageScores: Record<string, number>;
  identifiedGaps: string[];
  teamReadinessScore: number;
} {
  const squad: Student[] = [currentUser];
  const roleAssignments: Record<string, RoleType> = {
    [currentUser.id]: currentUser.preferredRoles[0] || 'Full Stack Engineer',
  };

  const remainingRoles = [...targetRoles].filter((r) => r !== roleAssignments[currentUser.id]);
  const availableStudents = students.filter((s) => s.id !== currentUser.id && s.openToTeam);

  // Greedy match based on role and synergy score
  for (const role of remainingRoles) {
    if (squad.length >= teamSize) break;

    const candidatesForRole = availableStudents
      .filter((s) => !squad.some((sq) => sq.id === s.id) && s.preferredRoles.includes(role))
      .map((s) => ({
        student: s,
        match: calculateMatch(currentUser, s),
      }))
      .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

    if (candidatesForRole.length > 0) {
      const chosen = candidatesForRole[0];
      squad.push(chosen.student);
      roleAssignments[chosen.student.id] = role;
    }
  }

  // If squad still not full, fill with highest matching remaining students
  while (squad.length < teamSize) {
    const unpicked = availableStudents
      .filter((s) => !squad.some((sq) => sq.id === s.id))
      .map((s) => ({
        student: s,
        match: calculateMatch(currentUser, s),
      }))
      .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

    if (unpicked.length === 0) break;
    const chosen = unpicked[0];
    squad.push(chosen.student);
    roleAssignments[chosen.student.id] = chosen.student.preferredRoles[0] || 'Frontend Engineer';
  }

  // Calculate coverage
  const allSkills = squad.flatMap((s) => s.skills.map((sk) => sk.name.toLowerCase()));
  const coverageScores: Record<string, number> = {
    Frontend: allSkills.some((s) => s.includes('react') || s.includes('typescript') || s.includes('tailwind')) ? 96 : 50,
    Backend: allSkills.some((s) => s.includes('go') || s.includes('rust') || s.includes('node') || s.includes('fastapi') || s.includes('grpc') || s.includes('java')) ? 94 : 45,
    'AI / ML': allSkills.some((s) => s.includes('pytorch') || s.includes('gemini') || s.includes('python') || s.includes('rag')) ? 98 : 40,
    'UI / UX': allSkills.some((s) => s.includes('figma') || s.includes('design') || s.includes('framer')) ? 92 : 35,
    'Cloud / DevOps': allSkills.some((s) => s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('gcp')) ? 88 : 40,
  };

  const identifiedGaps: string[] = [];
  if (coverageScores['UI / UX'] < 60) identifiedGaps.push('Dedicated UI/UX wireframing & prototyping');
  if (coverageScores['Cloud / DevOps'] < 60) identifiedGaps.push('CI/CD and multi-cluster deployment pipeline');
  if (coverageScores['Backend'] < 60) identifiedGaps.push('High concurrency backend microservices');

  const squadSynergy = Math.round(
    squad.reduce((acc, curr) => {
      if (curr.id === currentUser.id) return acc;
      return acc + calculateMatch(currentUser, curr).matchPercentage;
    }, 0) / Math.max(1, squad.length - 1)
  );

  const teamReadinessScore = Math.min(98, Math.max(76, Math.round(squadSynergy * 0.6 + 36)));

  return {
    selectedSquad: squad,
    squadSynergy,
    roleAssignments,
    coverageScores,
    identifiedGaps,
    teamReadinessScore,
  };
}

