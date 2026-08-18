import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem, STORAGE_KEYS } from '../utils/storage';

const ApplicationContext = createContext(null);

export const APPLICATION_STATUSES = ['Saved', 'Applied', 'Interview', 'Rejected', 'Selected'];

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(() => {
    const data = getStoredItem(STORAGE_KEYS.APPLICATIONS, []);
    return Array.isArray(data) ? data.filter(app => app && app.jobId) : [];
  });

  const getApplicationStatus = useCallback((jobId) => {
    if (!jobId) return null;
    const app = applications.find(a => String(a.jobId) === String(jobId));
    return app ? app.status : null;
  }, [applications]);

  const markAsApplied = useCallback((job, initialStatus = 'Applied') => {
    if (!job || (!job.id && !job.jobId)) return;

    const id = String(job.id || job.jobId);

    setApplications(prev => {
      const existingIndex = prev.findIndex(a => String(a.jobId) === id);
      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: initialStatus,
          updatedAt: now
        };
        setStoredItem(STORAGE_KEYS.APPLICATIONS, updated);
        return updated;
      }

      const newApp = {
        jobId: id,
        title: job.title,
        company: job.company,
        applicationUrl: job.applicationUrl || '',
        status: initialStatus,
        appliedAt: now,
        updatedAt: now
      };

      const updated = [newApp, ...prev];
      setStoredItem(STORAGE_KEYS.APPLICATIONS, updated);
      return updated;
    });
  }, []);

  const updateApplicationStatus = useCallback((jobId, newStatus) => {
    if (!jobId || !APPLICATION_STATUSES.includes(newStatus)) return;

    setApplications(prev => {
      const updated = prev.map(app => {
        if (String(app.jobId) === String(jobId)) {
          return {
            ...app,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return app;
      });
      setStoredItem(STORAGE_KEYS.APPLICATIONS, updated);
      return updated;
    });
  }, []);

  const removeApplication = useCallback((jobId) => {
    if (!jobId) return;

    setApplications(prev => {
      const updated = prev.filter(app => String(app.jobId) !== String(jobId));
      setStoredItem(STORAGE_KEYS.APPLICATIONS, updated);
      return updated;
    });
  }, []);

  const clearApplications = useCallback(() => {
    setApplications([]);
    removeStoredItem(STORAGE_KEYS.APPLICATIONS);
  }, []);

  const value = {
    applications,
    markAsApplied,
    updateApplicationStatus,
    removeApplication,
    getApplicationStatus,
    clearApplications
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
