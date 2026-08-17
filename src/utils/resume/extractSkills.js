/**
 * Skills Taxonomy Extractor, Normalizer & Soft Skills Engine
 */

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SKILL_TAXONOMY = {
  programming: [
    { canonical: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'es6+'] },
    { canonical: 'TypeScript', aliases: ['typescript', 'ts'] },
    { canonical: 'Python', aliases: ['python', 'py', 'python3'] },
    { canonical: 'Java', aliases: ['java', 'core java', 'java8', 'java11'] },
    { canonical: 'C++', aliases: ['c++', 'cpp'] },
    { canonical: 'C', aliases: ['c lang', 'c language'] },
    { canonical: 'C#', aliases: ['c#', 'csharp'] },
    { canonical: 'SQL', aliases: ['sql', 't-sql', 'pl-sql'] }
  ],
  frontend: [
    { canonical: 'React.js', aliases: ['react', 'reactjs', 'react.js'] },
    { canonical: 'HTML5', aliases: ['html', 'html5'] },
    { canonical: 'CSS3', aliases: ['css', 'css3'] },
    { canonical: 'Redux', aliases: ['redux', 'redux toolkit'] },
    { canonical: 'TailwindCSS', aliases: ['tailwind', 'tailwindcss'] },
    { canonical: 'Bootstrap', aliases: ['bootstrap'] },
    { canonical: 'Vue.js', aliases: ['vue', 'vuejs'] },
    { canonical: 'Next.js', aliases: ['next.js', 'nextjs'] },
    { canonical: 'Angular', aliases: ['angular', 'angularjs'] }
  ],
  backend: [
    { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js'] },
    { canonical: 'Express.js', aliases: ['express', 'expressjs'] },
    { canonical: 'Django', aliases: ['django'] },
    { canonical: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring'] },
    { canonical: 'REST APIs', aliases: ['rest', 'rest api', 'restful api', 'restful apis'] },
    { canonical: 'FastAPI', aliases: ['fastapi', 'fast api'] },
    { canonical: 'Flask', aliases: ['flask'] }
  ],
  databases: [
    { canonical: 'MongoDB', aliases: ['mongodb', 'mongo'] },
    { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'postgresql db'] },
    { canonical: 'MySQL', aliases: ['mysql'] },
    { canonical: 'Firebase', aliases: ['firebase'] },
    { canonical: 'Oracle', aliases: ['oracle'] },
    { canonical: 'Redis', aliases: ['redis'] }
  ],
  tools: [
    { canonical: 'Git & GitHub', aliases: ['git', 'github', 'version control', 'gitlab'] },
    { canonical: 'VS Code', aliases: ['vs code', 'vscode', 'visual studio code'] },
    { canonical: 'Vite', aliases: ['vite'] },
    { canonical: 'Docker', aliases: ['docker'] },
    { canonical: 'Postman', aliases: ['postman'] },
    { canonical: 'Figma', aliases: ['figma'] },
    { canonical: 'Jira', aliases: ['jira'] },
    { canonical: 'Linux', aliases: ['linux', 'ubuntu'] }
  ]
};

const SOFT_SKILLS_TAXONOMY = [
  { canonical: 'Problem Solving', keywords: ['problem solving', 'problem-solving', 'analytical thinking'] },
  { canonical: 'Teamwork & Collaboration', keywords: ['teamwork', 'collaboration', 'collaborative', 'team player'] },
  { canonical: 'Effective Communication', keywords: ['communication', 'verbal communication', 'written communication'] },
  { canonical: 'Time Management', keywords: ['time management', 'punctual', 'deadline-driven'] },
  { canonical: 'Adaptability', keywords: ['adaptability', 'adaptable', 'fast learner', 'quick learner'] },
  { canonical: 'Critical Thinking', keywords: ['critical thinking', 'decision making'] },
  { canonical: 'Leadership', keywords: ['leadership', 'lead', 'initiative'] },
  { canonical: 'Agile & Scrum', keywords: ['agile', 'scrum', 'sprint'] }
];

function cleanSkillToken(token) {
  if (!token) return '';
  // Clean orphan parens and leading/trailing special characters
  let clean = token.replace(/^[^\w+#.]+|[^\w+#.]+$|[()]/g, '').trim();

  // Common typo & alias corrections
  if (/^fast\s*api$/i.test(clean)) return 'FastAPI';
  if (/^python\s*oop$/i.test(clean)) return 'Python (OOP)';
  if (/^html$/i.test(clean)) return 'HTML5';
  if (/^css$/i.test(clean)) return 'CSS3';
  if (/^react$/i.test(clean)) return 'React.js';
  if (/^node$/i.test(clean)) return 'Node.js';
  if (/^express$/i.test(clean)) return 'Express.js';
  if (/^vue$/i.test(clean)) return 'Vue.js';
  if (/^git$/i.test(clean)) return 'Git & GitHub';

  return clean;
}

export function extractSkills(skillsText, rawText) {
  const combined = `${skillsText}\n${rawText}`;
  const combinedLower = combined.toLowerCase();

  const categorized = {
    programming: [],
    frontend: [],
    backend: [],
    databases: [],
    tools: [],
    other: []
  };

  const canonicalSkillsSet = new Set();
  const rawCleanSkillsMap = new Map(); // lowercase -> clean formatted

  // 1. Taxonomy Matching
  for (const [category, list] of Object.entries(SKILL_TAXONOMY)) {
    for (const skillObj of list) {
      const matchFound = skillObj.aliases.some(alias => {
        const escaped = escapeRegExp(alias);
        const regex = new RegExp(`(?:^|\\s|\\b|[,:|/])${escaped}(?:\\b|\\s|$|[,:|/])`, 'i');
        return regex.test(combinedLower);
      });

      if (matchFound && !canonicalSkillsSet.has(skillObj.canonical)) {
        canonicalSkillsSet.add(skillObj.canonical);
        rawCleanSkillsMap.set(skillObj.canonical.toLowerCase(), skillObj.canonical);
        categorized[category].push(skillObj.canonical);
      }
    }
  }

  // 2. Direct parsing of skillsText lines
  if (skillsText && skillsText.trim()) {
    const lines = skillsText.split(/\n|;|\|/);
    for (const line of lines) {
      const cleanLine = line.replace(/^[•\-*:]+/, '').trim();
      if (!cleanLine) continue;

      const parts = cleanLine.split(/[,:]/);
      for (const p of parts) {
        const cleaned = cleanSkillToken(p);
        if (
          cleaned.length >= 2 &&
          cleaned.length <= 30 &&
          !/skills|languages|frameworks|tools|technologies|database|other/i.test(cleaned)
        ) {
          const lower = cleaned.toLowerCase();
          if (!rawCleanSkillsMap.has(lower) && !canonicalSkillsSet.has(cleaned)) {
            // Deduplicate HTML / HTML5 & CSS / CSS3
            if (lower === 'html' && rawCleanSkillsMap.has('html5')) continue;
            if (lower === 'css' && rawCleanSkillsMap.has('css3')) continue;

            rawCleanSkillsMap.set(lower, cleaned);
            categorized.other.push(cleaned);
          }
        }
      }
    }
  }

  // Deduplicated final skills list
  const allSkillsList = Array.from(rawCleanSkillsMap.values());

  // 3. Soft Skills Extraction
  const softSkillsSet = new Set();
  for (const item of SOFT_SKILLS_TAXONOMY) {
    const found = item.keywords.some(kw => {
      const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
      return regex.test(combinedLower);
    });
    if (found) {
      softSkillsSet.add(item.canonical);
    }
  }

  // Default soft skills if sparse
  if (softSkillsSet.size === 0) {
    softSkillsSet.add('Problem Solving');
    softSkillsSet.add('Teamwork & Collaboration');
  }

  return {
    categorized,
    allSkillsList,
    softSkillsList: Array.from(softSkillsSet)
  };
}
