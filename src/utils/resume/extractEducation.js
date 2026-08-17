/**
 * Education Extractor
 */

export function extractGraduationYear(educationText, rawText) {
  const combined = `${educationText}\n${rawText}`;

  // 1. Check for date range pattern near degree keywords (e.g. "2022 - 2026" or "2022 – Present")
  const rangeMatches = Array.from(combined.matchAll(/\b(201[5-9]|202[0-9])\s*[-–to\s]+\s*(202[3-9]|203[0-5]|Present)\b/gi));
  if (rangeMatches.length > 0) {
    const lastRange = rangeMatches[0];
    if (lastRange[2].toLowerCase() === 'present') return '2026';
    return lastRange[2];
  }

  // 2. Explicit labels like "Year of Passing: 2026" or "Graduation: 2026"
  const labelMatch = combined.match(/(?:Graduation\s*Year|Passing\s*Year|Year\s*of\s*Passing|Graduated|Batch)[\s:]*(\b202[0-9]\b)/i);
  if (labelMatch) return labelMatch[1];

  // 3. Find highest/latest degree completion year among all detected years between 2023 and 2030
  const futureYears = combined.match(/\b(202[3-9]|203[0-0])\b/g);
  if (futureYears && futureYears.length > 0) {
    const numericYears = futureYears.map(Number);
    return String(Math.max(...numericYears));
  }

  // Fallback to highest year found if above 2020
  const allYears = combined.match(/\b(202[0-9])\b/g);
  if (allYears && allYears.length > 0) {
    const numericYears = allYears.map(Number);
    return String(Math.max(...numericYears));
  }

  return '';
}

export function extractEducation(educationText, rawText) {
  const text = `${educationText}\n${rawText}`;

  // 1. Degree Detection
  const degreePatterns = [
    { pattern: /B\.?\s*Tech|Bachelor of Technology/i, value: 'B.Tech / B.E.' },
    { pattern: /B\.?\s*E\b|Bachelor of Engineering/i, value: 'B.Tech / B.E.' },
    { pattern: /BCA|Bachelor of Computer Applications/i, value: 'BCA' },
    { pattern: /MCA|Master of Computer Applications/i, value: 'MCA' },
    { pattern: /B\.?\s*Sc|Bachelor of Science/i, value: 'B.Sc Computer Science' },
    { pattern: /M\.?\s*Tech|Master of Technology/i, value: 'M.Tech / M.E.' },
    { pattern: /M\.?\s*Sc|Master of Science/i, value: 'M.Sc' },
    { pattern: /Diploma/i, value: 'Diploma in Engineering' }
  ];

  let degree = '';
  for (const item of degreePatterns) {
    if (item.pattern.test(text)) {
      degree = item.value;
      break;
    }
  }

  // 2. Branch / Specialization
  const branchPatterns = [
    { pattern: /Computer Science|CSE|CS\b/i, value: 'Computer Science & Engineering' },
    { pattern: /Information Technology|IT\b/i, value: 'Information Technology' },
    { pattern: /Artificial Intelligence|AI|Machine Learning|ML/i, value: 'AI & Machine Learning' },
    { pattern: /Electronics|ECE|EEE/i, value: 'Electronics & Communication' },
    { pattern: /Data Science/i, value: 'Data Science' }
  ];

  let branch = '';
  for (const item of branchPatterns) {
    if (item.pattern.test(text)) {
      branch = item.value;
      break;
    }
  }

  // 3. Graduation Year calculation
  const graduationYear = extractGraduationYear(educationText, rawText);

  // 4. CGPA / Percentage
  const cgpaRegex = /(CGPA|GPA|Grade|Score)[\s:]*([0-9]\.[0-9]{1,2}|10(\.0)?)\s*(\/\s*10)?/i;
  const rawCgpaRegex = /\b([7-9]\.[0-9]{1,2}|6\.[5-9][0-9]?)\s*(\/\s*10)?\b/;
  const percentageRegex = /([7-9][0-9](\.[0-9]{1,2})?|\b6[5-9](\.[0-9]{1,2})?)\s*%/;

  const cgpaMatch = text.match(cgpaRegex) || text.match(rawCgpaRegex);
  const percentageMatch = text.match(percentageRegex);

  let cgpa = '';
  if (cgpaMatch) {
    const val = cgpaMatch[2] || cgpaMatch[1];
    cgpa = `${val} / 10`;
  } else if (percentageMatch) {
    cgpa = `${percentageMatch[1]}%`;
  }

  // 5. College / Institution Name
  const lines = (educationText || rawText).split('\n').map(l => l.trim()).filter(Boolean);
  let college = '';

  for (const line of lines) {
    if (/(Institute|University|College|Academy|IIT|NIT|IIIT|BITS|VIT|SRM)/i.test(line) && line.length < 85) {
      college = line;
      break;
    }
  }

  return [
    {
      degree: degree || '',
      branch: branch || '',
      college: college || '',
      graduationYear: graduationYear || '',
      cgpa: cgpa || ''
    }
  ];
}
