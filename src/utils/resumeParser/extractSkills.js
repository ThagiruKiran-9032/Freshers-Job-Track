import { TECH_SKILLS_DICTIONARY } from './skillDictionary.js';

// Synonym normalization map
const SKILL_SYNONYMS = {
  'React.js': 'React',
  'Vue.js': 'Vue',
  'Node.js': 'Node.js',
  'Express.js': 'Express',
  'Fast API': 'FastAPI',
  'Tailwind CSS': 'Tailwind',
  'HTML5': 'HTML',
  'CSS3': 'CSS',
  'Amazon Web Services': 'AWS',
  'Google Cloud': 'GCP'
};

/**
 * Extract Technical Skills mentioned in candidate skills section with Synonym Normalization & Deduplication
 */
export function extractSkills(text = '') {
  if (!text) return [];

  const matchedSkills = new Set();

  TECH_SKILLS_DICTIONARY.forEach(skill => {
    const escSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    let regex;
    if (skill === 'C' || skill === 'R') {
      regex = new RegExp(`(?:^|\\s|,|\\/)${escSkill}(?:$|\\s|,|\\/)`, 'i');
    } else {
      regex = new RegExp(`\\b${escSkill}\\b`, 'i');
    }

    if (regex.test(text)) {
      const normalized = SKILL_SYNONYMS[skill] || skill;
      matchedSkills.add(normalized);
    }
  });

  return Array.from(matchedSkills);
}
