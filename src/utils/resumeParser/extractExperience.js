/**
 * Extract Experience & Internship Entries
 * Deterministically parses experience entries and classifies internships strictly from explicit resume text.
 */
export function extractExperience(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return [];

  let expText = rawText;
  const sectionHeaderRegex = /(?:INTERNSHIPS|INTERNSHIP\s+EXPERIENCE|INTERNSHIP|WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT|WORK\s+HISTORY)\s*[:\n]?/i;
  const match = rawText.match(sectionHeaderRegex);

  const isInternshipSection = Boolean(rawText.match(/(?:INTERNSHIPS|INTERNSHIP\s+EXPERIENCE|INTERNSHIP)/i));

  if (match) {
    const startIdx = match.index + match[0].length;
    const endMatch = rawText.substring(startIdx).match(/(?:\n|\s{2,})(?:TECHNICAL\s+SKILLS|SKILLS|PROJECTS|EDUCATION|CERTIFICATIONS|DECLARATION|ACHIEVEMENTS|LANGUAGES)\s*[:\n]/i);
    expText = rawText.substring(startIdx, endMatch ? startIdx + endMatch.index : rawText.length);
  }

  const lines = expText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const dateAnchorRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}\s*(?:[-–]|to)\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}\s*(?:[-–]|to)\s*(?:Present|Current)\b|\b20\d{2}\s*(?:[-–]|to)\s*20\d{2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*20\d{2}\b|\b20\d{2}\b/i;

  const roleKeywords = /Intern|Developer|Engineer|Assistant|Analyst|Manager|Consultant|Associate|Specialist|Lead|Trainee|Programmer/i;

  const lineAnchors = [];
  lines.forEach((line, idx) => {
    const dm = line.match(dateAnchorRegex);
    if (dm) {
      lineAnchors.push({ lineIndex: idx, lineText: line, dateStr: dm[0].trim() });
    }
  });

  const entries = [];

  if (lineAnchors.length === 0) {
    lines.forEach(line => {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) return;
      if (line.includes(' - ') || line.includes(' – ') || line.includes(' | ')) {
        const parts = line.split(/[-–|]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const isFirstRole = roleKeywords.test(parts[0]);
          const isSecondRole = roleKeywords.test(parts[1]);
          const role = (isSecondRole && !isFirstRole) ? parts[1] : parts[0];
          const company = (isSecondRole && !isFirstRole) ? parts[0] : parts[1];
          const isIntern = isInternshipSection || /Intern|Internship|Trainee/i.test(role);

          entries.push({
            id: String(Date.now() + Math.random()),
            title: role,
            role,
            company,
            location: null,
            start_date: null,
            end_date: null,
            duration: '',
            is_internship: isIntern,
            description: []
          });
        }
      }
    });
    return entries;
  }

  for (let aIdx = 0; aIdx < lineAnchors.length; aIdx++) {
    const currAnchor = lineAnchors[aIdx];
    const prevAnchor = lineAnchors[aIdx - 1];

    let role = '';
    let company = '';
    const duration = currAnchor.dateStr;

    // Split date range into start_date and end_date
    const dateParts = duration.split(/[-–]|to/i).map(p => p.trim());
    const start_date = dateParts[0] || null;
    const end_date = dateParts.length > 1 ? dateParts[1] : null;

    const startLookBack = prevAnchor ? prevAnchor.lineIndex + 1 : Math.max(0, currAnchor.lineIndex - 3);
    const candidateLines = lines.slice(startLookBack, currAnchor.lineIndex + 1);

    for (let cIdx = candidateLines.length - 1; cIdx >= 0; cIdx--) {
      const cline = candidateLines[cIdx];
      let clean = cline.replace(dateAnchorRegex, '').trim();
      if (!clean || clean.startsWith('•') || clean.startsWith('-') || clean.startsWith('*')) continue;

      if (clean.includes(' - ') || clean.includes(' – ') || clean.includes(' | ')) {
        const parts = clean.split(/[-–|]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const isFirstRole = roleKeywords.test(parts[0]);
          const isSecondRole = roleKeywords.test(parts[1]);

          if (isSecondRole && !isFirstRole) {
            company = parts[0];
            role = parts[1];
          } else {
            role = parts[0];
            company = parts[1];
          }
          break;
        }
      } else if (clean.toLowerCase().includes(' at ')) {
        const parts = clean.split(/\s+at\s+/i).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          role = parts[0];
          company = parts[1];
          break;
        }
      }
    }

    if (!role || !company) {
      const headerLines = candidateLines.filter(l => !l.startsWith('•') && !l.startsWith('-') && !l.startsWith('*') && !l.match(dateAnchorRegex));
      if (headerLines.length >= 2) {
        const isFirstRole = roleKeywords.test(headerLines[0]);
        const isSecondRole = roleKeywords.test(headerLines[1]);

        if (isSecondRole && !isFirstRole) {
          company = headerLines[0];
          role = headerLines[1];
        } else {
          role = headerLines[0];
          company = headerLines[1];
        }
      } else if (headerLines.length === 1) {
        role = headerLines[0];
        company = '';
      }
    }

    const endLineIdx = lineAnchors[aIdx + 1] ? lineAnchors[aIdx + 1].lineIndex : lines.length;
    const descLines = lines
      .slice(currAnchor.lineIndex + 1, endLineIdx)
      .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
      .filter(l => l.length > 5 && !l.match(dateAnchorRegex) && !roleKeywords.test(l));

    const finalRole = role ? role.replace(/^[•\-\*]\s*/, '').trim() : '';
    const finalCompany = company ? company.replace(/^[•\-\*]\s*/, '').trim() : '';
    const isIntern = isInternshipSection || /Intern|Internship|Trainee/i.test(finalRole);

    entries.push({
      id: String(Date.now() + Math.random()),
      title: finalRole || null,
      role: finalRole,
      company: finalCompany || null,
      location: null,
      start_date,
      end_date,
      duration,
      is_internship: isIntern,
      description: descLines
    });
  }

  return entries;
}
