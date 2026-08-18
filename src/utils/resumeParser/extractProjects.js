import { TECH_SKILLS_DICTIONARY } from './skillDictionary.js';

/**
 * Extract Academic & Personal Projects
 * Dynamically parses project entries strictly from actual resume text.
 */
export function extractProjects(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return [];

  let text = rawText;
  if (rawText.includes('PROJECTS :') || rawText.includes('PROJECTS')) {
    const match = rawText.match(/(?:ACADEMIC\s+PROJECTS|PERSONAL\s+PROJECTS|KEY\s+PROJECTS|PROJECTS)\s*:\s*([\s\S]*?)(?=(?:TECHNICAL\s+)?SKILLS|EXPERIENCE|EDUCATION|CERTIFICATIONS|DECLARATION|$)/i);
    if (match) text = match[1];
  }

  const projectList = [];
  const rawItems = text
    .split(/➤|•|\n/)
    .map(i => i.trim())
    .filter(i => i.length > 5);

  let currentTitle = '';
  let descriptions = [];

  rawItems.forEach(item => {
    if (item.toLowerCase().startsWith('projects') || item.toLowerCase().startsWith('academic projects')) return;

    if (!currentTitle && (item.toLowerCase().includes('application') || item.toLowerCase().includes('system') || item.toLowerCase().includes('project') || item.toLowerCase().includes('web') || item.toLowerCase().includes('using') || item.length < 80)) {
      currentTitle = item;
    } else {
      descriptions.push(item);
    }
  });

  if (currentTitle) {
    // Extract tech stack dynamically by searching TECH_SKILLS_DICTIONARY in project text
    const matchedTech = TECH_SKILLS_DICTIONARY.filter(tech => {
      const escTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escTech}\\b`, 'i');
      return regex.test(text);
    });

    // Extract project URL if present
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/i);
    const projectUrl = urlMatch ? urlMatch[0] : '';

    projectList.push({
      id: String(Date.now() + Math.random()),
      title: currentTitle.replace(/^[•➤\s]+/, '').trim(),
      techStack: matchedTech.length > 0 ? Array.from(new Set(matchedTech)).join(', ') : '',
      description: descriptions.length > 0 ? descriptions.join(' ') : '',
      projectUrl
    });
  }

  return projectList;
}
