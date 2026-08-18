/**
 * Section Detector: Reliably segments resume text into isolated section blocks.
 * Supports both line-break headings and inline headings (e.g. "PROJECTS : ... CERTIFICATIONS : ...").
 */
export function detectSections(text = '') {
  if (!text) {
    return {
      contact: '',
      objective: '',
      education: '',
      skills: '',
      experience: '',
      projects: '',
      certifications: ''
    };
  }

  // Define section keywords and their regex patterns
  const sectionPatterns = [
    { key: 'education', regex: /(?:EDUCATION|ACADEMIC\s+BACKGROUND|EDUCATIONAL\s+QUALIFICATIONS)\s*[:\n]/i },
    { key: 'experience', regex: /(?:INTERNSHIP|INTERNSHIPS|WORK\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT)\s*[:\n]/i },
    { key: 'skills', regex: /(?:TECHNICAL\s+SKILLS|SKILLS\s+&\s+TOOLS|SKILLS|TECHNOLOGIES)\s*[:\n]/i },
    { key: 'projects', regex: /(?:ACADEMIC\s+PROJECTS|PERSONAL\s+PROJECTS|KEY\s+PROJECTS|PROJECTS)\s*[:\n]/i },
    { key: 'certifications', regex: /(?:LICENSES\s+&\s+CERTIFICATIONS|CERTIFICATIONS|CERTIFICATES|ACHIEVEMENTS)\s*[:\n]/i },
    { key: 'declaration', regex: /(?:DECLARATION)\s*[:\n]/i }
  ];

  // Find all matches with their start positions
  const matches = [];
  sectionPatterns.forEach(({ key, regex }) => {
    const match = regex.exec(text);
    if (match) {
      matches.push({
        key,
        index: match.index,
        endIndex: match.index + match[0].length
      });
    }
  });

  // Sort matches by index order
  matches.sort((a, b) => a.index - b.index);

  const sections = {
    contact: '',
    education: '',
    skills: '',
    experience: '',
    projects: '',
    certifications: ''
  };

  if (matches.length === 0) {
    // Fallback: entire text in contact
    sections.contact = text;
    return sections;
  }

  // Header / Contact section is everything before the first section match
  sections.contact = text.substring(0, matches[0].index);

  // Extract content between section headers
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    const contentStart = current.endIndex;
    const contentEnd = next ? next.index : text.length;

    const content = text.substring(contentStart, contentEnd).trim();

    if (current.key !== 'declaration' && sections.hasOwnProperty(current.key)) {
      sections[current.key] = content;
    }
  }

  return sections;
}
