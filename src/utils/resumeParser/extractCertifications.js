/**
 * Extract Certifications & Achievements
 * Dynamically parses certifications strictly from actual resume text.
 */
export function extractCertifications(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return [];

  let text = rawText;
  if (rawText.includes('CERTIFICATIONS :') || rawText.includes('CERTIFICATIONS')) {
    const match = rawText.match(/(?:LICENSES\s+&\s+CERTIFICATIONS|CERTIFICATIONS|CERTIFICATES|ACHIEVEMENTS)\s*:\s*([\s\S]*?)(?=(?:TECHNICAL\s+)?SKILLS|EXPERIENCE|EDUCATION|PROJECTS|DECLARATION|$)/i);
    if (match) text = match[1];
  }

  const certList = [];
  const rawItems = text
    .split(/•|\n/)
    .map(i => i.trim())
    .filter(i => i.length > 5 && !i.toLowerCase().startsWith('certifications') && !i.toLowerCase().startsWith('licenses'));

  rawItems.forEach(item => {
    // Extract year if present (e.g. 2024, 2025)
    const yearMatch = item.match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[0] : '';

    let cleanItem = item;
    if (yearMatch) {
      cleanItem = item.replace(yearMatch[0], '').trim();
    }

    // Split name and issuer if colon or hyphen is present
    let name = cleanItem;
    let org = '';

    if (cleanItem.includes(':')) {
      const parts = cleanItem.split(':').map(p => p.trim());
      org = parts[0];
      name = parts[1] || parts[0];
    } else if (cleanItem.includes(' - ')) {
      const parts = cleanItem.split(' - ').map(p => p.trim());
      name = parts[0];
      org = parts[1] || '';
    }

    certList.push({
      id: String(Date.now() + Math.random()),
      name: name.replace(/^[•\-\*]\s*/, '').trim(),
      organization: org.replace(/^[•\-\*]\s*/, '').trim(),
      year
    });
  });

  return certList;
}
