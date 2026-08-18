import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem, STORAGE_KEYS } from '../utils/storage';

const INITIAL_PROFILE = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: []
};

const ProfileContext = createContext(null);

/**
 * Calculate profile completeness percentage and missing sections based on real candidate data
 */
export function calculateProfileCompleteness(profile) {
  if (!profile) return { percentage: 0, missingFields: ['Name', 'Email', 'Skills', 'Education', 'Projects'] };

  const { personal = {}, skills = [], education = [], experience = [], projects = [], certifications = [] } = profile;

  const checks = [
    { name: 'Name', present: Boolean(personal.name && personal.name.trim()), weight: 15 },
    { name: 'Email', present: Boolean(personal.email), weight: 15 },
    { name: 'Phone', present: Boolean(personal.phone), weight: 10 },
    { name: 'Location', present: Boolean(personal.location), weight: 10 },
    { name: 'LinkedIn', present: Boolean(personal.linkedin), weight: 10 },
    { name: 'Skills', present: skills.length > 0, weight: 15 },
    { name: 'Education', present: education.length > 0, weight: 15 },
    { name: 'Projects / Experience', present: projects.length > 0 || experience.length > 0, weight: 10 }
  ];

  const earnedScore = checks.reduce((sum, item) => sum + (item.present ? item.weight : 0), 0);
  const missingFields = checks.filter(item => !item.present).map(item => item.name);

  return {
    percentage: Math.min(100, earnedScore),
    missingFields
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    const data = getStoredItem(STORAGE_KEYS.PROFILE, null);
    return data && typeof data === 'object' ? data : INITIAL_PROFILE;
  });

  const updateProfile = useCallback((newProfile) => {
    setProfileState(newProfile);
    setStoredItem(STORAGE_KEYS.PROFILE, newProfile);
  }, []);

  const updatePersonal = useCallback((personalData) => {
    setProfileState(prev => {
      const updated = {
        ...prev,
        personal: { ...prev.personal, ...personalData }
      };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const updateSkills = useCallback((newSkills) => {
    setProfileState(prev => {
      const updated = { ...prev, skills: newSkills };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const updateEducation = useCallback((newEducation) => {
    setProfileState(prev => {
      const updated = { ...prev, education: newEducation };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const updateExperience = useCallback((newExperience) => {
    setProfileState(prev => {
      const updated = { ...prev, experience: newExperience };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const updateProjects = useCallback((newProjects) => {
    setProfileState(prev => {
      const updated = { ...prev, projects: newProjects };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const updateCertifications = useCallback((newCertifications) => {
    setProfileState(prev => {
      const updated = { ...prev, certifications: newCertifications };
      setStoredItem(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(INITIAL_PROFILE);
    removeStoredItem(STORAGE_KEYS.PROFILE);
  }, []);

  const value = {
    profile,
    updateProfile,
    updatePersonal,
    updateSkills,
    updateEducation,
    updateExperience,
    updateProjects,
    updateCertifications,
    clearProfile,
    completeness: calculateProfileCompleteness(profile)
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
