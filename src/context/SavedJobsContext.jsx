import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem, STORAGE_KEYS } from '../utils/storage';

const SavedJobsContext = createContext(null);

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState(() => {
    const data = getStoredItem(STORAGE_KEYS.SAVED_JOBS, []);
    return Array.isArray(data) ? data.filter(job => job && job.id) : [];
  });

  const isJobSaved = useCallback((jobId) => {
    if (!jobId) return false;
    return savedJobs.some(job => String(job.id) === String(jobId));
  }, [savedJobs]);

  const saveJob = useCallback((job) => {
    if (!job || !job.id) return;

    setSavedJobs(prev => {
      if (prev.some(j => String(j.id) === String(job.id))) return prev;

      const minimalJob = {
        id: String(job.id),
        title: job.title,
        company: job.company,
        location: job.location || 'Location not listed',
        experienceLevel: job.experienceLevel || 'Entry Level',
        jobType: job.jobType || 'Full-time',
        category: job.category || 'Technology',
        applicationUrl: job.applicationUrl || '',
        source: job.source || 'The Muse',
        savedAt: new Date().toISOString()
      };

      const updated = [minimalJob, ...prev];
      setStoredItem(STORAGE_KEYS.SAVED_JOBS, updated);
      return updated;
    });
  }, []);

  const removeSavedJob = useCallback((jobId) => {
    if (!jobId) return;

    setSavedJobs(prev => {
      const updated = prev.filter(job => String(job.id) !== String(jobId));
      setStoredItem(STORAGE_KEYS.SAVED_JOBS, updated);
      return updated;
    });
  }, []);

  const toggleSaveJob = useCallback((job) => {
    if (!job || !job.id) return;

    if (isJobSaved(job.id)) {
      removeSavedJob(job.id);
    } else {
      saveJob(job);
    }
  }, [isJobSaved, saveJob, removeSavedJob]);

  const clearSavedJobs = useCallback(() => {
    setSavedJobs([]);
    removeStoredItem(STORAGE_KEYS.SAVED_JOBS);
  }, []);

  const value = {
    savedJobs,
    saveJob,
    removeSavedJob,
    toggleSaveJob,
    isJobSaved,
    clearSavedJobs
  };

  return (
    <SavedJobsContext.Provider value={value}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}
