import { detectSections } from './sectionDetector.js';
import { extractContact, deduplicateLinks } from './extractContact.js';
import { extractSkills } from './extractSkills.js';
import { extractEducation } from './extractEducation.js';
import { extractExperience } from './extractExperience.js';
import { extractProjects } from './extractProjects.js';
import { extractCertifications } from './extractCertifications.js';

/**
 * Main Resume Parser Orchestrator
 * Parses raw text & embedded document link metadata into a structured Candidate Profile following strict schema guidelines.
 * 100% dynamic, deterministic, and independent of any sample resume data.
 */
export function parseResumeText(rawText = '', embeddedLinks = []) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      name: null,
      email: null,
      phone: null,
      location: null,
      summary: null,
      skills: [],
      experience: [],
      internships: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      personal: {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        location: ''
      },
      links: []
    };
  }

  // 1. Detect sections dynamically
  const sections = detectSections(rawText);

  // 2. Extract contact information
  const contact = extractContact(sections.contact || rawText, embeddedLinks);

  // 3. Deduplicate extracted links metadata for UI presentation
  const links = deduplicateLinks(embeddedLinks, contact.name);

  // 4. Extract technical skills
  const skills = extractSkills(sections.skills || rawText);

  // 5. Extract education
  const education = extractEducation(sections.education || rawText);

  // 6. Extract experience / internships
  const allExperience = extractExperience(sections.experience || rawText);
  const experience = allExperience;
  const internships = allExperience.filter(e => e.is_internship);

  // 7. Extract projects
  const projects = extractProjects(sections.projects || rawText);

  // 8. Extract certifications
  const certifications = extractCertifications(sections.certifications || rawText);

  const personal = {
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    linkedin: contact.linkedin || '',
    github: contact.github || '',
    portfolio: contact.portfolio || '',
    location: contact.location || ''
  };

  return {
    name: contact.name || null,
    email: contact.email || null,
    phone: contact.phone || null,
    location: contact.location || null,
    summary: null,
    skills,
    experience,
    internships,
    education,
    projects,
    certifications,
    languages: [],
    personal,
    links
  };
}
