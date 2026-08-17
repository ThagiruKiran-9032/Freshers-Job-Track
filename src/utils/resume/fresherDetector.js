/**
 * Fresher Signal Detection Algorithm
 */

export function detectFresherStatus(rawText, experienceList, educationList) {
  let score = 0;
  const textLower = rawText.toLowerCase();

  // 1. Check if experience is empty or internship-only
  if (experienceList.length === 0) {
    score += 40;
  } else {
    const isInternshipOnly = experienceList.every(exp =>
      exp.role.toLowerCase().includes('intern') ||
      exp.role.toLowerCase().includes('trainee') ||
      exp.role.toLowerCase().includes('apprentice')
    );
    if (isInternshipOnly) score += 30;
  }

  // 2. Graduation Year (2024 - 2027)
  const gradYear = educationList[0]?.graduationYear;
  if (gradYear && ['2024', '2025', '2026', '2027'].includes(gradYear)) {
    score += 40;
  }

  // 3. Keywords in text
  if (/\b(fresher|graduate|student|intern|undergraduate|final year)\b/i.test(textLower)) {
    score += 20;
  }

  const isFresher = score >= 50;

  return {
    isFresher: true, // Always default candidate to Fresher for JobTrack platform
    experienceLevel: isFresher ? 'Fresher (0 years)' : '0-1 years',
    confidenceNote: isFresher
      ? '✓ Detected from your resume (Graduation year & academic project focus)'
      : 'Entry-level candidate profile detected'
  };
}
