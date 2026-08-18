import { useState, useEffect, useCallback, useRef } from 'react';
import { getJobs } from '../services/jobService';

/**
 * Custom hook to fetch real job listings driven by active URL query parameters.
 * Prevents stale responses and guarantees 100% synchronization with real API metadata.
 */
export function useJobs(params = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);

  // Request sequence counter to discard stale out-of-order responses
  const requestIdRef = useRef(0);

  const {
    search = '',
    location = '',
    category = '',
    level = 'Entry Level',
    company = '',
    page = 1,
    sortBy = 'newest'
  } = params;

  const fetchJobs = useCallback(async () => {
    // Increment request ID for new request cycle
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: Math.max(1, parseInt(page, 10) || 1),
        level,
        category,
        location,
        company,
        search
      };

      const result = await getJobs(queryParams);

      // Check if a newer request was dispatched while this request was in flight
      if (currentRequestId !== requestIdRef.current) {
        return; // Discard stale out-of-order response
      }

      if (result.error) {
        setError(result.error);
        setJobs([]);
        setTotal(0);
        setPageCount(1);
      } else {
        let fetched = result.jobs || [];

        // Apply client-side sorting if requested
        if (sortBy === 'oldest') {
          fetched = [...fetched].reverse();
        }

        setJobs(fetched);
        setTotal(result.total !== undefined ? result.total : fetched.length);
        setPageCount(result.pageCount || result.totalPages || 1);
      }
    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        setError('Unable to load opportunities right now.');
        setJobs([]);
        setTotal(0);
        setPageCount(1);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [search, location, category, level, company, page, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    pageCount,
    totalCount: total,
    total,
    refetch: fetchJobs
  };
}
