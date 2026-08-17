import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const ProfileContext = createContext(null);

const buildDefaultProfile = (user) => ({
  personal: {
    fullName: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    headline: 'Software Developer | Fresher',
    headlineSource: 'auto',
    bio: 'Passionate computer science fresher eager to build responsive web applications using modern programming principles.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  education: {
    degree: 'B.Tech / B.E.',
    branch: 'Computer Science & Engineering',
    college: 'National Institute of Technology',
    gradYear: '2026',
    cgpa: '8.6 / 10',
    achievements: 'Dean\'s List 2024, Winner of University Web Hackathon 2025'
  },
  preferences: {
    preferredRoles: ['Software Developer', 'Frontend Engineer', 'Software Engineer Trainee', 'Graduate Engineer'],
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune', 'Remote'],
    workMode: 'Hybrid',
    jobTypes: ['Full-time', 'Internship'],
    minSalary: '₹4,50,000 / year',
    experienceLevel: 'Fresher (0 years)'
  },
  skills: {
    technical: ['JavaScript', 'React.js', 'HTML5', 'CSS3', 'Python', 'SQL'],
    tools: ['Git & GitHub', 'VS Code', 'Vite', 'Postman'],
    soft: ['Problem Solving', 'Team Collaboration', 'Adaptability', 'Communication']
  }
});

export const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const userId = currentUser?.id || 'guest';
  const storageKey = `jt_profile_${userId}`;

  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Error reading profile from LocalStorage:', err);
    }
    return buildDefaultProfile(currentUser);
  });

  // Re-sync when currentUser changes
  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setProfileState(JSON.parse(saved));
        } else {
          const fresh = buildDefaultProfile(currentUser);
          setProfileState(fresh);
          localStorage.setItem(storageKey, JSON.stringify(fresh));
        }
      } catch (err) {
        console.error('Error syncing profile:', err);
      }
    }
  }, [userId]);

  const setProfile = (updater) => {
    setProfileState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving profile to LocalStorage:', err);
      }
      return next;
    });
  };

  const updatePersonal = (data) => {
    setProfile(prev => ({
      ...prev,
      personal: { ...prev.personal, ...data }
    }));
  };

  const updateEducation = (data) => {
    setProfile(prev => ({
      ...prev,
      education: { ...prev.education, ...data }
    }));
  };

  const updatePreferences = (data) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...data }
    }));
  };

  const addSkill = (category, skill) => {
    if (!skill || !skill.trim()) return;
    const cleanSkill = skill.trim();
    setProfile(prev => {
      const currentList = prev.skills[category] || [];
      if (currentList.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...currentList, cleanSkill]
        }
      };
    });
  };

  const removeSkill = (category, skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills[category] || []).filter(s => s !== skillToRemove)
      }
    }));
  };

  // Profile Completeness Score
  const completeness = useMemo(() => {
    let score = 0;
    let total = 10;

    if (profile?.personal?.fullName) score += 1;
    if (profile?.personal?.email) score += 1;
    if (profile?.personal?.location) score += 1;
    if (profile?.education?.degree) score += 1;
    if (profile?.education?.college) score += 1;
    if (profile?.education?.cgpa) score += 1;
    if (profile?.preferences?.preferredRoles?.length > 0) score += 1;
    if (profile?.preferences?.preferredLocations?.length > 0) score += 1;
    if (profile?.skills?.technical?.length >= 3) score += 1;
    if (profile?.skills?.tools?.length >= 2) score += 1;

    return Math.round((score / total) * 100);
  }, [profile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        completeness,
        updatePersonal,
        updateEducation,
        updatePreferences,
        addSkill,
        removeSkill,
        setProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
