import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const InterviewContext = createContext(null);

const defaultInterviews = [
  {
    id: 'int-301',
    company: 'TechCraft Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
    jobTitle: 'Junior React Developer',
    roundType: 'Technical Round 1',
    date: '2026-08-18',
    time: '11:00 AM',
    interviewerName: 'Priya Mehta (Lead UI Architect)',
    meetingLink: 'https://meet.google.com/xyz-abc-def',
    notes: 'Focus on React virtual DOM, hooks (useEffect, useMemo), and state management patterns.',
    status: 'Upcoming'
  },
  {
    id: 'int-302',
    company: 'CloudPulse Systems',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=150',
    jobTitle: 'Frontend Development Intern',
    roundType: 'HR Screening',
    date: '2026-08-12',
    time: '03:00 PM',
    interviewerName: 'Sarah Jenkins',
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'Discussed graduation date, availability for 6-month internship, and portfolio projects.',
    status: 'Completed'
  }
];

export const InterviewProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const userId = currentUser?.id || 'guest';
  const storageKey = `jt_interviews_${userId}`;

  const [interviews, setInterviewsState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Error loading interviews:', err);
    }
    return defaultInterviews;
  });

  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setInterviewsState(JSON.parse(saved));
        } else {
          setInterviewsState(defaultInterviews);
          localStorage.setItem(storageKey, JSON.stringify(defaultInterviews));
        }
      } catch (err) {
        console.error('Error syncing interviews:', err);
      }
    }
  }, [userId]);

  const setInterviews = (updater) => {
    setInterviewsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving interviews:', err);
      }
      return next;
    });
  };

  const addInterview = (data) => {
    const newInt = {
      id: `int-${Date.now()}`,
      status: 'Upcoming',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      ...data
    };
    setInterviews(prev => [newInt, ...prev]);
  };

  const updateInterview = (id, data) => {
    setInterviews(prev => prev.map(item =>
      item.id === id ? { ...item, ...data } : item
    ));
  };

  const deleteInterview = (id) => {
    setInterviews(prev => prev.filter(item => item.id !== id));
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        addInterview,
        updateInterview,
        deleteInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviews = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
