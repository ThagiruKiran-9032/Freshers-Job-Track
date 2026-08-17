import { extractSections } from './extractSections';
import { extractPersonal } from './extractPersonal';
import { extractEducation } from './extractEducation';
import { extractSkills } from './extractSkills';
import { extractProjects } from './extractProjects';
import { extractExperience } from './extractExperience';
import { detectFresherStatus } from './fresherDetector';
import { generateSingleHeadline } from './headlineGenerator';

/**
 * Main Resume Parser Entry Point
 * Takes raw extracted resume text and builds a standardized structured profile.
 */
export function buildProfileFromResumeText(rawText) {
  const sections = extractSections(rawText);
  const personal = extractPersonal(rawText, sections.header);
  const education = extractEducation(sections.education, rawText);
  const skills = extractSkills(sections.skills, rawText);
  const projects = extractProjects(sections.projects, rawText);
  const experience = extractExperience(sections.experience);
  const fresherStatus = detectFresherStatus(rawText, experience, education);

  const confidenceFlags = {
    personal: Boolean(personal.name && personal.email),
    education: Boolean(education[0]?.degree || education[0]?.college),
    skills: skills.allSkillsList.length > 0,
    projects: projects.length > 0,
    experience: experience.length > 0
  };

  const gradYear = education[0]?.graduationYear ? education[0].graduationYear : '';

  // Extract candidate's actual professional summary / objective text from resume
  const actualSummaryText = (sections.summary || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();

  const bio = actualSummaryText && actualSummaryText.length > 10
    ? actualSummaryText
    : (skills.allSkillsList.length > 0 ? `Candidate skilled in ${skills.allSkillsList.slice(0, 5).join(', ')}.` : '');

  // Draft profile for headline generator
  const draftProfile = {
    personal: { bio },
    skills,
    projects,
    education: education[0] || {},
    fresherStatus
  };

  const singleGeneratedHeadline = generateSingleHeadline(draftProfile);

  return {
    personal: {
      fullName: personal.name || '',
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.location || '',
      headline: singleGeneratedHeadline,
      headlineSource: 'auto', // 'auto' or 'manual'
      bio: bio,
      linkedin: personal.linkedin || '',
      github: personal.github || '',
      portfolio: personal.portfolio || '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    education: {
      degree: education[0]?.degree || '',
      branch: education[0]?.branch || '',
      college: education[0]?.college || '',
      gradYear: gradYear,
      cgpa: education[0]?.cgpa || '',
      achievements: ''
    },
    preferences: {
      preferredRoles: skills.categorized.frontend.length > 0
        ? ['React Developer', 'Frontend Engineer', 'Software Engineer Trainee']
        : ['Software Developer', 'Software Trainee'],
      preferredLocations: personal.location ? [personal.location.split(',')[0], 'Remote'] : ['Remote'],
      workMode: 'Hybrid',
      jobTypes: ['Full-time', 'Internship'],
      minSalary: '₹4,50,000 / year',
      experienceLevel: fresherStatus.experienceLevel
    },
    skills: {
      technical: skills.allSkillsList,
      tools: skills.categorized.tools,
      soft: skills.softSkillsList && skills.softSkillsList.length > 0 ? skills.softSkillsList : ['Problem Solving', 'Teamwork & Collaboration']
    },
    projects: projects,
    experience: experience,
    fresherStatus,
    confidenceFlags
  };
}
