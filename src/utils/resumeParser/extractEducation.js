/**
 * Extract Education Entries (Degree, Institution, Year, Score/CGPA)
 * Dynamically parses educational qualifications strictly from actual resume text.
 */
export function extractEducation(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return [];

  let cleanText = rawText;
  if (rawText.includes('EDUCATION :') || rawText.includes('EDUCATION')) {
    const match = rawText.match(/(?:EDUCATION\s+BACKGROUND|EDUCATIONAL\s+QUALIFICATIONS|ACADEMIC\s+BACKGROUND|EDUCATION)\s*:\s*([\s\S]*?)(?=(?:TECHNICAL\s+)?SKILLS|EXPERIENCE|INTERNSHIPS|PROJECTS|CERTIFICATIONS|DECLARATION|$)/i);
    if (match) cleanText = match[1];
  }

  const educationList = [];
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // Common degree patterns
  const degreePatterns = [
    /Bachelor[^\n\|,]*/i,
    /B\.Tech[^\n\|,]*/i,
    /B\.E\.[^\n\|,]*/i,
    /B\.S\.[^\n\|,]*/i,
    /B\.Sc[^\n\|,]*/i,
    /Master[^\n\|,]*/i,
    /M\.Tech[^\n\|,]*/i,
    /M\.E\.[^\n\|,]*/i,
    /M\.S\.[^\n\|,]*/i,
    /M\.Sc[^\n\|,]*/i,
    /MBA[^\n\|,]*/i,
    /Diploma[^\n\|,]*/i,
    /Intermediate[^\n\|,]*/i,
    /12th[^\n\|,]*/i,
    /10th[^\n\|,]*/i,
    /SSC[^\n\|,]*/i,
    /High\s+School[^\n\|,]*/i
  ];

  // Group lines by education entries
  let currentEntry = null;

  lines.forEach(line => {
    // Check if line contains a degree
    let matchedDegree = null;
    for (const pat of degreePatterns) {
      const match = line.match(pat);
      if (match) {
        matchedDegree = match[0].trim();
        break;
      }
    }

    if (matchedDegree) {
      if (currentEntry) {
        educationList.push(currentEntry);
      }

      // Extract institution if present on line
      const instMatch = line.match(/([A-Z][a-zA-Z\s,\.\&]+(?:Institute|College|University|School|Academy|Polytechnic)[a-zA-Z\s,\.]*)/i);
      const institution = instMatch ? instMatch[1].replace(matchedDegree, '').trim() : '';

      // Extract year
      const yearMatch = line.match(/\b(?:20\d{2}\s*[-–]\s*20\d{2}|20\d{2})\b/);
      const year = yearMatch ? yearMatch[0].trim() : '';

      // Extract score
      const scoreMatch = line.match(/(?:CGPA|Percentage|GPA|Score)\s*:\s*[0-9\.\%\/]+/i) || line.match(/\b\d+(\.\d+)?\s*(?:%|\/\s*10)\b/i);
      const score = scoreMatch ? scoreMatch[0].trim() : '';

      currentEntry = {
        id: String(Date.now() + Math.random()),
        degree: matchedDegree,
        institution,
        year,
        score
      };
    } else if (currentEntry) {
      // Look for institution, year, or score in following lines of the entry
      if (!currentEntry.institution) {
        const instMatch = line.match(/([A-Z][a-zA-Z\s,\.\&]+(?:Institute|College|University|School|Academy|Polytechnic)[a-zA-Z\s,\.]*)/i);
        if (instMatch) currentEntry.institution = instMatch[1].trim();
      }

      if (!currentEntry.year) {
        const yearMatch = line.match(/\b(?:20\d{2}\s*[-–]\s*20\d{2}|20\d{2})\b/);
        if (yearMatch) currentEntry.year = yearMatch[0].trim();
      }

      if (!currentEntry.score) {
        const scoreMatch = line.match(/(?:CGPA|Percentage|GPA|Score)\s*:\s*[0-9\.\%\/]+/i) || line.match(/\b\d+(\.\d+)?\s*(?:%|\/\s*10)\b/i);
        if (scoreMatch) currentEntry.score = scoreMatch[0].trim();
      }
    }
  });

  if (currentEntry) {
    educationList.push(currentEntry);
  }

  // Deduplicate entries by degree name
  const uniqueList = [];
  educationList.forEach(item => {
    if (!uniqueList.some(u => u.degree.toLowerCase() === item.degree.toLowerCase())) {
      uniqueList.push(item);
    }
  });

  return uniqueList;
}
