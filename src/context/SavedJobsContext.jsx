import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const userId = currentUser?.id || 'guest';
  const storageKey = `jt_saved_jobs_${userId}`;

  const [savedJobs, setSavedJobsState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading saved jobs:', err);
      return [];
    }
  });

  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(storageKey);
        setSavedJobsState(saved ? JSON.parse(saved) : []);
      } catch (err) {
        console.error('Error syncing saved jobs:', err);
      }
    }
  }, [userId]);

  const setSavedJobs = (updater) => {
    setSavedJobsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving jobs:', err);
      }
      return next;
    });
  };

  const saveJob = (job) => {
    if (!job || !job.id) return;
    setSavedJobs(prev => {
      if (prev.some(j => String(j.id) === String(job.id))) return prev;
      return [job, ...prev];
    });
  };

  const unsaveJob = (jobId) => {
    setSavedJobs(prev => prev.filter(j => String(j.id) !== String(jobId)));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(j => String(j.id) === String(jobId));
  };

  const toggleSaveJob = (job) => {
    if (isJobSaved(job.id)) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        saveJob,
        unsaveJob,
        isJobSaved,
        toggleSaveJob
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};
