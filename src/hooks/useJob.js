import { useState, useEffect, useCallback } from 'react';
import { getJobById } from '../services/jobService';

export function useJob(id) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!id) {
      setError('Job ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getJobById(id);
      if (data) {
        setJob(data);
      } else {
        setError('Opportunity not found. This job listing may have been removed or is no longer available.');
        setJob(null);
      }
    } catch (err) {
      setError('We couldn\'t load this opportunity. Please try again.');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    retry: fetchJob
  };
}
