/**
 * Relative Date Formatter helper
 */
export function formatRelativeDate(isoDateString) {
  if (!isoDateString) return 'Date not listed';
  const posted = new Date(isoDateString);
  if (isNaN(posted.getTime())) return 'Date not listed';

  const now = new Date();
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return 'Over a month ago';
}

/**
 * Normalize raw IT job objects from Jobicy IT API into standard JobTrack structure.
 *
 * Target Structure:
 * {
 *   id, title, company, companyLogo, location, category,
 *   experienceLevel, jobType, description, skills,
 *   postedDate, applicationUrl, source
 * }
 */
export function normalizeJob(apiJob) {
  if (!apiJob) return null;

  const title = apiJob.jobTitle ? apiJob.jobTitle.trim() : (apiJob.title ? apiJob.title.trim() : 'Title not listed');
  const companyName = apiJob.companyName ? apiJob.companyName.trim() : (apiJob.company ? apiJob.company.trim() : 'Company not listed');

  // Company logo image URL from Jobicy
  const companyLogo = apiJob.companyLogo ? apiJob.companyLogo.trim() : null;

  // Location / Geo
  let location = 'Remote / Anywhere';
  if (apiJob.jobGeo) {
    location = String(apiJob.jobGeo).replace(/&amp;/g, '&').trim();
  } else if (apiJob.location) {
    location = String(apiJob.location).trim();
  }

  // Category / Industry
  let category = 'Software Engineering';
  if (Array.isArray(apiJob.jobIndustry) && apiJob.jobIndustry.length > 0) {
    category = apiJob.jobIndustry.map(i => String(i).replace(/&amp;/g, '&').trim()).join(', ');
  } else if (apiJob.category) {
    category = String(apiJob.category).replace(/&amp;/g, '&').trim();
  }

  // Experience Level
  let experienceLevel = 'Entry Level';
  const rawLevel = apiJob.jobLevel || apiJob.level || '';
  if (/entry|junior|fresher|trainee|intern|graduate/i.test(rawLevel) || /entry|junior|fresher|trainee|intern|associate/i.test(title)) {
    experienceLevel = 'Entry Level';
  } else if (/mid/i.test(rawLevel)) {
    experienceLevel = 'Mid Level';
  } else if (/senior|lead|director|manager/i.test(rawLevel) || /senior|lead|manager|head|director/i.test(title)) {
    experienceLevel = 'Senior Level';
  }

  // Job Type (Full-Time, Contract, Internship)
  let jobType = 'Full-time';
  if (Array.isArray(apiJob.jobType) && apiJob.jobType.length > 0) {
    jobType = apiJob.jobType.join(', ');
  } else if (apiJob.jobType) {
    jobType = String(apiJob.jobType);
  }

  // Description HTML cleaning
  const rawContents = apiJob.jobDescription || apiJob.description || apiJob.jobExcerpt || '';
  const cleanDescription = rawContents
    ? rawContents.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
    : '';

  // Direct Application URL
  const applicationUrl = apiJob.url || apiJob.applicationUrl || null;

  // Extract skills from text/title
  const commonSkills = ['React', 'JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'Node.js', 'SQL', 'Git', 'TypeScript', 'C++', 'Django', 'FastAPI', 'Spring Boot', 'AWS', 'Docker', 'REST API', 'DevOps', 'QA', 'PostgreSQL', 'MongoDB'];
  const extractedSkills = commonSkills.filter(skill =>
    cleanDescription.toLowerCase().includes(skill.toLowerCase()) ||
    title.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    id: String(apiJob.id || Math.random()),
    title,
    company: companyName,
    companyLogo,
    location,
    category,
    experienceLevel,
    jobType,
    description: cleanDescription,
    skills: extractedSkills.length > 0 ? extractedSkills : ['Software Engineering', 'IT'],
    postedDate: formatRelativeDate(apiJob.pubDate || apiJob.publication_date),
    applicationUrl,
    source: 'Jobicy IT Jobs'
  };
}
