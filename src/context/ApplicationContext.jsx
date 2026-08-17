import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const ApplicationContext = createContext(null);

export const APPLICATION_STAGES = [
  { id: 'Saved', label: 'Saved', color: 'var(--stage-saved)' },
  { id: 'Applied', label: 'Applied', color: 'var(--stage-applied)' },
  { id: 'Screening', label: 'Screening', color: 'var(--stage-screening)' },
  { id: 'Assessment', label: 'Assessment', color: 'var(--stage-assessment)' },
  { id: 'Interview', label: 'Interview', color: 'var(--stage-interview)' },
  { id: 'Offer', label: 'Offer 🎉', color: 'var(--stage-offer)' },
  { id: 'Rejected', label: 'Rejected', color: 'var(--stage-rejected)' }
];

const defaultApplications = [
  {
    id: 'app-201',
    jobId: 'job-101',
    title: 'Junior React Developer',
    company: 'TechCraft Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
    location: 'Bengaluru, India',
    status: 'Interview',
    appliedDate: '2026-08-05',
    resumeVersion: 'Frontend Developer Resume v2',
    recruiterName: 'Priya Mehta',
    recruiterEmail: 'priya@techcraft.example.com',
    followUpDate: '2026-08-18',
    notes: 'Technical round scheduled focusing on React hooks, state management, and virtual DOM concepts.'
  },
  {
    id: 'app-202',
    jobId: 'job-102',
    title: 'Software Engineer Trainee',
    company: 'Nexus Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=150',
    location: 'Hyderabad, India',
    status: 'Assessment',
    appliedDate: '2026-08-10',
    resumeVersion: 'General Fresher Resume',
    recruiterName: 'Anil Kumar',
    recruiterEmail: 'careers@nexus.example.com',
    followUpDate: '2026-08-19',
    notes: 'Completed HackerRank online coding assessment. Awaiting results.'
  },
  {
    id: 'app-203',
    jobId: 'job-103',
    title: 'Frontend Development Intern',
    company: 'CloudPulse Systems',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=150',
    location: 'Remote',
    status: 'Screening',
    appliedDate: '2026-08-12',
    resumeVersion: 'Frontend Developer Resume v2',
    recruiterName: 'Sarah Jenkins',
    recruiterEmail: 'hr@cloudpulse.example.com',
    followUpDate: '2026-08-20',
    notes: 'HR phone screening completed. Submitted GitHub portfolio links.'
  }
];

export const ApplicationProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const userId = currentUser?.id || 'guest';
  const storageKey = `jt_applications_${userId}`;

  const [applications, setApplicationsState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Error loading applications:', err);
    }
    return defaultApplications;
  });

  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setApplicationsState(JSON.parse(saved));
        } else {
          setApplicationsState(defaultApplications);
          localStorage.setItem(storageKey, JSON.stringify(defaultApplications));
        }
      } catch (err) {
        console.error('Error syncing applications:', err);
      }
    }
  }, [userId]);

  const setApplications = (updater) => {
    setApplicationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving applications:', err);
      }
      return next;
    });
  };

  const addApplication = (job, status = 'Applied', extra = {}) => {
    const newApp = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      status: status,
      appliedDate: new Date().toISOString().split('T')[0],
      resumeVersion: extra.resumeVersion || 'General Fresher Resume',
      recruiterName: extra.recruiterName || '',
      recruiterEmail: extra.recruiterEmail || '',
      followUpDate: extra.followUpDate || '',
      notes: extra.notes || 'Application logged in JobTrack.'
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const updateApplicationDetails = (id, data) => {
    setApplications(prev => prev.map(app =>
      app.id === id ? { ...app, ...data } : app
    ));
  };

  const deleteApplication = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplicationStatus,
        updateApplicationDetails,
        deleteApplication
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
