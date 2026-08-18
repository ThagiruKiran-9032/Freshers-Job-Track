/**
 * Centralized JobTrack Base Query Model & Parameter Builder
 *
 * Base Scope Definition:
 * JobTrack is a job board for Freshers & Entry-Level candidates.
 * Base Query Scope = IT / Technology + Entry Level / Internship.
 *
 * Every specific stream or category filter inherits this EXACT base query,
 * ensuring: Stream Jobs Subset <= All Jobs Base Set.
 */

export const BASE_JOB_QUERY = {
  level: 'Entry Level',
  category: '',
  location: '',
  company: '',
  search: '',
  page: 1,
  sortBy: 'newest'
};

/**
 * Builds normalized API query parameters by merging specific overrides into the base query model.
 */
export function buildJobQuery(overrides = {}) {
  const query = {
    ...BASE_JOB_QUERY,
    ...overrides
  };

  // Ensure level always defaults to Entry Level if unassigned or empty
  if (!query.level || query.level === '') {
    query.level = 'Entry Level';
  }

  return query;
}
