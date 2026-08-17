/**
 * Work Experience & Internship Extractor
 */

export function extractExperience(experienceText) {
  if (!experienceText || !experienceText.trim()) return [];

  const lines = experienceText.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let currentItem = null;

  for (const line of lines) {
    if (line.length < 50 && (line.toLowerCase().includes('intern') || line.toLowerCase().includes('trainee') || line.toLowerCase().includes('developer'))) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        company: line,
        role: line.toLowerCase().includes('intern') ? 'Frontend Intern' : 'Software Trainee',
        startDate: '2025-01',
        endDate: '2025-06',
        description: ''
      };
    } else if (currentItem) {
      currentItem.description += (currentItem.description ? ' ' : '') + line;
    }
  }

  if (currentItem) items.push(currentItem);
  return items.slice(0, 3);
}
