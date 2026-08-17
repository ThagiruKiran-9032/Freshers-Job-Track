/**
 * Smart Single Professional Headline Generator
 * Analyzes Career Objective, Tech Stack, Projects, and Experience to generate
 * ONE dynamic, recruiter-friendly professional headline.
 */

const ROLE_PATTERNS = {
  aiml: {
    title: 'AI/ML Engineer',
    keywords: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'nlp', 'ai', 'data science', 'neural']
  },
  backend: {
    title: 'Backend Developer',
    keywords: ['python', 'fastapi', 'django', 'flask', 'java', 'spring', 'springboot', 'c++', 'sql', 'mysql', 'postgresql', 'node', 'express', 'rest api', 'backend', 'microservices']
  },
  frontend: {
    title: 'Frontend Developer',
    keywords: ['react', 'react.js', 'html', 'html5', 'css', 'css3', 'javascript', 'typescript', 'tailwind', 'bootstrap', 'vue', 'angular', 'frontend', 'ui']
  },
  fullstack: {
    title: 'Full Stack Developer',
    keywords: ['full stack', 'fullstack', 'mern', 'mean']
  }
};

export function generateSingleHeadline(parsedProfile) {
  const combinedText = [
    parsedProfile?.personal?.bio || '',
    (parsedProfile?.skills?.technical || []).join(' '),
    (parsedProfile?.skills?.tools || []).join(' '),
    (parsedProfile?.projects || []).map(p => `${p.name} ${p.description} ${(p.technologies || []).join(' ')}`).join(' '),
    (parsedProfile?.education?.branch || ''),
    (parsedProfile?.education?.degree || '')
  ].join(' ').toLowerCase();

  const techList = parsedProfile?.skills?.technical || [];

  // 1. Calculate Scores for Each Role
  let aimlScore = 0;
  let backendScore = 0;
  let frontendScore = 0;

  ROLE_PATTERNS.aiml.keywords.forEach(kw => {
    if (combinedText.includes(kw)) aimlScore++;
  });

  ROLE_PATTERNS.backend.keywords.forEach(kw => {
    if (combinedText.includes(kw)) backendScore++;
  });

  ROLE_PATTERNS.frontend.keywords.forEach(kw => {
    if (combinedText.includes(kw)) frontendScore++;
  });

  // Check for Full Stack explicitly or high Frontend + Backend
  const isFullStackKeyword = ROLE_PATTERNS.fullstack.keywords.some(kw => combinedText.includes(kw));

  let detectedRole = 'Software Developer';
  if (isFullStackKeyword || (frontendScore >= 2 && backendScore >= 2)) {
    detectedRole = 'Full Stack Developer';
  } else if (aimlScore >= 2 && aimlScore >= backendScore && aimlScore >= frontendScore) {
    detectedRole = 'AI/ML Engineer';
  } else if (backendScore > frontendScore && backendScore >= 2) {
    detectedRole = 'Backend Developer';
  } else if (frontendScore > backendScore && frontendScore >= 2) {
    detectedRole = 'Frontend Developer';
  }

  // 2. Select Relevant Technologies Based on Role
  let relevantTech = [];

  if (detectedRole === 'AI/ML Engineer') {
    relevantTech = techList.filter(t => /python|pytorch|tensorflow|pandas|numpy|machine learning|scikit/i.test(t));
  } else if (detectedRole === 'Backend Developer') {
    relevantTech = techList.filter(t => /python|fastapi|django|flask|java|spring|c\+\+|sql|mysql|postgres|node|express|rest/i.test(t));
  } else if (detectedRole === 'Frontend Developer') {
    relevantTech = techList.filter(t => /react|html|css|javascript|typescript|tailwind|bootstrap|vue|angular/i.test(t));
  } else if (detectedRole === 'Full Stack Developer') {
    const feTech = techList.filter(t => /react|html|css|javascript|typescript|vue|frontend/i.test(t));
    const beTech = techList.filter(t => /node|express|python|java|mongodb|sql|postgres|fastapi/i.test(t));
    relevantTech = [...feTech.slice(0, 2), ...beTech.slice(0, 2)];
  }

  // Fallback to top technical skills if no specific tech filtered
  if (relevantTech.length === 0) {
    relevantTech = techList.slice(0, 3);
  }

  // Deduplicate and clean selected techs
  const cleanTech = Array.from(new Set(relevantTech))
    .map(t => t.replace(/\.js$/i, '').replace(/5$/i, '').replace(/3$/i, ''))
    .slice(0, 3);

  // 3. Format Technology Segment
  let techSegment = '';
  if (cleanTech.length === 1) {
    techSegment = cleanTech[0];
  } else if (cleanTech.length === 2) {
    techSegment = `${cleanTech[0]} & ${cleanTech[1]}`;
  } else if (cleanTech.length >= 3) {
    techSegment = `${cleanTech[0]}, ${cleanTech[1]} & ${cleanTech[2]}`;
  } else {
    techSegment = 'Web & Software Development';
  }

  // 4. Experience Tag
  const expTag = parsedProfile?.fresherStatus?.experienceLevel ? 'Fresher' : 'Fresher';

  return `${detectedRole} | ${techSegment} | ${expTag}`;
}
