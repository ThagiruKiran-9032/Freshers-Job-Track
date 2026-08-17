/**
 * Resume Section Segmenter
 * Divides raw resume text into named section blocks based on common section headers.
 */

const SECTION_HEADERS = {
  education: [
    /\beducation\b/i, /\bacademic background\b/i, /\bacademics?\b/i,
    /\bacademic qualifications?\b/i, /\beducation & qualifications\b/i, /\bqualification\b/i
  ],
  skills: [
    /\bskills\b/i, /\btechnical skills\b/i, /\btech stack\b/i,
    /\bskills & tools\b/i, /\btechnologies\b/i, /\bcore competencies\b/i, /\bkey skills\b/i, /\bdomain skills\b/i
  ],
  experience: [
    /\bwork experience\b/i, /\bprofessional experience\b/i, /\bemployment history\b/i,
    /\binternships?\b/i, /\bexperience\b/i, /\bwork history\b/i
  ],
  projects: [
    /\bprojects\b/i, /\bacademic projects\b/i, /\bpersonal projects\b/i,
    /\bkey projects\b/i, /\bportfolio projects\b/i, /\bfeatured projects\b/i
  ],
  certifications: [
    /\bcertifications?\b/i, /\bcertificates?\b/i, /\bachievements?\b/i,
    /\bawards?\b/i, /\blicenses & certifications\b/i, /\btrainings?\b/i
  ],
  summary: [
    /\bprofessional summary\b/i, /\bprofile summary\b/i, /\bcareer objective\b/i,
    /\bsummary\b/i, /\babout me\b/i, /\bobjective\b/i, /\bprofile\b/i, /\bexecutive summary\b/i
  ]
};

export function extractSections(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const sections = {
    header: [],
    summary: [],
    education: [],
    skills: [],
    experience: [],
    projects: [],
    certifications: []
  };

  let currentSection = 'header';

  for (const line of lines) {
    const cleanLine = line.replace(/[:\-|_=]+$/, '').trim();
    let matchedHeader = null;

    if (cleanLine.length < 50) {
      for (const [sectionKey, regexes] of Object.entries(SECTION_HEADERS)) {
        if (regexes.some(r => r.test(cleanLine))) {
          matchedHeader = sectionKey;
          break;
        }
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
    } else {
      if (sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }
  }

  const result = {};
  for (const key in sections) {
    result[key] = sections[key].join('\n');
  }

  return result;
}
