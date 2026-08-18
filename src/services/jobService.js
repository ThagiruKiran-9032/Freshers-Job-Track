import apiClient from './api';
import { normalizeJob } from '../utils/normalizeJob';

/**
 * JobTrack IT Job Service
 * Provider: Jobicy IT Jobs API v2 (https://jobicy.com/api/v2/remote-jobs)
 *
 * Supported Jobicy Geo Enums: 'anywhere', 'apac', 'emea', 'usa', 'uk', 'japan'
 */
export async function getJobs({
  page = 1,
  level = 'Entry Level',
  category = '',
  location = '',
  company = '',
  search = ''
} = {}) {
  try {
    const params = {
      count: 50 // Fetch maximum available IT job pool
    };

    // Category / Stream mapping to valid Jobicy industry enum
    if (category && category !== 'all' && category.trim()) {
      const catLower = category.toLowerCase().trim();
      if (catLower.includes('data')) params.industry = 'data-science';
      else if (catLower.includes('qa') || catLower.includes('testing')) params.industry = 'qa';
      else if (catLower.includes('devops') || catLower.includes('cloud')) params.industry = 'devops';
      else if (catLower.includes('design') || catLower.includes('ux')) params.industry = 'supporting';
      else params.industry = 'engineering';
    }

    // Location mapping to VALID Jobicy geo enum ('anywhere', 'apac', 'usa', 'uk', 'emea', 'japan')
    // Prevents HTTP 400 errors from sending invalid geo enum strings
    if (location && location !== 'all' && location.trim()) {
      const locLower = location.toLowerCase().trim();
      if (locLower.includes('india') || locLower.includes('apac') || locLower.includes('asia') || locLower.includes('hyderabad') || locLower.includes('bangalore') || locLower.includes('chennai') || locLower.includes('pune') || locLower.includes('mumbai')) {
        params.geo = 'apac';
      } else if (locLower.includes('usa') || locLower.includes('us') || locLower.includes('america')) {
        params.geo = 'usa';
      } else if (locLower.includes('uk') || locLower.includes('britain') || locLower.includes('london')) {
        params.geo = 'uk';
      } else if (locLower.includes('japan') || locLower.includes('tokyo')) {
        params.geo = 'japan';
      } else if (locLower.includes('europe') || locLower.includes('emea')) {
        params.geo = 'emea';
      }
    }

    // Keyword mapping to Jobicy tag parameter
    if (search && search.trim()) {
      const tagQuery = search.toLowerCase().trim();
      if (['python', 'react', 'java', 'javascript', 'node', 'c++', 'sql', 'devops', 'qa'].includes(tagQuery)) {
        params.tag = tagQuery;
      }
    }

    const response = await apiClient.get('/remote-jobs', { params });

    if (response.data && response.data.jobs) {
      const rawJobs = response.data.jobs || [];

      // 1. Base Query Normalization: Only active, published jobs
      let normalizedJobs = rawJobs.map(normalizeJob).filter(Boolean);

      // 2. Consistent Filter Conditions: Search Keyword
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        normalizedJobs = normalizedJobs.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q))
        );
      }

      // 3. Consistent Filter Conditions: Stream / Category Subsetting
      if (category && category !== 'all' && category.trim()) {
        const catQuery = category.toLowerCase().trim();
        normalizedJobs = normalizedJobs.filter(job => {
          const jobCat = job.category.toLowerCase();
          if (catQuery.includes('data')) return jobCat.includes('data') || jobCat.includes('analytics');
          if (catQuery.includes('qa') || catQuery.includes('testing')) return jobCat.includes('qa') || jobCat.includes('testing') || jobCat.includes('test');
          if (catQuery.includes('ux') || catQuery.includes('design')) return jobCat.includes('ux') || jobCat.includes('design');
          if (catQuery.includes('devops') || catQuery.includes('cloud')) return jobCat.includes('devops') || jobCat.includes('cloud') || jobCat.includes('sys');
          return jobCat.includes('software') || jobCat.includes('engineering') || jobCat.includes('dev');
        });
      }

      // 4. Consistent Filter Conditions: Experience Level Subsetting
      if (level && level !== 'all') {
        if (level === 'Entry Level' || level === 'Internship') {
          const fresherFiltered = normalizedJobs.filter(job =>
            job.experienceLevel === 'Entry Level' ||
            /entry|junior|fresher|trainee|intern|associate|software/i.test(job.title)
          );
          if (fresherFiltered.length > 0) {
            normalizedJobs = fresherFiltered;
          }
        } else if (level === 'Senior Level') {
          normalizedJobs = normalizedJobs.filter(job => job.experienceLevel === 'Senior Level');
        }
      }

      // 5. Consistent Filter Conditions: Location Subsetting
      if (location && location !== 'all' && location.trim()) {
        const locQuery = location.toLowerCase().trim();
        const locFiltered = normalizedJobs.filter(job => job.location.toLowerCase().includes(locQuery));
        if (locFiltered.length > 0) {
          normalizedJobs = locFiltered;
        }
      }

      // 6. Consistent Filter Conditions: Company Subsetting
      if (company && company.trim()) {
        const compQuery = company.toLowerCase().trim();
        normalizedJobs = normalizedJobs.filter(job => job.company.toLowerCase().includes(compQuery));
      }

      // Exact total matching jobs count for current filter combination
      const totalMatchingCount = normalizedJobs.length;

      // Pagination calculation
      const perPage = 12;
      const pageCount = Math.max(1, Math.ceil(totalMatchingCount / perPage));
      const currentPage = Math.min(Math.max(1, parseInt(page, 10) || 1), pageCount);
      const paginatedJobs = normalizedJobs.slice((currentPage - 1) * perPage, currentPage * perPage);

      return {
        jobs: paginatedJobs,
        total: totalMatchingCount,
        page: currentPage,
        pageCount,
        totalPages: pageCount,
        source: 'Jobicy IT Jobs API',
        error: null
      };
    }

    return { jobs: [], total: 0, page: 1, pageCount: 1, totalPages: 1, source: 'Jobicy IT Jobs API', error: null };

  } catch (error) {
    let errorMessage = 'Unable to load IT job opportunities right now.';
    if (error.response) {
      errorMessage = `Job Service returned HTTP ${error.response.status}. Please try again later.`;
    } else if (error.request) {
      errorMessage = 'Network problem. Unable to connect to the IT Job Service.';
    }

    return { jobs: [], total: 0, page: 1, pageCount: 1, totalPages: 1, source: 'Jobicy IT Jobs API', error: errorMessage };
  }
}

/**
 * Fetch Job Details by ID from Jobicy IT Jobs API v2
 */
export async function getJobById(id) {
  if (!id) return null;

  try {
    const response = await apiClient.get('/remote-jobs', { params: { count: 50 } });
    if (response.data && response.data.jobs) {
      const rawJob = response.data.jobs.find(j => String(j.id) === String(id));
      if (rawJob) {
        return normalizeJob(rawJob);
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching IT job details:', error.message);
    return null;
  }
}
