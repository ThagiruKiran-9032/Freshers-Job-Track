/**
 * Fresher Fit Score Rule-Based Engine
 * Calculates how well a candidate's profile matches a specific fresher job listing.
 */

export function calculateFresherFitScore(profile, job) {
  if (!profile || !job) {
    return {
      overallScore: 70,
      scoreColor: '#3b82f6',
      breakdown: {
        skillMatch: true,
        experienceMatch: true,
        roleMatch: true,
        locationMatch: true,
        salaryMatch: true
      }
    };
  }

  let totalWeightedScore = 0;

  // 1. Experience Match (30% weight)
  // Fresher friendly listings get max score
  const isFresherJob = job.isFresherFriendly ||
    job.experienceLevel.toLowerCase().includes('fresher') ||
    job.experienceLevel.toLowerCase().includes('0-1') ||
    job.experienceLevel.toLowerCase().includes('trainee') ||
    job.experienceLevel.toLowerCase().includes('intern');
  
  const experienceScore = isFresherJob ? 100 : 60;
  totalWeightedScore += (experienceScore * 0.30);

  // 2. Skill Match (30% weight)
  const candidateSkills = [
    ...(profile.skills?.technical || []),
    ...(profile.skills?.tools || [])
  ].map(s => s.toLowerCase());

  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  const jobText = `${job.title} ${job.description}`.toLowerCase();

  let matchedSkillsCount = 0;
  if (candidateSkills.length > 0) {
    candidateSkills.forEach(skill => {
      if (jobSkills.includes(skill) || jobText.includes(skill)) {
        matchedSkillsCount++;
      }
    });
  }

  const skillMatchRatio = candidateSkills.length > 0
    ? Math.min(matchedSkillsCount / Math.max(jobSkills.length, 3), 1)
    : 0.5;
  const skillScore = Math.round(skillMatchRatio * 100);
  totalWeightedScore += (skillScore * 0.30);

  // 3. Preferred Role Match (20% weight)
  const preferredRoles = (profile.preferences?.preferredRoles || []).map(r => r.toLowerCase());
  const jobTitleLower = job.title.toLowerCase();

  const isRoleMatch = preferredRoles.some(role =>
    jobTitleLower.includes(role) || role.includes(jobTitleLower) ||
    (jobTitleLower.includes('react') && role.includes('frontend')) ||
    (jobTitleLower.includes('developer') && role.includes('engineer'))
  );
  const roleScore = isRoleMatch ? 100 : (preferredRoles.length === 0 ? 70 : 40);
  totalWeightedScore += (roleScore * 0.20);

  // 4. Location & Work Mode Match (10% weight)
  const preferredLocations = (profile.preferences?.preferredLocations || []).map(l => l.toLowerCase());
  const candidateLocation = (profile.personal?.location || '').toLowerCase();
  const jobLocationLower = job.location.toLowerCase();
  const candidateWorkMode = (profile.preferences?.workMode || '').toLowerCase();

  const isLocationMatch = job.workMode.toLowerCase() === 'remote' ||
    candidateWorkMode === 'remote' ||
    preferredLocations.some(loc => jobLocationLower.includes(loc)) ||
    jobLocationLower.includes(candidateLocation);

  const locationScore = isLocationMatch ? 100 : 50;
  totalWeightedScore += (locationScore * 0.10);

  // 5. Salary Match (10% weight)
  const salaryScore = 90; // Default reasonable match
  totalWeightedScore += (salaryScore * 0.10);

  const finalScore = Math.min(Math.max(Math.round(totalWeightedScore), 45), 98);

  let scoreColor = 'var(--color-primary)';
  if (finalScore >= 80) scoreColor = 'var(--color-success)';
  else if (finalScore >= 65) scoreColor = 'var(--color-primary)';
  else scoreColor = 'var(--color-warning)';

  return {
    overallScore: finalScore,
    scoreColor,
    breakdown: {
      skillMatch: skillScore >= 60,
      experienceMatch: experienceScore >= 80,
      roleMatch: roleScore >= 60,
      locationMatch: locationScore >= 80,
      salaryMatch: true
    }
  };
}
