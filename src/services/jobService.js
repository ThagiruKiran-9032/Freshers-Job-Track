import axios from 'axios';
import { mockJobsData } from '../data/mockJobs';

// Jooble REST API Key provided by user
const JOOBLE_API_KEY = '4a22d1de-9f18-4447-b4ba-be50f556e26d';
const JOOBLE_API_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

// In-Memory Cache for all fetched / normalized jobs
const JOBS_CACHE = new Map();

/**
 * Format raw date into human-readable relative posting date
 */
export function formatRelativePostedDate(rawDate) {
  if (!rawDate) return 'Recently';

  const posted = new Date(rawDate);
  if (isNaN(posted.getTime())) return 'Recently';

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
 * Detect whether a job is a Senior or Experienced role (MUST BE EXCLUDED from JobTrack)
 */
export function isSeniorOrExperiencedRole(title = '', description = '', expLevel = '') {
  const text = `${title} ${description} ${expLevel}`.toLowerCase();
  
  // Senior, Lead, Manager, or Experienced keywords (1-2 yrs, 2+ yrs, 3+ yrs, etc.)
  const seniorKeywords = [
    'senior', 'sr.', 'sr ', 'lead', 'principal', 'architect', 'staff', 'manager',
    'director', 'head of', 'executive', 'vp ', 'vice president', '5+ years', '4+ years',
    '3+ years', '2+ years', '3-5 years', '5-7 years', '7+ years', '1-2 years', '1-2 yrs'
  ];

  return seniorKeywords.some(kw => text.includes(kw));
}

/**
 * Normalization function to standard JobTrack schema from Jooble API or Mock Engine
 */
export const normalizeJobData = (rawJob, index = 0) => {
  const title = rawJob.title || rawJob.job_title || 'Software Developer (Fresher)';
  const cleanSnippet = rawJob.snippet
    ? rawJob.snippet.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    : (rawJob.description || 'Entry-level fresher position.');

  // If role is Senior or Experienced, return null so it can be filtered out
  if (isSeniorOrExperiencedRole(title, cleanSnippet, rawJob.experienceLevel || '')) {
    return null;
  }

  // Extract skills from snippet / description text if rawJob is from Jooble
  let extractedSkills = rawJob.skills || [];
  if (extractedSkills.length === 0 && rawJob.snippet) {
    const commonSkills = ['React', 'JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'Node.js', 'SQL', 'Git', 'TypeScript', 'C++', 'Django', 'FastAPI', 'Spring Boot'];
    const found = commonSkills.filter(skill =>
      rawJob.snippet.toLowerCase().includes(skill.toLowerCase()) ||
      (title && title.toLowerCase().includes(skill.toLowerCase()))
    );
    extractedSkills = found.length > 0 ? found : ['Software Development', 'Problem Solving'];
  }

  const company = rawJob.company || rawJob.employer_name || 'Verified Employer';
  const rawSalary = rawJob.salary ? rawJob.salary.trim() : '';
  const displaySalary = rawSalary && rawSalary.length > 2 ? rawSalary : 'Salary not disclosed';
  const relativeDate = formatRelativePostedDate(rawJob.updated || rawJob.postedDate);

  // Experience level display for freshers
  let expDisplay = 'Fresher (0-1 yrs)';
  if (title.toLowerCase().includes('intern') || cleanSnippet.toLowerCase().includes('intern')) {
    expDisplay = 'Fresher (Internship)';
  } else if (title.toLowerCase().includes('trainee') || cleanSnippet.toLowerCase().includes('trainee')) {
    expDisplay = 'Fresher (Trainee)';
  } else if (cleanSnippet.toLowerCase().includes('0 years') || cleanSnippet.toLowerCase().includes('fresher')) {
    expDisplay = 'Fresher (0 years)';
  }

  const normalized = {
    id: String(rawJob.id || rawJob.job_id || `job-${Date.now()}-${index}`),
    title: title,
    company: company,
    companyLogo: rawJob.companyLogo || null,
    location: rawJob.location || 'India',
    workMode: rawJob.workMode || (cleanSnippet.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid'),
    jobType: rawJob.type || rawJob.jobType || 'Full-time',
    experienceLevel: expDisplay,
    salary: displaySalary,
    postedDate: relativeDate,
    rawPostedDate: rawJob.updated || rawJob.postedDate || new Date().toISOString(),
    description: cleanSnippet,
    skills: extractedSkills,
    requirements: rawJob.requirements || [
      'Graduation in Computer Science, IT, MCA, or relevant engineering branch.',
      'Basic understanding of programming fundamentals and web technologies.',
      'Strong problem-solving mindset and eagerness to learn.'
    ],
    benefits: rawJob.benefits || ['Mentorship Program', 'Health Cover', 'Career Growth'],
    isFresherFriendly: true, // 100% of jobs on JobTrack are strictly fresher friendly
    applyUrl: rawJob.link || rawJob.applyUrl || 'https://jooble.org',
    source: rawJob.source || 'Jooble'
  };

  // Cache normalized job
  JOBS_CACHE.set(normalized.id, normalized);
  return normalized;
};

/**
 * Cache manually registered jobs into memory
 */
export function cacheJobInService(job) {
  if (job && job.id) {
    JOBS_CACHE.set(String(job.id), job);
  }
}

/**
 * Unique job deduplication helper
 */
function deduplicateJobs(jobsList) {
  const seen = new Set();
  return jobsList.filter(job => {
    if (!job) return false;
    const key = `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}_${job.location.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Centralized Filter Application Engine
 */
export function applyJobFilters(jobsList, { experience, jobType, workMode, sortBy }) {
  let filtered = jobsList.filter(Boolean);

  // 1. Filter by Experience Level
  if (experience && experience !== 'all') {
    const exp = experience.toLowerCase();
    filtered = filtered.filter(j => {
      const expLevel = (j.experienceLevel || '').toLowerCase();
      if (exp === 'fresher') {
        return expLevel.includes('0 years') || expLevel.includes('0-1');
      }
      if (exp === 'trainee') {
        return expLevel.includes('trainee') || (j.jobType || '').toLowerCase().includes('trainee');
      }
      if (exp === 'intern') {
        return expLevel.includes('intern') || (j.jobType || '').toLowerCase().includes('intern');
      }
      return true;
    });
  }

  // 2. Filter by Job Type
  if (jobType && jobType !== 'all') {
    const jt = jobType.toLowerCase();
    filtered = filtered.filter(j => (j.jobType || '').toLowerCase().includes(jt));
  }

  // 3. Filter by Work Mode
  if (workMode && workMode !== 'all') {
    const wm = workMode.toLowerCase();
    filtered = filtered.filter(j => (j.workMode || '').toLowerCase().includes(wm));
  }

  // 4. Sort
  if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.rawPostedDate || 0) - new Date(a.rawPostedDate || 0));
  }

  return filtered;
}

/**
 * Fetch Jobs Service Layer using Jooble REST API with Mock Engine Backup
 */
export const fetchJobs = async ({
  query = '',
  location = '',
  experience = 'all',
  jobType = 'all',
  workMode = 'all',
  sortBy = 'newest',
  page = 1
} = {}) => {
  // Query Jooble strictly for entry-level fresher roles
  let searchKeywords = 'fresher entry level trainee intern software developer';
  if (query.trim()) {
    searchKeywords = `${query.trim()} fresher entry level`;
  }

  const searchLocation = location && location !== 'all' ? location : 'India';

  try {
    // Make POST request to Jooble API
    const response = await axios.post(JOOBLE_API_URL, {
      keywords: searchKeywords,
      location: searchLocation,
      page: page
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.data && response.data.jobs && response.data.jobs.length > 0) {
      let rawJoobleJobs = response.data.jobs
        .map((job, idx) => normalizeJobData(job, idx))
        .filter(Boolean); // Filters out any senior/experienced roles

      let deduplicated = deduplicateJobs(rawJoobleJobs);

      // Populate Cache
      deduplicated.forEach(j => JOBS_CACHE.set(j.id, j));

      // Apply Filter Pipeline
      let joobleJobs = applyJobFilters(deduplicated, { experience, jobType, workMode, sortBy });

      return {
        jobs: joobleJobs,
        total: joobleJobs.length,
        page,
        source: 'Jooble REST API'
      };
    }
  } catch (error) {
    console.warn('Jooble API call offline/limit, using local dataset engine:', error.message);
  }

  // Resilient Local Engine Filter Pipeline
  return new Promise((resolve) => {
    setTimeout(() => {
      let rawList = mockJobsData
        .map((j, idx) => normalizeJobData(j, idx))
        .filter(Boolean);

      let filtered = deduplicateJobs(rawList);

      // Populate Cache
      filtered.forEach(j => JOBS_CACHE.set(j.id, j));

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        filtered = filtered.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
        );
      }

      if (location.trim() && location !== 'all') {
        const loc = location.toLowerCase().trim();
        filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
      }

      // Apply Filter Pipeline
      filtered = applyJobFilters(filtered, { experience, jobType, workMode, sortBy });

      resolve({
        jobs: filtered,
        total: filtered.length,
        page,
        source: 'JobTrack Engine'
      });
    }, 250);
  });
};

/**
 * Fetch Job By ID Service Layer - Checks in-memory cache first before falling back
 */
export const fetchJobById = async (id) => {
  const targetId = String(id);

  // 1. Check in-memory cache
  if (JOBS_CACHE.has(targetId)) {
    return JOBS_CACHE.get(targetId);
  }

  // 2. Check mock dataset
  const foundMock = mockJobsData.find(j => String(j.id) === targetId);
  if (foundMock) {
    const normalized = normalizeJobData(foundMock);
    if (normalized) {
      JOBS_CACHE.set(targetId, normalized);
      return normalized;
    }
  }

  // 3. Fallback to first available cached job or first normalized mock job
  for (const job of JOBS_CACHE.values()) {
    if (job) return job;
  }

  const fallback = normalizeJobData(mockJobsData[0]);
  return fallback;
};
